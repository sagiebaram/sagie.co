# External Integrations

**Analysis Date:** 2026-04-04

## APIs & External Services

**Content Management (Notion):**
- Notion Database API - Core CMS for blog, resources, events, solutions, members, chapters, ventures
  - SDK/Client: `@notionhq/client` (2.2.15)
  - Auth: `NOTION_TOKEN` environment variable
  - Usage: Read databases for landing pages, write user submissions to intake databases
  - Wrapper: `src/lib/notion.ts` - Creates authenticated client
  - Error handling: `src/lib/notion-monitor.ts` - Catches write failures and reports to Sentry

**Email Delivery (Resend):**
- Resend Email Service - Transactional email for form submissions and confirmations
  - SDK/Client: `resend` (6.9.4)
  - Auth: `RESEND_API_KEY` environment variable
  - From address: `SAGIE <hello@sagie.co>`
  - Admin recipient: `ADMIN_EMAIL` environment variable (defaults to `hello@sagie.co`)
  - Usage location: `src/lib/email.ts`
  - Email templates: `src/emails/` directory
    - `ConfirmationEmail` - Sent to applicants
    - `AdminAlertEmail` - Sent to admin with submission data
  - Features:
    - Confirmation emails to applicants after form submission
    - Admin alerts with full submission data
    - Error tracking via Sentry when sends fail
    - Graceful degradation in non-production environments (logged, not sent)
  - Form types triggering emails:
    - Membership Application
    - Chapter Lead Application
    - Ventures Intake
    - Solutions Provider
    - Event Suggestion
    - Blog Post Submission
    - Resource Submission
    - Contact Form

**Newsletter Management (Beehiiv):**
- Beehiiv Newsletter API - Email list management (optional integration)
  - API Endpoint: `https://api.beehiiv.com/v2/publications/{PUBLICATION_ID}/subscriptions`
  - Auth: `BEEHIIV_API_KEY` Bearer token
  - Config: `BEEHIIV_PUBLICATION_ID`
  - Usage: `src/app/api/subscribe/route.ts`
  - Features:
    - Subscribe endpoint accepts email via POST
    - Sets `reactivate_existing: true` to re-enable inactive subscribers
    - Sends welcome email automatically
  - Graceful: Integration is optional (warns if not configured, returns success)

## Data Storage

**Databases (Notion):**
- Blog posts: `NOTION_BLOG_DB_ID`
  - Read via `src/lib/blog.ts`
  - Converted to Markdown via `notion-to-md`
  - Cached with tag: `notion:blog`

- Resources (guides, tools, templates): `NOTION_RESOURCES_DB_ID`
  - Read via `src/lib/resources.ts`
  - Cached with tag: `notion:resources`

- Solutions (providers): `NOTION_SOLUTIONS_DB_ID`
  - Read via `src/lib/solutions.ts`
  - Written to via form submission: `src/app/api/applications/solutions/route.ts`
  - Cached with tag: `notion:solutions`

- Events: `NOTION_EVENT_DB_ID`
  - Read via `src/lib/events.ts`
  - Cached with tag: `notion:events`
  - Generates ICS calendar files via `src/app/api/events/[id]/ics/route.ts`

- Members (community members): `NOTION_MEMBER_DB_ID`
  - Read via `src/lib/members.ts`
  - Cached with tag: `notion:members`

- Chapters (local chapters): `NOTION_CHAPTERS_DB_ID` (optional)
  - Read via `src/lib/chapters.ts`
  - Cached with tag: `notion:chapters`

- Ventures (intake form): `NOTION_VENTURES_INTAKE_DB_ID`
  - Written to via form: `src/app/api/applications/ventures/route.ts`

- Deals (optional): `NOTION_DEAL_PIPELINE_DB_ID`
  - Optional integration, no reads detected

**File Storage:**
- Local filesystem only
- Public assets: `public/` directory
- Generated files: `.next/` (Next.js build output, not committed)

**Caching:**
- None (external cache service)
- Uses Next.js ISR tags: `notion:blog`, `notion:events`, `notion:resources`, `notion:solutions`, `notion:members`, `notion:chapters`
- Revalidation via webhook: `src/app/api/revalidate/route.ts`
  - Secret-protected POST endpoint
  - Accepts `{ secret, tags }` payload
  - Triggers `revalidateTag()` for specified tags

## Authentication & Identity

**Auth Provider:**
- Custom/None - No centralized auth system
- Approach:
  - Forms use Zod schema validation
  - API routes protected by CORS check: `ALLOWED_ORIGINS`
  - Webhook revalidation protected by `REVALIDATE_SECRET`
  - Admin alerts sent to configured email only
  - No user login required for public forms

**CORS & Origin Validation:**
- Allowed origins configured in `ALLOWED_ORIGINS` env var (comma-separated)
- Parsed in `src/env/server.ts`: `allowedOrigins` Set

## Monitoring & Observability

**Error Tracking (Sentry):**
- Service: Sentry (SaaS error tracking)
- SDK: `@sentry/nextjs` (10.46.0)
- Project: `sagie` / `sagie-co`
- DSN: `NEXT_PUBLIC_SENTRY_DSN` (client-side)
- Initialization:
  - Client: `sentry.client.config.ts`
  - Server: `sentry.server.config.ts`
  - Edge: `sentry.edge.config.ts`
