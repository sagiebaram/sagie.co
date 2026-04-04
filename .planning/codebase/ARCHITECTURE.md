# Architecture

**Analysis Date:** 2026-04-04

## Pattern Overview

**Overall:** Next.js App Router with server-driven data, client form interaction, and Notion as headless CMS

**Key Characteristics:**
- Server components for static content; Client components for forms and interactive features
- Notion API as single source of truth for blog, events, resources, solutions, and members
- Incremental Static Regeneration (ISR) with tag-based cache invalidation
- Zod validation on both client and server with honeypot bot detection
- React Hook Form paired with Zod for client-side form handling
- GSAP for scroll-triggered animations; Three.js for lazy-loaded 3D globe
- API routes with rate limiting, validation, email delivery, and Sentry error monitoring

## Layers

**Page Layer:**
- Purpose: Render marketing pages and application pages; coordinate layout, sections, and forms
- Location: `src/app/(marketing)/`, `src/app/admin/`
- Contains: Page components, layout wrappers, error boundaries, loading states
- Depends on: Components (sections, forms, layout), lib utilities, constants
- Used by: Next.js routing system; Browser requests

**Component Layer:**
- Purpose: Reusable UI and feature components
- Location: `src/components/`
- Subdivisions:
  - **Forms** (`src/components/forms/`): Application forms with validation — MembershipForm, ChapterForm, VenturesForm, SolutionsForm, ContactForm, SubmitPostForm, SuggestEventForm
  - **Layout** (`src/components/layout/`): Navbar, Footer (persistent across pages)
  - **Sections** (`src/components/sections/`): Page sections — Hero, Pillars, Belief, FAQ, Tiers, etc.
  - **UI** (`src/components/ui/`): Atomic components — FormField, PhoneField, LocationFields, Button, Filters, animations
- Depends on: Lib utilities (validation, schemas), hooks, constants
- Used by: Page layer, other components

**API Layer:**
- Purpose: Handle form submissions, Notion writes, email delivery, cache revalidation
- Location: `src/app/api/`
- Endpoints:
  - **Applications**: `/api/applications/{membership,chapter,solutions,ventures}` — POST form submissions
  - **Content**: `/api/{submit-post,submit-resource,suggest-event,contact,subscribe}` — POST user submissions
  - **Events**: `/api/events/[id]/ics` — GET calendar file generation
  - **Admin**: `/api/revalidate` — POST cache invalidation (secret-protected)
- Depends on: Validation middleware, schemas, Notion client, email service, Sentry
- Used by: Client forms (fetch), Notion webhooks, external triggers (revalidate)

**Data/Lib Layer:**
- Purpose: Notion queries, validation, email templates, sanitization, monitoring
- Location: `src/lib/`
- Key modules:
  - **Notion**: `notion.ts` (client initialization), `blog.ts`, `events.ts`, `resources.ts`, `solutions.ts`, `members.ts`, `chapters.ts` (all use `unstable_cache` for ISR)
  - **Validation**: `validation.ts` (HOF `withValidation` combining Zod + honeypot + rate limiting), `schemas.ts` (Zod form schemas)
  - **Email**: `email.ts` (Resend integration), `sanitize.ts` (XSS prevention on user input)
  - **Notion Utilities**: `notion-utils.ts` (property extractors), `notion-monitor.ts` (Sentry wrapper)
  - **Other**: `gsap.ts` (dynamic import), `calendar.ts` (ICS generation), `location.ts`, `locationData.ts`
- Depends on: External SDKs (Notion, Resend, Sentry), Zod, environment config
- Used by: Page layer (data fetching), API layer (form processing)

**Constants & Types:**
- Purpose: Centralized copy, personas, tiers, FAQ, pillar definitions; TypeScript interfaces
- Location: `src/constants/`, `src/types/`
- Contains: Marketing copy, static data structures, type definitions (BlogPost, SAGIEEvent, Chapter, Pillar, etc.)
- Depends on: None
- Used by: Components, pages, lib modules

