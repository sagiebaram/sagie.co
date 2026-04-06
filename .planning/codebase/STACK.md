# Technology Stack

**Analysis Date:** 2026-04-05

## Languages

**Primary:**
- TypeScript 6.0.2 - All source code (`src/**/*.ts`, `src/**/*.tsx`)

**Secondary:**
- JavaScript - Configuration files (Next.js, ESLint, PostCSS configs)
- CSS - Styling with Tailwind (see INTEGRATIONS.md)

## Runtime

**Environment:**
- Node.js (LTS, version not pinned in package.json)

**Package Manager:**
- npm with package-lock.json (lockfileVersion 3)
- Lockfile: Present at `package-lock.json`

## Frameworks

**Core:**
- Next.js 16.2.1 - Full-stack React framework with App Router (`src/app/`)
- React 19.2.4 - UI library
- React DOM 19.2.4 - DOM rendering

**UI & Animation:**
- GSAP 3.14.2 - Animation library (`src/lib/gsap.ts`)
  - ScrollTrigger plugin - Scroll-driven animations (parallax, reveals)
  - SplitText plugin - Per-character/word text animations
- Motion 12.38.0 - Animation framework
- Tailwind CSS 4.2.2 - Utility-first CSS framework (`postcss.config.mjs`)
- @tailwindcss/postcss 4.2.2 - PostCSS plugin for Tailwind (CSS-based config, no tailwind.config.ts)
- View Transition API - Browser-native page transition animations (`src/components/ui/TransitionLink.tsx`, `src/app/globals.css`)

**Form Handling:**
- React Hook Form 7.72.0 - Form state management
- @hookform/resolvers 5.2.2 - Schema validation resolvers

**Testing:**
- Vitest 4.1.2 - Unit test framework (`vitest.config.ts`)
  - @vitest/coverage-v8 4.1.2 - Code coverage with V8
- @playwright/test 1.58.2 - E2E testing (`playwright.config.ts`)

**Build/Dev:**
- TypeScript 6.0.2 - Type checking and compilation
- ESLint 9.39.4 - Code linting
- eslint-config-next 16.2.1 - Next.js ESLint rules
- @eslint/js 9.39.4 - JavaScript linting rules
- PostCSS 8 - CSS transformation
- Babel Plugin React Compiler 1.0.0 - React compiler optimization

## Key Dependencies

**Critical:**
- @notionhq/client 2.2.15 - Notion API client (`src/lib/notion.ts`)
- notion-to-md 3.1.9 - Convert Notion pages to Markdown (`src/lib/blog.ts`)
- Resend 6.9.4 - Email delivery service (`src/lib/email.ts`)
- Zod 4.3.6 - Schema validation (`src/lib/schemas.ts`, `src/env/server.ts`)

**Infrastructure & Monitoring:**
- @sentry/nextjs 10.46.0 - Error tracking and monitoring (`src/lib/email.ts`, `src/lib/notion-monitor.ts`)
- @vercel/analytics 2.0.1 - Analytics (`src/app/layout.tsx`)
- @vercel/speed-insights 2.0.0 - Performance monitoring (`src/app/layout.tsx`)

**UI & UX:**
- nuqs 2.8.9 - URL state management with Next.js
- next-themes 0.4.6 - Theme management
- clsx 2.1.1 - Conditional classname utility
- tailwind-merge 3.5.0 - Tailwind class merging
- react-markdown 10.1.0 - Markdown rendering
- @react-email/components 1.0.10 - Email component library

**Utilities:**
- country-state-city 3.2.1 - Geographical data
- libphonenumber-js 1.12.41 - Phone number parsing
- react-phone-number-input 3.4.16 - Phone input UI
- three 0.183.2 - 3D graphics library
- react-globe.gl 2.37.0 - Interactive globe component

**Development Only:**
- server-only 0.0.1 - Marks code for server-side execution only

## Configuration

**Environment:**
- Zod schema validation in `src/env/server.ts`
- Required env vars:
  - `NOTION_TOKEN` - Notion API authentication
  - `NOTION_BLOG_DB_ID` - Blog database ID
  - `NOTION_RESOURCES_DB_ID` - Resources database ID
  - `NOTION_SOLUTIONS_DB_ID` - Solutions database ID
  - `NOTION_EVENT_DB_ID` - Events database ID
  - `NOTION_MEMBER_DB_ID` - Members database ID
  - `NOTION_VENTURES_INTAKE_DB_ID` - Ventures intake database ID
  - `NOTION_CHAPTERS_DB_ID` - Chapters database ID (optional)
  - `NOTION_DEAL_PIPELINE_DB_ID` - Deal pipeline database ID (optional)
  - `ALLOWED_ORIGINS` - CORS origins (comma-separated)
  - `REVALIDATE_SECRET` - ISR revalidation secret (optional)
  - `RESEND_API_KEY` - Resend email service (optional)
  - `ADMIN_EMAIL` - Admin notification email (default: hello@sagie.co)
  - `BEEHIIV_API_KEY` - Beehiiv newsletter API (optional)
  - `BEEHIIV_PUBLICATION_ID` - Beehiiv publication ID (optional)
  - `NODE_ENV` - Enum: development, test, production

**Build:**
- `tsconfig.json`:
  - Target: ES2022
  - Strict mode enabled
  - Path aliases: `@/*` maps to `./src/*`
  - React JSX mode
  - Strict compiler options: noUncheckedIndexedAccess, noImplicitOverride, exactOptionalPropertyTypes
- `next.config.ts`:
  - React Compiler enabled (`reactCompiler: true`)
  - Security headers configured (X-Frame-Options, X-Content-Type-Options, Permissions-Policy)
  - Cache control for API routes
  - Sentry integration with org "sagie", project "sagie-co"
- `postcss.config.mjs` - Tailwind PostCSS plugin
- `eslint.config.mjs` - ESLint extends Next.js config
- `vitest.config.ts`:
  - Test environment: node
  - Include: `src/**/*.test.ts`
  - Coverage provider: V8
  - Coverage includes: `src/lib/**/*.ts` (excludes: notion.ts, notion-monitor.ts, gsap.ts)
- `playwright.config.ts`:
  - Test directory: `tests/`
  - Base URL: http://localhost:3000 (configurable via PLAYWRIGHT_TEST_BASE_URL)
  - Vercel protection bypass support via environment variable

## Platform Requirements

**Development:**
- Node.js LTS
- npm (lockfileVersion 3)

**Production:**
- Deployment: Vercel (Next.js native)
- Runtime: Node.js LTS
- Environment: Serverless (Next.js default on Vercel)

---

*Stack analysis: 2026-04-05*
