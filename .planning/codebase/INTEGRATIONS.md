# External Integrations

**Analysis Date:** 2026-04-05

## APIs & External Services

**Content Management:**
- Notion - Content database and CMS
  - SDK/Client: @notionhq/client 2.2.15 (`src/lib/notion.ts`)
  - Auth: `NOTION_TOKEN` environment variable
  - Conversion: notion-to-md 3.1.9 for markdown export
  - Databases accessed:
    - Blog posts: `NOTION_BLOG_DB_ID`
    - Resources: `NOTION_RESOURCES_DB_ID`
    - Solutions: `NOTION_SOLUTIONS_DB_ID`
    - Events: `NOTION_EVENT_DB_ID`
    - Members: `NOTION_MEMBER_DB_ID`
    - Chapters: `NOTION_CHAPTERS_DB_ID` (optional)
    - Ventures intake: `NOTION_VENTURES_INTAKE_DB_ID`
    - Deal pipeline: `NOTION_DEAL_PIPELINE_DB_ID` (optional)

**Email & Communication:**
- Resend - Email delivery service
  - SDK/Client: Resend 6.9.4 (`src/lib/email.ts`)
  - Auth: `RESEND_API_KEY` environment variable
  - Usage: Form submissions and admin notifications
  - Integration: `src/app/api/contact/route.ts`, `src/app/api/submit-post/route.ts`, `src/app/api/submit-resource/route.ts`, application endpoints
  - Components: @react-email/components for email templates

**Newsletter:**
- Beehiiv - Newsletter subscription platform
  - Endpoint: `https://api.beehiiv.com/v2/publications/{PUBLICATION_ID}/subscriptions`
  - Auth: Bearer token via `BEEHIIV_API_KEY`
  - Implementation: `src/app/api/subscribe/route.ts`
  - Config vars: `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID` (both optional)
  - Fallback: Skips subscription if not configured (logs warning)

## Data Storage

**Databases:**
- Notion (primary)
  - Connection: API token (`NOTION_TOKEN`)
  - Client: @notionhq/client
  - Usage: All application data (blog, resources, solutions, events, members, chapters, ventures)
  - Caching: Next.js `unstable_cache` with ISR (revalidate: 3600s, tags-based)
  - Cache tags: `notion:blog`, `notion:events`, `notion:resources`, `notion:solutions`, `notion:members`, `notion:chapters`

**File Storage:**
- Local filesystem only - No external blob storage
- Images/assets served from public directory or embedded in Notion

**Caching:**
- Next.js built-in cache with tags (`src/app/api/revalidate/route.ts`)
- Revalidation endpoint for on-demand ISR
- Revalidation secret: `REVALIDATE_SECRET` (optional, guards ISR endpoint)

## Authentication & Identity

**Auth Provider:**
- None - No built-in authentication system
- Admin access: Protected via `REVALIDATE_SECRET` in ISR endpoint
- Form CORS protection: `ALLOWED_ORIGINS` environment variable (comma-separated)

## Monitoring & Observability

**Error Tracking:**
- Sentry - Error monitoring and diagnostics
  - SDK: @sentry/nextjs 10.46.0
  - Configuration: `next.config.ts` with org "sagie", project "sagie-co"
  - Instrumentation: `src/lib/email.ts`, `src/lib/notion-monitor.ts`
  - Tags: service (resend, notion), type (confirmation, admin_alert, write_failure)
  - Usage: Captures email send failures and Notion write failures

**Logs:**
- Console logging with environment checks (logs skipped in non-production)
- Sentry integration for exception logging
- Vercel analytics and speed insights

**Performance:**
- @vercel/analytics 2.0.1 - Analytics tracking (`src/app/layout.tsx`)
- @vercel/speed-insights 2.0.0 - Performance monitoring (`src/app/layout.tsx`)
- GSAP for animation performance optimization

## CI/CD & Deployment

**Hosting:**
- Vercel - Native Next.js deployment
- Configuration: Sentry integration in `next.config.ts`
- Protected routes: Vercel automation bypass via `VERCEL_AUTOMATION_BYPASS_SECRET`

**CI Pipeline:**
- Playwright tests configurable via `PLAYWRIGHT_TEST_BASE_URL`
- Test workers: Single worker in CI, unlimited in local (per `playwright.config.ts`)
- E2E test directory: `tests/`

## Environment Configuration

**Required env vars:**
- `NOTION_TOKEN` - Notion API authentication key
- `NOTION_BLOG_DB_ID` - Notion blog database ID
- `NOTION_RESOURCES_DB_ID` - Resources database ID
- `NOTION_SOLUTIONS_DB_ID` - Solutions database ID
- `NOTION_EVENT_DB_ID` - Events database ID
- `NOTION_MEMBER_DB_ID` - Members/chapters database ID
- `NOTION_VENTURES_INTAKE_DB_ID` - Ventures intake form submissions
- `ALLOWED_ORIGINS` - CORS-allowed origins for form submissions
- `NODE_ENV` - Environment (development, test, production)

**Optional env vars:**
- `RESEND_API_KEY` - Resend email service (skipped if not set)
- `BEEHIIV_API_KEY` - Beehiiv newsletter API
- `BEEHIIV_PUBLICATION_ID` - Beehiiv publication ID
- `REVALIDATE_SECRET` - ISR revalidation secret
- `ADMIN_EMAIL` - Admin notification email (default: hello@sagie.co)
- `NOTION_CHAPTERS_DB_ID` - Optional chapters database
- `NOTION_DEAL_PIPELINE_DB_ID` - Optional deal pipeline database
- `PLAYWRIGHT_TEST_BASE_URL` - E2E test base URL
- `VERCEL_AUTOMATION_BYPASS_SECRET` - Vercel protection bypass
- `.env.local` present - Contains actual secrets (never committed)

**Secrets location:**
- `.env.local` - Local development (git-ignored)
- `.env.example` - Template reference (no actual values)

## Webhooks & Callbacks

**Incoming:**
- `/api/revalidate` (POST) - ISR revalidation endpoint
  - Secret protection: `REVALIDATE_SECRET`
  - Payload: `{ secret, tags?: string[] }`
  - Triggers: Cache invalidation for specified Notion tags
  - Response: `{ revalidated: true, tags, now }`

**Outgoing:**
- No outgoing webhooks detected
- Notion API is pull-based (polling via `unstable_cache` with ISR revalidation)
- Beehiiv integration is one-way (POST to subscribe endpoint)

## Third-Party Data Flows

**Form Submissions:**
1. Client submits form to API route
2. Validation via Zod schemas
3. Data sanitized via `sanitizeRecord()`
4. Stored in Notion database via @notionhq/client
5. Confirmation email sent via Resend (if RESEND_API_KEY configured)
6. Admin alert email sent to ADMIN_EMAIL via Resend
7. Errors captured to Sentry

**Content Publishing:**
1. Admin creates/updates content in Notion
2. Revalidation endpoint triggered (manual or via Notion webhook integration)
3. Next.js ISR revalidates cache tags
4. `unstable_cache` refetches from Notion
5. Page/API renders fresh content

**Newsletter Subscription:**
1. Client submits email to `/api/subscribe`
2. Validation via Zod
3. POST to Beehiiv API (if configured)
4. Skipped gracefully if not configured

---

*Integration audit: 2026-04-05*