**Environment Configuration:**
- Purpose: Zod-validated server-side environment variables
- Location: `src/env/server.ts`
- Validates: Notion tokens/DB IDs, API keys (Resend, Beehiiv, Sentry), admin email, allowed origins, revalidate secret
- Used by: Lib modules, API routes

## Data Flow

**Blog/Content Fetch:**

1. Page component (`/blog`, `/solutions`, `/resources`, `/events`) calls server-side lib function (getAllPosts, getUpcomingEvents, etc.)
2. Lib function checks Next.js cache via `unstable_cache` + tag
3. If cache miss: fetch from Notion database with filters/sorts
4. Map Notion properties via `notion-utils.ts` helper functions
5. Return typed data to page component
6. Component renders content with filters/search client-side
7. ISR revalidates on schedule or via `/api/revalidate` webhook (Notion database change triggers POST to secret endpoint)

**Form Submission:**

1. User fills form (client component — MembershipForm, SolutionsForm, etc.)
2. On submit, client validates via React Hook Form + Zod resolver
3. If valid, POST to `/api/applications/{type}` with honeypot fields (`_trap`, `_t`)
4. Server receives request in `withValidation` middleware
5. Checks: honeypot, timing (must be >3000ms), rate limit (5 per IP per 10 min)
6. If bot detected or rate limited: return 200 silently (honeypot)
7. If rate limited (legitimate): return 429 with Retry-After
8. Zod validates payload; on failure: return 422 with fieldErrors
9. On success: call handler async function
10. Handler calls `notionWrite(() => notion.pages.create(...))` wrapped in Sentry try/catch
11. Meanwhile call `sendEmails(formType, userEmail, data)` fire-and-forget via Promise.allSettled
12. Return `{ success: true }` to client
13. Client shows success state, optional redirect/reset

**Cache Invalidation:**

1. Notion database is updated (post published, event added, etc.)
2. Notion automation or webhook calls POST `/api/revalidate` with secret
3. Route handler validates secret; on mismatch: return 401
4. For each tag (or specific tags): call `revalidateTag(tag)`
5. Next.js invalidates all paths cached with that tag
6. Next cache miss triggers fresh Notion fetch on next request

**Email Delivery:**

1. Form handler calls `sendEmails(formType, applicantEmail, data)`
2. In production only: sends two emails via Resend:
   - Confirmation email to applicant (from `ConfirmationEmail` React template)
   - Admin alert to `env.ADMIN_EMAIL` (from `AdminAlertEmail` template)
3. Errors captured in Sentry with tags `service: 'resend'` + `type: 'confirmation'|'admin_alert'`
4. Uses Promise.allSettled so one email failure doesn't block the other

## Key Abstractions

**Validation Middleware (`withValidation`):**
- Purpose: Wrap API handlers with Zod validation, bot detection, rate limiting
- Location: `src/lib/validation.ts`
- Usage: `withValidation(schema, handler)` returns an async Request handler
- Pattern: Higher-order function accepting schema and handler; returns middleware that pre-processes and validates
- Guards: Honeypot check, timing check (>3s), rate limiter (5 per IP per 10min), Zod validation, returns appropriate status codes

**Notion Data Accessors:**
- Purpose: Type-safe extraction of Notion properties with fallback handling
- Location: `src/lib/notion-utils.ts`
- Functions: `getTextProperty`, `getTitleProperty`, `getSelectProperty`, `getNumberProperty`, `getCheckboxProperty`, `getUrlProperty`, `getDateProperty`
- Pattern: Each takes `properties` object, property name, page ID, fallback; returns typed value; logs warning to Sentry on missing
- Usage: Called within blog.ts, events.ts, resources.ts, etc. to extract fields from Notion page objects

**Cached Data Loaders:**
- Purpose: Fetch Notion data with ISR caching and tag-based revalidation
- Location: `src/lib/blog.ts`, `src/lib/events.ts`, `src/lib/resources.ts`, `src/lib/solutions.ts`, etc.
- Pattern: Use `unstable_cache(asyncFn, keyArray, { revalidate: seconds, tags: [] })` to wrap Notion queries
- Cache keys: e.g., `['notion:blog:index']`; tags: e.g., `['notion:blog']`
- Allows selective cache invalidation via tag without cache key knowledge

