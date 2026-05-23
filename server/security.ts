import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type express from 'express';

const SESSION_COOKIE = 'bhi_admin_session';
const SCRYPT_KEY_LENGTH = 64;

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const rateLimitBuckets = new Map<string, RateLimitBucket>();

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('base64url');
  const hash = scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString('base64url');
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, expectedHash] = storedHash.split('$');
  if (algorithm !== 'scrypt' || !salt || !expectedHash) {
    return false;
  }

  const actualHash = scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString('base64url');
  return timingSafeEqual(Buffer.from(actualHash), Buffer.from(expectedHash));
}

export function createSessionToken() {
  return randomBytes(32).toString('base64url');
}

export function hashSessionToken(token: string, secret: string) {
  return createHmac('sha256', secret).update(token).digest('hex');
}

export function createIpHash(ipAddress: string, secret: string) {
  return createHash('sha256').update(`${secret}:${ipAddress}`).digest('hex');
}

export function parseCookies(headerValue: string | undefined) {
  const cookies = new Map<string, string>();
  if (!headerValue) {
    return cookies;
  }

  for (const segment of headerValue.split(';')) {
    const [rawName, ...rawValue] = segment.trim().split('=');
    if (!rawName || !rawValue.length) {
      continue;
    }

    cookies.set(rawName, decodeURIComponent(rawValue.join('=')));
  }

  return cookies;
}

export function serializeSessionCookie(token: string, expiresAt: Date, secure: boolean) {
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    secure ? 'Secure' : '',
    `Expires=${expiresAt.toUTCString()}`,
  ]
    .filter(Boolean)
    .join('; ');
}

export function clearSessionCookie(secure: boolean) {
  return [
    `${SESSION_COOKIE}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    secure ? 'Secure' : '',
    'Max-Age=0',
  ]
    .filter(Boolean)
    .join('; ');
}

export function getClientIp(req: express.Request) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0]!.trim();
  }

  return req.ip || req.socket.remoteAddress || 'unknown';
}

export function consumeRateLimit(
  scope: string,
  key: string,
  limit: number,
  windowMs: number,
) {
  const now = Date.now();
  const bucketKey = `${scope}:${key}`;
  const existing = rateLimitBuckets.get(bucketKey);

  if (!existing || existing.resetAt <= now) {
    const nextBucket: RateLimitBucket = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitBuckets.set(bucketKey, nextBucket);
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(0, existing.resetAt - now),
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, limit - existing.count),
    retryAfterMs: 0,
  };
}

export function isTrustedOrigin(originHeader: string | undefined, allowedOrigins: Set<string>) {
  if (!originHeader) {
    return true;
  }

  try {
    const parsedOrigin = new URL(originHeader).origin;
    return allowedOrigins.has(parsedOrigin);
  } catch {
    return false;
  }
}
