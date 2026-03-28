# Codebase Structure

**Analysis Date:** 2026-03-28

## Directory Layout

```
sagie.co/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (fonts, global CSS, metadata)
│   │   ├── globals.css               # Tailwind v4 + CSS custom properties (design tokens)
│   │   ├── not-found.tsx             # 404 page
│   │   ├── sitemap.ts                # /sitemap.xml
│   │   ├── (marketing)/              # Route group — all public marketing pages
│   │   │   ├── page.tsx              # / (home)
│   │   │   ├── apply/
│   │   │   │   ├── page.tsx          # /apply (membership form)
│   │   │   │   ├── chapter/page.tsx  # /apply/chapter
│   │   │   │   ├── solutions/page.tsx# /apply/solutions
│   │   │   │   └── ventures/page.tsx # /apply/ventures
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx          # /blog
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx      # /blog/:slug
│   │   │   │       └── ShareButton.tsx
│   │   │   ├── events/
│   │   │   │   ├── page.tsx          # /events (server, fetches data)
│   │   │   │   └── EventsPageClient.tsx  # client wrapper with accordion UI
│   │   │   ├── resources/page.tsx    # /resources
│   │   │   ├── solutions/page.tsx    # /solutions
│   │   │   └── suggest-event/page.tsx# /suggest-event
│   │   └── api/                      # API routes (POST only)
│   │       ├── applications/
│   │       │   ├── membership/route.ts
│   │       │   ├── chapter/route.ts
│   │       │   ├── solutions/route.ts
│   │       │   └── ventures/route.ts
│   │       ├── submit-post/route.ts
│   │       ├── submit-resource/route.ts
│   │       └── suggest-event/route.ts
│   ├── components/
│   │   ├── layout/                   # Navbar.tsx, Footer.tsx
│   │   ├── sections/                 # Full-width page content blocks
│   │   ├── forms/                    # 'use client' form components
│   │   ├── ui/                       # Reusable atoms and animation wrappers
│   │   ├── mdx/                      # Blog markdown renderer (BlogContent.tsx)
│   │   ├── GlobeShell.tsx            # Globe wrapper component
│   │   └── GlobeNetwork.tsx          # Globe visualization
│   ├── lib/                          # Server-side logic and Notion data layer
│   │   ├── notion.ts                 # Notion client singleton
│   │   ├── notion-monitor.ts         # notionWrite() — Sentry-wrapped write helper
│   │   ├── blog.ts                   # getAllPosts(), getPostBySlug()
│   │   ├── events.ts                 # getUpcomingEvents(), getPastEvents()
│   │   ├── resources.ts              # getResources()
│   │   ├── solutions.ts              # getSolutionProviders()
│   │   ├── schemas.ts                # Zod schemas for all form types
│   │   ├── validation.ts             # withValidation() API middleware
│   │   ├── gsap.ts                   # GSAP + ScrollTrigger + SplitText registration
│   │   └── utils.ts                  # General utilities
│   ├── hooks/
│   │   └── useScrollReveal.ts        # GSAP scroll-triggered animation hook
│   ├── types/
│   │   └── index.ts                  # Shared TS interfaces (Pillar, Tier, Chapter, etc.)
│   ├── constants/                    # Static copy and configuration
│   │   ├── copy.ts                   # All marketing text, nav links, chapters, stats
│   │   ├── pillars.ts
│   │   ├── tiers.ts
│   │   ├── faq.ts
│   │   ├── personas.ts
│   │   ├── solutions.ts
│   │   ├── blog.ts
│   │   ├── resources.ts
│   │   └── events.ts
│   └── env/
│       └── server.ts                 # Validated env vars (server-only, Zod)
├── public/                           # Static assets (images, fonts)
├── tests/
│   └── smoke.spec.ts                 # Playwright smoke test
├── next.config.ts                    # Next.js config with Sentry and CSP headers
├── playwright.config.ts              # Playwright test config
├── sentry.client.config.ts           # Sentry browser init
├── sentry.server.config.ts           # Sentry Node init
├── sentry.edge.config.ts             # Sentry edge runtime init
├── tsconfig.json                     # TypeScript config with path aliases
├── postcss.config.mjs                # PostCSS (Tailwind v4)
└── package.json
```

