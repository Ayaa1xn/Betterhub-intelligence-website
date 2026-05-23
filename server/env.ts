import { existsSync } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

for (const fileName of ['.env.local', '.env']) {
  const targetPath = path.join(rootDir, fileName);
  if (existsSync(targetPath)) {
    process.loadEnvFile(targetPath);
  }
}

function readNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function parseOriginList(value: string | undefined) {
  return new Set(
    (value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => trimTrailingSlash(item)),
  );
}

export const config = {
  rootDir,
  dataDir: path.join(rootDir, 'data'),
  runtimeDataDir: path.join(rootDir, 'data', 'runtime'),
  seedUploadsDir: path.join(rootDir, 'data', 'uploads'),
  runtimeUploadsDir: path.join(rootDir, 'data', 'runtime', 'uploads'),
  databaseFile: path.join(rootDir, 'data', 'runtime', 'betterhub.sqlite'),
  legacyContentFile: path.join(rootDir, 'data', 'site-content.json'),
  legacySubmissionsFile: path.join(rootDir, 'data', 'submissions.json'),
  distDir: path.join(rootDir, 'dist'),
  host: process.env.API_HOST || '0.0.0.0',
  port: readNumber(process.env.PORT || process.env.API_PORT, 3001),
  nodeEnv: process.env.NODE_ENV || 'development',
  publicSiteUrl: trimTrailingSlash(process.env.PUBLIC_SITE_URL || ''),
  adminEmail: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
  adminPasswordHash: (process.env.ADMIN_PASSWORD_HASH || '').trim(),
  adminPassword: process.env.ADMIN_PASSWORD || '',
  adminSessionSecret: process.env.ADMIN_SESSION_SECRET || '',
  submissionWebhookUrl: (process.env.SUBMISSION_WEBHOOK_URL || '').trim(),
  submissionWebhookSecret: process.env.SUBMISSION_WEBHOOK_SECRET || '',
  submissionWebhookTimeoutMs: readNumber(process.env.SUBMISSION_WEBHOOK_TIMEOUT_MS, 5000),
  adminSessionTtlHours: readNumber(process.env.ADMIN_SESSION_TTL_HOURS, 12),
  loginRateLimitMax: readNumber(process.env.LOGIN_RATE_LIMIT_MAX, 10),
  loginRateLimitWindowMs: readNumber(process.env.LOGIN_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  contactRateLimitMax: readNumber(process.env.CONTACT_RATE_LIMIT_MAX, 12),
  contactRateLimitWindowMs: readNumber(
    process.env.CONTACT_RATE_LIMIT_WINDOW_MS,
    15 * 60 * 1000,
  ),
  careerRateLimitMax: readNumber(process.env.CAREER_RATE_LIMIT_MAX, 8),
  careerRateLimitWindowMs: readNumber(
    process.env.CAREER_RATE_LIMIT_WINDOW_MS,
    30 * 60 * 1000,
  ),
  uploadRateLimitMax: readNumber(process.env.UPLOAD_RATE_LIMIT_MAX, 30),
  uploadRateLimitWindowMs: readNumber(process.env.UPLOAD_RATE_LIMIT_WINDOW_MS, 60 * 60 * 1000),
  allowedOrigins: parseOriginList(process.env.ALLOWED_ORIGINS),
} as const;

export function assertServerConfig() {
  const missing: string[] = [];

  if (!config.adminEmail) {
    missing.push('ADMIN_EMAIL');
  }

  if (!config.adminPasswordHash && !config.adminPassword) {
    missing.push('ADMIN_PASSWORD_HASH or ADMIN_PASSWORD');
  }

  if (!config.adminSessionSecret) {
    missing.push('ADMIN_SESSION_SECRET');
  }

  if (missing.length) {
    throw new Error(`Missing required server configuration: ${missing.join(', ')}`);
  }
}

export function getAllowedOrigins() {
  const origins = new Set<string>(config.allowedOrigins);

  if (config.publicSiteUrl) {
    origins.add(config.publicSiteUrl);
  }

  if (config.nodeEnv !== 'production') {
    origins.add('http://127.0.0.1:3000');
    origins.add('http://localhost:3000');
    origins.add('http://127.0.0.1:3001');
    origins.add('http://localhost:3001');
  }

  return origins;
}
