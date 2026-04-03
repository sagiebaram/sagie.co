# Technology Stack

**Analysis Date:** 2026-03-30

## Languages

**Primary:**
- TypeScript 6.0.2 - Full codebase including frontend, backend, and server configuration
- TSX - React components and page files
- JavaScript (ESM) - Configuration files (next.config.ts, postcss.config.mjs, etc.)

## Runtime

**Environment:**
- Node.js (version specified by project, enforced via .vercel config)
- Next.js 16.2.1 - Full-stack React framework with App Router

**Package Manager:**
- npm - Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.2.1 - Full-stack framework with React 19.2.4, server/client components, API routes
- React 19.2.4 - UI library with hooks and server components support
- React DOM 19.2.4 - DOM rendering

**Testing:**
- Vitest 4.1.2 - Unit test runner configured in `vitest.config.ts`
- @vitest/coverage-v8 4.1.2 - Coverage reporting (v8 provider)
- @playwright/test 1.58.2 - E2E testing framework

**Build/Dev:**
- Babel React Compiler Plugin 1.0.0 - Enabled via `reactCompiler: true` in `next.config.ts`
- PostCSS 8 - CSS processing with Tailwind CSS integration
- Tailwind CSS 4.2.2 - Utility-first CSS framework via @tailwindcss/postcss 4.2.2
- ESLint 9.39.4 - Linting via eslint.config.mjs with Next.js config
- TypeScript 6.0.2 - Strict type checking with strict mode enabled

## Key Dependencies

**Critical:**
- @notionhq/client 2.2.15 - Notion API integration for multi-database content management
- resend 6.9.4 - Email delivery service (optional in non-production)
- @sentry/nextjs 10.46.0 - Error tracking and monitoring (client/server/edge)
- zod 4.3.6 - Runtime schema validation for environment variables and form data

**UI & Animation:**
- gsap 3.14.2 - Advanced animation library with ScrollTrigger and SplitText plugins
- motion 12.38.0 - Animation and motion library (secondary to GSAP)
- react-globe.gl 2.37.0 - 3D globe visualization component
- three 0.183.2 - 3D graphics library (dependency of react-globe.gl)

**Forms & Validation:**
- react-hook-form 7.72.0 - Lightweight form state management
- @hookform/resolvers 5.2.2 - Validation resolvers for react-hook-form
- clsx 2.1.1 - Conditional class name utility
- tailwind-merge 3.5.0 - Merge Tailwind CSS class names without conflicts

**Content Management:**
- notion-to-md 3.1.9 - Convert Notion blocks to Markdown
- react-markdown 10.1.0 - Render Markdown to React components
- @react-email/components 1.0.10 - Email component library for HTML emails

**Utilities:**
- next-themes 0.4.6 - Dark mode and theme management
- nuqs 2.8.9 - Next.js URL search params management (query strings)
- server-only 0.0.1 - Enforce server-only modules (development utility)

**Type Safety:**
- @types/react 19.2.14 - Type definitions for React
- @types/react-dom 19.2.3 - Type definitions for React DOM
- @types/node 25.5.0 - Type definitions for Node.js runtime

## Configuration

**Environment:**
- Server-side environment validation via `src/env/server.ts` using Zod
- Environment variables loaded from `.env.local` (development) and vercel secrets (production)
- Required variables:
  - `NOTION_TOKEN` - Notion API authentication
  - `NOTION_BLOG_DB_ID`, `NOTION_RESOURCES_DB_ID`, `NOTION_SOLUTIONS_DB_ID`, `NOTION_EVENT_DB_ID`, `NOTION_MEMBER_DB_ID`, `NOTION_CHAPTERS_DB_ID`, `NOTION_VENTURES_INTAKE_DB_ID` - Notion database identifiers
  - `ALLOWED_ORIGINS` - CORS-allowed origins (comma-separated)
  - `RESEND_API_KEY` - Email service API key (optional, production only)
  - `REVALIDATE_SECRET` - Cache revalidation endpoint security
  - `NODE_ENV` - Runtime environment (development/test/production)

**Build:**
- `next.config.ts` - Next.js configuration with:
  - React Compiler enabled for optimized rendering
  - Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
  - Cache-Control headers for API routes
  - Sentry integration via withSentryConfig wrapper
- `tsconfig.json` - Strict TypeScript configuration:
  - ES2022 target
  - Strict mode enabled
  - Path alias: `@/*` → `./src/*`
- `vitest.config.ts` - Test configuration:
  - Test glob: `src/**/*.test.ts`
  - Coverage provider: v8
  - Excluded from coverage: external integrations (notion, email, animations)
- `playwright.config.ts` - E2E test configuration:
  - Base URL: localhost:3000 (dev) or env var
  - Worker count: 1 in CI, auto otherwise

## Platform Requirements

**Development:**
- Node.js runtime
- `.env.local` file with Notion and optional Resend API keys
- npm dependencies installed

**Production:**
- Vercel deployment platform (configured in `.vercel/project.json`)
- Environment secrets stored in Vercel dashboard
- Sentry DSN configured via `NEXT_PUBLIC_SENTRY_DSN`
- Notion API access from server
- Resend API key for email delivery (optional but recommended)

---

*Stack analysis: 2026-03-30*
