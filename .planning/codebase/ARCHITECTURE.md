# Architecture

**Analysis Date:** 2026-03-28

## Pattern Overview

**Overall:** Full-stack Next.js application with a server-centric architecture combining static generation, server-side rendering, and API-driven form submission patterns.

**Key Characteristics:**
- Server-first data fetching using Next.js `unstable_cache` for content from Notion
- Client-side form UI with server-side validation and rate limiting
- API routes as a security boundary for form submissions and webhooks
- Notion as the single source of truth for all dynamic content (blog, events, resources, applications)
- Static marketing pages with client-side animations and scroll reveals
- Email notifications through Resend service with dual-recipient pattern (user + admin)

## Layers

**Presentation (Client-Side):**
- Purpose: Render interactive UI, handle animations, manage client state for forms
- Location: `src/components/` and `src/app/(marketing)/` pages
- Contains: React components, UI primitives, forms, animations (GSAP/Framer Motion)
- Depends on: Form validation schemas, API routes, utility hooks
- Used by: Marketing pages and user-facing application flows

**API Layer:**
- Purpose: Secure entry point for client requests, validation, and delegation to services
- Location: `src/app/api/`
- Contains: Route handlers using Next.js App Router pattern
- Depends on: Validation middleware, notification service, database write handlers
- Used by: Client-side forms and admin webhooks

**Service/Business Logic:**
- Purpose: Encapsulate domain logic for data fetching, transformation, and external service coordination
- Location: `src/lib/` (email.ts, blog.ts, events.ts, etc.)
- Contains: Data loaders with caching, email service wrappers, database mapping functions
- Depends on: Environment config, external SDKs (Notion, Resend), validation schemas
- Used by: API routes and server components

**Data Access:**
- Purpose: Direct integration with Notion API and query building
- Location: `src/lib/notion.ts`, `src/lib/notion-monitor.ts`
- Contains: Client initialization, write monitoring, database operations
- Depends on: @notionhq/client SDK, environment variables
- Used by: Service layer functions

**Configuration:**
- Purpose: Type-safe environment variables and constants
- Location: `src/env/server.ts` and `src/constants/`
- Contains: Validated env schema, hardcoded strings, metadata, personas, tiers
- Depends on: Zod for validation
- Used by: Throughout the application

## Data Flow

**Content Delivery (Read-Heavy):**

1. Page request to `/blog`, `/events`, `/resources`, etc.
2. Server component calls data loader (e.g., `getAllPosts()`)
3. Data loader uses `unstable_cache()` with Notion API query
4. Response cached with revalidation tag (e.g., `'notion:blog'`)
5. Notion returns structured properties mapped to TypeScript interfaces
6. Server component renders static HTML with cached data
7. Client hydrates and applies animations via GSAP ScrollTrigger

**Form Submission (Write Pattern):**

1. User fills form on client (e.g., MembershipForm)
2. Client-side validation with honeypot and time-based bot check
3. Form POST to `/api/applications/{type}` route
4. `withValidation()` middleware:
   - Extracts client IP
   - Checks rate limit (5 requests per 10 minutes)
   - Validates JSON structure and honeypot
   - Parses and validates request body against Zod schema
   - Returns 429, 400, or 422 on validation failure
5. Handler receives validated typed data
6. `notionWrite()` writes page to appropriate Notion database
7. `sendEmails()` sends confirmation to user + admin alert (non-blocking)
8. Returns 200 success or 500 error

**Cache Invalidation (Revalidation):**

1. Notion database is updated (e.g., new blog post published)
2. Webhook triggers POST to `/api/revalidate`
3. Request includes secret token for authorization
4. Revalidate handler calls `revalidateTag()` for affected tags
5. Next.js ISR clears cache and regenerates on next request
6. Users see updated content within revalidation window

**Error Handling:**

**Strategy:** Graceful degradation with Sentry error tracking and user-facing fallbacks.

**Patterns:**
- Server components wrap data fetches in try-catch, return null or empty arrays on failure
- API routes return structured error responses with HTTP status codes
- Email errors are caught and logged to Sentry but don't fail form submission
- Client-side forms show field-level validation errors immediately
- Error boundary components (`error.tsx`) display recovery UI with error message

## Key Abstractions

**Data Loader Pattern (`unstable_cache`):**
- Purpose: Abstract Notion API polling with built-in HTTP caching
- Examples: `src/lib/blog.ts:getAllPosts()`, `src/lib/events.ts:getUpcomingEvents()`
- Pattern: Async function wrapped in `unstable_cache()` with cache key, revalidation time, and tags

**Validation Middleware (`withValidation`):**
- Purpose: Centralize rate limiting, honeypot checks, schema validation, error formatting
- Examples: `src/app/api/applications/membership/route.ts`
- Pattern: Higher-order function that wraps handler, performs checks sequentially

**Email Service (`sendEmails`):**
- Purpose: Coordinate sending both user confirmation and admin alert emails in parallel
- Examples: `src/lib/email.ts`
- Pattern: Accepts form type and data, sends async without blocking form response

**Notion Monitor (`notionWrite`):**
- Purpose: Wrap Notion write operations for potential monitoring/debugging
- Examples: `src/app/api/applications/solutions/route.ts:11`
- Pattern: HOF that wraps async Notion operation, allows hook points for logging

## Entry Points

**Marketing Site:**
- Location: `src/app/(marketing)/page.tsx` (home page) and nested routes
- Triggers: Direct URL navigation, link clicks
- Responsibilities: Renders full marketing site with animated sections, navigation, footer

**Blog/Resources/Events:**
- Location: `src/app/(marketing)/blog/[slug]/page.tsx` and list pages
- Triggers: Navigation to `/blog`, `/resources`, `/events` routes
- Responsibilities: Load content from Notion, render with filters and detail views

**Application Forms:**
- Location: Form pages under `/apply/*` routes
- Triggers: User clicks apply button or navigates directly
- Responsibilities: Render form with client-side validation, submit to API

**Admin Page:**
- Location: `src/app/admin/revalidate/page.tsx`
- Triggers: Admin dashboard access
- Responsibilities: Manual cache revalidation control

**API Endpoints:**
- Locations: `src/app/api/applications/{type}/route.ts`, `src/app/api/submit-{resource}/route.ts`, `src/app/api/revalidate/route.ts`
- Triggers: Form submissions from client, webhooks from Notion
- Responsibilities: Validate input, write to Notion, send emails, manage cache

## Cross-Cutting Concerns

**Logging:** console.log() for development, structured logs only on form errors sent to Sentry

**Validation:** Multi-layered approach:
- Client: Regex-based email/URL validation, required field checks
- Server: Zod schema validation with detailed field errors
- Security: Honeypot field, submission time check (3-second minimum)

**Authentication:** Not implemented. Admin endpoints lack auth (security concern noted).

**Rate Limiting:** Memory-based in-process rate limiter per IP (5 requests per 10 minutes). Non-persistent, resets on server restart.

**Caching:** Next.js ISR with tag-based revalidation. All Notion queries cached with 5-minute minimum freshness, manual revalidation support.

**Error Tracking:** Sentry integrated via `@sentry/nextjs` for unhandled errors in API routes and email service failures.

---

*Architecture analysis: 2026-03-28*