## Directory Purposes

**`src/app/(marketing)/`:**
- Purpose: All public-facing marketing pages. The `(marketing)` group adds no URL segment.
- Contains: Async server components that fetch Notion data and pass to presentation components
- Key files: `page.tsx` (home), `apply/page.tsx`, `blog/[slug]/page.tsx`, `events/page.tsx`

**`src/app/api/`:**
- Purpose: Form submission endpoints only — no REST API, no GET routes
- Contains: `route.ts` files each exporting `POST` via `withValidation`
- Key pattern: All API routes use `withValidation(Schema, handler)` from `src/lib/validation.ts`

**`src/components/sections/`:**
- Purpose: Full-width, full-height content blocks that compose pages
- Contains: `Hero.tsx`, `Belief.tsx`, `Pillars.tsx`, `WhoItsFor.tsx`, `SocialProof.tsx`, `ChapterMap.tsx`, `Tiers.tsx`, `FounderBridge.tsx`, `FAQ.tsx`, `FinalCTA.tsx`, `ResourcesDirectory.tsx`
- Key files: Each section is self-contained and pulls its content from `src/constants/`

**`src/components/forms/`:**
- Purpose: Client-side form components, each matching one API route
- Contains: `MembershipForm.tsx`, `ChapterForm.tsx`, `VenturesForm.tsx`, `SolutionsForm.tsx`, `SuggestEventForm.tsx`, `SubmitPostForm.tsx`
- Key pattern: All are `'use client'`; include honeypot `_trap` and timestamp `_t` fields

**`src/components/ui/`:**
- Purpose: Reusable presentational atoms and animation wrappers
- Contains: `Button.tsx`, `Section.tsx`, `Eyebrow.tsx`, `FormField.tsx`, `FormSuccess.tsx`, `ScrollReveal.tsx`, `AnimatedSection.tsx`, `BlogPostHeaderAnimation.tsx`, `PageHeroAnimation.tsx`, `CountUp.tsx`, `FAQAccordion.tsx`, `BlogFilter.tsx`, `EventFilter.tsx`, `SolutionsFilter.tsx`, `ResourceFilter.tsx`, `GridBackground.tsx`, `CircuitBackground.tsx`, `GSAPCleanup.tsx`, `PillarIcon.tsx`, `Logo.tsx`

**`src/components/layout/`:**
- Purpose: Site-wide chrome present on every page
- Contains: `Navbar.tsx` (fixed top nav, mobile burger), `Footer.tsx`

**`src/components/mdx/`:**
- Purpose: Render Notion-sourced markdown to styled React
- Contains: `BlogContent.tsx` — uses `react-markdown` with inline style overrides matching design tokens

**`src/lib/`:**
- Purpose: All server-side logic. Never imported by client components directly.
- Contains: Notion client, cached data fetchers, Zod schemas, validation middleware, GSAP setup, utilities

**`src/constants/`:**
- Purpose: Static site content not managed via Notion
- Contains: Marketing copy, nav links, chapters list, tiers, pillars, FAQ, personas — all typed as `as const` readonly objects

**`src/env/`:**
- Purpose: Server-only validated environment access
- Key pattern: Import `env` from `@/env/server` to access any env var; never read `process.env` directly

**`tests/`:**
- Purpose: Playwright e2e tests
- Contains: `smoke.spec.ts` only

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root layout — global fonts, CSS, metadata
- `src/app/(marketing)/page.tsx`: Home page

**Configuration:**
- `src/env/server.ts`: All required environment variables with Zod validation
- `next.config.ts`: CSP headers, Sentry integration, React compiler enabled
- `tsconfig.json`: Path aliases (`@/*` → `src/*`)
- `src/app/globals.css`: Design tokens (CSS custom properties), Tailwind v4 theme

