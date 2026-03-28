# External Integrations

**Analysis Date:** 2026-03-28

## APIs & External Services

**Notion (Database Platform):**
- Service: Notion workspace for content management
  - SDK: `@notionhq/client` 2.2.15
  - Client file: `src/lib/notion.ts`
  - Auth: `NOTION_TOKEN` environment variable
  - Write pattern: Uses Notion API to create pages in multiple databases

**Email Service:**
- Service: Resend
  - SDK: `resend` 6.9.4
  - Implementation: `src/lib/email.ts`
  - Auth: `RESEND_API_KEY` environment variable
  - Features: Sends confirmation emails to applicants and admin alerts to `hello@sagie.co`
  - Template system: React email components (`src/emails/ConfirmationEmail`, `src/emails/AdminAlertEmail`)
  - Production-only: Disabled in non-production environments

**Error Tracking & Observability:**
- Service: Sentry
  - SDK: `@sentry/nextjs` 10.46.0
  - Configuration:
    - Server: `sentry.server.config.ts`
    - Client: `sentry.client.config.ts`
    - Edge: `sentry.edge.config.ts`
  - Auth: `NEXT_PUBLIC_SENTRY_DSN` environment variable
  - Sampling:
    - Traces: 10% in production, 100% in development
    - Replays: 10% session, 100% on error
  - Organization: `sagie`
  - Project: `sagie-co`

## Data Storage

**Databases:**
- Notion (primary data store)
  - Connection: `NOTION_TOKEN` authentication
  - Client: `@notionhq/client`
  - Implementation: `src/lib/notion.ts`

**Notion Databases Used:**
- `NOTION_BLOG_DB_ID` - Blog post submissions and published content
- `NOTION_RESOURCES_DB_ID` - Resource listings
- `NOTION_SOLUTIONS_DB_ID` - Solutions provider intake forms
- `NOTION_EVENT_DB_ID` - Event suggestions
- `NOTION_MEMBER_DB_ID` - Member directory
- `NOTION_VENTURES_INTAKE_DB_ID` - Venture intake forms
- `NOTION_CHAPTERS_DB_ID` (optional) - Chapter information
- `NOTION_DEAL_PIPELINE_DB_ID` (optional) - Deal tracking

**File Storage:**
- Local filesystem only (static content and assets)
- No cloud file storage integration detected

**Caching:**
- Next.js built-in cache with revalidation tags:
  - `notion:blog`
  - `notion:events`
  - `notion:resources`
  - `notion:solutions`
  - `notion:members`
  - `notion:chapters`
- Revalidation endpoint: `POST /api/revalidate` (requires `REVALIDATE_SECRET`)

## Authentication & Identity

**Auth Provider:**
- Custom/None - No third-party auth provider detected
- Implementation approach:
  - Rate limiting per IP for form submissions (5 requests per 10 minutes)
  - Honeypot field for bot detection (`_trap` field)
  - Minimum submission time validation (3 seconds)
  - Validation middleware: `src/lib/validation.ts` with `withValidation` HOF

**API Security:**
- All form submissions validated with Zod schemas
- REVALIDATE_SECRET required for cache invalidation endpoint
- Rate limiting in-memory store by IP address

## Monitoring & Observability

**Error Tracking:**
- Sentry integration for server and client errors
- Email service errors tagged with `service: 'resend'` and `type: 'confirmation'|'admin_alert'`
- Sample implementation in `src/lib/email.ts` lines 46-50, 63-67

**Logs:**
- Console logging for development/debugging:
  - Email skipping in non-production: `console.log`
  - API errors: `console.error`
- Sentry captures all exceptions thrown in handlers

**Performance Monitoring:**
- Sentry APM (Application Performance Monitoring) enabled
- Trace sampling: 10% in production

## CI/CD & Deployment

**Hosting:**
- Vercel (detected via Sentry config and `VERCEL_AUTOMATION_BYPASS_SECRET`)
- Environment variable: `NODE_ENV` (values: `development`, `test`, `production`)

