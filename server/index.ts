import express from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import {
  addCareerSubmission,
  addContactSubmission,
  clearExpiredAdminSessions,
  createAdminSession,
  deleteAdminSession,
  getAdminSession,
  getAdminSiteContent,
  getPublicSiteContent,
  getSubmissions,
  initializeStore,
  saveSiteContent,
  saveUpload,
  verifyAdminCredentials,
} from './store';
import { assertServerConfig, config, getAllowedOrigins } from './env';
import { asyncHandler, badRequest, forbidden, HttpError, tooManyRequests, unauthorized } from './errors';
import {
  clearSessionCookie,
  consumeRateLimit,
  getClientIp,
  isTrustedOrigin,
  parseCookies,
  serializeSessionCookie,
} from './security';
import { validateCareerPayload, validateContactPayload, validateSiteContentPayload } from './validation';
import type { CareerSubmission, ContactSubmission, SiteContent } from '../src/types';
import { notifySubmission } from './notifications';

const app = express();
const allowedOrigins = getAllowedOrigins();
const secureCookies = config.nodeEnv === 'production';
const distDir = config.distDir;

app.disable('x-powered-by');
app.set('trust proxy', true);

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  );
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "img-src 'self' data: blob: https:",
      "media-src 'self' data: blob: https:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self'",
      "font-src 'self' data: https:",
      "connect-src 'self'",
      "object-src 'none'",
    ].join('; '),
  );

  if (secureCookies && req.secure) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
});

app.use('/uploads', express.static(config.runtimeUploadsDir, { maxAge: '30d', fallthrough: true }));
app.use('/uploads', express.static(config.seedUploadsDir, { maxAge: '30d', fallthrough: true }));

app.get(
  '/api/health',
  asyncHandler(async (_req, res) => {
    clearExpiredAdminSessions();
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      ok: true,
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  }),
);

app.get(
  '/robots.txt',
  asyncHandler(async (req, res) => {
    const baseUrl = getBaseUrl(req);
    res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${baseUrl}/sitemap.xml\n`);
  }),
);

app.get(
  '/sitemap.xml',
  asyncHandler(async (req, res) => {
    const content = await getPublicSiteContent();
    const baseUrl = getBaseUrl(req);
    res.type('application/xml').send(buildSitemapXml(baseUrl, content));
  }),
);

app.get(
  '/api/content',
  asyncHandler(async (_req, res) => {
    const content = await getPublicSiteContent();
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(content);
  }),
);

app.post(
  '/api/contact',
  express.json({ limit: '256kb' }),
  requireTrustedOrigin,
  rateLimit('contact', config.contactRateLimitMax, config.contactRateLimitWindowMs),
  asyncHandler(async (req, res) => {
    const payload = validateContactPayload(req.body);
    const submission: ContactSubmission = {
      id: `contact-${Date.now()}`,
      type: 'contact',
      ...payload,
      createdAt: new Date().toISOString(),
    };

    await addContactSubmission(submission, getClientIp(req));
    void notifySubmission('contact', submission);
    res.status(201).json({ ok: true });
  }),
);

app.post(
  '/api/careers/apply',
  express.json({ limit: '256kb' }),
  requireTrustedOrigin,
  rateLimit('career', config.careerRateLimitMax, config.careerRateLimitWindowMs),
  asyncHandler(async (req, res) => {
    const payload = validateCareerPayload(req.body);
    const submission: CareerSubmission = {
      id: `career-${Date.now()}`,
      type: 'career',
      ...payload,
      createdAt: new Date().toISOString(),
    };

    await addCareerSubmission(submission, getClientIp(req));
    void notifySubmission('career', submission);
    res.status(201).json({ ok: true });
  }),
);

app.post(
  '/api/admin/login',
  express.json({ limit: '32kb' }),
  requireTrustedOrigin,
  rateLimit('admin-login', config.loginRateLimitMax, config.loginRateLimitWindowMs),
  asyncHandler(async (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!email || !password) {
      throw badRequest('Email and password are required.');
    }

    const admin = await verifyAdminCredentials(email, password);
    if (!admin) {
      throw unauthorized('Invalid credentials.');
    }

    const session = await createAdminSession(admin.email, {
      userAgent: req.headers['user-agent'] || 'unknown',
      ipAddress: getClientIp(req),
    });

    res.setHeader('Set-Cookie', serializeSessionCookie(session.token, session.expiresAt, secureCookies));
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      user: {
        email: admin.email,
        role: 'admin',
      },
    });
  }),
);

app.get(
  '/api/admin/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      user: {
        email: req.adminEmail,
        role: 'admin',
      },
    });
  }),
);

app.get(
  '/api/admin/content',
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json(await getAdminSiteContent());
  }),
);

app.put(
  '/api/admin/content',
  requireAuth,
  requireTrustedOrigin,
  express.json({ limit: '8mb' }),
  asyncHandler(async (req, res) => {
    const content = validateSiteContentPayload(req.body?.content);
    const saved = await saveSiteContent(content);
    res.setHeader('Cache-Control', 'no-store');
    res.json(saved);
  }),
);

app.get(
  '/api/admin/submissions',
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json(await getSubmissions());
  }),
);

app.post(
  '/api/admin/uploads',
  requireAuth,
  requireTrustedOrigin,
  express.json({ limit: '120mb' }),
  rateLimit('admin-upload', config.uploadRateLimitMax, config.uploadRateLimitWindowMs),
  asyncHandler(async (req, res) => {
    const fileName = typeof req.body?.fileName === 'string' ? req.body.fileName : '';
    const dataUrl = typeof req.body?.dataUrl === 'string' ? req.body.dataUrl : '';
    if (!fileName || !dataUrl) {
      throw badRequest('fileName and dataUrl are required.');
    }

    const upload = await saveUpload(fileName, dataUrl);
    res.status(201).json(upload);
  }),
);

app.post(
  '/api/admin/logout',
  requireAuth,
  requireTrustedOrigin,
  asyncHandler(async (req, res) => {
    if (req.authToken) {
      await deleteAdminSession(req.authToken);
    }

    res.setHeader('Set-Cookie', clearSessionCookie(secureCookies));
    res.setHeader('Cache-Control', 'no-store');
    res.json({ ok: true });
  }),
);

app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'Not found.' });
});

if (existsSync(distDir)) {
  app.use(
    express.static(distDir, {
      index: false,
      maxAge: '1h',
    }),
  );

  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message =
    error instanceof HttpError
      ? error.message
      : error instanceof Error
        ? error.message
        : 'Unexpected server error.';

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    message: statusCode >= 500 ? 'Unexpected server error.' : message,
  });
});

assertServerConfig();
initializeStore().then(() => {
  app.listen(config.port, config.host, () => {
    console.log(`BetterHub API listening on http://${config.host}:${config.port}`);
  });
});

