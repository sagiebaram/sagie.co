# External Integrations

**Analysis Date:** 2026-03-30

## APIs & External Services

**Content & Data Management:**
- Notion - Content management and database system
  - SDK/Client: @notionhq/client 2.2.15
  - Auth: `NOTION_TOKEN` environment variable
  - Usage: Multiple database queries and page creation across content types
  - Implementation: `src/lib/notion.ts` - Client instantiation
  - Monitoring: `src/lib/notion-monitor.ts` - Error tracking with Sentry for write operations

**Email Delivery:**
- Resend - Email sending service
  - SDK/Client: resend 6.9.4
  - Auth: `RESEND_API_KEY` environment variable (optional, production only)
  - Usage: Confirmation emails to users and admin alerts
  - Implementation: `src/lib/email.ts`
  - Environment: Only active in production (skipped in development/test)
  - Email templates: `src/emails/ConfirmationEmail.tsx`, `src/emails/AdminAlertEmail.tsx`
  - Error tracking: Exceptions captured to Sentry with service tags

**Error Tracking & Monitoring:**
- Sentry - Error tracking and performance monitoring
  - SDK: @sentry/nextjs 10.46.0 (includes client, server, edge support)
  - Auth: `NEXT_PUBLIC_SENTRY_DSN` (public DSN for client-side, configured in next.config.ts via org: 'sagie', project: 'sagie-co')
  - Configuration:
    - Client-side: `sentry.client.config.ts` - Trace sample rate 0.1 (prod), 1.0 (dev); replay sessions 0.1; error replays 1.0
    - Server-side: `sentry.server.config.ts` - Same trace sampling
    - Edge: `sentry.edge.config.ts` - Lightweight edge runtime config
  - Usage: Captured in `src/lib/email.ts` (Resend failures), `src/lib/notion-monitor.ts` (Notion write failures)
  - Integration: Wrapped via `withSentryConfig` in next.config.ts

## Data Storage

**Databases:**
- Notion - Primary data storage
  - Connection: API token via `NOTION_TOKEN`
  - Client: @notionhq/client with custom wrapper
  - Database IDs (via environment variables):
    - `NOTION_BLOG_DB_ID` - Blog posts (`src/lib/blog.ts`)
    - `NOTION_RESOURCES_DB_ID` - Resources directory (`src/lib/resources.ts`)
    - `NOTION_SOLUTIONS_DB_ID` - Solutions listing (`src/lib/solutions.ts`)
    - `NOTION_EVENT_DB_ID` - Events/calendar data (`src/lib/events.ts`)
    - `NOTION_MEMBER_DB_ID` - Community members (`src/lib/members.ts`)
    - `NOTION_CHAPTERS_DB_ID` - Chapter information (`src/lib/chapters.ts`)
    - `NOTION_VENTURES_INTAKE_DB_ID` - Ventures applications (`src/app/api/applications/ventures/route.ts`)
    - `NOTION_DEAL_PIPELINE_DB_ID` - Deal pipeline (optional)
  - Data Access Patterns:
    - Query: `notion.databases.query()` - Used for fetching pages with filters
    - Create: `notion.pages.create()` - Used for form submissions writing to databases
  - Conversion: notion-to-md 3.1.9 converts Notion content to Markdown for blog rendering

**File Storage:**
- Notion file attachments - Files stored via Notion database attachments (not separate cloud storage)
- No S3/Google Cloud/Azure blob storage detected

**Caching:**
- Next.js native caching:
  - Cache tags: `notion:blog`, `notion:events`, `notion:resources`, `notion:solutions`, `notion:members`, `notion:chapters`
  - Revalidation endpoint: `POST /api/revalidate` - Manual cache invalidation via secret
  - Implementation: `src/app/api/revalidate/route.ts` - Uses Next.js `revalidateTag()` API

## Authentication & Identity

