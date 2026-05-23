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
- dynamic `robots.txt` and `sitemap.xml`
- production deployment support with Docker

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

If you later want email notifications, CRM sync, or webhook delivery, those can be layered on top of the current backend cleanly.

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
