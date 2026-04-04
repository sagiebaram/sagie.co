# Codebase Structure

**Analysis Date:** 2026-04-04

## Directory Layout

```
sagie.co/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (fonts, metadata, providers)
│   │   ├── not-found.tsx             # 404 page
│   │   ├── sitemap.ts                # Dynamic sitemap generation
│   │   ├── (marketing)/              # Public pages (grouped route, no /marketing prefix)
│   │   │   ├── layout.tsx            # Navbar + Footer wrapper
│   │   │   ├── page.tsx              # Home page (/)
│   │   │   ├── [slug]/               # Dynamic routes (blog posts, etc.)
│   │   │   ├── apply/                # Application hub (/apply)
│   │   │   │   ├── page.tsx          # Apply index
│   │   │   │   ├── membership/       # /apply/membership (MembershipForm)
│   │   │   │   ├── chapter/          # /apply/chapter (ChapterForm)
│   │   │   │   ├── solutions/        # /apply/solutions (SolutionsForm)
│   │   │   │   ├── ventures/         # /apply/ventures (VenturesForm)
│   │   │   │   ├── error.tsx         # Error boundary
│   │   │   │   └── loading.tsx       # Suspense boundary
│   │   │   ├── blog/                 # /blog
│   │   │   │   ├── page.tsx          # Blog index with filters
│   │   │   │   ├── [slug]/           # /blog/[slug] (post detail)
│   │   │   │   ├── error.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── events/               # /events
│   │   │   ├── solutions/            # /solutions (directory)
│   │   │   ├── resources/            # /resources (directory)
│   │   │   ├── ventures/             # /ventures (info page)
│   │   │   ├── eco/                  # /eco (ecosystem page)
│   │   │   ├── contact/              # /contact (contact form)
│   │   │   ├── suggest-event/        # /suggest-event (event suggestion form)
│   │   │   ├── privacy/              # /privacy (legal)
│   │   │   ├── terms/                # /terms (legal)
│   │   │   └── resources/            # /resources (info page)
│   │   └── api/                      # API routes
│   │       ├── applications/         # Form submissions
│   │       │   ├── membership/route.ts
│   │       │   ├── chapter/route.ts
│   │       │   ├── solutions/route.ts
│   │       │   └── ventures/route.ts
│   │       ├── submit-post/route.ts  # Community blog submission
│   │       ├── submit-resource/route.ts
│   │       ├── contact/route.ts
│   │       ├── subscribe/route.ts    # Newsletter subscription
│   │       ├── suggest-event/route.ts
│   │       ├── events/
│   │       │   └── [id]/ics/route.ts # Calendar file export
│   │       ├── revalidate/route.ts   # ISR cache invalidation
│   │       └── (admin paths — user-facing pages, not API)
│   │           └── revalidate/
│   │               ├── page.tsx      # Admin revalidate UI
│   │               └── layout.tsx
│   │
│   ├── components/
│   │   ├── forms/                    # Form components (Client Components)
│   │   │   ├── MembershipForm.tsx
│   │   │   ├── ChapterForm.tsx
│   │   │   ├── SolutionsForm.tsx
│   │   │   ├── VenturesForm.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── SubmitPostForm.tsx
│   │   │   └── SuggestEventForm.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Navigation (Client Component)
│   │   │   └── Footer.tsx            # Footer (Client Component)
│   │   ├── sections/                 # Marketing page sections
│   │   │   ├── Hero.tsx              # Hero section + animation
│   │   │   ├── HeroAnimation.tsx
│   │   │   ├── Belief.tsx
│   │   │   ├── Pillars.tsx
│   │   │   ├── WhoItsFor.tsx
│   │   │   ├── SocialProof.tsx
│   │   │   ├── Tiers.tsx
│   │   │   ├── FAQ.tsx
│   │   │   ├── FounderBridge.tsx
│   │   │   ├── FinalCTA.tsx
│   │   │   ├── ChapterMap.tsx        # Interactive chapter map
│   │   │   ├── ResourcesDirectory.tsx
│   │   │   └── ...
│   │   ├── ui/                       # Reusable UI atoms + helpers
│   │   │   ├── FormField.tsx         # Input wrapper with validation
│   │   │   ├── PhoneField.tsx        # Phone input with country selector
│   │   │   ├── LocationFields.tsx    # Country/State/City dropdowns
│   │   │   ├── Button.tsx
│   │   │   ├── FAQAccordion.tsx
│   │   │   ├── NewsletterForm.tsx
│   │   │   ├── SubmitResourceForm.tsx
│   │   │   ├── AnimatedSection.tsx   # Wrapper with scroll reveal
│   │   │   ├── ScrollReveal.tsx
│   │   │   ├── PageHeroAnimation.tsx
│   │   │   ├── BlogPostHeaderAnimation.tsx
│   │   │   ├── BlogFilter.tsx        # Category/author filter
│   │   │   ├── EventFilter.tsx       # Event filtering UI
│   │   │   ├── ResourceFilter.tsx
│   │   │   ├── SolutionsFilter.tsx
│   │   │   ├── CountUp.tsx           # Number animation
│   │   │   ├── CircuitBackground.tsx # SVG background
│   │   │   ├── GridBackground.tsx    # CSS gradient background
│   │   │   ├── ErrorPage.tsx
│   │   │   ├── FormSuccess.tsx       # Post-submission success screen
│   │   │   ├── Logo.tsx
│   │   │   ├── Eyebrow.tsx           # Section label
│   │   │   ├── Section.tsx           # Generic section wrapper
│   │   │   ├── Skeleton.tsx          # Loading placeholder
│   │   │   ├── PillarIcon.tsx        # SVG icon component
│   │   │   ├── GSAPCleanup.tsx       # GSAP cleanup on route change
│   │   │   └── ...
│   │   ├── mdx/
│   │   │   └── BlogContent.tsx       # MDX rendering wrapper
│   │   ├── GlobeClient.tsx           # 3D globe (lazy Client Component)
│   │   ├── GlobeShell.tsx            # Lazy load wrapper for Globe
│   │   ├── GlobeNetwork.tsx          # Data for globe visualization
│   │   └── ...
│   │
│   ├── lib/                          # Utility functions & data accessors
│   │   ├── notion.ts                 # Notion API client initialization
│   │   ├── notion-utils.ts           # Property extractors (getTextProperty, etc.)
│   │   ├── notion-monitor.ts         # Sentry wrapper for Notion writes
│   │   ├── blog.ts                   # Blog fetch + cache (getAllPosts, getPostBySlug)
│   │   ├── events.ts                 # Event fetch + cache (getUpcomingEvents, getPastEvents)
│   │   ├── resources.ts              # Resource fetch + cache
│   │   ├── solutions.ts              # Solutions provider fetch + cache
│   │   ├── members.ts                # Member fetch + cache
│   │   ├── chapters.ts               # Chapter data fetch
│   │   ├── validation.ts             # withValidation HOF (Zod + honeypot + rate limit)
│   │   ├── schemas.ts                # Zod form schemas (MembershipSchema, ChapterSchema, etc.)
│   │   ├── sanitize.ts               # XSS prevention (sanitizeRecord)
│   │   ├── email.ts                  # Resend integration (sendEmails)
│   │   ├── gsap.ts                   # Dynamic GSAP import
│   │   ├── calendar.ts               # ICS file generation
│   │   ├── location.ts               # Location utils
│   │   ├── locationData.ts           # Country/state/city data
│   │   ├── utils.ts                  # Helper: cn() (clsx + tailwind-merge)
│   │   └── __tests__/                # Unit tests (colocated with lib)
│   │       ├── validation.test.ts
│   │       ├── schemas.test.ts
│   │       ├── email.test.ts
│   │       ├── sanitize.test.ts
│   │       ├── blog.test.ts
│   │       ├── events.test.ts
│   │       ├── resources.test.ts
│   │       ├── solutions.test.ts
│   │       ├── members.test.ts
│   │       ├── revalidate.test.ts
│   │       └── sitemap.test.ts
│   │
│   ├── components/
│   │   ├── forms/                    # Form components
│   │   ├── layout/                   # Layout wrappers
│   │   ├── sections/                 # Page sections
│   │   └── ui/                       # Atomic UI components
│   │
│   ├── constants/                    # Static data
│   │   ├── copy.ts                   # Site metadata, copy strings
│   │   ├── tiers.ts                  # Membership tiers
│   │   ├── pillars.ts                # SAGIE pillars
│   │   ├── personas.ts               # Personas (Founder, Operator, etc.)
│   │   ├── faq.ts                    # FAQ content
│   │   ├── solutions.ts              # Solutions categories
│   │   ├── blog.ts                   # Blog meta (featured, recent counts)
│   │   └── ...
│   │
│   ├── types/                        # TypeScript type definitions
│   │   ├── index.ts                  # Core types (Pillar, Persona, Tier, Chapter, etc.)
│   │   └── events.ts                 # SAGIEEvent type
│   │
│   ├── emails/                       # React Email templates
│   │   ├── ConfirmationEmail.tsx     # Sent to applicants
│   │   ├── AdminAlertEmail.tsx       # Sent to admin on each submission
│   │   └── ...
│   │
│   ├── env/
│   │   └── server.ts                 # Zod-validated server env vars
│   │
│   ├── hooks/                        # Custom React hooks
│   │   └── useScrollReveal.ts        # GSAP scroll trigger animation hook
│   │
│   └── (globals)
│       └── globals.css               # Tailwind + custom CSS (theme via :root vars)
│
├── tests/                            # E2E tests (Playwright)
│   ├── smoke.spec.ts
│   ├── content-pages.spec.ts
│   └── forms.spec.ts
│
├── public/                           # Static assets
│   ├── data/                         # JSON data files
│   └── (images, fonts, etc.)
│
├── .github/workflows/                # CI/CD pipelines
│   ├── ci.yml                        # Lint, typecheck, test on PRs
│   └── e2e-preview.yml               # E2E on Vercel previews
│
├── .planning/                        # Planning & documentation
├── vitest.config.ts                  # Unit test config
├── playwright.config.ts              # E2E test config
├── next.config.ts                    # Next.js config (CSP headers)
├── tsconfig.json                     # TypeScript config
├── tailwind.config.js                # Tailwind CSS config (v4)
├── postcss.config.js                 # PostCSS config
├── eslint.config.mjs                 # ESLint config
├── package.json
├── package-lock.json
├── README.md
└── .env.example                      # Template for env vars
```

