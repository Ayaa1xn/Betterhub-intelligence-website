import { existsSync } from 'node:fs';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { createSiteContentSeed, normalizeSiteContent } from '../src/data';
import type {
  CareerSubmission,
  ContactSubmission,
  SiteContent,
  SiteSubmissions,
} from '../src/types';
import { config } from './env';
import { badRequest } from './errors';
import { toPublicSiteContent } from './public-content';
import {
  createIpHash,
  createSessionToken,
  hashPassword,
  hashSessionToken,
  verifyPassword,
} from './security';

const ALLOWED_UPLOAD_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);
const MAX_IMAGE_UPLOAD_BYTES = 12 * 1024 * 1024;
const MAX_VIDEO_UPLOAD_BYTES = 80 * 1024 * 1024;

const EMPTY_SUBMISSIONS: SiteSubmissions = {
  contacts: [],
  careers: [],
};

let database: DatabaseSync | null = null;

export async function initializeStore() {
  await mkdir(config.runtimeDataDir, { recursive: true });
  await mkdir(config.runtimeUploadsDir, { recursive: true });
  const db = getDatabase();
  migrateDatabase(db);
  await seedContentIfNeeded(db);
  await importLegacySubmissionsIfNeeded(db);
  upsertAdminUser(db);
  clearExpiredAdminSessions();
}

export async function getPublicSiteContent(): Promise<SiteContent> {
  return toPublicSiteContent(await getAdminSiteContent());
}

export async function getAdminSiteContent(): Promise<SiteContent> {
  const db = getDatabase();
  const row = db
    .prepare('SELECT json FROM site_state WHERE key = ?')
    .get('primary') as { json: string } | undefined;

  const content = row ? (JSON.parse(row.json) as SiteContent) : createSiteContentSeed();
  return normalizeSiteContent(content);
}