**CI Pipeline:**
- Playwright E2E tests (not auto-triggered in git config, must be manual or in separate workflow)
- Test configuration: `playwright.config.ts`
- Base URL: `PLAYWRIGHT_TEST_BASE_URL` (defaults to `http://localhost:3000`)
- Workers: Single worker in CI (via `process.env.CI` check)

## Form Submissions & Data Flow

**Submit Endpoints:**

1. **Solutions Provider (`POST /api/applications/solutions`):**
   - Schema: `SolutionsSchema`
   - Notion DB: `NOTION_SOLUTIONS_DB_ID`
   - Email type: `Solutions Provider`
   - Fields: Provider Name, Email, Category, Bio, Services Offered, LinkedIn URL, Website, Rate Range, Location

2. **Event Suggestion (`POST /api/suggest-event`):**
   - Schema: `EventSuggestionSchema`
   - Notion DB: `NOTION_EVENT_DB_ID`
   - Email type: `Event Suggestion` (admin only)
   - Fields: Event Name, Description, Submitted By

3. **Blog Post Submission (`POST /api/submit-post`):**
   - Schema: `SubmitPostSchema`
   - Notion DB: `NOTION_BLOG_DB_ID`
   - Email type: `Blog Post Submission`
   - Fields: Post Title, Content (excerpt auto-generated), Category, Author Name, Author Email

4. **Resource Submission (`POST /api/submit-resource`):**
   - Notion DB: `NOTION_RESOURCES_DB_ID`
   - Email type: `Resource Submission`

5. **Membership Application (`POST /api/applications/membership`):**
   - Notion DB: N/A (Notion write target unconfirmed)
   - Email type: `Membership Application`

6. **Chapter Lead Application (`POST /api/applications/chapter`):**
   - Notion DB: N/A (Notion write target unconfirmed)
   - Email type: `Chapter Lead Application`

7. **Ventures Intake (`POST /api/applications/ventures`):**
   - Schema: Ventures application form
   - Notion DB: `NOTION_VENTURES_INTAKE_DB_ID`
   - Email type: `Ventures Intake`

**Email Sending:**
- Implementation: `src/lib/email.ts` → `sendEmails(formType, applicantEmail?, submissionData)`
- From address: `SAGIE <hello@sagie.co>`
- Admin destination: `hello@sagie.co`
- Components: `src/emails/ConfirmationEmail.tsx`, `src/emails/AdminAlertEmail.tsx`
- Service: Resend API
- Error handling: Errors logged to Sentry but don't block form submission (via `catch` in Promise handler)

**Notion Write Monitoring:**
- Wrapper function: `notionWrite()` in `src/lib/notion-monitor.ts`
- Purpose: Track/throttle Notion API calls (exact implementation in that file)

## Content Sourcing

**Blog & Content:**
- Source: Notion database (`NOTION_BLOG_DB_ID`)
- Processing: `notion-to-md` to convert Notion blocks to markdown
- Rendering: `react-markdown` for display
- Implementation: `src/lib/blog.ts`

**Events:**
- Source: Notion database (`NOTION_EVENT_DB_ID`)
- Implementation: `src/lib/events.ts`

**Resources:**
- Source: Notion database (`NOTION_RESOURCES_DB_ID`)
- Implementation: `src/lib/resources.ts`

**Solutions/Providers:**
- Source: Notion database (`NOTION_SOLUTIONS_DB_ID`)
- Implementation: `src/lib/solutions.ts`

**Members & Chapters:**
- Source: Notion databases (`NOTION_MEMBER_DB_ID`, `NOTION_CHAPTERS_DB_ID`)
- Implementation: `src/lib/members.ts`, `src/lib/chapters.ts`

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- Notion API calls (create pages) triggered by form submissions
- Revalidation endpoint calls required externally to invalidate cache

## Security Configuration

**CORS & Headers:**
- X-Frame-Options: DENY (prevent framing)
- X-Content-Type-Options: nosniff (prevent MIME sniffing)
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy: Disable camera, microphone, geolocation
- Cache-Control: no-store for all `/api/*` routes

**Origin Validation:**
- `ALLOWED_ORIGINS` parsed from comma-separated env var
- Stored in Set for efficient lookups in `src/env/server.ts`

---

*Integration audit: 2026-03-28*