## Directory Purposes

**`src/app/(marketing)/`:**
- Purpose: Public marketing and application pages
- Contains: Page.tsx, layout, error/loading boundaries, content pages, application flows
- Key files: `page.tsx` (home), `apply/`, `blog/`, `events/`, `solutions/`, `resources/`, `ventures/`, `contact/`, `suggest-event/`, `privacy/`, `terms/`

**`src/app/api/`:**
- Purpose: API route handlers for form submissions and webhook targets
- Contains: POST routes for forms, GET routes for exports (ICS calendar), admin revalidate endpoint
- Key files: `applications/{membership,chapter,solutions,ventures}/route.ts`, `{submit-post,submit-resource,contact,subscribe,suggest-event}/route.ts`, `revalidate/route.ts`

**`src/components/forms/`:**
- Purpose: Form components with client-side validation and submission
- Contains: One form per application type + contact/newsletter forms
- Key files: MembershipForm, ChapterForm, VenturesForm, SolutionsForm, ContactForm, SubmitPostForm, SuggestEventForm
- Pattern: All are Client Components; use React Hook Form + Zod resolver; manage local state for submission status

**`src/components/layout/`:**
- Purpose: Persistent layout wrappers
- Contains: Navbar (top navigation), Footer (bottom with links/socials)
- Shared across all pages via layout nesting

