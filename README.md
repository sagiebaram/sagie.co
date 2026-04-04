# sagie.co

**S.A.G.I.E** (Shape a Great Impact Everywhere) — the marketing site and operational hub for a curated ecosystem connecting founders, operators, and builders across multiple cities.

Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components, ISR)
- **Language:** TypeScript 6 (strict mode)
- **React:** 19 with React Compiler enabled
- **Styling:** Tailwind CSS v4 (inline theme via `globals.css`)
- **Animations:** GSAP (ScrollTrigger + SplitText) + Motion
- **3D:** Three.js / react-globe.gl (lazy-loaded via `GlobeShell`)
- **Forms:** react-hook-form + Zod + react-phone-number-input
- **Location:** country-state-city (cascading country → state → city dropdowns)
- **Phone Validation:** libphonenumber-js (international phone number validation)
- **Database:** Notion API (`@notionhq/client`)
- **Email:** Resend + React Email
- **Newsletter:** Beehiiv API integration
- **Error Monitoring:** Sentry (client + server + edge)
- **Testing:** Vitest (unit) + Playwright (E2E)
- **Deployment:** Vercel + GitHub Actions CI/CD

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
| `NOTION_CHAPTERS_DB_ID` | No | Chapter features database ID |
| `BEEHIIV_API_KEY` | No | Beehiiv newsletter API key |
| `BEEHIIV_PUBLICATION_ID` | No | Beehiiv publication identifier |
| `ALLOWED_ORIGINS` | Yes | Comma-separated allowed origins |
| `REVALIDATE_SECRET` | No | Secret for on-demand ISR revalidation |
| `RESEND_API_KEY` | No | Email delivery via Resend (skipped in dev/test) |
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
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:coverage` | Run unit tests with coverage |

## Project Structure

```text
src/
├── app/                    # Next.js App Router pages & layout
│   ├── (marketing)/        # Public pages (home, blog, events, apply, legal)
│   └── api/                # API route handlers (11 endpoints)
├── components/
│   ├── forms/              # Form components (6 forms with honeypot protection)
│   ├── layout/             # Navbar, Footer
│   ├── sections/           # Hero, Pillars, Tiers, FAQ, SocialProof, etc.
│   └── ui/                 # Reusable UI (LocationFields, PhoneField, NewsletterForm, etc.)
├── constants/              # Copy & persona data
├── emails/                 # React Email templates (confirmation + admin alert)
├── env/                    # Zod-validated environment variables
├── hooks/                  # Custom hooks (useScrollReveal)
├── lib/                    # Notion client, validation, schemas, location data, monitoring
└── types/                  # TypeScript type definitions
```

## Architecture

### Pages

- **Home** — Hero, Belief, Pillars, WhoItsFor, SocialProof, ChapterMap, Tiers, FAQ, Founder, CTA
- **Pillars** — ECO (ecosystem page), Ventures (venture pillar page)
- **Content** — Blog, Events, Resources, Solutions (all Notion-driven with filters)
- **Applications** — Membership, Chapter Lead, Solutions Provider, Ventures Intake
- **Legal** — Privacy Policy, Terms of Service, Contact

### API Routes

All form submissions go through validated API routes:

- `/api/applications/membership` — Membership applications (Zod + honeypot)
- `/api/applications/chapter` — Chapter lead applications
- `/api/applications/solutions` — Solutions provider applications
- `/api/applications/ventures` — Ventures intake
- `/api/subscribe` — Newsletter subscription (Beehiiv integration)
- `/api/contact` — Contact form submissions
- `/api/submit-post` — Community blog post submissions
- `/api/suggest-event` — Event suggestions
- `/api/submit-resource` — Resource submissions
- `/api/events/[id]/ics` — iCalendar file generation for events
- `/api/revalidate` — ISR cache invalidation (secret-protected)

Each route uses:

- **`withValidation`** — Zod schema validation + honeypot/timing bot detection + rate limiting
- **`notionWrite`** — Sentry-monitored Notion API wrapper

### Security

- **CSP + security headers** configured in `next.config.ts`
- **Honeypot fields** (`_trap` + `_t` timing) on all forms — bots get silent 200s
- **Rate limiting** — 5 requests per IP per 10 minutes on all form endpoints
- **Zod validation** on both client and server — invalid data returns 422 with field errors
- **RFC 5321 email validation** — production-grade email checks beyond basic regex
- **International phone validation** — libphonenumber-js for E.164 phone number validation
- **Environment validation** — server env vars validated at startup via `src/env/server.ts`

### Performance

- **ISR caching** via `unstable_cache` on all Notion read queries:
  - Blog: 1hr, Events: 5min, Resources: 6hr, Solutions: 12hr, Members/Chapters: 1hr
- **Globe lazy loading** — Three.js bundle only loads on desktop via `GlobeShell`
- **React Compiler** enabled for automatic memoization

## Testing

- **Unit tests** (Vitest): `src/lib/__tests__/` — data transforms, schema validation, email templates, rate limiting
- **E2E tests** (Playwright): `tests/` — smoke tests, content verification, form workflows

## CI/CD

GitHub Actions workflows in `.github/workflows/`:

- **`ci.yml`** — Runs on PRs to `main`: preflight, lint, typecheck, unit tests
- **`e2e-preview.yml`** — Runs Playwright against Vercel preview deployments

5 required PR checks must pass before merging. See [GITHUB_SECRETS_CHECKLIST.md](GITHUB_SECRETS_CHECKLIST.md) for required secrets.
