# Architecture

**Analysis Date:** 2026-04-05

## Pattern Overview

**Overall:** Server-Centric Next.js 16 Application with Server-Rendered Marketing Pages and API Routes

**Key Characteristics:**
- Server Components by default (App Router with React 19 Server Components)
- Client Components for interactivity (animations, forms, state management)
- Form-centric backend with Zod validation and rate limiting
- Third-party CMS integration (Notion) for content management
- Real-time animation framework (GSAP) with scroll-triggered effects
- Edge-case handling for accessibility and performance

## Layers

**Page Layer (App Router):**
- Purpose: Server-rendered marketing pages and API endpoints
- Location: `src/app/`
- Contains: Page routes, API routes, layouts, metadata definitions
- Depends on: Sections, components, data fetching libraries
- Used by: Direct HTTP requests, users

**Section Components Layer:**
- Purpose: Compose reusable, full-width page sections with marketing content
- Location: `src/components/sections/`
- Contains: Hero, HeroAnimation, Pillars, FAQ, ChapterMap, Tiers, FounderBridge, ResourcesDirectory, Belief, SocialProof, FinalCTA, WhoItsFor
- Depends on: UI components, data libraries, animations
- Used by: Page components to assemble pages

**UI Component Layer:**
- Purpose: Reusable interactive and presentational elements
- Location: `src/components/ui/`
- Contains: Buttons, Accordions, Filters, Animation wrappers (AnimatedSection, AnimatedLogo, PageHeroAnimation, BlogPostHeaderAnimation), Backgrounds (GridBackground, GridParallaxWrapper, CircuitBackground), Reveals (ScrollReveal, SplitTextReveal), Navigation (SectionNav, TransitionLink), Cards (CardTilt), Skeletons, Error pages
- Depends on: Hooks, GSAP, Tailwind
- Used by: Sections, Forms, Pages

**Form Layer:**
- Purpose: Handle user input with validation and submission
- Location: `src/components/forms/`
- Contains: React Hook Form wrappers with Zod validation
- Depends on: Validation schemas, API routes, sanitization
- Used by: Page sections

**Layout Layer:**
- Purpose: Persistent page structure (navigation, footer, global wrappers)
- Location: `src/components/layout/`
- Contains: Navbar, Footer, navigation logic
- Depends on: Constants, UI components
- Used by: Root layout and nested layouts

**Business Logic Layer:**
- Purpose: Data fetching, transformation, and validation
- Location: `src/lib/`
- Contains: Notion client wrapper, schema definitions, email service, sanitization, data fetchers (blog, events, chapters, resources, solutions, members), utilities, location data
- Depends on: External SDKs (Notion, Resend), Zod, Sentry
- Used by: Pages, API routes, components

**API Route Layer:**
- Purpose: Server-side handlers for form submissions and revalidation
- Location: `src/app/api/`
- Contains: Route handlers with validation, rate limiting, error handling
- Depends on: Validation middleware, email service, Notion library
- Used by: Client forms, external webhooks

**Type Definition Layer:**
- Purpose: Shared TypeScript interfaces for business domain
- Location: `src/types/`
- Contains: Pillar, Persona, Tier, Chapter, FAQItem
- Depends on: Nothing (leaf layer)
- Used by: Components, data libraries, API routes

**Constants Layer:**
- Purpose: Static configuration and copy text
- Location: `src/constants/`
- Contains: Navigation, metadata, FAQ content, tiers, personas, solutions
- Depends on: Types
- Used by: Components, pages, layout

## Data Flow

**Form Submission Flow:**

1. User fills form in `src/components/forms/ContactForm.tsx` (or similar)
2. React Hook Form validates against Zod schema from `src/lib/schemas.ts`
3. On valid submission, POST to `/api/contact/route.ts`
4. Server validates again via `withValidation` middleware
5. Sanitization applied via `sanitizeRecord()` from `src/lib/sanitize.ts`
6. Email sent via `sendEmails()` from `src/lib/email.ts` using Resend SDK
7. Response with success/error returned to client
8. Client shows success state or error message

**Content Fetch Flow:**

1. Page component (e.g., `src/app/(marketing)/page.tsx`) calls data function
2. Functions like `getChapters()` from `src/lib/chapters.ts` execute on server
3. Notion client (`@notionhq/client`) queries database via `NOTION_TOKEN`
4. Results parsed with property getters from `src/lib/notion-utils.ts`
5. Data passed to component props during server render
6. Components render as static HTML

**Animation Flow:**

1. Client component mounts (e.g., `src/components/ui/GridParallaxWrapper.tsx`)
2. GSAP dynamically imported from `src/lib/gsap.ts` (lazy loaded)
3. ScrollTrigger initialized with scroll position tracking
4. DOM element animated in sync with scroll progress
5. On unmount, animations cleaned up via `gsap.context().revert()`

**Page Transition Flow:**

1. User clicks `TransitionLink` component (`src/components/ui/TransitionLink.tsx`)
2. View Transition API invoked via `document.startViewTransition()`
3. CSS animations applied via `::view-transition-old` / `::view-transition-new` pseudo-elements (defined in `globals.css`)
4. Next.js router navigates to new page during transition

