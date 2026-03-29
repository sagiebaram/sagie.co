# sagie.co

## What This Is

The marketing and community platform for SAGIE — a global network for founders, investors, and tech professionals. The site showcases the community's pillars, hosts a blog, events calendar, solutions marketplace, and resource directory, all powered by Notion as a CMS. It handles intake for membership, chapter leadership, ventures, and solutions provider applications via custom forms with inline validation. Events support registration, calendar integration, and recap links.

## Core Value

Community members and prospective members can discover SAGIE's value, consume content, and apply to join — with every submission reliably reaching the team and every piece of content appearing promptly.

## Requirements

### Validated

- ✓ Homepage with hero, pillars, social proof, FAQ, CTA sections — v1.0
- ✓ Blog listing and detail pages with Notion CMS — v1.0
- ✓ Events listing page with filtering — v1.0
- ✓ Solutions marketplace with category filtering — v1.0
- ✓ Resources directory with filtering — v1.0
- ✓ Membership, chapter, ventures, and solutions application forms — v1.0
- ✓ Blog post and resource community submission forms — v1.0
- ✓ Event suggestion form — v1.0
- ✓ Notion as backend for all content and submissions — v1.0
- ✓ Sentry error tracking (client, server, edge) — v1.0
- ✓ Zod validation on all API routes — v1.0
- ✓ Honeypot + timing bot protection on forms — v1.0
- ✓ CSP and security headers with nonces — v1.0
- ✓ 3D globe visualization with live Notion data — v1.0
- ✓ GSAP scroll animations — v1.0
- ✓ GitHub Actions CI pipeline — v1.0
- ✓ Rate limiting on all API routes — v1.0
- ✓ CORS enforcement on API routes — v1.0
- ✓ Email notifications on form submissions — v1.0
- ✓ On-demand cache revalidation endpoint — v1.0
- ✓ Complete sitemap with dynamic content — v1.0
- ✓ Error and loading boundaries for all route segments — v1.0
- ✓ Vitest + Playwright test suites — v1.0
- ✓ URL-synced filters with nuqs (Blog, Solutions, Resources, Events) — v2.0
- ✓ Back/forward navigation rendering fix — v2.0
- ✓ Rate limit feedback (amber warning, Retry-After parsing) on all forms — v2.0
- ✓ Event action buttons: Register, More Info, Read Recap (data-driven) — v2.0
- ✓ Add to Calendar inline dropdown (Google, Outlook, Apple Calendar) — v2.0
- ✓ ICS API route for calendar downloads — v2.0
- ✓ react-hook-form with zodResolver, inline blur validation on all forms — v2.0
- ✓ Custom-styled dropdowns and checkbox groups matching dark theme — v2.0
- ✓ Form field audit: all schema fields rendered, data-loss bugs fixed — v2.0
- ✓ Admin revalidation page with per-button loading/success/failure states — v2.0
- ✓ Branded 404 page with circuit-board SVG illustration — v2.0

### Active

(None — next milestone not yet defined)

### Out of Scope

- Authentication / user accounts — not needed for a marketing site
- Real-time chat — high complexity, not core
- Mobile app — web-first
- CMS admin panel — Notion serves this role
- Payment processing — not part of current model
- Event "Notify me when confirmed" — deferred (EVT-06), requires email capture without accounts
- Multi-step form wizard — deferred (FORM-04)

## Context

- Next.js 16+ site deployed on Vercel (App Router)
- Notion is the sole backend — no database, no auth
- ~129 TypeScript files in src/
- 11,200+ lines of application code
- Vitest (127 unit tests) + Playwright (10 E2E tests), CI fully green
- react-hook-form + Zod for all 7 forms with inline validation
- nuqs for URL-synced filter state
- Resend + React Email for form submission notifications
- Codebase map available at `.planning/codebase/`

## Constraints

- **Backend**: Notion only — no separate database
- **Hosting**: Vercel
- **Framework**: Next.js App Router (established)
- **Styling**: Tailwind CSS + inline styles (mixed, both in use)
- **Budget**: Minimize external service dependencies

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Fix bugs before adding features | Broken forms were losing real user data | ✓ Good — data loss fixed in Phase 1 |
| Vitest for unit testing | Already referenced in CI, lightweight, Vite-native | ✓ Good — 127 tests, <1s runs |
| Keep Notion as sole backend | Already deeply integrated, team uses it daily | ✓ Good — no operational overhead |
| nuqs for filter URL params | Lightweight, replaceState, works with App Router | ✓ Good — shareable/bookmarkable filters |
| react-hook-form + zodResolver | Industry standard, reuses existing Zod schemas | ✓ Good — all 7 forms migrated |
| Custom dropdowns over native select | Dark theme consistency, keyboard nav, "Other" free-text | ✓ Good — cohesive form UX |
| Server-side ICS route over client Blob | User chose despite out-of-scope listing; simpler CSP story | ✓ Good — works reliably |
| Calendar helpers in separate calendar.ts | events.ts imports server-only; client components can't import it | ✓ Good — clean module boundary |

## Known Gaps

- Notion "Referral" property doesn't exist yet — form collects referral but API write is commented out
- SubmitPostForm `yourEmail` and `url` collected but not written to Notion blog DB
- Event Notion properties (Registration Link, More Info Link, Recap Link) may not exist yet — buttons won't appear until populated

---
*Last updated: 2026-03-29 after v2.0 milestone completed*
