import { randomUUID } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
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

type AdminUserRecord = {
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
};

type AdminSessionRecord = {
  id: string;
  tokenHash: string;
  email: string;
  createdAt: string;
  expiresAt: string;
  userAgent: string;
  ipHash: string;
  lastSeenAt: string;
};

type UploadRecord = {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  createdAt: string;
};

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

const files = {
  content: path.join(config.runtimeDataDir, 'content.json'),
  submissions: path.join(config.runtimeDataDir, 'submissions.json'),
  adminUsers: path.join(config.runtimeDataDir, 'admin-users.json'),
  adminSessions: path.join(config.runtimeDataDir, 'admin-sessions.json'),
  uploads: path.join(config.runtimeDataDir, 'uploads.json'),
} as const;

export async function initializeStore() {
  await mkdir(config.runtimeDataDir, { recursive: true });
  await mkdir(config.runtimeUploadsDir, { recursive: true });

  await ensureContent();
  await ensureSubmissions();
  await ensureJsonFile(files.adminUsers, [] satisfies AdminUserRecord[]);
  await ensureJsonFile(files.adminSessions, [] satisfies AdminSessionRecord[]);
  await ensureJsonFile(files.uploads, [] satisfies UploadRecord[]);
  await upsertAdminUser();
  await clearExpiredAdminSessions();
}

export async function getPublicSiteContent(): Promise<SiteContent> {
  return toPublicSiteContent(await getAdminSiteContent());
}

export async function getAdminSiteContent(): Promise<SiteContent> {
  const content = await readJsonFile<SiteContent>(files.content, createSiteContentSeed());
  return normalizeSiteContent(content);
}

export async function saveSiteContent(content: SiteContent) {
  const normalized = normalizeSiteContent({
    ...content,
    blogPosts: [...content.blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    careerRoles: [...content.careerRoles].sort((a, b) => a.title.localeCompare(b.title)),
  });

  await writeJsonFile(files.content, normalized);
  return normalized;
}

export async function getSubmissions(): Promise<SiteSubmissions> {
  return readJsonFile<SiteSubmissions>(files.submissions, EMPTY_SUBMISSIONS);
}

export async function addContactSubmission(
  submission: ContactSubmission,
  _ipAddress: string,
) {
  const submissions = await getSubmissions();
  submissions.contacts.unshift(submission);
  await writeJsonFile(files.submissions, submissions);
  return submission;
}

export async function addCareerSubmission(
  submission: CareerSubmission,
  _ipAddress: string,
) {
  const submissions = await getSubmissions();
  submissions.careers.unshift(submission);
  await writeJsonFile(files.submissions, submissions);
  return submission;
}

export async function saveUpload(filename: string, dataUrl: string) {
  const parsed = parseDataUrl(dataUrl);
  const safeName = createSafeFileName(filename, parsed.extension);
  const filePath = path.join(config.runtimeUploadsDir, safeName);
  const url = `/uploads/${safeName}`;
  const uploads = await readJsonFile<UploadRecord[]>(files.uploads, []);
  const now = new Date().toISOString();

  await writeFile(filePath, parsed.buffer);

  uploads.unshift({
    id: randomUUID(),
    fileName: safeName,
    originalName: filename,
    mimeType: parsed.mime,
    sizeBytes: parsed.buffer.byteLength,
    url,
    createdAt: now,
  });

  await writeJsonFile(files.uploads, uploads);

  return {
    fileName: safeName,
    url,
  };
}

export async function verifyAdminCredentials(email: string, password: string) {
  const users = await readJsonFile<AdminUserRecord[]>(files.adminUsers, []);
  const admin = users.find((user) => user.email === email);
  if (!admin) {
    return null;
  }

  return verifyPassword(password, admin.passwordHash) ? { email: admin.email } : null;
}

export async function createAdminSession(
  email: string,
  context: { userAgent: string; ipAddress: string },
) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + config.adminSessionTtlHours * 60 * 60 * 1000);
  const sessions = await readJsonFile<AdminSessionRecord[]>(files.adminSessions, []);
  const now = new Date().toISOString();

  sessions.push({
    id: randomUUID(),
    tokenHash: hashSessionToken(token, config.adminSessionSecret),
    email,
    createdAt: now,
    expiresAt: expiresAt.toISOString(),
    userAgent: context.userAgent.slice(0, 400),
    ipHash: createIpHash(context.ipAddress, config.adminSessionSecret),
    lastSeenAt: now,
  });

  await writeJsonFile(files.adminSessions, sessions);
  await clearExpiredAdminSessions();
  return { token, expiresAt };
}

