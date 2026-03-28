# Codebase Structure

**Analysis Date:** 2026-03-28

## Directory Layout

```
sagie.co/
├── src/
│   ├── app/                        # Next.js App Router with file-based routing
│   │   ├── (marketing)/            # Route group for marketing pages
│   │   │   ├── page.tsx            # Home page
│   │   │   ├── blog/               # Blog listing and detail pages
│   │   │   ├── events/             # Events listing page with filter
│   │   │   ├── resources/          # Resources directory listing
│   │   │   ├── solutions/          # Solutions provider directory
│   │   │   ├── apply/              # Application forms
│   │   │   │   ├── chapter/        # Chapter lead application
│   │   │   │   ├── membership/     # Membership application
│   │   │   │   ├── ventures/       # Ventures intake
│   │   │   │   └── solutions/      # Solutions provider application
│   │   │   ├── suggest-event/      # Event suggestion form
│   │   │   └── layout.tsx          # Marketing layout wrapper
│   │   ├── admin/                  # Admin-only pages (no auth)
│   │   │   └── revalidate/         # Manual cache revalidation
│   │   ├── api/                    # API routes
│   │   │   ├── applications/       # Form submission endpoints
│   │   │   │   ├── chapter/route.ts
│   │   │   │   ├── membership/route.ts
│   │   │   │   ├── ventures/route.ts
│   │   │   │   └── solutions/route.ts
│   │   │   ├── submit-post/route.ts       # Blog post submissions
│   │   │   ├── submit-resource/route.ts   # Resource submissions
│   │   │   ├── suggest-event/route.ts     # Event suggestions
│   │   │   └── revalidate/route.ts        # ISR cache invalidation
│   │   ├── layout.tsx              # Root layout (html, fonts, metadata)
│   │   ├── sitemap.ts              # Dynamic sitemap generation
│   │   ├── not-found.tsx           # 404 page
│   │   └── globals.css             # Global styles (Tailwind, custom vars)
│   │
│   ├── components/                 # React components (presentation layer)
│   │   ├── layout/                 # Page structure components
│   │   │   ├── Navbar.tsx          # Navigation bar (responsive, mobile menu)
│   │   │   └── Footer.tsx          # Footer with links
│   │   ├── sections/               # Large page sections (Hero, FAQ, etc.)
│   │   │   ├── Hero.tsx
│   │   │   ├── Belief.tsx
│   │   │   ├── Pillars.tsx
│   │   │   ├── WhoItsFor.tsx
│   │   │   ├── SocialProof.tsx
│   │   │   ├── ChapterMap.tsx      # Interactive map component
│   │   │   ├── Tiers.tsx           # Membership tier display
│   │   │   ├── FAQ.tsx
│   │   │   ├── FounderBridge.tsx
│   │   │   ├── FinalCTA.tsx
│   │   │   └── ResourcesDirectory.tsx # Large filterable resource list
│   │   ├── ui/                     # Reusable UI primitives
│   │   │   ├── CircuitBackground.tsx   # Animated background pattern
│   │   │   ├── Button.tsx
│   │   │   ├── FormField.tsx       # Input wrapper with error display
│   │   │   ├── FormSuccess.tsx     # Success message component
│   │   │   ├── ErrorPage.tsx       # Error boundary fallback
│   │   │   ├── BlogFilter.tsx      # Blog post filter UI
│   │   │   ├── EventFilter.tsx     # Event filter UI
│   │   │   ├── ResourceFilter.tsx  # Resource filter UI
│   │   │   ├── SolutionsFilter.tsx # Solutions filter UI
│   │   │   ├── FAQAccordion.tsx
│   │   │   ├── ScrollReveal.tsx    # Animation wrapper
│   │   │   ├── AnimatedSection.tsx
│   │   │   ├── Skeleton.tsx        # Loading placeholder
│   │   │   ├── GSAPCleanup.tsx     # GSAP context manager
│   │   │   └── [other UI components]
│   │   ├── forms/                  # Form components (client-side)
│   │   │   ├── MembershipForm.tsx
│   │   │   ├── ChapterForm.tsx
│   │   │   ├── VenturesForm.tsx
│   │   │   ├── SolutionsForm.tsx
│   │   │   ├── SubmitPostForm.tsx
│   │   │   ├── SuggestEventForm.tsx
│   │   │   └── SubmitResourceForm.tsx
│   │   └── GlobeShell.tsx          # Three.js globe wrapper
│   │
│   ├── lib/                        # Business logic and utilities
│   │   ├── notion.ts               # Notion client initialization
│   │   ├── notion-monitor.ts       # Notion write monitoring wrapper
│   │   ├── blog.ts                 # Blog data loader with caching
│   │   ├── events.ts               # Event data loader with caching
│   │   ├── resources.ts            # Resource data loader with caching
│   │   ├── solutions.ts            # Solutions data loader with caching
│   │   ├── members.ts              # Member/chapter data loader
│   │   ├── chapters.ts             # Chapter data loader
│   │   ├── email.ts                # Email sending service
│   │   ├── validation.ts           # Form validation middleware (rate limit, honeypot, schema)
│   │   ├── schemas.ts              # Zod validation schemas for all forms
│   │   ├── gsap.ts                 # GSAP with ScrollTrigger export
│   │   ├── utils.ts                # General utilities
│   │   └── __tests__/              # Unit tests for lib functions
│   │       ├── blog.test.ts
│   │       ├── events.test.ts
│   │       ├── email.test.ts
│   │       ├── validation.test.ts
│   │       ├── schemas.test.ts
│   │       ├── revalidate.test.ts
│   │       └── [more tests]
│   │
│   ├── hooks/                      # Custom React hooks
│   │   └── useScrollReveal.ts      # GSAP scroll reveal hook with motion detection
│   │
│   ├── types/                      # TypeScript type definitions
│   │   └── index.ts                # Shared interfaces (Pillar, Persona, Tier, Chapter, FAQItem, etc.)
│   │
│   ├── env/                        # Environment variable management
│   │   └── server.ts               # Server-only validated env schema
│   │
│   ├── constants/                  # Static data and configuration
│   │   ├── copy.ts                 # Copy strings, metadata, site config
│   │   ├── personas.ts             # Persona definitions
│   │   ├── pillars.ts              # Pillar definitions
│   │   ├── tiers.ts                # Membership tier definitions
│   │   ├── faq.ts                  # FAQ data
│   │   ├── blog.ts                 # Blog-related constants
│   │   └── solutions.ts            # Solutions category data
│   │
│   └── emails/                     # React Email components
│       ├── ConfirmationEmail.tsx   # User confirmation email template
│       └── AdminAlertEmail.tsx     # Admin notification email template
│
├── public/                         # Static assets (images, icons, fonts)
│   ├── sagie_logo_nav.png
│   └── data/                       # JSON data files (if any)
│
├── tests/                          # E2E tests (Playwright)
│   └── [test files]
│
├── .planning/                      # GSD planning documents
│   ├── codebase/                   # Codebase analysis (this directory)
│   └── phases/                     # Phase implementation plans
│
├── .github/                        # GitHub configuration
│   └── workflows/                  # CI/CD workflows
│
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── next.config.ts                  # Next.js configuration (Sentry integration)
├── tailwind.config.js              # Tailwind CSS configuration
├── vitest.config.ts                # Vitest configuration
└── playwright.config.ts            # Playwright E2E test configuration
```

