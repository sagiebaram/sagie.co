# Architecture

**Analysis Date:** 2026-03-28

## Pattern Overview

**Overall:** Next.js 15 App Router — Server-first with selective client boundaries

**Key Characteristics:**
- Pages are React Server Components by default; client-side state is pushed to leaf components or dedicated `*Client.tsx` files
- Notion acts as the single backend data store (CMS + application intake) — no database other than Notion
- API routes are thin: validate input via Zod schema → write to Notion → return JSON
- Data-fetching is always cached via `unstable_cache` from `next/cache`, with per-resource TTLs
- All environment configuration is validated at startup via Zod in `src/env/server.ts`

## Layers

**Pages (App Router):**
- Purpose: Compose layout from server-fetched data and section components
- Location: `src/app/(marketing)/`
- Contains: Async server components, `generateStaticParams`, `revalidate` exports
- Depends on: `src/lib/*` for data, `src/components/*` for rendering
- Used by: Next.js routing

**API Routes:**
- Purpose: Accept form submissions, validate, write to Notion
- Location: `src/app/api/`
- Contains: `route.ts` files, each exporting `POST = withValidation(Schema, handler)`
- Depends on: `src/lib/validation.ts`, `src/lib/schemas.ts`, `src/lib/notion.ts`, `src/lib/notion-monitor.ts`
- Used by: Client-side forms via `fetch`

**Data Access (lib):**
- Purpose: Read from Notion databases, shape to typed interfaces, cache results
- Location: `src/lib/`
- Contains: `blog.ts`, `events.ts`, `resources.ts`, `solutions.ts` — each exporting typed `unstable_cache`-wrapped functions
- Depends on: `src/lib/notion.ts` (Notion client), `src/env/server.ts`
- Used by: Pages and server components

**Components:**
- Purpose: Render UI; sections compose ui primitives; forms handle client state
- Location: `src/components/`
- Contains: `sections/` (full-page content blocks), `forms/` (client form components), `ui/` (reusable atoms), `layout/` (Navbar, Footer), `mdx/` (blog rendering)
- Depends on: `src/hooks/`, `src/lib/gsap.ts`, `src/constants/*`
- Used by: Pages

**Constants:**
- Purpose: Static copy, site data, and configuration that does not come from Notion
- Location: `src/constants/`
- Contains: `copy.ts` (all marketing text, nav links, social stats, chapters), `pillars.ts`, `tiers.ts`, `faq.ts`, `personas.ts`, `solutions.ts`, `blog.ts`, `resources.ts`, `events.ts`
- Depends on: `src/types/index.ts`
- Used by: Components and pages

**Types:**
- Purpose: Shared TypeScript interfaces for UI-level domain objects
- Location: `src/types/index.ts`
- Contains: `Pillar`, `Persona`, `Tier`, `FAQItem`, `Chapter`, `SocialStat`, `ButtonVariant`, `ChapterStatus`
- Depends on: nothing
- Used by: Constants, components

**Env:**
- Purpose: Validated, typed access to environment variables; server-only enforced
- Location: `src/env/server.ts`
- Contains: Zod schema parsed against `process.env`; exports `env` object and `allowedOrigins` set
- Depends on: `server-only` package (prevents client import)
- Used by: All `src/lib/*` files and API routes

## Data Flow

**Read Flow (Notion → Page → User):**

1. Page component (server) calls a lib function, e.g. `getUpcomingEvents()`
2. `unstable_cache` checks the Next.js data cache; cache key is `['notion:events:upcoming']`
3. On cache miss, Notion SDK queries the relevant database with filters and sorts
4. Results are mapped to typed interfaces (e.g. `SAGIEEvent[]`) via inline mapper functions
5. Page passes typed data as props to RSC or client sections (e.g. `<EventsPageClient upcoming={...} />`)
6. Client components render with Framer Motion / GSAP animations

**Write Flow (Form → API → Notion):**

1. `'use client'` form component (e.g. `MembershipForm`) maintains state with `useState`
2. On submit, honeypot field `_trap` and timestamp `_t` are included in JSON body
3. `fetch('/api/applications/membership', { method: 'POST', body: JSON.stringify({...}) })`
4. API route wraps handler in `withValidation(Schema, handler)` — validates honeypot, elapsed time, then Zod schema
5. Valid data is written to Notion via `notionWrite(() => notion.pages.create({...}))`
6. `notionWrite` wraps the call in a try/catch that forwards errors to Sentry
7. API returns `{ success: true }` on success; form shows `<FormSuccess>` component

