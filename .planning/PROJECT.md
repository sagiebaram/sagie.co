# sagie.co

## What This Is

The marketing and community platform for SAGIE — a global network for founders, investors, and tech professionals. The site showcases the community's pillars, hosts a blog, events calendar, solutions marketplace, and resource directory, all powered by Notion as a CMS. It also handles intake for membership, chapter leadership, ventures, and solutions provider applications via custom forms.

## Core Value

Community members and prospective members can discover SAGIE's value, consume content, and apply to join — with every submission reliably reaching the team and every piece of content appearing promptly.

## Requirements

### Validated

- ✓ Homepage with hero, pillars, social proof, FAQ, CTA sections — existing
- ✓ Blog listing and detail pages with Notion CMS — existing
- ✓ Events listing page with filtering — existing
- ✓ Solutions marketplace with category filtering — existing
- ✓ Resources directory with filtering — existing
- ✓ Membership, chapter, ventures, and solutions application forms — existing
- ✓ Blog post and resource community submission forms — existing
- ✓ Event suggestion form — existing
- ✓ Notion as backend for all content and submissions — existing
- ✓ Sentry error tracking (client, server, edge) — existing
- ✓ Zod validation on all API routes — existing
- ✓ Honeypot + timing bot protection on forms — existing
- ✓ CSP and security headers — existing
- ✓ 3D globe visualization on social proof section — existing
- ✓ GSAP scroll animations — existing
- ✓ GitHub Actions CI pipeline — existing

### Active

- [ ] Fix form/schema field mismatches (ChapterForm, MembershipForm data silently dropped)
- [ ] Remove dead code: orphaned mock data, unused dependencies (@typeform/embed-react, dotenv)
- [ ] Remove duplicate type definitions (SolutionProvider, BlogPost)
- [ ] Fix unused env vars crashing startup (NOTION_DEAL_PIPELINE_DB_ID, REVALIDATE_SECRET)
- [ ] Add rate limiting on all 7 API routes
- [ ] Enforce CORS using allowedOrigins on API routes
- [ ] Replace CSP unsafe-inline with nonces
- [ ] Build /api/revalidate endpoint for on-demand cache invalidation
- [ ] Add email notifications on form submissions (applicant confirmation + admin alert)
- [ ] Build complete sitemap covering all routes and dynamic content
- [ ] Add error.tsx and loading.tsx boundaries for all route segments
- [ ] Connect globe to real membership data from Notion
- [ ] Bundle GeoJSON locally instead of fetching from GitHub at runtime
- [ ] Fix globe initGlobe infinite setTimeout loop (add cleanup/max retries)
- [ ] Lower Sentry tracesSampleRate in production
- [ ] Add unit tests for lib data-fetching functions
- [ ] Add unit tests for Zod schemas and withValidation middleware
- [ ] Add E2E tests for form submissions and content pages
- [ ] Add Vitest as unit test framework (referenced in CI but not installed)

### Out of Scope

- Authentication / user accounts — not needed for a marketing site
- Real-time chat — high complexity, not core
- Mobile app — web-first
- CMS admin panel — Notion serves this role
- Payment processing — not part of current model

## Context

- Brownfield Next.js 15+ site deployed on Vercel
- Notion is the sole backend — no database, no auth
- ~89 TypeScript files, well-organized App Router structure
- Codebase map available at `.planning/codebase/`
- CI exists but unit test step will fail (Vitest not installed)
- All forms work end-to-end but some silently drop fields due to schema mismatches

## Constraints

- **Backend**: Notion only — no separate database
- **Hosting**: Vercel
- **Framework**: Next.js App Router (already established)
- **Styling**: Tailwind CSS + inline styles (mixed, both in use)
- **Budget**: Minimize external service dependencies

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Fix bugs before adding features | Broken forms are losing real user data now | — Pending |
| Vitest for unit testing | Already referenced in CI, lightweight, Vite-native | — Pending |
| Keep Notion as sole backend | Already deeply integrated, team uses it daily | — Pending |

---
*Last updated: 2026-03-28 after initialization*