## Directory Purposes

**src/app:**
- Purpose: Next.js App Router containing all pages and API routes with file-based routing
- Contains: `.tsx` page files, layout wrappers, API route handlers, loading/error states
- Key files: `layout.tsx` (root), `(marketing)/page.tsx` (home), `api/applications/*`

**src/components:**
- Purpose: Reusable React components organized by responsibility
- Contains: UI primitives, form components, animated sections, layout wrappers
- Key subdirectories: `ui/` (primitives), `forms/` (input forms), `sections/` (marketing content blocks)

**src/lib:**
- Purpose: Business logic, data loaders, external service integration, utility functions
- Contains: Notion client, caching patterns, validation, email service, data mappers
- Key files: `validation.ts` (middleware), `schemas.ts` (Zod definitions), `blog.ts`/`events.ts` (data loaders)

**src/hooks:**
- Purpose: Custom React hooks for reusable stateful logic
- Contains: Animation hooks (useScrollReveal), potentially hooks for forms
- Key files: `useScrollReveal.ts` (GSAP integration with motion preference support)

**src/types:**
- Purpose: Shared TypeScript interfaces and type definitions
- Contains: Domain types (Pillar, Persona, Chapter, etc.) used across components and data loaders
- Key files: `index.ts` (all types)

**src/env:**
- Purpose: Environment variable validation and access with type safety
- Contains: Zod schema for all required and optional env vars
- Key files: `server.ts` (server-only env access)

**src/constants:**
- Purpose: Static configuration data, copy strings, content definitions
- Contains: Site metadata, personas, tiers, pillars, FAQ, category definitions
- Key files: `copy.ts` (metadata, nav links), `tiers.ts`, `faq.ts`

**src/emails:**
- Purpose: Email template components using React Email
- Contains: JSX templates for user confirmations and admin alerts
- Key files: `ConfirmationEmail.tsx`, `AdminAlertEmail.tsx`

**public:**
- Purpose: Static assets served directly by Next.js
- Contains: Images, logos, icon files, potentially JSON data files
- Key files: `sagie_logo_nav.png`

**tests:**
- Purpose: End-to-end tests using Playwright
- Contains: Test specs for critical user flows (forms, navigation, pages)
- Generated output: `playwright-report/`, `test-results/`

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root layout, loads fonts, sets metadata, initializes GSAPCleanup
- `src/app/(marketing)/page.tsx`: Home page (index), composes sections
- `src/app/api/applications/{type}/route.ts`: Form submission API endpoints

