# External Integrations

**Analysis Date:** 2026-03-28

## APIs & External Services

**Notion API:**
- Notion - Content management and database backend for all dynamic content
  - SDK/Client: @notionhq/client 2.2.15
  - Auth: `NOTION_TOKEN` environment variable

## Data Storage

**Databases:**
- Notion Workspace - Primary data store
  - Connection: Authenticated via `NOTION_TOKEN`
  - Client: @notionhq/client
  - Multiple databases for different content types:
    - Blog Posts Database: `NOTION_BLOG_DB_ID` (env var) → ID `e949d62be0de4681b62cebe876a50ece` (hardcoded in `src/app/api/submit-post/route.ts`)
    - Resources Database: `NOTION_RESOURCES_DB_ID` (env var) → ID `1756dccaddfc4f78864a4ebea15ef2d4` (hardcoded in `src/app/api/submit-resource/route.ts`)
    - Solutions Providers Database: `NOTION_SOLUTIONS_DB_ID` (env var) → ID `f13af2979d1d455d960fdd962721401d` (hardcoded in `src/app/api/applications/solutions/route.ts`)
    - Events Database: `NOTION_EVENT_DB_ID` (env var) - queried in `src/lib/events.ts`
    - Chapter Membership Database: ID `08ec39a6-865f-4938-bb4d-44f86cd1e967` (hardcoded in `src/app/api/applications/chapter/route.ts`)
    - Membership Database: ID `ec753df1-ca8d-46d7-8c74-9b6f64cea2d5` (hardcoded in `src/app/api/applications/membership/route.ts`)
    - Event Tracker/Suggestions Database: ID `89c65fc6665a49c8b1af382a3daef4d3` (hardcoded in `src/app/api/suggest-event/route.ts`)
    - Ventures/Deal Pipeline Database: `NOTION_DEAL_PIPELINE_DB_ID` (env var, configurable)

**File Storage:**
- Local filesystem only - No external file storage service detected

**Caching:**
- None configured

## Authentication & Identity

**Auth Provider:**
- Custom/None - No third-party auth provider detected
- Implementation: No user authentication system; all submissions are public/anonymous

## Monitoring & Observability

**Error Tracking:**
- Not detected - No Sentry, Rollbar, or similar service

**Logs:**
- Console-based logging only
- Pattern: `console.error()` for API errors in route handlers (`src/app/api/*/route.ts`)

## CI/CD & Deployment

**Hosting:**
- Not explicitly detected - Next.js can deploy to Vercel, Node.js servers, or other platforms

**CI Pipeline:**
- Not detected - No GitHub Actions, CircleCI, or similar CI configuration found

## Environment Configuration

**Required env vars:**
- `NOTION_TOKEN` - Notion API authentication (critical)
- `NOTION_BLOG_DB_ID` - Blog database identifier
- `NOTION_RESOURCES_DB_ID` - Resources database identifier
- `NOTION_SOLUTIONS_DB_ID` - Solutions providers database identifier
- `NOTION_EVENT_DB_ID` - Events database identifier
- `NOTION_DEAL_PIPELINE_DB_ID` - Ventures pipeline database (optional, has fallback)

**Secrets location:**
- `.env.local` file - Contains all environment variables (present, 1599 bytes)

## Webhooks & Callbacks

**Incoming:**
- Not detected - No webhook listeners for external service events

**Outgoing:**
- Notion API calls via @notionhq/client - Async POST requests to create/update database entries
  - Blog post submissions: `POST /api/submit-post` → creates page in NOTION_BLOG_DB_ID
  - Resource submissions: `POST /api/submit-resource` → creates page in NOTION_RESOURCES_DB_ID
  - Solutions provider applications: `POST /api/applications/solutions` → creates page in NOTION_SOLUTIONS_DB_ID
  - Chapter membership applications: `POST /api/applications/chapter` → creates page in membership database
  - Ventures applications: `POST /api/applications/ventures` → creates page in deal pipeline
  - Membership tier applications: `POST /api/applications/membership` → creates page in membership database
  - Event suggestions: `POST /api/suggest-event` → creates page in event tracker database

## Content Management

**Blog System:**
- Read: Blog posts fetched from Notion via `src/lib/blog.ts`
  - Query filter: Status = "Published"
  - Markdown conversion via notion-to-md 3.1.9
  - Route: `src/app/(marketing)/blog/[slug]/page.tsx`

**Resources System:**
- Read: Resources fetched from Notion via `src/lib/resources.ts`
  - Query filter: Status = "Published"
  - Route: `src/app/(marketing)/resources/page.tsx`

**Solutions Providers:**
- Read: Provider list fetched from Notion via `src/lib/solutions.ts`
  - Query filter: Status = "Active"
  - Route: `src/app/(marketing)/solutions/page.tsx`

**Events System:**
- Read: Events fetched from Notion via `src/lib/events.ts`
  - Upcoming events filter: Status NOT "Cancelled" AND Status NOT "Complete"
  - Past events filter: Status = "Complete"
  - Route: `src/app/(marketing)/events/page.tsx`, `src/app/(marketing)/events/EventsPageClient.tsx`

## Form Submissions

**Application Forms:**
All forms use client-side React components with fetch API to POST to Next.js API routes, which then create pages in Notion databases:

- Solutions Provider: `src/components/forms/SolutionsForm.tsx`
- Chapter Membership: `src/components/forms/ChapterForm.tsx`
- Ventures: `src/components/forms/VenturesForm.tsx`
- Membership Tier: `src/components/forms/MembershipForm.tsx`
- Blog Post Submission: `src/components/forms/SubmitPostForm.tsx`
- Resource Submission: `src/components/ui/SubmitResourceForm.tsx`
- Event Suggestion: Community form on `/apply` page

---

*Integration audit: 2026-03-28*
