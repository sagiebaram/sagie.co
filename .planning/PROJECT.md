# sagie.co

## What This Is

The marketing and community platform for SAGIE — a global network for founders, investors, and tech professionals. The site showcases the community's pillars, hosts a blog, events calendar, solutions marketplace, and resource directory, all powered by Notion as a CMS. It also handles intake for membership, chapter leadership, ventures, and solutions provider applications via custom forms.

## Core Value

Community members and prospective members can discover SAGIE's value, consume content, and apply to join — with every submission reliably reaching the team and every piece of content appearing promptly.

## Current Milestone: v2.0 Polish & Interactivity

**Goal:** Fix navigation/rendering bugs, make event pages interactive, redesign forms, and polish the admin and error experiences.

**Target features:**

- Fix filter state bug (Blog, Solutions, Resources)
- Fix page navigation rendering bug (back/forward)
- Rate limit feedback in forms
- Event action buttons (Register, Add to Calendar, More Info, Read Recap)
- Form redesign (fields + UX overhaul)
- Revalidation UI feedback (success/failure, key rotation fix)
- Custom 404 illustration

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

### Active

- [ ] Fix filter state bug — second filter selection wipes rendered components until refresh
- [ ] Fix navigation rendering bug — pages don't render on browser back/forward until refresh
- [ ] Add visible rate limit feedback in forms when 429 is returned
- [ ] Event action buttons: Register opens external event link
- [ ] Event action buttons: Add to Calendar modal with Google/Outlook/Apple Calendar + .ics download
- [ ] Event action buttons: More Info and Read Recap functional
- [ ] Form redesign — rethink fields collected and improve UX (dropdowns, checkboxes, inline validation)
- [ ] Revalidation admin UI — success/failure indication on refresh
- [ ] Revalidation admin UI — fix key rotation redirect behavior
- [ ] Custom 404 page with branded SVG/CSS illustration

### Out of Scope

- Authentication / user accounts — not needed for a marketing site
- Real-time chat — high complexity, not core
- Mobile app — web-first
- CMS admin panel — Notion serves this role
- Payment processing — not part of current model
- Event "Notify me when confirmed" — deferred, requires email capture without accounts

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
*Last updated: 2026-03-28 after milestone v2.0 started*
