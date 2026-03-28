# Architecture

**Analysis Date:** 2026-03-28

## Pattern Overview

**Overall:** Next.js App Router with server-side data fetching and client-side animations

**Key Characteristics:**
- Next.js 16+ with React 19 server components as default
- Notion as content/data backend (blog, events, resources, solutions)
- Hybrid rendering: static generation with revalidation for content pages, client-side interactivity for animations
- API routes for form submissions directly to Notion
- Heavy animation/motion layer using GSAP for scroll-triggered reveals
- Marketing-focused site structure with application forms as CTA endpoints

## Layers

**Presentation Layer:**
- Purpose: Render pages and sections to users with rich animations and visual feedback
- Location: `src/app/(marketing)/`, `src/components/`
- Contains: React components (sections, UI, forms, layout), page routes
- Depends on: Data layer, Hooks, Constants
- Used by: Browser/User

**Data Layer:**
- Purpose: Fetch and transform data from Notion databases, provide data contracts
- Location: `src/lib/blog.ts`, `src/lib/events.ts`, `src/lib/resources.ts`, `src/lib/solutions.ts`
- Contains: Type definitions, async fetch functions, Notion queries, data mapping
- Depends on: Notion client, Environment config
- Used by: Page components, API routes

**API Layer:**
- Purpose: Handle form submissions and write operations to Notion
- Location: `src/app/api/applications/`, `src/app/api/submit-*`
- Contains: Route handlers that receive form data and create Notion pages
- Depends on: Notion client, Request body parsing
- Used by: Client-side forms

**Constants & Configuration:**
- Purpose: Centralize copy, UI data, form definitions
- Location: `src/constants/`
- Contains: Static content (copy.ts, blog.ts, pillars.ts, tiers.ts, etc.), type-safe data
- Depends on: Types
- Used by: Components, Layout

**Utilities:**
- Purpose: Shared helper functions and hooks
- Location: `src/lib/utils.ts`, `src/lib/gsap.ts`, `src/hooks/useScrollReveal.ts`
- Contains: Class name utilities, GSAP setup, custom hooks
- Depends on: External libraries
- Used by: Components

## Data Flow

**Content Pages (Blog, Events, Resources, Solutions):**

1. Page component (async) calls data-fetching function (e.g., `getAllPosts()`)
2. Data function queries Notion database using `@notionhq/client`
3. Raw Notion response is mapped to TypeScript interface (e.g., `BlogPost`)
4. Mapped data is passed to client components for rendering
5. Optional: `notion-to-md` converts Notion blocks to Markdown for blog content
6. Static generation with 3600s revalidation window (specified by `export const revalidate`)

**Form Submissions (Applications):**

1. User fills client component form (`ChapterForm`, `SolutionsForm`, etc.)
2. Form validates locally and sends JSON POST to `/api/applications/[type]`
3. Route handler receives request, extracts fields, creates Notion page
4. Notion SDK writes record to appropriate database (determined by `MEMBER_DB_ID` etc.)
5. Response returns success/error state
6. Client-side state updates show success message or error

**State Management:**
- Local form state in client components using `useState`
- No global state management (Redux, Zustand, Context)
- Animation state managed by GSAP (scroll triggers, timeline animations)
- Page data fetched at build/request time, not stored in client

## Key Abstractions

**BlogPost Interface:**
- Purpose: Type-safe representation of blog content from Notion
- Examples: `src/lib/blog.ts` lines 6-18
- Pattern: Interface with readonly properties, optional fields use union types and nullish coalescing

**SAGIEEvent Interface:**
- Purpose: Unified type for event data from Notion events database
- Examples: `src/lib/events.ts` lines 3-22
- Pattern: Discriminated unions for status field, nullable fields for optional Notion properties

**SolutionProvider Interface:**
- Purpose: Type for expert services from Notion
- Examples: `src/lib/solutions.ts` lines 3-13
- Pattern: Source field indicates Curated vs Community-submitted

**ScrollReveal Component:**
- Purpose: Abstraction over GSAP scroll animations
- Examples: `src/components/ui/ScrollReveal.tsx`
- Pattern: Wrapper component that uses `useScrollReveal` hook, accepts selector for child elements and stagger animations

**Section Component:**
- Purpose: Consistent layout wrapper with max-width and padding
- Examples: `src/components/ui/Section.tsx`
- Pattern: Simple presentational component, passes className to children

## Entry Points

**Home Page:**
- Location: `src/app/(marketing)/page.tsx`
- Triggers: Request to `/`
- Responsibilities: Composes Hero, Belief, Pillars, Tiers, FAQ sections; renders Navbar and Footer

**Marketing Group Layout:**
- Location: `src/app/(marketing)/layout.tsx` (implicit from file structure)
- Triggers: All routes under `/(marketing)/`
- Responsibilities: Provides consistent layout with Navbar, Footer, CircuitBackground

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: All routes
- Responsibilities: HTML setup, font loading, GSAPCleanup component, metadata

**Blog Page:**
- Location: `src/app/(marketing)/blog/page.tsx`
- Triggers: Request to `/blog`
- Responsibilities: Fetches all blog posts, renders BlogFilter for client-side filtering, includes SubmitPostForm

**Dynamic Blog Post:**
- Location: `src/app/(marketing)/blog/[slug]/page.tsx`
- Triggers: Request to `/blog/[slug]`
- Responsibilities: Fetches single post by slug, generates static params, renders markdown content, related posts navigation

**API Application Routes:**
- Location: `src/app/api/applications/[type]/route.ts`
- Triggers: POST requests to `/api/applications/chapter`, `/api/applications/solutions`, etc.
- Responsibilities: Validate request body, create Notion page in member database, return success/error

## Error Handling

**Strategy:** Try-catch in async data functions with console error logging and graceful fallbacks

**Patterns:**
- Data functions return empty array on fetch failure: `catch (e) { console.error(...); }`
- Components handle empty state: `let posts: BlogPost[] = []` then try to fetch
- API routes return 500 status with error message: `NextResponse.json({ error: '...' }, { status: 500 })`
- Form submission errors update client-side error state without navigating
- Dynamic routes use `notFound()` when content doesn't exist (e.g., blog post slug not found)

## Cross-Cutting Concerns

**Logging:** Browser console.error() for data fetch failures and API errors. No structured logging configured.

**Validation:** Form validation in client components before submission. No server-side validation layer; Notion API creates entries with whatever data is sent.

**Authentication:** No user auth required. Forms are public-facing. Notion token stored in env variable for API access.

**Animation:** GSAP with ScrollTrigger plugin. Page animations opt-in (components import animation utility, not automatic). Respects `prefers-reduced-motion` media query in `useScrollReveal`.

---

*Architecture analysis: 2026-03-28*