**Auth Provider:**
- No dedicated auth provider (Clerk, Auth0, NextAuth.js not present)
- Custom origin validation via environment variable:
  - `ALLOWED_ORIGINS` - Comma-separated list for CORS/webhook validation
  - Implementation: `src/env/server.ts` - Parsed as Set for membership validation
  - Usage: `src/lib/validation.ts` - Validates request origin in form submissions

**Authorization:**
- Admin endpoints secured via secret tokens:
  - `/api/revalidate` - Requires `REVALIDATE_SECRET` header validation
  - Form submissions - Optional origin validation for CORS
- No per-user permission system (simple admin secret pattern)

## Monitoring & Observability

**Error Tracking:**
- Sentry - Captures exceptions from:
  - Email delivery failures (Resend)
  - Notion write failures (all form submissions and API operations)
  - Performance traces (0.1% in production)
  - Session replays on error (100% capture rate)

**Logs:**
- Console logging in development:
  - `src/lib/email.ts` - Logs email skips in non-production
  - `src/app/api/applications/membership/route.ts` - Logs application failures
- No external log aggregation (ELK, Datadog, etc.)

## CI/CD & Deployment

**Hosting:**
- Vercel - Edge-optimized serverless platform
  - Project config: `.vercel/project.json` (projectId: prj_fTQQAZhN7twm93BvnWfUbEbFIPCW)
  - Edge functions: Sentry edge config available for edge middleware
  - Bypass header: `x-vercel-protection-bypass` via `VERCEL_AUTOMATION_BYPASS_SECRET` for test automation

**CI Pipeline:**
- GitHub Actions (configured in `.github/` directory)
- Playwright tests with CI detection:
  - Single worker in CI mode (via `process.env.CI`)
  - Multi-worker locally
  - Base URL: Configurable via env var or localhost:3000

## Environment Configuration

**Required env vars:**
- `NOTION_TOKEN` - Critical for all content operations
- `NOTION_BLOG_DB_ID` - Required for blog rendering
- `NOTION_RESOURCES_DB_ID` - Required for resources page
- `NOTION_SOLUTIONS_DB_ID` - Required for solutions listing
- `NOTION_EVENT_DB_ID` - Required for events/calendar
- `NOTION_MEMBER_DB_ID` - Required for membership applications
- `NOTION_VENTURES_INTAKE_DB_ID` - Required for ventures applications
- `ALLOWED_ORIGINS` - Required for form submission validation
- `NODE_ENV` - Required (development/test/production)

**Optional env vars:**
- `NOTION_CHAPTERS_DB_ID` - For chapter features
- `NOTION_DEAL_PIPELINE_DB_ID` - For deal pipeline (if implemented)
- `RESEND_API_KEY` - Email delivery (production recommended, not development)
- `REVALIDATE_SECRET` - Cache invalidation (production recommended)
- `NEXT_PUBLIC_SENTRY_DSN` - Error tracking (production recommended)
- `VERCEL_AUTOMATION_BYPASS_SECRET` - Test automation (development/testing)
- `PLAYWRIGHT_TEST_BASE_URL` - E2E test URL (defaults to http://localhost:3000)

**Secrets location:**
- Development: `.env.local` file (ignored by git)
- Production: Vercel environment variables dashboard
- `.env.example` available showing structure

## Webhooks & Callbacks

**Incoming:**
- `/api/revalidate` - POST endpoint for cache invalidation
  - Secret-based auth via `REVALIDATE_SECRET`
  - Accepts optional `tags` array to target specific cache keys
  - Returns: `{ revalidated: true, tags: string[], now: number }`
- `/api/submit-post` - Form submission handler (blog posts)
- `/api/submit-resource` - Form submission handler (resources)
- `/api/suggest-event` - Form submission handler (event suggestions)
- `/api/applications/membership` - Membership application handler
- `/api/applications/chapter` - Chapter lead application handler
- `/api/applications/solutions` - Solutions provider application handler
- `/api/applications/ventures` - Ventures intake application handler

**Outgoing:**
- Email confirmations via Resend (async, fire-and-forget with error catching)
- No outgoing webhooks to external services detected
- Sentry error reporting (automatic via SDK)

---

*Integration audit: 2026-03-30*
