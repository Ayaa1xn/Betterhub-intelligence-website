# BetterHub Intelligence

Production-oriented marketing website and admin-managed content system for BetterHub Intelligence.

This project now includes:
- a public React frontend
- a hardened Express backend
- admin authentication with secure server-side sessions
- SQLite-backed persistence for site content, submissions, and admin sessions
- runtime upload handling
- media management
- form submission handling for inquiries and careers
- optional signed webhook notifications for inquiries and careers
- dynamic `robots.txt` and `sitemap.xml`
- production deployment support with Docker, Docker Compose, and Nginx
- GitHub Actions CI for lint, tests, and builds

## Architecture

The app is split into two layers:

1. Frontend
- Vite + React + TypeScript
- client-side routing with clean path URLs
- public pages for home, products, services, industries, blog, careers, contact, privacy policy, and sitemap
- admin console at `/admin`

2. Backend
- Express server serving API routes and the built frontend bundle
- SQLite database for runtime persistence
- secure admin session cookie auth
- runtime upload storage
- validation, sanitization, rate limiting, and security headers

## Runtime Data Model

Seed content lives in:
- `data/site-content.json`

Runtime data lives in:
- `data/runtime/betterhub.sqlite`
- `data/runtime/uploads/`

The seed JSON is used for first-time bootstrap only. After initialization, the live editable content is read from the SQLite database.

## Database Schema

The runtime database stores:
- `site_state`: current public/admin-managed site content as normalized JSON
- `admin_users`: admin accounts with hashed passwords
- `admin_sessions`: expiring admin sessions
- `contact_submissions`: inquiry submissions
- `career_submissions`: job applications
- `uploads`: runtime upload metadata

## Security Baseline

This project now includes:
- no hardcoded admin password in UI or source code defaults
- secure server-side admin sessions via `HttpOnly` cookies
- SameSite cookie protection
- origin checks for mutating routes
- rate limiting on login, inquiry, career, and upload endpoints
- security headers including CSP, frame denial, and content-type protection
- rich-text sanitization before rendering
- public-content filtering so draft posts and closed roles are not exposed
- SQLite persistence instead of mutable JSON-only runtime storage

## Required Environment Variables

Create a local runtime env file such as `.env.local`.

Node requirement:
- Node.js 22 or newer

Minimum required variables:

```bash
API_PORT="3001"
API_HOST="127.0.0.1"
PUBLIC_SITE_URL="https://your-domain.com"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD_HASH="paste-generated-hash-here"
ADMIN_SESSION_SECRET="generate-a-long-random-secret"
```

Optional runtime tuning:

```bash
ADMIN_SESSION_TTL_HOURS="12"
LOGIN_RATE_LIMIT_MAX="10"
LOGIN_RATE_LIMIT_WINDOW_MS="900000"
CONTACT_RATE_LIMIT_MAX="12"
CONTACT_RATE_LIMIT_WINDOW_MS="900000"
CAREER_RATE_LIMIT_MAX="8"
CAREER_RATE_LIMIT_WINDOW_MS="1800000"
UPLOAD_RATE_LIMIT_MAX="30"
UPLOAD_RATE_LIMIT_WINDOW_MS="3600000"
ALLOWED_ORIGINS="https://your-domain.com"
SUBMISSION_WEBHOOK_URL=""
SUBMISSION_WEBHOOK_SECRET=""
SUBMISSION_WEBHOOK_TIMEOUT_MS="5000"
```

## Generate an Admin Password Hash

Use:

```bash
npm run admin:hash -- "your-password"
```

Then place the printed value into `ADMIN_PASSWORD_HASH`.

## Local Development

Install dependencies:

```bash
npm install
```

Start client + API:

```bash
npm run dev
```

Local URLs:
- frontend: `http://127.0.0.1:3000`
- API: `http://127.0.0.1:3001`

### Share a Local Build via ngrok or Another Tunnel

When you want to share your local dev site with someone else through ngrok, Cloudflare Tunnel, or a similar public URL, add the tunnel URL to `.env.local` and restart the dev server:

```bash
DEV_PUBLIC_URL="https://your-tunnel-host.example"
```

If your tunnel requires an additional explicit host allowlist entry, you can also set:

```bash
DEV_ALLOWED_HOSTS="your-tunnel-host.example"
```

This keeps both layers aligned:
- Vite will allow the public host instead of blocking it
- the backend will accept that origin for admin login, contact forms, and career submissions

For ngrok specifically, the usual flow is:
1. start `npm run dev`
2. start `ngrok http 3000`
3. copy the HTTPS URL ngrok gives you
4. place that URL into `DEV_PUBLIC_URL` in `.env.local`
5. restart `npm run dev`

If you are sharing the production-style local server instead:

```bash
npm run build
npm start
ngrok http 3001
```

Then common dev tunnel domains such as ngrok are accepted automatically by the backend in non-production mode, so admin login and form submissions do not need an extra origin override just for that preview flow.

## Commands

- `npm run dev` starts Vite and the API together
- `npm run client` starts only the frontend dev server
- `npm run api` starts only the backend
- `npm run build` builds the frontend bundle
- `npm run start` runs the production server
- `npm run lint` runs TypeScript checks
- `npm run test` runs frontend and backend unit tests
- `npm run check` runs lint, tests, and build
- `npm run admin:hash -- "password"` generates a secure admin password hash
- `npm run db:backup` creates a timestamped SQLite backup under `data/runtime/backups/`