**State Management:**

- Server-side: Notion database as source of truth
- Client-side: React form state via React Hook Form
- URL state: Query parameters managed by `nuqs` library
- Animation state: GSAP context with automatic cleanup

## Key Abstractions

**Validation Wrapper (`withValidation`):**
- Purpose: Common pattern for API routes with schema validation + rate limiting
- Examples: `src/app/api/contact/route.ts`, `src/app/api/subscribe/route.ts`
- Pattern: HOF that takes Zod schema and handler, returns Next.js route handler
- Location: `src/lib/validation.ts`

**Notion Property Getters:**
- Purpose: Safe extraction of typed values from Notion API responses
- Examples: `getTitleProperty`, `getSelectProperty`, `getDateProperty`
- Pattern: Each checks for missing property (logs warning to Sentry in prod)
- Location: `src/lib/notion-utils.ts`

**GSAP Animation Context:**
- Purpose: Encapsulate scroll-triggered animations with proper cleanup
- Examples: Parallax, reveals, card tilts
- Pattern: `useEffect` with dynamic import, `gsap.context()`, cleanup on unmount
- Location: Various components like `src/components/ui/GridParallaxWrapper.tsx`

**Markdown/MDX Content:**
- Purpose: Render blog posts from Notion as React components
- Pattern: `notion-to-md` converts Notion blocks → markdown → React components
- Location: `src/components/mdx/BlogContent.tsx`

## Entry Points

**Web Application Root:**
- Location: `src/app/layout.tsx`
- Triggers: HTTP requests to `/`
- Responsibilities: Wraps app with global providers (NuqsAdapter, Analytics), defines fonts, sets up root metadata

**Marketing Page Hierarchy:**
- Location: `src/app/(marketing)/page.tsx`
- Triggers: HTTP request to `/`
- Responsibilities: Fetches chapter data, assembles page from section components

**Admin Revalidation:**
- Location: `src/app/admin/revalidate/page.tsx`
- Triggers: Manual POST requests with REVALIDATE_SECRET
- Responsibilities: Triggers Next.js on-demand revalidation for static pages

**API Route: Contact Form:**
- Location: `src/app/api/contact/route.ts`
- Triggers: POST /api/contact with form data
- Responsibilities: Validates contact form, sanitizes input, sends email via Resend

**API Route: Applications (Ventures/Chapter/Solutions/Membership):**
- Location: `src/app/api/applications/{ventures,chapter,solutions,membership}/route.ts`
- Triggers: POST to application endpoints
- Responsibilities: Validates application data, stores to Notion database

**API Route: ICS Calendar Export:**
- Location: `src/app/api/events/[id]/ics/route.ts`
- Triggers: GET /api/events/:id/ics
- Responsibilities: Generates ICS calendar file for event download

## Error Handling

**Strategy:** Layered validation with user-friendly error messages and server-side logging

**Patterns:**

- **Zod Schema Validation:** First layer in form components and API routes (`src/lib/schemas.ts`)
- **Rate Limiting:** Second layer in `withValidation` middleware to prevent abuse
- **Sanitization:** Third layer to prevent XSS attacks (email, database storage)
- **Error Logging:** Sentry integration for production warnings/errors (`src/lib/notion-utils.ts`)
- **Fallback Values:** Notion property getters return sensible defaults rather than throwing
- **User Feedback:** Forms show field-level validation errors and form-level error messages
- **HTTP Status Codes:** 400 (validation error), 429 (rate limited), 500 (server error)

## Cross-Cutting Concerns

**Logging:** 
- Client-side: Browser console.log for development
- Server-side: Sentry integration via `@sentry/nextjs` for production warnings
- Configured in `next.config.ts` with `withSentryConfig`

**Validation:**
- All user inputs validated with Zod schemas before processing
- Schemas centralized in `src/lib/schemas.ts`
- API routes use `withValidation` HOF for consistent pattern
- Frontend forms use `zodResolver` for instant feedback

**Authentication:**
- No user authentication system (marketing site)
- Rate limiting by IP address in `withValidation` middleware
- Admin operations protected by `REVALIDATE_SECRET` env var

**Accessibility:**
- Skip-to-content link in Navbar (`src/components/layout/Navbar.tsx`)
- Form labels properly associated with inputs
- 60+ aria-* attributes across components
- Animations respect `prefers-reduced-motion` in 10+ components (GSAP animations disabled)
- `useSyncExternalStore` pattern for media queries in `AnimatedSection`
- Semantic HTML with proper heading hierarchy

**Performance:**
- React Compiler enabled (`reactCompiler: true` in `next.config.ts`)
- Dynamic imports for GSAP library to reduce bundle size
- Server-side rendering minimizes client JavaScript
- Vercel Analytics and Speed Insights integrated
- Image optimization via Next.js Image component
- ISR (Incremental Static Regeneration) via revalidation endpoint

---

*Architecture analysis: 2026-04-05*