**`src/components/sections/`:**
- Purpose: Marketing page sections (reusable page blocks)
- Contains: Hero, Belief, Pillars, Tiers, FAQ, SocialProof, Chapters, etc.
- Pattern: Most are Client Components for animations; often use useScrollReveal hook

**`src/components/ui/`:**
- Purpose: Atomic UI components and utilities
- Contains: Form fields, buttons, filters, backgrounds, animations, loaders
- Key patterns: FormField wraps input + error; PhoneField integrates react-phone-number-input; LocationFields manages country→state→city cascade

**`src/lib/`:**
- Purpose: Business logic, data access, validation
- Contains: Notion queries (with ISR caching), form validation schemas, email service, monitoring
- Key files:
  - `blog.ts`, `events.ts`, `resources.ts`, `solutions.ts`, `members.ts`: Notion fetchers with `unstable_cache`
  - `validation.ts`: `withValidation` HOF combining Zod + honeypot + rate limiting
  - `schemas.ts`: Zod form schemas (source of truth for form structure)
  - `email.ts`: Resend integration
  - `notion-utils.ts`: Property extractors to handle Notion API response shapes

**`src/lib/__tests__/`:**
- Purpose: Unit tests for lib utilities
- Colocated with source files for quick navigation
- Patterns: Vitest, mocked dependencies (server-only, env, Sentry), focus on validation, email, sanitization, data transforms