## Admin Access Flow

Admin login is handled by:
- `POST /api/admin/login`
- secure session cookie set by the server
- `GET /api/admin/me` to restore an authenticated session
- `POST /api/admin/logout` to invalidate it

The browser no longer stores the admin bearer token in `localStorage`.

## Public Submission Flow

Contact and career forms:
- validate input on the backend
- reject honeypot spam
- apply IP-based rate limiting
- store submissions in SQLite
- make them visible inside the admin dashboard

Current operational behavior:
- no email provider is required for submissions to be captured
- the admin console is the authoritative inbox
- optional webhook delivery can notify Slack, Zapier, Make, a CRM, or another internal endpoint

Webhook behavior:
- `SUBMISSION_WEBHOOK_URL` receives a signed JSON POST for contact and career submissions
- `X-BetterHub-Event` identifies the submission type
- `X-BetterHub-Delivery` provides a unique delivery id
- `X-BetterHub-Signature` is included when `SUBMISSION_WEBHOOK_SECRET` is set

If you later want SMTP email delivery in addition to webhooks, that can be layered on top of the current backend cleanly.

## Upload Handling

Seed media:
- `data/uploads/`

Runtime uploaded media:
- `data/runtime/uploads/`

Both are served from `/uploads/...`, but runtime uploads are kept separate from seed assets so public content editing does not pollute repository-tracked media.

## Production Deployment

This app is designed to run as a single Node process serving both:
- the compiled frontend
- the backend API

### Recommended Deployment Shape

1. Use a VPS, container host, or platform that supports:
- persistent disk/volume storage
- long-running Node processes
- HTTPS termination

2. Build and run:

```bash
npm install
npm run build
npm start
```

3. Persist:
- `data/runtime/betterhub.sqlite`
- `data/runtime/uploads/`

4. Put a reverse proxy or managed edge in front for:
- HTTPS
- domain mapping
- gzip/brotli
- request logging

### Docker

A production Dockerfile is included:

```bash
docker build -t betterhub-intelligence .
docker run -p 3001:3001 --env-file .env.local -v $(pwd)/data/runtime:/app/data/runtime betterhub-intelligence
```

Important:
- mount `data/runtime` as a persistent volume
- do not rely on container filesystem persistence alone

### Docker Compose

A `docker-compose.yml` file is included for a single-host deployment:

```bash
docker compose up -d --build
```

### Reverse Proxy

A starter reverse proxy example is included at:
- `deploy/nginx.conf`

You should still attach TLS with your real Nginx, Caddy, Traefik, or hosting edge configuration.

### CI

A GitHub Actions workflow is included at:
- `.github/workflows/ci.yml`

It runs `npm run check` on pushes to `main` and on pull requests.

## Hostinger Managed Node.js Notes

If you deploy this repository through Hostinger's managed Node.js flow:

- use Node.js `22.x`
- use build command: `npm run build`
- use start command: `npm start`
- if Hostinger asks for an entry file, use `dist-server/index.js`
- if Hostinger asks for an output directory for the frontend assets, use `dist`

Required environment variables in hPanel:

```bash
PUBLIC_SITE_URL="https://your-live-domain.com"
ADMIN_EMAIL="techteam@bhi"
ADMIN_PASSWORD_HASH="paste-the-generated-hash"
ADMIN_SESSION_SECRET="generate-a-long-random-secret"
ALLOWED_ORIGINS="https://your-live-domain.com"
```

Notes:
- Hostinger will not read `.env.example` automatically. You must add real values in the deployment environment.
- `PORT` is typically injected by the platform, so you usually do not need to set `API_PORT` manually there.
- This app writes runtime content, sessions, submissions, and uploads. If your hosting workflow replaces the app directory during redeploys, move runtime data to a persistent writable path before relying on admin-managed content long term.

## SEO and Crawlability

The site now includes:
- clean routes instead of hash routing
- dynamic document titles and descriptions
- canonical tags
- `robots.txt`
- `sitemap.xml`
- noindex protection for `/admin`

This is strong for a client-rendered site. If you later want maximum SEO depth for large-scale content growth, the next step would be SSR or prerendering.

## Go-Live Checklist

Before launch, confirm:

1. `PUBLIC_SITE_URL` matches the final live domain
2. `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET` are set securely in the host
3. persistent storage is mounted for `data/runtime`
4. HTTPS is enabled
5. `npm run check` passes
6. admin login works on the live domain
7. contact and careers submissions appear in the admin dashboard
8. runtime backup strategy is in place
9. `robots.txt` and `sitemap.xml` resolve correctly on the live domain
10. the reverse proxy or host health check points to `/api/health`

## Operational Notes

- This project is now suitable for staging and controlled production deployment on a persistent Node host.
- It is not a serverless-static-only architecture because content, submissions, and sessions are runtime-backed.
- SQLite is appropriate here for a single-instance company site/admin system. If you later move to multi-admin, high-traffic, or horizontally scaled hosting, the next step would be PostgreSQL plus object storage.
# Betterhub-intelligence-website
