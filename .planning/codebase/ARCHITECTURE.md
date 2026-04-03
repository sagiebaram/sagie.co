# Architecture

**Analysis Date:** 2026-03-30

## Pattern Overview

**Overall:** Next.js App Router with Client-Server Architecture

**Key Characteristics:**
- Next.js 16.2 with React 19 and Server Components by default
- Notion as primary CMS for all dynamic content (blog, events, resources, applications)
- Hybrid client-server: SSR pages with client-side forms and interactive components
- API routes with request validation, rate limiting, and honeypot spam protection
- Email notifications via Resend with React components
- GSAP-based animations with specialized cleanup handlers

## Layers

**Presentation Layer:**
- Purpose: UI components and page rendering
- Location: `src/components/` and `src/app/`
- Contains: Page layouts, section components, UI components, form components
- Depends on: Business logic layer (data fetching, validation)
- Used by: Next.js routing system

**Business Logic Layer:**
- Purpose: Data fetching, transformation, validation, and domain logic
- Location: `src/lib/`
- Contains: Notion queries, email service, validation schemas, form processing
- Depends on: External services (Notion API, Resend API)
- Used by: Presentation and API layers

**API Route Layer:**
- Purpose: HTTP endpoints for form submissions and cache revalidation
- Location: `src/app/api/`
- Contains: Request handlers, validation middleware, error responses
- Depends on: Business logic and validation layers
- Used by: Client-side forms and external services

**Data/Configuration Layer:**
- Purpose: Types, constants, environment configuration
- Location: `src/types/`, `src/constants/`, `src/env/`
- Contains: Domain types, UI constants, environment schema validation
- Depends on: Nothing
- Used by: All other layers

## Data Flow

**Form Submission Flow:**

1. User interacts with form (e.g., `SolutionsForm`)
2. Form validates client-side using Zod schema from `@/lib/schemas`
3. Form submits POST to `/api/applications/{type}` with honeypot fields
4. API route in `src/app/api/applications/{type}/route.ts`:
   - Checks rate limiting (5 submissions per 10 minutes per IP)
   - Validates honeypot fields and form load time (>3 seconds)
   - Validates request body against Zod schema
   - Calls `notion.pages.create()` to store in Notion database
   - Calls `sendEmails()` to notify applicant and admin
5. Response returned with success/error status
6. Client updates UI (shows success message or error)

**Content Fetch Flow:**

1. Server-side page component calls data function (e.g., `getAllPosts()`)
2. Data function uses `unstable_cache` wrapper with cache keys and tags
3. Function queries Notion database using notion SDK
4. Results are transformed/mapped to typed objects
5. Cache tags used for selective revalidation via `/api/revalidate` endpoint
6. Revalidation called from Notion automations via webhook

**State Management:**

- **Server State:** Notion databases (single source of truth for all content)
- **Client State:**
  - Form state: React Hook Form with Zod validation
  - UI state: useState hooks (success/error states, loading indicators)
  - URL state: nuqs for query parameters (filters on blog, events, resources pages)
- **Animation State:** GSAP controlled directly, with cleanup via `GSAPCleanup` component
- **Cache State:** Next.js cache with tag-based invalidation strategy

## Key Abstractions

**Data Layer Abstraction (src/lib/):**
- Purpose: Encapsulates Notion client and query logic
- Examples: `blog.ts`, `events.ts`, `resources.ts`, `members.ts`, `chapters.ts`
- Pattern:
  - `unstable_cache` wraps async data fetchers
  - Custom mapper functions transform Notion pages to typed objects
  - Cache keys and revalidation tags manage freshness

**Form Processing Abstraction (src/lib/validation.ts):**
- Purpose: Reusable middleware for request validation, rate limiting, and spam protection
- Pattern: Higher-order function `withValidation` wraps route handlers
- Features: IP-based rate limiting, honeypot detection, Zod schema validation

**Email Service Abstraction (src/lib/email.ts):**
- Purpose: Centralized email sending with type-safe form types
- Pattern: `sendEmails()` function takes FormType enum and submission data
- Features: React component email templates, conditional skipping in non-prod, error tracking via Sentry

**Section Components (src/components/sections/):**
- Purpose: Reusable landing page sections with consistent styling
- Examples: `Hero.tsx`, `Pillars.tsx`, `FAQ.tsx`, `ChapterMap.tsx`
- Pattern: Async server components that compose child components and fetch data as needed

**Form Components (src/components/forms/):**
- Purpose: Self-contained form implementations with validation and submission
- Examples: `SolutionsForm.tsx`, `MembershipForm.tsx`, `VenturesForm.tsx`
- Pattern: Client components using React Hook Form + Zod, manage own success/error states

## Entry Points

**Home Page:**
- Location: `src/app/(marketing)/page.tsx`
- Triggers: Route `/`
- Responsibilities: Fetches chapters data, renders section components in sequence (Hero → Belief → Pillars → ... → Footer)

**Application Pages:**
- Location: `src/app/(marketing)/apply/[type]/page.tsx`
- Triggers: Routes `/apply`, `/apply/solutions`, `/apply/chapter`, `/apply/ventures`
- Responsibilities: Render page intro text and form component for specific application type

**Content Pages:**
- Location: `src/app/(marketing)/blog/page.tsx`, `/resources/page.tsx`, `/solutions/page.tsx`
- Triggers: `/blog`, `/resources`, `/solutions`
- Responsibilities: Fetch content from Notion, render filters and content grid

**API Routes:**
- Location: `src/app/api/applications/*/route.ts`, `src/app/api/submit-post/route.ts`, etc.
- Triggers: Form POST requests from client
- Responsibilities: Validate, process submission, store in Notion, send emails

**Admin/Revalidation:**
- Location: `src/app/admin/revalidate/page.tsx`, `src/app/api/revalidate/route.ts`
- Triggers: Manual dashboard trigger or webhook from Notion
- Responsibilities: Invalidate cache tags to refresh stale content

## Error Handling

**Strategy:** Layered validation with graceful degradation and error tracking

**Patterns:**

- **Client-side form errors:** React Hook Form captures validation errors, displays inline error messages
- **API validation errors:** Returns 422 with field-level error details
- **API rate limiting:** Returns 429 with Retry-After header, client shows user message
- **Notion API failures:** Caught in try-catch, returns 500 error, logs to Sentry
- **Email sending failures:** Non-blocking failures, captured by Sentry, user still sees success
- **Content fetch failures:** Graceful fallbacks (empty arrays, null values, default text)
- **Spam detection:** Honeypot failures silently return 200 to fool bots

## Cross-Cutting Concerns

**Logging:** Console.log for development; Sentry integration for production errors with context tags

**Validation:**
- Client: Zod schemas in `@/lib/schemas.ts` used by React Hook Form
- Server: Same schemas used in `withValidation` middleware wrapper
- Bidirectional: Prevents invalid data from reaching Notion

**Authentication:**
- Secret-based (REVALIDATE_SECRET for cache invalidation endpoint)
- No user authentication; all routes are public
- Rate limiting by IP prevents abuse

**Caching:**
- Server-side: `unstable_cache` with time-based revalidation (300s to 3600s)
- Cache tags: All notion:* tags invalidate via `/api/revalidate` endpoint
- No browser caching for API routes (Cache-Control: no-store)

**Security Headers:** Configured in `next.config.ts`:
- X-Frame-Options: DENY (no framing)
- X-Content-Type-Options: nosniff (prevent MIME sniffing)
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy: disabled camera, microphone, geolocation

---

*Architecture analysis: 2026-03-30*
