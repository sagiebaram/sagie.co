# External Integrations

**Analysis Date:** 2026-03-28

## APIs & External Services

**CMS / Database (Primary data store):**
- Notion API - Serves as the sole CMS and operational database for all content and intake forms
  - SDK/Client: `@notionhq/client` ^2.2.15
  - Auth: `NOTION_TOKEN` (server-only env var)
  - Client instantiated in: `src/lib/notion.ts`
  - All read operations use `unstable_cache` with tag-based revalidation
  - All write operations wrapped in `notionWrite()` from `src/lib/notion-monitor.ts` for Sentry error capture

**Notion Databases in use:**
| Env Var | Purpose | Revalidation TTL |
|---------|---------|-----------------|
| `NOTION_BLOG_DB_ID` | Blog posts (read) | 3600s / tag: `notion:blog` |
| `NOTION_RESOURCES_DB_ID` | Resource directory (read) | 21600s / tag: `notion:resources` |
| `NOTION_SOLUTIONS_DB_ID` | Solution providers (read) | 43200s / tag: `notion:solutions` |
| `NOTION_EVENT_DB_ID` | Events (read) | 300s / tag: `notion:events` |
| `NOTION_MEMBER_DB_ID` | Membership applications (write) | N/A |
| `NOTION_VENTURES_INTAKE_DB_ID` | Ventures intake (write) | N/A |
| `NOTION_DEAL_PIPELINE_DB_ID` | Deal pipeline (write) | N/A |
| `NOTION_SOLUTIONS_DB_ID` | Solutions provider applications (write) | N/A |

**API routes that write to Notion:**
- `src/app/api/applications/membership/route.ts` → `NOTION_MEMBER_DB_ID`
- `src/app/api/applications/chapter/route.ts` → (Notion write)
- `src/app/api/applications/ventures/route.ts` → `NOTION_VENTURES_INTAKE_DB_ID`
- `src/app/api/applications/solutions/route.ts` → `NOTION_SOLUTIONS_DB_ID`
- `src/app/api/submit-post/route.ts` → `NOTION_BLOG_DB_ID`
- `src/app/api/submit-resource/route.ts` → `NOTION_RESOURCES_DB_ID`
- `src/app/api/suggest-event/route.ts` → `NOTION_EVENT_DB_ID`

**Error Monitoring:**
- Sentry - Error tracking, performance tracing, session replay
  - SDK: `@sentry/nextjs` ^10.46.0
  - Auth: `NEXT_PUBLIC_SENTRY_DSN` (public env var)
  - Sentry org: `sagie`, project: `sagie-co`
  - Configured in: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
  - Wrapped in `next.config.ts` via `withSentryConfig`
  - `tracesSampleRate: 1.0` (100% traces on all runtimes)
  - Session replays: 10% normal, 100% on error (client only)
  - Notion write failures tagged with `{ service: 'notion', type: 'write_failure' }` via `src/lib/notion-monitor.ts`

## Data Storage

**Databases:**
- Notion (see above) - All structured data (blog, events, resources, solutions, members, ventures)
  - Connection: `NOTION_TOKEN`
  - Client: `@notionhq/client` → `src/lib/notion.ts`
  - No traditional relational or document database detected

**File Storage:**
- None detected - Images appear to be stored as URLs in Notion properties (e.g., `coverImage`, `eventImage`)

**Caching:**
- Next.js Data Cache (`unstable_cache`) - In-process cache with tag-based revalidation
  - Blog: 1 hour TTL
  - Events: 5 minutes TTL
  - Resources: 6 hours TTL
  - Solutions: 12 hours TTL
- Cache invalidation: `REVALIDATE_SECRET` env var suggests an on-demand revalidation endpoint exists or is planned

## Authentication & Identity

**Auth Provider:**
- None detected - No user authentication system is implemented
- The site is public-facing marketing / community site with unauthenticated form submissions
- Bot protection on API routes via honeypot field (`_trap`) and minimum elapsed time check (3000ms) implemented in `src/lib/validation.ts`

## Monitoring & Observability

**Error Tracking:**
- Sentry (see above under APIs & External Services)
- CSP `connect-src` explicitly allows `https://*.ingest.sentry.io`

**Logs:**
- `console.error` used in API route catch blocks (e.g., `src/app/api/applications/membership/route.ts`)
- Structured Sentry exception capture for Notion write failures via `src/lib/notion-monitor.ts`

## CI/CD & Deployment

**Hosting:**
- Vercel (inferred) - CI pipeline listens on `deployment_status` GitHub event to trigger E2E tests against Vercel preview URLs via `PLAYWRIGHT_TEST_BASE_URL`

**CI Pipeline:**
- GitHub Actions (`.github/workflows/ci.yml`, `.github/workflows/e2e-preview.yml`)
- `ci.yml` runs on PR to `main`:
  - `preflight` - Validates `NOTION_TOKEN` secret is present
  - `lint` - `npm run lint` (Next.js ESLint)
  - `typecheck` - `npx tsc --noEmit`
  - `unit` - `npx vitest run`
- `e2e-preview.yml` runs on successful deployment:
  - Runs Playwright smoke tests against the preview URL
  - Uploads playwright report as artifact (30-day retention)

## Environment Configuration

**Required env vars (server-side, validated at startup by `src/env/server.ts`):**
- `NOTION_TOKEN` - Notion integration API key
- `NOTION_BLOG_DB_ID` - Notion blog database ID
- `NOTION_RESOURCES_DB_ID` - Notion resources database ID
- `NOTION_SOLUTIONS_DB_ID` - Notion solutions database ID
- `NOTION_EVENT_DB_ID` - Notion events database ID
- `NOTION_DEAL_PIPELINE_DB_ID` - Notion deal pipeline database ID
- `NOTION_MEMBER_DB_ID` - Notion member database ID
- `NOTION_VENTURES_INTAKE_DB_ID` - Notion ventures intake database ID
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins
- `REVALIDATE_SECRET` - Secret for on-demand cache revalidation
- `NODE_ENV` - Must be `development`, `test`, or `production`

**Required env vars (public/client-side):**
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN (safe to expose to browser)

**Secrets location:**
- Vercel environment variables (production)
- GitHub Actions secrets (CI): `NOTION_TOKEN` validated in `preflight` job
- `.env.example` documents expected vars at project root

## Webhooks & Callbacks

**Incoming:**
- On-demand revalidation endpoint implied by `REVALIDATE_SECRET` env var (implementation not located - may be planned or in an undiscovered route)
- CSP `connect-src` allows `https://api.notion.com` for any client-side Notion calls

**Outgoing:**
- All Notion API calls are server-side outbound requests from API routes and cached data fetchers
- Sentry event ingestion via `https://*.ingest.sentry.io`

---

*Integration audit: 2026-03-28*
