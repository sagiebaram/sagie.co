# Technology Stack

**Analysis Date:** 2026-03-28

## Languages

**Primary:**
- TypeScript 6.0.2 - All application code, configuration, and tests
- JSX/TSX - React components and page files

**Secondary:**
- JavaScript (mjs) - PostCSS configuration (`postcss.config.mjs`)

## Runtime

**Environment:**
- Node.js (version not specified in lockfile constraints - determined by deployment platform)

**Package Manager:**
- npm (lockfile: `package-lock.json` present)

## Frameworks

**Core:**
- Next.js 16.2.1 - Full-stack React framework, API routes, server components
- React 19.2.4 - UI library and component system
- React DOM 19.2.4 - DOM rendering

**Styling:**
- Tailwind CSS 4.2.2 - Utility-first CSS framework
- PostCSS 8 - CSS transformation pipeline
- @tailwindcss/postcss 4.2.2 - Tailwind CSS v4 plugin

**Animation/Interaction:**
- GSAP 3.14.2 - Advanced animation library (`src/lib/gsap.ts`)
- Motion 12.38.0 - Animation primitives library
- react-globe.gl 2.37.0 - 3D globe visualization component
- three 0.183.2 - 3D graphics library (dependency of react-globe.gl)

**Content & Rendering:**
- react-markdown 10.1.0 - Markdown to React component rendering
- notion-to-md 3.1.9 - Convert Notion blocks to markdown
- @react-email/components 1.0.10 - Email template components

**Utilities:**
- clsx 2.1.1 - Conditional CSS class builder
- tailwind-merge 3.5.0 - Merge Tailwind CSS classes intelligently
- zod 4.3.6 - TypeScript-first schema validation and parsing
- next-themes 0.4.6 - Dark mode management

**Build/Compilation:**
- babel-plugin-react-compiler 1.0.0 - React Compiler for automatic memoization

## Testing

**Test Runner:**
- Vitest 4.1.2 - Fast unit test framework (`vitest.config.ts`)
- @vitest/coverage-v8 4.1.2 - Code coverage using V8 provider

**E2E Testing:**
- @playwright/test 1.58.2 - Browser automation and E2E testing

**Test Configuration:**
- Tests run in Node environment with globals enabled
- Coverage includes `src/lib/**/*.ts` (excludes Notion, GSAP integrations)
- Test files pattern: `src/**/*.test.ts`

## Error Tracking & Monitoring

**Error Tracking:**
- @sentry/nextjs 10.46.0 - Error tracking and performance monitoring
- Configuration files: `sentry.server.config.ts`, `sentry.client.config.ts`, `sentry.edge.config.ts`
- Integrated in Next.js config via `withSentryConfig` wrapper

## Key Dependencies

**Critical - External Services:**
- @notionhq/client 2.2.15 - Notion database client for CRUD operations
- resend 6.9.4 - Email service provider (confirmed optional in env schema)

**Data Validation:**
- zod 4.3.6 - Schema validation on all API routes via `src/lib/validation.ts`

**Server-Side Only:**
- server-only 0.0.1 - Enforces server-only code at build time

**Type Definitions:**
- @types/node 25.5.0 - Node.js type definitions
- @types/react 19.2.14 - React type definitions
- @types/react-dom 19.2.3 - React DOM type definitions

## Configuration

**TypeScript:**
- Target: ES2022
- Strict mode enabled with additional checks:
  - `noUncheckedIndexedAccess: true`
  - `noImplicitOverride: true`
  - `noImplicitReturns: true`
  - `exactOptionalPropertyTypes: true`
- Path alias: `@/*` → `src/*`

**Next.js:**
- React Compiler enabled (`reactCompiler: true`)
- Security headers configured for all routes
- Cache-Control headers for `/api/*` routes
- Sentry integration enabled via `withSentryConfig`

**Build Output:**
- Location: `.next/` directory (git-ignored)

## Environment Configuration

**Required Environment Variables:**
- `NOTION_TOKEN` - Notion API authentication token
- `NOTION_BLOG_DB_ID` - Notion database ID for blog posts
- `NOTION_RESOURCES_DB_ID` - Notion database ID for resources
- `NOTION_SOLUTIONS_DB_ID` - Notion database ID for solutions
- `NOTION_EVENT_DB_ID` - Notion database ID for event suggestions
- `NOTION_MEMBER_DB_ID` - Notion database ID for members
- `NOTION_VENTURES_INTAKE_DB_ID` - Notion database ID for venture intakes
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins
- `NODE_ENV` - Environment: `development`, `test`, or `production`

**Optional Environment Variables:**
- `NOTION_DEAL_PIPELINE_DB_ID` - Notion database ID for deals
- `NOTION_CHAPTERS_DB_ID` - Notion database ID for chapters
- `REVALIDATE_SECRET` - Secret token for `/api/revalidate` endpoint
- `RESEND_API_KEY` - Resend email service API key
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry Data Source Name (public, for client-side)
- `PLAYWRIGHT_TEST_BASE_URL` - E2E test base URL (defaults to `http://localhost:3000`)
- `VERCEL_AUTOMATION_BYPASS_SECRET` - Vercel protection bypass token

**Secrets Location:**
- Environment variables provided at deployment/runtime
- No `.env` file pattern committed to repository

## Platform Requirements

**Development:**
- Node.js (version unspecified - recommend checking `.npmrc` or deployment docs)
- npm for dependency management

**Production:**
- Deployed on Vercel (inferred from Sentry config organization "sagie" and `VERCEL_AUTOMATION_BYPASS_SECRET`)
- Sentry project: `sagie-co`

## Testing Commands

```bash
npm test              # Run unit tests
npm run test:watch   # Watch mode for unit tests
npm run test:coverage # Generate coverage report
```

## Development Commands

```bash
npm run dev   # Start development server (http://localhost:3000)
npm run build # Production build
npm start     # Start production server
npm run lint  # Run Next.js linting
```

---

*Stack analysis: 2026-03-28*