**Schemas as Source of Truth:**
- Purpose: Define form structure, validation rules, and type safety in one place
- Location: `src/lib/schemas.ts`
- Pattern: Zod objects for each form type (MembershipSchema, ChapterSchema, SolutionsSchema, VenturesSchema, etc.)
- Used by: Client-side React Hook Form resolver AND server-side API validation
- Ensures client and server validation match; includes spam checks and format validation

**Location Cascading:**
- Purpose: Provide dependent dropdowns (Country → State → City)
- Location: `src/components/ui/LocationFields.tsx`, `src/lib/location.ts`, `src/lib/locationData.ts`
- Pattern: Component tracks selected country, filters states for that country; selected state filters cities
- Data: Static mapping from `country-state-city` npm package
- Validation: Zod schema ensures only valid location tuples are submitted

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Browser navigation to any page
- Responsibilities: Load fonts (Bebas Neue, DM Sans), setup metadata/JSON-LD, wrap with providers (NuqsAdapter for query strings), integrate Sentry, Vercel Analytics, Vercel Speed Insights

**Marketing Layout:**
- Location: `src/app/(marketing)/layout.tsx`
- Triggers: Navigation to any page under `/(marketing)/`
- Responsibilities: Render Navbar + Footer + children; consistent styling across public pages

**API Route Handlers:**
- Locations: `src/app/api/**/route.ts`
- Triggers: HTTP requests (POST for forms, GET for ICS)
- Responsibilities: Validate input via `withValidation`, process form data, write to Notion, send emails, return JSON response

**Admin Revalidate Route:**
- Location: `src/app/admin/revalidate/page.tsx`
- Triggers: Authenticated admin visits `/admin/revalidate`
- Responsibilities: Display UI for triggering cache revalidation via `/api/revalidate` endpoint

## Error Handling

**Strategy:** Layered approach with Sentry monitoring, user-friendly messages, and silent bot responses

**Patterns:**

1. **Validation Errors (422):** Zod parsing fails → return `{ error: 'Validation failed', fieldErrors: {...} }` → client displays per-field error messages
2. **Rate Limit (429):** Too many requests from IP → return 429 with Retry-After header → client shows warning, disables form temporarily
3. **Honeypot/Bot (200):** Bot detected → silent 200 response (appears successful to bot; client checks response structure to detect actual success)
4. **Notion Write Errors:** Wrapped in try/catch → log to Sentry with context → still return 200 to user (don't expose backend issues); currently bypassed in dev/test due to Notion property setup
5. **Email Errors:** Caught and sent to Sentry; Promise.allSettled prevents one email failure from blocking response
6. **Server Errors (500):** Uncaught exceptions → logged to Sentry → return generic error message to client

Example error handling in form submission (SolutionsForm.tsx):
```typescript
if (res.status === 429) {
  setSubmitWarning("You've submitted several times recently...")
  setIsRateLimited(true)
} else if (!res.ok) {
  const body = await res.json()
  if (body.fieldErrors) {
    // Display field-specific errors
  } else {
    setSubmitError('Something went wrong. Please try again.')
  }
}
```

## Cross-Cutting Concerns

**Logging:** 
- Development: console.log/warn for debugging
- Production: Sentry for errors + warnings; email delivery logs status
- Notion utilities warn when properties missing, escalated to Sentry in production

**Validation:** 
- Client-side: React Hook Form with Zod resolver for UX feedback
- Server-side: `withValidation` HOF with Zod for security
- Honeypot + timing check for bot detection
- Rate limiting per IP for abuse prevention

**Authentication:** 
- No user login system; forms are public
- Admin endpoints protected via secret token in env variable
- CORS validation via env.ALLOWED_ORIGINS set

**Monitoring:**
- Sentry integration: client-side errors, server-side errors, Notion failures, email delivery issues
- Vercel Analytics: page views, Web Vitals
- Vercel Speed Insights: performance metrics
- Custom tags on Sentry captures (e.g., `service: 'resend'`, `type: 'confirmation'`)

---

*Architecture analysis: 2026-04-04*