**`tests/`:**
- Purpose: E2E tests (Playwright)
- Contains: smoke.spec.ts, content-pages.spec.ts, forms.spec.ts
- Pattern: Test user flows (form fill + submit, page navigation, filtering)
- Includes form-specific helpers (selectDropdownOption, mockApplicationRoute)

**`src/constants/`:**
- Purpose: Static data and marketing copy
- Contains: SITE metadata, METADATA SEO, tiers, personas, pillars, FAQ, solutions categories
- Pattern: Exported as const objects; used by components, pages, and lib

**`src/types/`:**
- Purpose: TypeScript type definitions
- Contains: Pillar, Persona, Tier, Chapter, FAQItem, ButtonVariant, BlogPost, SAGIEEvent
- Pattern: Used throughout components and lib for type safety

**`src/emails/`:**
- Purpose: React Email templates
- Contains: ConfirmationEmail (sent to user), AdminAlertEmail (sent to admin)
- Used by: `email.ts` sendEmails function

**`src/env/`:**
- Purpose: Environment variable validation at startup
- Contains: Zod schema for server env vars
- Pattern: Import `env` from here instead of directly accessing process.env; ensures type safety and validation

**`src/hooks/`:**
- Purpose: Custom React hooks
- Contains: useScrollReveal (GSAP scroll trigger animation)
- Pattern: Client-side only; integrates with GSAP dynamic import

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root layout (fonts, metadata, providers, Sentry, Analytics)
- `src/app/(marketing)/layout.tsx`: Marketing layout (Navbar, Footer wrapper)
- `src/app/(marketing)/page.tsx`: Home page
- `src/app/api/**/route.ts`: API route handlers

