# External Integrations

**Analysis Date:** 2026-03-28

## APIs & External Services

**Content & Data (Notion):**
- Notion API - Sole database for all content (blog posts, events, resources, solutions, members, ventures)
  - SDK/Client: `@notionhq/client` ^2.2.15
  - Auth: `NOTION_TOKEN` env var (server-side only, never exposed to client)
  - Client singleton: `src/lib/notion.ts`
  - CSP allows: `connect-src https://api.notion.com`

**Error Monitoring (Sentry):**
- Sentry - Error tracking and performance monitoring across all runtimes
  - SDK: `@sentry/nextjs` ^10.46.0
  - Org: `sagie`, Project: `sagie-co` (configured in `next.config.ts`)
  - Client config: `sentry.client.config.ts` — `tracesSampleRate: 1.0`, session replay at 10% / 100% on error
  - Server config: `sentry.server.config.ts` — `tracesSampleRate: 1.0`
  - Edge config: `sentry.edge.config.ts` — `tracesSampleRate: 1.0`
  - Auth token for source maps: `SENTRY_AUTH_TOKEN` GitHub secret
  - DSN env var: `NEXT_PUBLIC_SENTRY_DSN` (public, used in all three runtimes)
  - CSP allows: `connect-src https://*.ingest.sentry.io`
  - Notion write failures are explicitly tagged: `{ service: 'notion', type: 'write_failure' }` via `src/lib/notion-monitor.ts`

## Data Storage

**Databases:**
- Notion (primary and only data store)
  - Connection: `NOTION_TOKEN`
  - Client: `@notionhq/client` - `src/lib/notion.ts`
  - All read access wrapped with `unstable_cache` (Next.js ISR)
  - All write access wrapped with `notionWrite()` error monitor in `src/lib/notion-monitor.ts`

**Notion Databases:**

| Database | Env Var | Used For | Revalidation TTL |
|----------|---------|----------|-----------------|
| Blog | `NOTION_BLOG_DB_ID` | Blog posts read/write | 3600s |
| Events | `NOTION_EVENT_DB_ID` | Events listing + suggestions | 300s |
| Resources | `NOTION_RESOURCES_DB_ID` | Resource directory | 21600s |
| Solutions | `NOTION_SOLUTIONS_DB_ID` | Solutions providers | 43200s |
| Members | `NOTION_MEMBER_DB_ID` | Membership applications (write only) | N/A |
| Ventures Intake | `NOTION_VENTURES_INTAKE_DB_ID` | Ventures applications (write only) | N/A |
| Deal Pipeline | `NOTION_DEAL_PIPELINE_DB_ID` | Referenced in env; no read lib yet | N/A |

**File Storage:**
- None - Images and assets referenced by URL from Notion properties (`Cover Image`, `Event Image`)

**Caching:**
- Next.js ISR via `unstable_cache` with tag-based revalidation
  - Cache tags: `notion:blog`, `notion:events`, `notion:resources`, `notion:solutions`
  - TTL varies per data type (300s–43200s; see table above)

## Authentication & Identity

**Auth Provider:**
- None - No user authentication system exists
- API routes are public; bot protection implemented client-side via honeypot field (`_trap`) and timing check (`_t` < 3000ms) in `src/lib/validation.ts`
- Origin validation via `ALLOWED_ORIGINS` allowlist (`src/env/server.ts`)

## Monitoring & Observability

**Error Tracking:**
- Sentry (see above)
- Notion write errors captured with `Sentry.captureException()` and tagged

**Logs:**
- `console.error()` used in API route catch blocks (e.g., `src/app/api/applications/membership/route.ts`)
- No structured logging framework

## CI/CD & Deployment

**Hosting:**
- Vercel - Production and preview deployments
  - Preview deployments trigger E2E tests via `deployment_status` webhook
  - Automation bypass: `VERCEL_AUTOMATION_BYPASS_SECRET` used in Playwright requests

**CI Pipeline:**
- GitHub Actions
  - `ci.yml` - Runs on PRs to `main`: preflight (secrets check), lint, typecheck, unit tests
  - `e2e-preview.yml` - Runs Playwright against Vercel preview URL on successful deployment
  - Node.js 22, `npm ci` with node_modules caching, Playwright browsers cached

**Required GitHub Secrets:**

| Secret | Purpose |
|--------|---------|
| `NOTION_TOKEN` | CI preflight validation |
| `SENTRY_AUTH_TOKEN` | Sentry source map upload during build |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | Bypass Vercel deployment protection in E2E tests |

## Webhooks & Callbacks

**Incoming:**
- On-demand ISR revalidation: `REVALIDATE_SECRET` env var present in schema (`src/env/server.ts`) but no revalidate API route was found in `src/app/api/`. The secret is provisioned but the handler endpoint has not yet been implemented.

**Outgoing:**
- None - All Notion writes are fire-and-forget; no outgoing webhooks

## API Routes Summary

All API routes write to Notion databases. Validation via `withValidation()` wrapper (`src/lib/validation.ts`).

| Route | Schema | Target Notion DB |
|-------|--------|-----------------|
| `POST /api/applications/membership` | `MembershipSchema` | `NOTION_MEMBER_DB_ID` |
| `POST /api/applications/chapter` | `ChapterSchema` | `NOTION_MEMBER_DB_ID` (chapter section) |
| `POST /api/applications/ventures` | `VenturesSchema` | `NOTION_VENTURES_INTAKE_DB_ID` |
| `POST /api/applications/solutions` | `SolutionsSchema` | `NOTION_SOLUTIONS_DB_ID` |
| `POST /api/suggest-event` | `EventSuggestionSchema` | `NOTION_EVENT_DB_ID` |
| `POST /api/submit-post` | `SubmitPostSchema` | `NOTION_BLOG_DB_ID` |
| `POST /api/submit-resource` | Resource schema | `NOTION_RESOURCES_DB_ID` |

---

*Integration audit: 2026-03-28*