function rateLimit(scope: string, maxRequests: number, windowMs: number): express.RequestHandler {
  return (req, res, next) => {
    const result = consumeRateLimit(scope, getClientIp(req), maxRequests, windowMs);
    if (!result.allowed) {
      res.setHeader('Retry-After', Math.ceil(result.retryAfterMs / 1000));
      return next(tooManyRequests());
    }

    return next();
  };
}

function requireTrustedOrigin(
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction,
) {
  if (!isTrustedOrigin(req.headers.origin, allowedOrigins) && !isTrustedTunnelOrigin(req.headers.origin)) {
    return next(forbidden('Origin not allowed.'));
  }

  return next();
}

async function requireAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.get('bhi_admin_session') || '';

  if (!token) {
    res.setHeader('Set-Cookie', clearSessionCookie(secureCookies));
    return next(unauthorized());
  }

  const session = await getAdminSession(token);
  if (!session) {
    res.setHeader('Set-Cookie', clearSessionCookie(secureCookies));
    return next(unauthorized());
  }

  req.adminEmail = session.email;
  req.authToken = token;
  return next();
}

function getBaseUrl(req: express.Request) {
  if (config.publicSiteUrl) {
    return config.publicSiteUrl;
  }

  return `${req.protocol}://${req.get('host')}`;
}

function buildSitemapXml(baseUrl: string, content: SiteContent) {
  const staticPaths = [
    '/',
    '/about',
    '/services',
    '/products',
    '/industries',
    '/careers',
    '/blog',
    '/contact',
    '/privacy-policy',
    '/sitemap',
  ];

  const dynamicPaths = [
    ...content.services.map((service) => `/service/${service.id}`),
    ...content.products.map((product) => `/product/${product.id}`),
    ...content.blogPosts.filter((post) => post.status === 'published').map((post) => `/blog/${post.id}`),
  ];

  const urls = [...new Set([...staticPaths, ...dynamicPaths])].map(
    (targetPath) => `  <url><loc>${escapeXml(`${baseUrl}${targetPath}`)}</loc></url>`,
  );

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function isTrustedTunnelOrigin(originHeader: string | undefined) {
  if (config.nodeEnv === 'production' || !originHeader) {
    return false;
  }

  try {
    const hostname = new URL(originHeader).hostname.toLowerCase();
    return (
      hostname.endsWith('.ngrok-free.app') ||
      hostname.endsWith('.ngrok.app') ||
      hostname.endsWith('.loca.lt') ||
      hostname.endsWith('.trycloudflare.com') ||
      hostname.endsWith('.localhost.run')
    );
  } catch {
    return false;
  }
}

declare global {
  namespace Express {
    interface Request {
      adminEmail?: string;
      authToken?: string;
    }
  }
}