export async function saveSiteContent(content: SiteContent) {
  const db = getDatabase();
  const normalized = normalizeSiteContent({
    ...content,
    blogPosts: [...content.blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    careerRoles: [...content.careerRoles].sort((a, b) => a.title.localeCompare(b.title)),
  });

  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO site_state (key, json, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET json = excluded.json, updated_at = excluded.updated_at`,
  ).run('primary', JSON.stringify(normalized), now);

  return normalized;
}

export async function getSubmissions(): Promise<SiteSubmissions> {
  const db = getDatabase();

  const contacts = db
    .prepare(
      `SELECT id, type, name, email, phone, subject, message, created_at AS createdAt
       FROM contact_submissions
       ORDER BY created_at DESC`,
    )
    .all() as unknown as ContactSubmission[];

  const careers = db
    .prepare(
      `SELECT id, type, role_id AS roleId, role_title AS roleTitle, name, email, experience, portfolio, cover_text AS coverText, created_at AS createdAt
       FROM career_submissions
       ORDER BY created_at DESC`,
    )
    .all() as unknown as CareerSubmission[];

  return {
    contacts,
    careers,
  };
}

export async function addContactSubmission(
  submission: ContactSubmission,
  ipAddress: string,
) {
  const db = getDatabase();
  db.prepare(
    `INSERT INTO contact_submissions (id, type, name, email, phone, subject, message, created_at, ip_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    submission.id,
    submission.type,
    submission.name,
    submission.email,
    submission.phone,
    submission.subject,
    submission.message,
    submission.createdAt,
    createIpHash(ipAddress, config.adminSessionSecret),
  );

  return submission;
}

export async function addCareerSubmission(
  submission: CareerSubmission,
  ipAddress: string,
) {
  const db = getDatabase();
  db.prepare(
    `INSERT INTO career_submissions (id, type, role_id, role_title, name, email, experience, portfolio, cover_text, created_at, ip_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    submission.id,
    submission.type,
    submission.roleId,
    submission.roleTitle,
    submission.name,
    submission.email,
    submission.experience,
    submission.portfolio,
    submission.coverText,
    submission.createdAt,
    createIpHash(ipAddress, config.adminSessionSecret),
  );

  return submission;
}

export async function saveUpload(filename: string, dataUrl: string) {
  const parsed = parseDataUrl(dataUrl);
  const safeName = createSafeFileName(filename, parsed.extension);
  const filePath = path.join(config.runtimeUploadsDir, safeName);
  const url = `/uploads/${safeName}`;

  await writeFile(filePath, parsed.buffer);

  getDatabase()
    .prepare(
      `INSERT INTO uploads (id, file_name, original_name, mime_type, size_bytes, url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      randomUUID(),
      safeName,
      filename,
      parsed.mime,
      parsed.buffer.byteLength,
      url,
      new Date().toISOString(),
    );

  return {
    fileName: safeName,
    url,
  };
}

export async function verifyAdminCredentials(email: string, password: string) {
  const row = getDatabase()
    .prepare('SELECT email, password_hash AS passwordHash FROM admin_users WHERE email = ?')
    .get(email) as { email: string; passwordHash: string } | undefined;

  if (!row) {
    return null;
  }

  return verifyPassword(password, row.passwordHash) ? { email: row.email } : null;
}

export async function createAdminSession(
  email: string,
  context: { userAgent: string; ipAddress: string },
) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + config.adminSessionTtlHours * 60 * 60 * 1000);
  const now = new Date().toISOString();

  getDatabase()
    .prepare(
      `INSERT INTO admin_sessions (id, token_hash, email, created_at, expires_at, user_agent, ip_hash, last_seen_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      randomUUID(),
      hashSessionToken(token, config.adminSessionSecret),
      email,
      now,
      expiresAt.toISOString(),
      context.userAgent.slice(0, 400),
      createIpHash(context.ipAddress, config.adminSessionSecret),
      now,
    );

  clearExpiredAdminSessions();
  return { token, expiresAt };
}

export async function getAdminSession(rawToken: string) {
  const row = getDatabase()
    .prepare(
      `SELECT id, email, expires_at AS expiresAt
       FROM admin_sessions
       WHERE token_hash = ?`,
    )
    .get(hashSessionToken(rawToken, config.adminSessionSecret)) as
    | { id: string; email: string; expiresAt: string }
    | undefined;

  if (!row) {
    return null;
  }

  if (new Date(row.expiresAt).getTime() <= Date.now()) {
    await deleteAdminSession(rawToken);
    return null;
  }

  getDatabase()
    .prepare('UPDATE admin_sessions SET last_seen_at = ? WHERE id = ?')
    .run(new Date().toISOString(), row.id);

  return row;
}

export async function deleteAdminSession(rawToken: string) {
  getDatabase()
    .prepare('DELETE FROM admin_sessions WHERE token_hash = ?')
    .run(hashSessionToken(rawToken, config.adminSessionSecret));
}

export function clearExpiredAdminSessions() {
  getDatabase()
    .prepare('DELETE FROM admin_sessions WHERE expires_at <= ?')
    .run(new Date().toISOString());
}

function getDatabase() {
  if (!database) {
    database = new DatabaseSync(config.databaseFile);
    database.exec('PRAGMA journal_mode = WAL;');
    database.exec('PRAGMA foreign_keys = ON;');
  }

  return database;
}

function migrateDatabase(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_state (
      key TEXT PRIMARY KEY,
      json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      email TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      id TEXT PRIMARY KEY,
      token_hash TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      user_agent TEXT NOT NULL,
      ip_hash TEXT NOT NULL,
      last_seen_at TEXT NOT NULL,
      FOREIGN KEY(email) REFERENCES admin_users(email) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS contact_submissions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      ip_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS career_submissions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      role_id TEXT NOT NULL,
      role_title TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      experience TEXT NOT NULL,
      portfolio TEXT NOT NULL,
      cover_text TEXT NOT NULL,
      created_at TEXT NOT NULL,
      ip_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS uploads (
      id TEXT PRIMARY KEY,
      file_name TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      url TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    );
  `);
}

async function seedContentIfNeeded(db: DatabaseSync) {
  const existing = db
    .prepare('SELECT 1 FROM site_state WHERE key = ?')
    .get('primary') as { 1: number } | undefined;

  if (existing) {
    return;
  }

  const content = normalizeSiteContent(await readLegacyContent());
  db.prepare('INSERT INTO site_state (key, json, updated_at) VALUES (?, ?, ?)').run(
    'primary',
    JSON.stringify(content),
    new Date().toISOString(),
  );
}

async function importLegacySubmissionsIfNeeded(db: DatabaseSync) {
  const existingContacts = db
    .prepare('SELECT COUNT(*) AS total FROM contact_submissions')
    .get() as { total: number };
  const existingCareers = db
    .prepare('SELECT COUNT(*) AS total FROM career_submissions')
    .get() as { total: number };

  if (existingContacts.total > 0 || existingCareers.total > 0) {
    return;
  }

  const legacy = await readLegacySubmissions();
  const insertContact = db.prepare(
    `INSERT INTO contact_submissions (id, type, name, email, phone, subject, message, created_at, ip_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const insertCareer = db.prepare(
    `INSERT INTO career_submissions (id, type, role_id, role_title, name, email, experience, portfolio, cover_text, created_at, ip_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  for (const item of legacy.contacts) {
    insertContact.run(
      item.id,
      item.type,
      item.name,
      item.email,
      item.phone,
      item.subject,
      item.message,
      item.createdAt,
      'legacy-import',
    );
  }

  for (const item of legacy.careers) {
    insertCareer.run(
      item.id,
      item.type,
      item.roleId,
      item.roleTitle,
      item.name,
      item.email,
      item.experience,
      item.portfolio,
      item.coverText,
      item.createdAt,
      'legacy-import',
    );
  }
}

function upsertAdminUser(db: DatabaseSync) {
  const now = new Date().toISOString();
  const passwordHash = config.adminPasswordHash || hashPassword(config.adminPassword);

  db.prepare('DELETE FROM admin_users WHERE email != ?').run(config.adminEmail);
  db.prepare(
    `INSERT INTO admin_users (email, password_hash, created_at, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       password_hash = excluded.password_hash,
       updated_at = excluded.updated_at`,
  ).run(config.adminEmail, passwordHash, now, now);
}

async function readLegacyContent() {
  if (!(await fileExists(config.legacyContentFile))) {
    return createSiteContentSeed();
  }

  return readJson<SiteContent>(config.legacyContentFile);
}

async function readLegacySubmissions() {
  if (!(await fileExists(config.legacySubmissionsFile))) {
    return EMPTY_SUBMISSIONS;
  }

  return readJson<SiteSubmissions>(config.legacySubmissionsFile);
}

async function fileExists(targetPath: string) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readJson<T>(targetPath: string): Promise<T> {
  const raw = await readFile(targetPath, 'utf-8');
  return JSON.parse(raw) as T;
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:((?:image|video)\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw badRequest('Unsupported upload payload.');
  }

  const mime = match[1];
  if (!ALLOWED_UPLOAD_MIME.has(mime)) {
    throw badRequest('Unsupported file type.');
  }

  const base64 = match[2];
  const extension = mime.split('/')[1]?.replace('jpeg', 'jpg').replace('quicktime', 'mov') || 'bin';
  const buffer = Buffer.from(base64, 'base64');
  const maxBytes = mime.startsWith('image/') ? MAX_IMAGE_UPLOAD_BYTES : MAX_VIDEO_UPLOAD_BYTES;

  if (buffer.byteLength > maxBytes) {
    throw badRequest(
      mime.startsWith('image/')
        ? 'Images must be 12 MB or smaller.'
        : 'Videos must be 80 MB or smaller.',
    );
  }

  return { buffer, extension, mime };
}

function createSafeFileName(filename: string, extension: string) {
  const baseName = filename
    .replace(/\.[^.]+$/, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'upload';

  return `${baseName}-${Date.now()}.${extension}`;
}
