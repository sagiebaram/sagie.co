# Technology Stack

**Analysis Date:** 2026-03-28

## Languages

**Primary:**
- TypeScript 6.x - All application code (`src/**/*.ts`, `src/**/*.tsx`)

**Secondary:**
- None - `allowJs: false` enforced in `tsconfig.json`

## Runtime

**Environment:**
- Node.js 22 (enforced in CI via `actions/setup-node@v4` with `node-version: 22`)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js ^16.2.1 - Full-stack React framework with App Router
  - React Compiler enabled (`reactCompiler: true` in `next.config.ts`)
  - Uses App Router with `(marketing)` route group layout
  - ISR (Incremental Static Regeneration) via `unstable_cache` and `revalidate` exports

**Animation:**
- GSAP ^3.14.2 - Scroll-triggered animations (used in marketing sections)
- Motion ^12.38.0 - React animation library (Framer Motion successor)

**3D / Visualization:**
- Three.js ^0.183.2 - 3D rendering
- react-globe.gl ^2.37.0 - Interactive globe component

**Build/Dev:**
- Tailwind CSS ^4.2.2 - Utility-first CSS (v4 with PostCSS plugin via `@tailwindcss/postcss`)
- PostCSS ^8 - CSS processing (`postcss.config.mjs`)
- TypeScript strict mode - `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns` all enabled

## Key Dependencies

**Critical:**
- `@notionhq/client` ^2.2.15 - Official Notion SDK; the sole data store for all content
- `notion-to-md` ^3.1.9 - Converts Notion page blocks to Markdown for blog post rendering
- `zod` ^4.3.6 - Runtime schema validation for all API routes (`src/lib/schemas.ts`, `src/lib/validation.ts`)
- `@sentry/nextjs` ^10.46.0 - Error monitoring across client, server, and edge runtimes

**UI Utilities:**
- `clsx` ^2.1.1 - Conditional class joining
- `tailwind-merge` ^3.5.0 - Merges Tailwind classes without conflicts
- `next-themes` ^0.4.6 - Dark/light theme switching
- `react-markdown` ^10.1.0 - Renders Markdown strings in blog post pages

**Other:**
- `dotenv` ^17.3.1 - Environment variable loading (dev only; production uses platform env)
- `@typeform/embed-react` ^5.0.0 - Typeform embed (package present; actual TypeformEmbed component deleted per git status)
- `babel-plugin-react-compiler` ^1.0.0 - Enables the React Compiler for the Next.js build

## Testing

**E2E:**
- `@playwright/test` ^1.58.2 - Browser end-to-end tests
  - Config: `playwright.config.ts`
  - Test directory: `./tests`
  - Triggered against Vercel preview deployments via `e2e-preview.yml`

**Unit:**
- Vitest (not in `package.json` but invoked as `npx vitest run` in CI `unit` job)
  - No `vitest.config.*` file detected; likely relies on defaults

## TypeScript Configuration

**Key settings in `tsconfig.json`:**
- `target`: ES2022
- `module`: ESNext, `moduleResolution`: bundler
- `strict`: true + `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, `exactOptionalPropertyTypes`
- Path alias: `@/*` → `./src/*`
- `isolatedModules`: true

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js config with Sentry wrapper, CSP headers, security headers |
| `tsconfig.json` | TypeScript compiler options |
| `postcss.config.mjs` | Tailwind CSS v4 PostCSS plugin |
| `playwright.config.ts` | Playwright E2E test configuration |
| `sentry.client.config.ts` | Sentry init for browser runtime |
| `sentry.server.config.ts` | Sentry init for Node.js server runtime |
| `sentry.edge.config.ts` | Sentry init for edge runtime |

## Environment

**Configuration approach:**
- All server-side env vars validated at startup with Zod schema in `src/env/server.ts`
- Uses `server-only` package to prevent accidental client-side import of secrets
- Public Sentry DSN exposed via `NEXT_PUBLIC_SENTRY_DSN`
- `.env` file not committed; `.env.example` present (not readable due to permissions)

**Required environment variables:**
- `NOTION_TOKEN` - Notion API authentication
- `NOTION_BLOG_DB_ID` - Blog posts database
- `NOTION_RESOURCES_DB_ID` - Resources database
- `NOTION_SOLUTIONS_DB_ID` - Solutions providers database
- `NOTION_EVENT_DB_ID` - Events database
- `NOTION_DEAL_PIPELINE_DB_ID` - Deal pipeline database
- `NOTION_MEMBER_DB_ID` - Members database
- `NOTION_VENTURES_INTAKE_DB_ID` - Ventures intake database
- `ALLOWED_ORIGINS` - Comma-separated CORS allowed origins
- `REVALIDATE_SECRET` - Secret for on-demand ISR revalidation webhooks
- `NODE_ENV` - Must be `development`, `test`, or `production`
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN (public, available client-side)

## Platform Requirements

**Development:**
- Node.js 22
- `npm install` then `npm run dev`
- All Notion database IDs and token must be set locally

**Production:**
- Deployed on Vercel (evidenced by `VERCEL_AUTOMATION_BYPASS_SECRET` usage and Vercel deployment status webhook)
- CI/CD via GitHub Actions (`.github/workflows/ci.yml`, `.github/workflows/e2e-preview.yml`)

---

*Stack analysis: 2026-03-28*
