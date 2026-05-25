# BetterHub Intelligence

BetterHub Intelligence is the codebase for BetterHub's public website and internal content management experience. It combines a React frontend with a Node.js backend so the site, admin workflow, and operational content can be delivered from a single deployable application.

## Overview

This project supports:

- a public marketing website for BetterHub Intelligence
- an authenticated admin workspace for managing content and reviewing inbound submissions
- a deployment model suited to a persistent Node.js environment

## Highlights

- React, Vite, and TypeScript frontend
- Express-based backend and runtime application server
- SQLite-backed persistence for managed content and runtime data
- media upload support for admin-managed assets
- SEO essentials including canonical metadata, `robots.txt`, and `sitemap.xml`
- container-ready deployment support and CI automation

## Architecture

The application is organized into two primary layers:

- `src/` contains the frontend application and route-driven user experience
- `server/` contains the backend runtime, configuration, persistence, and API logic

Supporting directories include:

- `data/` for seed content and runtime storage paths
- `scripts/` for build and maintenance tasks
- `deploy/` for deployment-related configuration
- `.github/workflows/` for CI automation

## Technology Stack

| Area | Technology |
| --- | --- |
| Frontend | React, Vite, TypeScript |
| Backend | Node.js, Express |
| Persistence | SQLite |
| Tooling | tsx, esbuild, TypeScript |
| Delivery | Docker, Docker Compose, GitHub Actions |

## Development

### Prerequisites

- Node.js 22 or newer
- npm

### Setup

Install dependencies:

```bash
npm install
```

Review `.env.example` and provide the required environment configuration for your local or deployment target.

### Run Locally

Start the development environment:

```bash
npm run dev
```

### Production Build

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the development workflow |
| `npm run client` | Starts the frontend only |
| `npm run api` | Starts the backend only |
| `npm run build` | Builds the frontend and server bundles |
| `npm start` | Starts the production server |
| `npm run lint` | Runs TypeScript checks |
| `npm run test` | Runs the test suite |
| `npm run check` | Runs lint, tests, and build |

## Deployment

This project is intended for a persistent Node.js runtime rather than a static-only host. Production environments should provide:

- a long-running Node.js process
- environment-based runtime configuration
- persistent writable storage for runtime data
- HTTPS termination through the host or a reverse proxy

Container and reverse-proxy support are included in the repository for teams deploying on their own infrastructure.

## CI

GitHub Actions is configured to run the verification pipeline on pushes to `main` and on pull requests.
