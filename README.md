# sagie.co

**S.A.G.I.E** Website — built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 6
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP + Motion (Framer Motion)
- **3D:** Three.js / react-globe.gl (lazy-loaded via `GlobeShell`)
- **Database:** Notion API (`@notionhq/client`)
- **Validation:** Zod
- **Error Monitoring:** Sentry (`@sentry/nextjs`)
- **Deployment:** Vercel

## Getting Started

```bash
cp .env.example .env.local    # then fill in values
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

| Variable | Required | Description |
| --- | --- | --- |
| `NOTION_TOKEN` | Yes | Notion API integration token |
| `NOTION_BLOG_DB_ID` | Yes | Blog posts database ID |
| `NOTION_RESOURCES_DB_ID` | Yes | Resources database ID |
| `NOTION_SOLUTIONS_DB_ID` | Yes | Solutions providers database ID |
| `NOTION_EVENT_DB_ID` | Yes | Events database ID |
| `NOTION_DEAL_PIPELINE_DB_ID` | Yes | Deal pipeline database ID |
| `NOTION_MEMBER_DB_ID` | Yes | Membership database ID |
| `NOTION_VENTURES_INTAKE_DB_ID` | Yes | Ventures intake database ID |
| `ALLOWED_ORIGINS` | Yes | Comma-separated allowed origins |
| `REVALIDATE_SECRET` | Yes | Secret for on-demand ISR revalidation |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry DSN for error monitoring |
| `SENTRY_AUTH_TOKEN` | No | Sentry auth token for source maps |
| `NODE_ENV` | Yes | `development`, `test`, or `production` |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```text
src/
├── app/                    # Next.js App Router pages & layout
│   └── api/                # API route handlers (7 endpoints)
├── components/
│   ├── forms/              # Form components (6 forms with honeypot protection)
│   ├── layout/             # Navbar, Footer
│   ├── sections/           # Hero, Pillars, Tiers, FAQ, SocialProof, etc.
│   └── ui/                 # Reusable UI components
├── constants/              # Copy & persona data
├── env/                    # Zod-validated environment variables
├── lib/                    # Notion client, validation, schemas, monitoring
└── types/                  # TypeScript type definitions
```

## Architecture

### API Routes

All form submissions go through validated API routes:

- `/api/applications/membership` — Membership applications (Zod + honeypot)
- `/api/applications/chapter` — Chapter lead applications
- `/api/applications/solutions` — Solutions provider applications
- `/api/applications/ventures` — Ventures intake (separate DB from Deal Pipeline)
- `/api/submit-post` — Community blog post submissions
- `/api/suggest-event` — Event suggestions
- `/api/submit-resource` — Resource submissions

Each route uses:

- **`withValidation`** — Zod schema validation + honeypot/timing bot detection
- **`notionWrite`** — Sentry-monitored Notion API wrapper

### Security

- **CSP + security headers** configured in `next.config.ts`
- **Honeypot fields** (`_trap` + `_t` timing) on all forms — bots get silent 200s
- **Zod validation** on all API inputs — invalid data returns 422 with field errors
- **Environment validation** — server env vars validated at startup via `src/env/server.ts`

### Performance

- **ISR caching** via `unstable_cache` on all Notion read queries:
  - Blog: 1hr, Events: 5min, Resources: 6hr, Solutions: 12hr
- **Globe lazy loading** — Three.js bundle only loads on desktop via `GlobeShell`

## CI/CD

GitHub Actions workflows in `.github/workflows/`:

- **`ci.yml`** — Runs on PRs to `main`: preflight, lint, typecheck, unit tests
- **`e2e-preview.yml`** — Runs Playwright against Vercel preview deployments

See [GITHUB_SECRETS_CHECKLIST.md](GITHUB_SECRETS_CHECKLIST.md) for required secrets.