**Configuration:**
- `tsconfig.json`: TypeScript with `@/*` alias for `src/*`
- `vitest.config.ts`: Unit test runner (src/**/*.test.ts)
- `playwright.config.ts`: E2E test runner (tests/*.spec.ts)
- `next.config.ts`: CSP headers, image optimization
- `.env.example`: Template for required env vars
- `src/env/server.ts`: Zod validation of env vars

**Core Logic:**
- `src/lib/validation.ts`: withValidation HOF (rate limit + honeypot + Zod)
- `src/lib/schemas.ts`: Zod form schemas (MembershipSchema, ChapterSchema, etc.)
- `src/lib/blog.ts`, `events.ts`, `resources.ts`: Notion data fetchers with ISR caching
- `src/lib/email.ts`: Resend email service
- `src/lib/sanitize.ts`: XSS prevention

**Forms:**
- `src/components/forms/*Form.tsx`: Form components (Client-side)
- `src/app/api/applications/{type}/route.ts`: Form submission handlers

**Testing:**
- `src/lib/__tests__/*.test.ts`: Unit tests (validation, schemas, email, etc.)
- `tests/*.spec.ts`: E2E tests (forms, content pages, smoke)

## Naming Conventions

**Files:**
- Page components: `page.tsx` (Next.js convention)
- Layout components: `layout.tsx` (Next.js convention)
- API routes: `route.ts` (Next.js convention)
- Components: PascalCase (e.g., `MembershipForm.tsx`, `FAQAccordion.tsx`)
- Utilities/lib: camelCase (e.g., `validation.ts`, `notion-utils.ts`)
- Tests: Match source file name with `.test.ts` suffix (e.g., `validation.test.ts`)
- Types: PascalCase (e.g., `BlogPost`, `SAGIEEvent`)
- Constants: UPPER_SNAKE_CASE for constants (e.g., `RATE_LIMIT`, `WINDOW_MS`)

**Directories:**
- Lower-case with hyphens (e.g., `apply/`, `submit-post/`)
- Grouped routes use parentheses (e.g., `(marketing)/`, `(admin)/`)
- Dynamic segments use brackets (e.g., `[slug]/`, `[id]/`)

**Functions & Variables:**
- camelCase for functions (e.g., `withValidation`, `getAllPosts`, `sendEmails`)
- camelCase for state/props (e.g., `isSubmitting`, `formData`, `submitError`)
- Prefix hooks with `use` (e.g., `useScrollReveal`)
- Prefix utility functions with noun or action (e.g., `cn()` for className, `getTextProperty()` for extractor)

**Types & Interfaces:**
- PascalCase (e.g., `BlogPost`, `FormType`, `ChapterStatus`)
- Prefix optional types with `?` (e.g., `cover?: string`)
- Enum-like unions: union types or literal types (e.g., `'live' | 'soon' | 'open'`)

## Where to Add New Code

**New Feature (e.g., new form, new page):**
- Feature pages: Create in `src/app/(marketing)/{feature}/page.tsx`
- Feature forms: Create in `src/components/forms/{FeatureName}Form.tsx` (Client Component)
- API handler: Create in `src/app/api/{feature}/route.ts` with `withValidation` wrapper
- Schema: Add to `src/lib/schemas.ts` as new Zod object (e.g., `FeatureSchema`)
- Email template: Create in `src/emails/{Feature}Email.tsx` if needed
- Tests: Create `tests/{feature}.spec.ts` for E2E, `src/lib/__tests__/{feature}.test.ts` for unit tests

**New Component/Module:**
- UI components: `src/components/ui/{ComponentName}.tsx` (Server or Client as needed)
- Section components: `src/components/sections/{SectionName}.tsx` (typically Client for animations)
- Form fields: `src/components/ui/Form*.tsx` (e.g., FormField, PhoneField, LocationFields)
- Layout components: `src/components/layout/{LayoutName}.tsx`

**Utilities:**
- Form validation: Add to `src/lib/schemas.ts`
- General helpers: Add to `src/lib/utils.ts` or create new file in `src/lib/`
- Type definitions: Add to `src/types/` (index.ts for shared, or feature-specific file)
- Constants: Add to `src/constants/` (copy.ts for copy, tiers.ts for tiers, etc.)

**Data Fetching (Notion-based):**
- Create new fetcher in `src/lib/{feature}.ts` using `unstable_cache` pattern
- Ensure all queries use `.safeParse()` and property extractors from `notion-utils.ts`
- Use Sentry for error monitoring via `notionWrite` wrapper
- Add tag-based cache invalidation via `/api/revalidate` endpoint

## Special Directories

**`.next/`:**
- Purpose: Build output from Next.js build
- Generated: Yes
- Committed: No (.gitignored)
- Content: Compiled JS, server bundles, static assets

**`.planning/`:**
- Purpose: Project planning, phase documentation, codebase analysis
- Generated: Partially (GSD tools write to `.planning/codebase/`)
- Committed: Yes
- Content: SPRINT files, milestone phases, analysis docs (ARCHITECTURE.md, STRUCTURE.md, etc.)

**`coverage/`:**
- Purpose: Code coverage reports from Vitest
- Generated: Yes (on `npm run test:coverage`)
- Committed: No (.gitignored)
- Content: HTML reports, JSON coverage data

**`playwright-report/`:**
- Purpose: Playwright E2E test reports
- Generated: Yes (after test run)
- Committed: No (.gitignored)
- Content: HTML report with screenshots, traces

**`public/data/`:**
- Purpose: Static JSON data files (if any)
- Generated: No (static)
- Committed: Yes
- Content: Seed data, lookup tables

---

*Structure analysis: 2026-04-04*