export async function getAdminSession(rawToken: string) {
  const sessions = await readJsonFile<AdminSessionRecord[]>(files.adminSessions, []);
  const tokenHash = hashSessionToken(rawToken, config.adminSessionSecret);
  const session = sessions.find((item) => item.tokenHash === tokenHash);

  if (!session) {
    return null;
  }

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    await deleteAdminSession(rawToken);
    return null;
  }

  session.lastSeenAt = new Date().toISOString();
  await writeJsonFile(files.adminSessions, sessions);

  return {
    id: session.id,
    email: session.email,
    expiresAt: session.expiresAt,
  };
}

export async function deleteAdminSession(rawToken: string) {
  const sessions = await readJsonFile<AdminSessionRecord[]>(files.adminSessions, []);
  const tokenHash = hashSessionToken(rawToken, config.adminSessionSecret);
  const filtered = sessions.filter((session) => session.tokenHash !== tokenHash);
  await writeJsonFile(files.adminSessions, filtered);
}

export async function clearExpiredAdminSessions() {
  const sessions = await readJsonFile<AdminSessionRecord[]>(files.adminSessions, []);
  const now = Date.now();
  const filtered = sessions.filter((session) => new Date(session.expiresAt).getTime() > now);
  if (filtered.length !== sessions.length) {
    await writeJsonFile(files.adminSessions, filtered);
  }
}

async function ensureContent() {
  if (await fileExists(files.content)) {
    return;
  }

  const content = normalizeSiteContent(await readLegacyContent());
  await writeJsonFile(files.content, content);
}

async function ensureSubmissions() {
  if (await fileExists(files.submissions)) {
    return;
  }

  await writeJsonFile(files.submissions, await readLegacySubmissions());
}

async function upsertAdminUser() {
  const users = await readJsonFile<AdminUserRecord[]>(files.adminUsers, []);
  const now = new Date().toISOString();
  const passwordHash = config.adminPasswordHash || hashPassword(config.adminPassword);
  const existing = users.find((user) => user.email === config.adminEmail);

  const nextUsers = existing
    ? users
        .filter((user) => user.email === config.adminEmail)
        .map((user) =>
          user.email === config.adminEmail
            ? { ...user, passwordHash, updatedAt: now }
            : user,
        )
    : [
        {
          email: config.adminEmail,
          passwordHash,
          createdAt: now,
          updatedAt: now,
        },
      ];

  await writeJsonFile(files.adminUsers, nextUsers);
}

async function readLegacyContent() {
  if (!(await fileExists(config.legacyContentFile))) {
    return createSiteContentSeed();
  }

  return readJsonFile<SiteContent>(config.legacyContentFile, createSiteContentSeed());
}

async function readLegacySubmissions() {
  if (!(await fileExists(config.legacySubmissionsFile))) {
    return EMPTY_SUBMISSIONS;
  }

  return readJsonFile<SiteSubmissions>(config.legacySubmissionsFile, EMPTY_SUBMISSIONS);
}

async function ensureJsonFile<T>(targetPath: string, fallback: T) {
  if (await fileExists(targetPath)) {
    return;
  }

  await writeJsonFile(targetPath, fallback);
}

async function fileExists(targetPath: string) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonFile<T>(targetPath: string, fallback: T): Promise<T> {
  if (!(await fileExists(targetPath))) {
    return fallback;
  }

  const raw = await readFile(targetPath, 'utf-8');
  return JSON.parse(raw) as T;
}

async function writeJsonFile(targetPath: string, value: unknown) {
  await writeFile(targetPath, JSON.stringify(value, null, 2));
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
