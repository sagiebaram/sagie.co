# Technology Stack

**Analysis Date:** 2026-04-04

## Languages

**Primary:**
- TypeScript 6.0.2 - Full codebase (source, tests, config)
- JSX/TSX - React components in `src/components/` and `src/app/`

**Secondary:**
- CSS - Global styles and Tailwind utilities in `src/app/globals.css`
- JSON - Configuration and type definitions

## Runtime

**Environment:**
- Node.js (version specified in package-lock.json via npm)
- Vercel Edge Runtime (via Next.js 16)

**Package Manager:**
- npm 10.x (inferred from package-lock.json)
- Lockfile: `package-lock.json` (present and up-to-date)

## Frameworks

**Core:**
- Next.js 16.2.1 - App Router framework, SSR, API routes, static generation
  - Config: `next.config.ts`
  - Integrates Sentry via `withSentryConfig()` wrapper
  - React Compiler enabled for performance (`reactCompiler: true`)

**UI & Styling:**
- React 19.2.4 - Component library and JSX
- TailwindCSS 4.2.2 - Utility-first CSS styling
- tailwind-merge 3.5.0 - Merge Tailwind class names intelligently
- Tailwind PostCSS plugin 4.2.2 - PostCSS integration

**Form Handling:**
- React Hook Form 7.72.0 - Lightweight form state management
- Zod 4.3.6 - Schema validation for forms and API input
- @hookform/resolvers 5.2.2 - Integrates Zod with React Hook Form

**Animation & Graphics:**
- GSAP 3.14.2 - Animation library (used via `src/lib/gsap.ts`)
- Motion 12.38.0 - Animation primitives
- Three.js 0.183.2 - 3D graphics library
- react-globe.gl 2.37.0 - Interactive 3D globe component

**UI Components & Utilities:**
- react-markdown 10.1.0 - Render markdown content
- clsx 2.1.1 - Conditional className utility
- next-themes 0.4.6 - Dark/light theme management
- nuqs 2.8.9 - URL state management with Next.js

**Localization & Phone:**
- libphonenumber-js 1.12.41 - Phone number validation and formatting
- react-phone-number-input 3.4.16 - Phone input component
- country-state-city 3.2.1 - Country/state/city location data

**Email:**
- @react-email/components 1.0.10 - Build email templates with React
- resend 6.9.4 - Email delivery service SDK

**Content & Data:**
- @notionhq/client 2.2.15 - Notion API client
- notion-to-md 3.1.9 - Convert Notion blocks to Markdown

**Monitoring & Analytics:**
- @sentry/nextjs 10.46.0 - Error tracking and performance monitoring
  - Config: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
  - Initialized with DSN from `NEXT_PUBLIC_SENTRY_DSN`
- @vercel/analytics 2.0.1 - Vercel Analytics SDK (privacy-friendly, cookie-free)
- @vercel/speed-insights 2.0.0 - Web Vitals monitoring via Vercel

**Build & Performance:**
- babel-plugin-react-compiler 1.0.0 - Automatic React component memoization
- server-only 0.0.1 - Ensure server code doesn't leak to client

## Testing

**Framework:**
- Vitest 4.1.2 - Unit testing framework
- @playwright/test 1.58.2 - E2E testing framework
- @vitest/coverage-v8 4.1.2 - Code coverage reporting

**Config Files:**
- `vitest.config.ts` - Test runner config
  - Test files: `src/**/*.test.ts`
  - Coverage targets: `src/lib/**/*.ts` (excludes Notion and GSAP integrations)
  - Environment: Node.js
  - Coverage provider: v8

- `playwright.config.ts` - E2E test configuration

## Key Dependencies

**Critical:**
- @notionhq/client - Notion API integration for CMS functionality
- resend - Email delivery (contact forms, applications, confirmations)
- zod - Type-safe schema validation for all form input
- react-hook-form - Form state management with minimal re-renders
- @sentry/nextjs - Error tracking and monitoring in production

**Infrastructure:**
- @vercel/analytics - Privacy-friendly analytics
- @vercel/speed-insights - Web performance monitoring
- next-themes - Theme management for dark/light modes
- nuqs - URL-based state management

**Location & Validation:**
- country-state-city - Data for cascading country/state/city fields
- libphonenumber-js - International phone number validation
- react-phone-number-input - Phone input UI component

**Content:**
- notion-to-md - Transform Notion database content to Markdown
- react-markdown - Render Markdown in React components
- @react-email/components - Email template components

## Configuration

**Environment:**
- Variables validated with Zod in `src/env/server.ts`
- Prefix: `NOTION_*`, `RESEND_*`, `BEEHIIV_*`, `SENTRY_*`, `NEXT_PUBLIC_*`
- Example config: `.env.example` (reference file, not actual secrets)

**Key Environment Variables:**
- `NOTION_TOKEN` - API auth for Notion
- `NOTION_*_DB_ID` - Database IDs (blog, resources, solutions, events, members, chapters, ventures)
- `RESEND_API_KEY` - Email service API key
- `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID` - Newsletter integration (optional)
- `NEXT_PUBLIC_SENTRY_DSN` - Client-side error tracking
- `REVALIDATE_SECRET` - Webhook authentication for ISR revalidation
- `ALLOWED_ORIGINS` - CORS-allowed domains (comma-separated)
- `ADMIN_EMAIL` - Alert recipient for form submissions

**TypeScript:**
- Target: ES2022
- Module: ESNext
- Strict mode enabled
- JSX: react-jsx
- Path aliases: `@/*` → `./src/*`
- `noImplicitOverride`, `exactOptionalPropertyTypes` enabled for safety
- Config file: `tsconfig.json`

**Build:**
- Next.js configuration in `next.config.ts`
- PostCSS for CSS processing: `postcss.config.mjs`
- ESLint configuration: `eslint.config.mjs`

## Platform Requirements

**Development:**
- Node.js (version from package-lock.json, likely LTS)
- npm 10.x
- macOS/Linux/Windows (cross-platform)

**Production:**
- Vercel (implied by `next.config.ts` and `.vercel/` directory)
- Serverless environment (Next.js App Router compatible)
- Environment variables configured in Vercel project settings

## Security Headers

**Configured in next.config.ts:**
- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-Content-Type-Options: nosniff` - Prevent MIME-type sniffing
- `Referrer-Policy: origin-when-cross-origin` - Control referrer info
- `Permissions-Policy` - Disable camera, microphone, geolocation
- API routes: `Cache-Control: no-store` - Prevent caching sensitive responses

---

*Stack analysis: 2026-04-04*
