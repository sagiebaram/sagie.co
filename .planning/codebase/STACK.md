# Technology Stack

**Analysis Date:** 2026-03-28

## Languages

**Primary:**
- TypeScript 6.0.2 - All source code, type-safe application development
- JSX/TSX - React component development

**Secondary:**
- JavaScript - Configuration files (postcss.config.mjs, next.config.ts)

## Runtime

**Environment:**
- Node.js (version not explicitly specified in package.json)

**Package Manager:**
- npm - Primary package manager
- Lockfile: `package-lock.json` - Present and up to date (142993 bytes)

## Frameworks

**Core:**
- Next.js 16.2.1 - Full-stack React framework with App Router
- React 19.2.4 - UI library
- React DOM 19.2.4 - DOM rendering for React

**Animation & Visual:**
- GSAP 3.14.2 - Advanced animation library for scroll-triggered animations and motion effects
- Motion 12.38.0 - Motion animation library
- Three.js 0.183.2 - 3D graphics library (used for interactive visualizations)
- React Globe.gl 2.37.0 - Geospatial visualization component

**Styling & UI:**
- Tailwind CSS 4.2.2 - Utility-first CSS framework
- @tailwindcss/postcss 4.2.2 - PostCSS integration for Tailwind
- Tailwind Merge 3.5.0 - Merge Tailwind class names intelligently
- clsx 2.1.1 - Conditional className utility

**Theming:**
- next-themes 0.4.6 - Dark/light mode theme management

**Markdown & Content:**
- React Markdown 10.1.0 - Markdown to React component rendering
- notion-to-md 3.1.9 - Convert Notion blocks to Markdown

**Optimizations:**
- babel-plugin-react-compiler 1.0.0 - React compiler Babel plugin for optimization

**Testing:**
- Not detected in dependencies

## Key Dependencies

**Critical:**
- @notionhq/client 2.2.15 - Official Notion API client; core integration for data management
- next 16.2.1 - Framework for server and client rendering; production build/deployment
- react 19.2.4 - Component rendering; entire UI foundation
- @tailwindcss/postcss 4.2.2 - CSS framework; styling foundation

**Infrastructure:**
- dotenv 17.3.1 - Environment variable loading from `.env.local`
- @typeform/embed-react 5.0.0 - Deprecated; Typeform embed (being replaced with custom forms)

**Development:**
- @types/node 25.5.0 - Node.js type definitions
- @types/react 19.2.14 - React type definitions
- @types/react-dom 19.2.3 - React DOM type definitions
- typescript 6.0.2 - TypeScript compiler

## Configuration

**Environment:**
- `.env.local` file present (1599 bytes) - Contains runtime configuration
- Configuration via environment variables for Notion database IDs and API tokens
- Key environment variables required:
  - `NOTION_TOKEN` - Notion API authentication token
  - `NOTION_BLOG_DB_ID` - Blog posts database ID
  - `NOTION_RESOURCES_DB_ID` - Resources database ID
  - `NOTION_SOLUTIONS_DB_ID` - Solutions providers database ID
  - `NOTION_EVENT_DB_ID` - Events database ID
  - `NOTION_DEAL_PIPELINE_DB_ID` - Ventures/deal pipeline database ID

**Build:**
- `next.config.ts` - Next.js configuration enabling React compiler
- `tsconfig.json` - TypeScript compiler configuration with strict mode enabled
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS

## TypeScript Configuration

**Target:** ES2022
**Module Resolution:** bundler
**Strict Mode:** Enabled
- noImplicitOverride: true
- noImplicitReturns: true
- exactOptionalPropertyTypes: true
- noUncheckedIndexedAccess: true

**Path Aliases:**
- `@/*` → `./src/*`

## Platform Requirements

**Development:**
- Node.js environment
- npm/node package manager
- TypeScript 6.0.2 compiler
- Modern browser supporting ES2022

**Production:**
- Node.js runtime (supports `npm start` via Next.js server)
- Environment variables configured for Notion API access

---

*Stack analysis: 2026-03-28*