- Sampling:
  - Traces: 0.1 (10%) in production, 1.0 (100%) in dev
  - Replays on session: 0.1 (10%)
  - Replays on error: 1.0 (100%)
- Error Tagging:
  - `service: resend` - Email delivery failures
  - `service: notion` - Notion API write failures
  - `type: confirmation` - Confirmation email failures
  - `type: admin_alert` - Admin alert email failures
  - `type: write_failure` - Notion database write errors

**Logs:**
- Approach: Console logs (development and error reporting)
- Patterns:
  - `console.log()` - Info (email skipped in non-production, Beehiiv config missing)
  - `console.error()` - Errors (form submission failures, API errors)
  - `console.warn()` - Warnings (optional services not configured)
  - Errors captured via Sentry for alerting

**Analytics & Performance:**
- Vercel Analytics: `@vercel/analytics` (2.0.1)
  - Imported in `src/app/layout.tsx` as `<Analytics />`
  - Privacy-friendly, cookie-free
  - Tracks Web Vitals by default
  - Client-side initialization

- Vercel Speed Insights: `@vercel/speed-insights` (2.0.0)
  - Imported in `src/app/layout.tsx` as `<SpeedInsights />`
  - Monitors Core Web Vitals
  - Server-side instrumentation

## CI/CD & Deployment

**Hosting:**
- Vercel (inferred from `.vercel/` directory and Next.js config)
- Deployment: Automatic via git push (likely from GitHub)
- Edge Runtime: Available for API routes

**CI Pipeline:**
- GitHub Actions (`.github/` directory present)
- Config file present but not examined (in forbidden exploration scope)

**Webhook Integrations:**
- ISR Revalidation: `src/app/api/revalidate/route.ts`
  - Can be called from Notion via automations to trigger cache invalidation
  - Protected by `REVALIDATE_SECRET` environment variable
  - Accepts tags array to revalidate specific content

## Environment Configuration

**Required Environment Variables (Production):**
```
NOTION_TOKEN                          # API token for Notion authentication
NOTION_BLOG_DB_ID                     # Notion database ID for blog posts
NOTION_RESOURCES_DB_ID                # Database ID for resources
NOTION_SOLUTIONS_DB_ID                # Database ID for solutions
NOTION_EVENT_DB_ID                    # Database ID for events
NOTION_MEMBER_DB_ID                   # Database ID for members
NOTION_CHAPTERS_DB_ID                 # Database ID for chapters (optional)
NOTION_VENTURES_INTAKE_DB_ID          # Database ID for ventures intake form
NOTION_DEAL_PIPELINE_DB_ID            # Database ID for deals (optional)
RESEND_API_KEY                        # Resend email service API key
ALLOWED_ORIGINS                       # Comma-separated list of allowed origins
REVALIDATE_SECRET                     # Secret for ISR revalidation webhook (optional)
ADMIN_EMAIL                           # Email address for admin alerts (default: hello@sagie.co)
NODE_ENV                              # Environment (development/test/production)
NEXT_PUBLIC_SENTRY_DSN               # Sentry DSN for error tracking (public)
BEEHIIV_API_KEY                      # Beehiiv API key (optional)
BEEHIIV_PUBLICATION_ID               # Beehiiv publication ID (optional)
```

**Secrets Location:**
- Vercel project settings (for `NOTION_TOKEN`, `RESEND_API_KEY`, etc.)
- Never committed to git (see `.gitignore`)
- Example reference: `.env.example` (safe to read, contains no secrets)

## Webhooks & Callbacks

**Incoming Webhooks:**
- `/api/revalidate` - ISR cache revalidation trigger
  - Source: Notion automations or external scripts
  - Payload: `{ secret: string, tags?: string[] }`
  - Auth: `REVALIDATE_SECRET` validation
  - Response: `{ revalidated: true, tags, now }`

**Outgoing Webhooks:**
- None detected
- All integrations use pull-based approaches (API calls, SDK methods)

## Integration Flow Patterns

**Form Submission Flow:**
1. User fills form (validated by Zod schema)
2. POST to API route (e.g., `/api/applications/solutions`)
3. Validation via `withValidation()` middleware
4. Data sanitized via `sanitizeRecord()`
5. Notion write (if database configured):
   - Properties mapped from form fields
   - Wrapped in `notionWrite()` for error handling
   - Errors logged but non-blocking (graceful bypass)
6. Email sent via Resend:
   - Confirmation to applicant
   - Admin alert to configured email
   - Errors captured to Sentry
7. Response: `{ success: true }` or error

**Content Read Flow:**
1. API route or server component requests data
2. Library function (e.g., `getBlogPosts()`) calls Notion API
3. Notion blocks converted to Markdown via `notion-to-md`
4. Cached with ISR tag (e.g., `notion:blog`)
5. Served with cache until revalidation triggered

**Revalidation Flow:**
1. External trigger: POST to `/api/revalidate` with secret
2. Secret validated against `REVALIDATE_SECRET`
3. Tags specified in payload or defaults to all tags
4. `revalidateTag()` called for each tag
5. Next.js invalidates matching cached pages
6. Content refreshes on next request

---

*Integration audit: 2026-04-04*