**Cache Revalidation TTLs:**
- Blog posts: 3600s (1 hour)
- Events: 300s (5 minutes)
- Resources: 21600s (6 hours)
- Solutions: 43200s (12 hours)

**State Management:**
- No global state manager; local component state only via `useState`
- Animation state managed by GSAP context per component via `useLayoutEffect`
- No React Context or Zustand/Redux used

## Key Abstractions

**`withValidation` (API middleware):**
- Purpose: Wrap API route handlers with bot protection and Zod validation
- File: `src/lib/validation.ts`
- Pattern: Higher-order function — `withValidation(Schema, handler)` returns a Next.js `POST` handler
- Includes honeypot check (`_trap` field) and minimum elapsed time check (3000ms)

**`unstable_cache` wrappers (data layer):**
- Purpose: Cache Notion reads with TTL and revalidation tags
- Examples: `getAllPosts` in `src/lib/blog.ts`, `getUpcomingEvents` in `src/lib/events.ts`
- Pattern: Export a named async function wrapped in `unstable_cache(fn, [key], { revalidate, tags })`

**`notionWrite` (error boundary):**
- Purpose: Wrap Notion write calls to capture exceptions in Sentry
- File: `src/lib/notion-monitor.ts`
- Pattern: `await notionWrite(() => notion.pages.create({...}))` — rethrows after capture

**`useScrollReveal` hook:**
- Purpose: Apply GSAP scroll-triggered fade-up animations
- File: `src/hooks/useScrollReveal.ts`
- Pattern: Returns a `ref` to attach to a container; animates children matching optional `selector`; `ScrollReveal` component at `src/components/ui/ScrollReveal.tsx` wraps this as JSX

**`src/env/server.ts` (typed env):**
- Purpose: Single source of truth for server environment variables with startup validation
- Pattern: Zod schema defines all required vars; `process.env` is parsed at module load; any missing var crashes the server at startup

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every page render
- Responsibilities: Font injection (`Bebas_Neue`, `DM_Sans`), global CSS, metadata defaults, `<GSAPCleanup>` to prevent memory leaks

**Home Page:**
- Location: `src/app/(marketing)/page.tsx`
- Triggers: `GET /`
- Responsibilities: Composes all marketing sections sequentially; no data fetching (sections use static constants)

**Route Group:**
- Location: `src/app/(marketing)/`
- All public marketing pages are grouped here; the group does not add a URL segment

**API Routes:**
- Location: `src/app/api/`
- All are POST-only; no GET routes exist
- Pattern: `export const POST = withValidation(Schema, async (_req, body) => { ... })`

## Error Handling

**Strategy:** Errors are caught locally; pages fall back to empty state rather than crashing

**Patterns:**
- Data fetch failures in pages are caught in try/catch, returning empty arrays to client components
- API route handlers catch Notion errors, log via `console.error`, return `{ error: '...' }` with 500 status
- Notion write failures are additionally captured in Sentry via `notionWrite`
- Validation failures return `{ error: 'Validation failed', fieldErrors: {...} }` with 422 status
- Client forms display a generic error message on network failure; no per-field server error display

## Cross-Cutting Concerns

**Security:**
- CSP headers set globally in `next.config.ts` (connect-src limited to `api.notion.com` and Sentry)
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` on all routes
- API routes have `Cache-Control: no-store`
- Bot protection: honeypot field + 3-second minimum elapsed time in `withValidation`

**Logging:** `console.error` in API route catch blocks; Sentry captures Notion write exceptions with `service: 'notion', type: 'write_failure'` tags

**Validation:** Zod schemas for all form payloads defined in `src/lib/schemas.ts`; applied at API boundary via `withValidation`

**Authentication:** None — the site is fully public; form submissions go directly to Notion for manual review

**Animation:** GSAP (ScrollTrigger, SplitText) registered client-side in `src/lib/gsap.ts`; reduced-motion is respected in `useScrollReveal`

---

*Architecture analysis: 2026-03-28*