**Configuration:**
- `tsconfig.json`: TypeScript strict mode, path alias `@/*` → `./src/*`
- `next.config.ts`: Sentry integration, security headers, cache control
- `src/env/server.ts`: Environment variable schema with validation
- `src/constants/copy.ts`: Site metadata, navigation links, copy strings

**Core Logic:**
- `src/lib/validation.ts`: Rate limiting, honeypot, schema validation middleware
- `src/lib/schemas.ts`: Zod schemas for all form types (Membership, Ventures, Chapter, etc.)
- `src/lib/blog.ts`: Blog data loader with `unstable_cache`, markdown conversion
- `src/lib/events.ts`: Event data loader with filtering by status
- `src/lib/email.ts`: Resend service integration, dual-recipient pattern

**Testing:**
- `src/lib/__tests__/`: Unit tests for data loaders, validation, schemas
- `tests/`: Playwright E2E test files

## Naming Conventions

**Files:**
- Pages: `page.tsx` (Next.js convention)
- Layouts: `layout.tsx` (Next.js convention)
- API routes: `route.ts` (Next.js convention)
- Components: `PascalCase.tsx` (React convention, e.g., `MembershipForm.tsx`)
- Utilities/services: `camelCase.ts` (e.g., `validation.ts`, `blog.ts`)
- Schemas: `schemas.ts` (Zod definitions grouped in one file)
- Tests: `*.test.ts` or `*.test.tsx` (Vitest convention)

**Directories:**
- Feature-based: `/apply/`, `/blog/`, `/api/applications/`
- Type-based: `/components/ui/`, `/components/forms/`, `/components/sections/`
- Route groups: `(marketing)` wraps public-facing routes under one layout
- Admin: `/admin/` for admin-only pages (currently unprotected)

**Component Names:**
- Section components: `<SectionName>` in `src/components/sections/`
- Form components: `<FormType>Form` in `src/components/forms/`
- UI primitives: `<ComponentName>` in `src/components/ui/`

**Export Patterns:**
- Barrel exports: `src/types/index.ts`, `src/constants/`
- Named exports for services: `export { blog, getPostBySlug }` from `src/lib/blog.ts`
- Default exports for components: `export default function ComponentName() {}`

## Where to Add New Code

**New Form/Application Type:**

1. Define schema: Add to `src/lib/schemas.ts` as a new Zod object export
2. Create form component: `src/components/forms/{FormName}Form.tsx` using pattern from `MembershipForm.tsx`
3. Create API route: `src/app/api/applications/{type}/route.ts` using `withValidation()` wrapper
4. Add email templates: Extend `src/emails/ConfirmationEmail.tsx` and `AdminAlertEmail.tsx` with new form type
5. Update types: Add form type to `FormType` union in `src/lib/email.ts`
6. Create page: `src/app/(marketing)/apply/{type}/page.tsx` that renders form

**New Data Source (Notion Database):**

1. Define interface: Add to `src/types/index.ts` or create in `src/lib/{resource}.ts`
2. Create loader: `src/lib/{resource}.ts` following pattern from `blog.ts` (with `unstable_cache`, mapping function)
3. Add env var: Update `src/env/server.ts` with database ID
4. Create page: `src/app/(marketing)/{resource}/page.tsx` that calls loader
5. Add tests: `src/lib/__tests__/{resource}.test.ts`

**New Marketing Section:**

1. Create component: `src/components/sections/{SectionName}.tsx`
2. Use GSAP animations: Import `useScrollReveal` hook or wrap children in `<ScrollReveal>`
3. Import to page: Add to relevant page file (e.g., `src/app/(marketing)/page.tsx`)
4. Style: Use Tailwind classes, custom CSS variables from `globals.css`
5. Add test: If complex, add to `tests/`

**Utilities/Helpers:**

- Shared functions: `src/lib/utils.ts`
- Custom hooks: `src/hooks/{hookName}.ts`
- Reusable components: `src/components/ui/{ComponentName}.tsx`

**Types:**

- Global types: `src/types/index.ts`
- Service-specific: Inline in service file or in `src/types/`
- Avoid scattering types; prefer centralized definition

## Special Directories

**src/.next:**
- Purpose: Build output directory generated by Next.js
- Generated: Yes (created on `npm run build`)
- Committed: No (in .gitignore)

**playwright-report/ and test-results/:**
- Purpose: Playwright test execution reports and results
- Generated: Yes (created when running tests)
- Committed: No (in .gitignore)

**.planning/codebase/:**
- Purpose: Codebase analysis documents for GSD (this directory)
- Generated: No (manually written by analysis tools)
- Committed: Yes (part of git repo for planning)

**public/:**
- Purpose: Static assets served without processing
- Generated: No (committed source files)
- Committed: Yes

## Import Path Aliases

TypeScript path alias defined in `tsconfig.json`:
- `@/*` → `./src/*`

Usage examples:
- `import { BlogPost } from '@/lib/blog'`
- `import { FormField } from '@/components/ui/FormField'`
- `import { MembershipSchema } from '@/lib/schemas'`

This centralized alias simplifies imports and enables easy refactoring.

---

*Structure analysis: 2026-03-28*
