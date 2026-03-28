# Technology Stack

**Analysis Date:** 2026-03-28

## Languages

**Primary:**
- TypeScript 6.x - All application code (strict mode enabled, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns`)

**Secondary:**
- None detected (no JavaScript source files; `allowJs: false` in tsconfig)

## Runtime

**Environment:**
- Node.js 22 (pinned in CI via `actions/setup-node@v4 node-version: 22`)

**Package Manager:**
- npm (no version pinned)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js ^16.2.1 - Full-stack React framework; App Router used throughout
- React ^19.2.4 - UI rendering
- React DOM ^19.2.4 - DOM bindings

**React Compiler:**
- `babel-plugin-react-compiler` ^1.0.0 - Enabled via `reactCompiler: true` in `next.config.ts`

**Testing:**
- Playwright ^1.58.2 - E2E / smoke tests; config at `playwright.config.ts`; tests in `tests/`
- Vitest - Unit tests (referenced in CI `unit` job as `npx vitest run`; no config file detected yet)

**Build/Dev:**
- TypeScript compiler (`tsc --noEmit`) for type-checking
- PostCSS ^8 with `@tailwindcss/postcss` plugin - CSS processing
- Tailwind CSS ^4.2.2 - Utility-first CSS; config via `postcss.config.mjs`
- `@sentry/nextjs` ^10.46.0 wrapped via `withSentryConfig` in `next.config.ts`

## Key Dependencies

**Critical:**
- `@notionhq/client` ^2.2.15 - Notion API SDK; sole database/CMS client
- `notion-to-md` ^3.1.9 - Converts Notion page blocks to Markdown for blog post rendering
- `zod` ^4.3.6 - Runtime schema validation for all API route inputs; also used to validate `process.env` at startup via `src/env/server.ts`
- `@sentry/nextjs` ^10.46.0 - Error monitoring and performance tracing; configured across client, server, and edge runtimes

**UI / Animation:**
- `gsap` ^3.14.2 - GSAP animations (used in marketing sections, e.g. FounderBridge)
- `motion` ^12.38.0 - Motion/Framer Motion animations
- `react-globe.gl` ^2.37.0 - 3D globe visualization component
- `three` ^0.183.2 - WebGL/3D engine (peer dependency of react-globe.gl)
- `next-themes` ^0.4.6 - Dark/light theme management
- `clsx` ^2.1.1 + `tailwind-merge` ^3.5.0 - Conditional className utilities

**Content Rendering:**
- `react-markdown` ^10.1.0 - Renders Markdown strings (blog posts converted via notion-to-md)

**Utilities:**
- `dotenv` ^17.3.1 - Loads `.env` files in local development
- `server-only` ^0.0.1 - Prevents accidental import of server modules in client bundles

**Deprecated / Unused:**
- `@typeform/embed-react` ^5.0.0 - Listed in `package.json` but the `TypeformEmbed.tsx` component was deleted; likely safe to remove

## Configuration

**Environment:**
- All environment variables are validated at startup through `src/env/server.ts` using a Zod schema
- Public variable: `NEXT_PUBLIC_SENTRY_DSN` (exposed to browser via Next.js convention)
- Server-only variables (see `src/env/server.ts`):
  - `NOTION_TOKEN`
  - `NOTION_BLOG_DB_ID`
  - `NOTION_RESOURCES_DB_ID`
  - `NOTION_SOLUTIONS_DB_ID`
  - `NOTION_EVENT_DB_ID`
  - `NOTION_DEAL_PIPELINE_DB_ID`
  - `NOTION_MEMBER_DB_ID`
  - `NOTION_VENTURES_INTAKE_DB_ID`
  - `ALLOWED_ORIGINS`
  - `REVALIDATE_SECRET`
  - `NODE_ENV`
- `.env.example` present at project root (contents not read)

**TypeScript:**
- Target: ES2022
- Module resolution: `bundler`
- Path alias: `@/*` → `./src/*`
- Strict settings: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, `exactOptionalPropertyTypes`
- Playwright config excluded from main tsconfig

**Build:**
- `next.config.ts` - CSP headers, security headers, Sentry integration
- `postcss.config.mjs` - Tailwind PostCSS plugin
- `tsconfig.json` - TypeScript compiler options
- `sentry.client.config.ts` - Sentry browser init (session replays enabled)
- `sentry.server.config.ts` - Sentry server init
- `sentry.edge.config.ts` - Sentry edge runtime init

## Platform Requirements

**Development:**
- Node.js 22+
- npm (use `npm install`)
- Dev server: `npm run dev` → `next dev` on port 3000

**Production:**
- `npm run build` → `next build`
- `npm run start` → `next start`
- Deployed to a platform that supports Vercel-style deployment status webhooks (CI uses `deployment_status` event to trigger E2E tests against preview URLs)

---

*Stack analysis: 2026-03-28*