**Core Logic:**
- `src/lib/notion.ts`: Notion SDK client
- `src/lib/validation.ts`: `withValidation()` — bot protection + Zod validation middleware
- `src/lib/schemas.ts`: All Zod schemas (Membership, Chapter, Ventures, Solutions, EventSuggestion, SubmitPost)
- `src/lib/notion-monitor.ts`: `notionWrite()` — Sentry-wrapped Notion write wrapper

**Data Fetchers:**
- `src/lib/blog.ts`: `getAllPosts()`, `getPostBySlug()`
- `src/lib/events.ts`: `getUpcomingEvents()`, `getPastEvents()`
- `src/lib/resources.ts`: `getResources()`
- `src/lib/solutions.ts`: `getSolutionProviders()`

**Animation:**
- `src/lib/gsap.ts`: GSAP plugin registration (client-only via `typeof window !== 'undefined'`)
- `src/hooks/useScrollReveal.ts`: Reusable GSAP scroll animation hook
- `src/components/ui/ScrollReveal.tsx`: JSX wrapper for `useScrollReveal`

## Naming Conventions

**Files:**
- React components: PascalCase `.tsx` — e.g., `MembershipForm.tsx`, `EventsPageClient.tsx`
- Non-component modules: camelCase `.ts` — e.g., `notion.ts`, `useScrollReveal.ts`
- Page/route files: always named `page.tsx` or `route.ts` per Next.js convention

**Directories:**
- Kebab-case for route segments — `suggest-event/`, `submit-post/`
- camelCase for logical groupings — `sections/`, `forms/`, `ui/`
- Next.js special conventions — `(marketing)` for route group, `[slug]` for dynamic segment

**Exports:**
- Named exports only — no default exports except Next.js required ones (`layout.tsx`, `page.tsx`, `route.ts`)
- Constants: SCREAMING_SNAKE_CASE — `SITE`, `METADATA`, `NAV_LINKS`, `HERO`
- Interfaces: PascalCase — `BlogPost`, `SAGIEEvent`, `SolutionProvider`

## Where to Add New Code

**New marketing page:**
- Add `src/app/(marketing)/[page-name]/page.tsx`
- If it needs client interactivity: create `[page-name]/[PageName]Client.tsx` alongside it

**New form:**
1. Add Zod schema to `src/lib/schemas.ts`
2. Create `src/components/forms/[EntityName]Form.tsx` (client component, include honeypot fields)
3. Create `src/app/api/[route-name]/route.ts` using `withValidation(Schema, handler)`
4. Create `src/app/(marketing)/[path]/page.tsx` that imports the form component

**New Notion data source:**
- Add database ID env var to the schema in `src/env/server.ts`
- Create `src/lib/[entity].ts` with a typed interface + `unstable_cache`-wrapped fetcher

**New UI component:**
- Reusable atoms → `src/components/ui/[ComponentName].tsx`
- Full-page content block → `src/components/sections/[SectionName].tsx`
- Site-wide layout element → `src/components/layout/[ComponentName].tsx`

**New static copy:**
- Add to `src/constants/copy.ts` if it is site-wide marketing text
- Create `src/constants/[domain].ts` if it is a new content domain with its own data shape

**New types:**
- UI-level domain types → `src/types/index.ts`
- Data-layer types → colocate as exported interfaces in the relevant `src/lib/` file

## Special Directories

**`.planning/`:**
- Purpose: AI planning and codebase analysis documents
- Generated: No (authored by AI planning tools)
- Committed: Yes

**`.next/`:**
- Purpose: Next.js build output and cache
- Generated: Yes
- Committed: No

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes
- Committed: No

**`.vercel/`:**
- Purpose: Vercel deployment config and project metadata
- Generated: Yes
- Committed: Yes (project ID only, no secrets)

---

*Structure analysis: 2026-03-28*
