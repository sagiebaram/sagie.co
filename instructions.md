# sagie.co Dev — Co-work Project

## What this is
Development operations layer for sagie.co.
Scope: SAGIE HQ. Folder: ~/SAGIE-HQ/sagie.co/
Live at: https://sagie.co
Phase 1 complete. Phase 2 in progress.

---

## Stack

Languages: TypeScript 6.0.2 (strict mode), TSX, JavaScript (ESM for config)
Runtime: Node.js + Next.js 16.2.1 (App Router)
Package manager: npm (lockfile: package-lock.json)

Core frameworks:
  Next.js 16.2.1 — full-stack, React 19.2.4, server/client components
  React 19.2.4 + React DOM 19.2.4
  Babel React Compiler Plugin 1.0.0 (reactCompiler: true in next.config.ts)
  Tailwind CSS 4.2.2 (@tailwindcss/postcss 4.2.2)
  ESLint 9.39.4 (eslint.config.mjs, flat config)
  TypeScript 6.0.2 (strict, ES2022 target, @/* → ./src/*)

Testing:
  Vitest 4.1.2 + @vitest/coverage-v8 4.1.2
  @playwright/test 1.58.2

Critical dependencies:
  @notionhq/client 2.2.15 — Notion API (primary data backend)
  resend 6.9.4 — email delivery (production only)
  @sentry/nextjs 10.46.0 — error tracking (client + server + edge)
  zod 4.3.6 — runtime schema validation

UI & Animation:
  gsap 3.14.2 — primary animations (ScrollTrigger, SplitText plugins)
  motion 12.38.0 — secondary animation
  react-globe.gl 2.37.0 — 3D globe visualization
  three 0.183.2 — 3D graphics (dependency of react-globe.gl)

Forms & Validation:
  react-hook-form 7.72.0 — form state management
  @hookform/resolvers 5.2.2 — Zod integration
  clsx 2.1.1 — conditional class names
  tailwind-merge 3.5.0 — merge Tailwind classes

Content & Utilities:
  notion-to-md 3.1.9 — Notion blocks to Markdown (blog rendering)
  react-markdown 10.1.0 — Markdown to React
  @react-email/components 1.0.10 — email templates
  next-themes 0.4.6 — dark mode
  nuqs 2.8.9 — URL search params (filters on blog, events, resources)
  server-only 0.0.1 — enforce server-only modules

Deployment:
  Vercel (projectId: prj_fTQQAZhN7twm93BvnWfUbEbFIPCW)
  GitHub + GitHub Actions (CI/CD)

---

## Architecture

Pattern: Next.js App Router, Client-Server, Hybrid SSR

Layers:
  Presentation:    src/components/ and src/app/
  Business Logic:  src/lib/ (Notion queries, email, validation, calendar)
  API Routes:      src/app/api/ (form submissions, revalidation)
  Data/Config:     src/types/, src/constants/, src/env/

Key abstractions:
  withValidation HOF — wraps all API route handlers
    Provides: IP rate limiting (5/10min), honeypot detection,
    form load time check (>3s), Zod schema validation
    File: src/lib/validation.ts
  sendEmails() — centralized email, takes FormType enum
    File: src/lib/email.ts
  unstable_cache — wraps all Notion data fetchers with TTL 300s–3600s
    Cache tags: notion:blog, notion:events, notion:resources,
    notion:solutions, notion:members, notion:chapters
  GSAPCleanup component — handles GSAP animation cleanup on unmount
    Must be used whenever GSAP is initialized to prevent memory leaks

Data flows:
  Form: client Zod validation → POST /api/applications/{type}
        → withValidation (rate limit + honeypot + server Zod)
        → notion.pages.create() → sendEmails() (non-blocking)
  Content: unstable_cache → notion.databases.query() → mapper → ISR
  Revalidation: POST /api/revalidate + REVALIDATE_SECRET
                → revalidateTag() → cache cleared

State:
  Server: Notion databases (single source of truth)
  Form: React Hook Form + Zod schemas from @/lib/schemas.ts
  URL: nuqs (filters on blog, events, resources pages)
  Animation: GSAP direct control + GSAPCleanup component
  Cache: Next.js tag-based invalidation

Error handling:
  Client form errors: React Hook Form inline messages
  API validation: 422 with field-level error details
  API rate limiting: 429 with Retry-After header
  Notion failures: try-catch → 500 → Sentry
  Email failures: non-blocking, captured by Sentry, user sees success
  Content fetch failures: graceful fallbacks (empty arrays, null, defaults)
  Spam detection: honeypot failures silently return 200 (fool bots)
  Error boundaries: component-level failures

Security headers (next.config.ts):
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: origin-when-cross-origin
  Permissions-Policy: disabled camera, microphone, geolocation
  Cache-Control: no-store on API routes

No auth provider — secret-based admin (REVALIDATE_SECRET), all public routes.

---

## Structure

sagie.co/
├── src/
│   ├── app/
│   │   ├── (marketing)/          — public pages (route group, no URL segment)
│   │   │   ├── page.tsx          — homepage
│   │   │   ├── layout.tsx        — root layout (Navbar + Footer)
│   │   │   ├── not-found.tsx     — 404 page (EXISTS — do not recreate)
│   │   │   ├── sitemap.ts        — dynamic sitemap generation
│   │   │   ├── error.tsx         — per-route error state
│   │   │   ├── loading.tsx       — per-route loading state
│   │   │   ├── events/           — events listing
│   │   │   ├── blog/             — blog listing + [slug] detail
│   │   │   ├── resources/        — resources directory
│   │   │   ├── solutions/        — solutions page
│   │   │   ├── apply/            — general + chapter + solutions + ventures (fork → founder/investor)
│   │   │   └── suggest-event/    — event suggestion form
│   │   ├── admin/
│   │   │   └── revalidate/       — cache invalidation dashboard
│   │   └── api/
│   │       ├── revalidate/       — POST cache invalidation webhook
│   │       ├── submit-post/      — blog post submission
│   │       ├── submit-resource/  — resource submission
│   │       ├── suggest-event/    — event suggestion
│   │       └── applications/
│   │           ├── membership/   — membership application
│   │           ├── chapter/      — chapter lead application
│   │           ├── solutions/    — solutions provider application
│   │           └── ventures/     — ventures intake
│   ├── components/
│   │   ├── forms/                — one per application type
│   │   │   MembershipForm, ChapterForm, SolutionsForm,
│   │   │   VenturesForm, SuggestEventForm, SubmitPostForm
│   │   ├── layout/               — Navbar, Footer
│   │   ├── mdx/                  — MDX/blog content rendering
│   │   ├── sections/             — homepage sections
│   │   │   Order: Hero → SocialProof → Pillars → WhoItsFor →
│   │   │   Belief → FounderBridge → Tiers → ChapterMap → FAQ → FinalCTA
│   │   ├── ui/                   — reusable primitives
│   │   │   Button, Section, Eyebrow, FormField, ScrollReveal,
│   │   │   AnimatedSection, CircuitBackground, GridBackground,
│   │   │   Skeleton, ErrorPage, Logo
│   │   ├── GlobeClient.tsx       — 3D globe (client component)
│   │   ├── GlobeNetwork.tsx      — globe network data/arcs
│   │   └── GlobeShell.tsx        — globe wrapper with loading state
│   ├── lib/
│   │   ├── __tests__/            — unit tests
│   │   ├── notion.ts             — Notion API client
│   │   ├── notion-monitor.ts     — Notion write failure tracking (Sentry)
│   │   ├── schemas.ts            — Zod validation schemas (shared client+server)
│   │   ├── validation.ts         — withValidation HOF middleware
│   │   ├── email.ts              — sendEmails() via Resend
│   │   ├── blog.ts               — blog data fetching/transformation
│   │   ├── events.ts             — events data fetching/transformation
│   │   ├── members.ts            — members data operations
│   │   ├── chapters.ts           — chapters data operations
│   │   ├── resources.ts          — resources data operations
│   │   ├── solutions.ts          — solutions data operations
│   │   ├── calendar.ts           — Google Calendar integration
│   │   ├── gsap.ts               — GSAP animation utilities
│   │   └── utils.ts              — cn(), formatDate(), general utilities
│   ├── types/
│   │   ├── index.ts              — shared TypeScript interfaces
│   │   └── events.ts             — event-specific types
│   ├── hooks/
│   │   └── useScrollReveal.ts    — scroll-triggered reveal animation
│   ├── emails/
│   │   ├── ConfirmationEmail.tsx — user confirmation (React Email)
│   │   └── AdminAlertEmail.tsx   — admin notification (React Email)
│   ├── constants/
│   │   copy.ts, faq.ts, personas.ts, pillars.ts,
│   │   solutions.ts, tiers.ts, blog.ts
│   └── env/
│       └── server.ts             — Zod server-side env validation
├── tests/                        — Playwright E2E (tests/*.spec.ts)
├── public/                       — static assets
├── .planning/                    — GSD planning documents
├── .env.example                  — env var template (committed to repo)
├── sentry.client.config.ts
├── sentry.server.config.ts
└── sentry.edge.config.ts

---

## Where to add new code

New page:          src/app/(marketing)/route-name/page.tsx
API endpoint:      src/app/api/endpoint-name/route.ts
Reusable UI:       src/components/ui/ComponentName.tsx
Page section:      src/components/sections/SectionName.tsx
Form component:    src/components/forms/FormName.tsx
Data fetching:     src/lib/domain-name.ts
Types:             src/types/index.ts or src/types/domain.ts
Constants:         src/constants/topic.ts
Unit test:         src/lib/__tests__/module.test.ts
E2E test:          tests/feature.spec.ts

---

## Conventions

Naming:
  Components: PascalCase (Hero.tsx, MembershipForm.tsx)
  Utilities: camelCase (notion.ts, utils.ts, schema.ts)
  Routes: kebab-case directories (apply/chapter/, suggest-event/)
  Tests: *.test.ts in __tests__/ directories
  Hooks: use prefix (useScrollReveal.ts)
  Constants: camelCase file, UPPER_CASE exports (copy.ts → HERO_COPY)
  Types: PascalCase (EventType, BlogPost)
  Booleans: is* or has* prefix

Import ordering (always follow this):
  1. Third-party packages
  2. Type imports (import type)
  3. Internal modules via @/ path alias

Components:
  Functional, arrow functions
  Props destructured in function signature
  Default exports: page components
  Named exports: reusable components
  "use client" directive on all client components

Styling:
  Tailwind CSS utility classes
  cn() helper (clsx + tailwind-merge) for conditional composition
  CSS modules (*.module.css) for complex animations only
  Design tokens via CSS custom properties

Types:
  readonly modifiers on data types
  Zod schemas for runtime validation with inferred TypeScript types

Async: async/await with typed Promise returns
Fire-and-forget: void prefix
Comments: JSDoc for public APIs, section separators (// ─── Section ───)

---

## Environment variables

Required (app won't work without these):
  NOTION_TOKEN              — all content operations
  NOTION_BLOG_DB_ID         — blog rendering
  NOTION_RESOURCES_DB_ID    — resources page
  NOTION_SOLUTIONS_DB_ID    — solutions listing
  NOTION_EVENT_DB_ID        — events/calendar
  NOTION_MEMBER_DB_ID       — membership applications
                              confirmed: ec753df1-ca8d-46d7-8c74-9b6f64cea2d5
  NOTION_VENTURES_INTAKE_DB_ID — ventures applications
                              confirmed: e32bed8c-a82a-4efa-88e9-84a200aea16f
  ALLOWED_ORIGINS           — CORS validation (comma-separated)
  NODE_ENV                  — development / test / production

Optional (recommended for production):
  NOTION_CHAPTERS_DB_ID     — chapter features
                              confirmed: 730c916a-0ecf-4df4-bea3-e231533f68db
  NOTION_DEAL_PIPELINE_DB_ID — deal pipeline (if implemented)
  RESEND_API_KEY            — email (skip in dev/test)
  REVALIDATE_SECRET         — cache invalidation security
  NEXT_PUBLIC_SENTRY_DSN    — error tracking
  VERCEL_AUTOMATION_BYPASS_SECRET — CI test bypass
  PLAYWRIGHT_TEST_BASE_URL  — defaults to http://localhost:3000

Secrets location:
  Development: .env.local (gitignored)
  Production: Vercel dashboard
  Template: .env.example (committed — use this as reference)

Sentry:
  org: sagie, project: sagie-co
  Client trace: 0.1 (prod), 1.0 (dev)
  Session replays: 0.1 rate, 1.0 on error

---

## Integrations

Notion — primary CMS + data store
  Client: @notionhq/client
  Patterns: databases.query() for reads, pages.create() for form writes
  Monitor: notion-monitor.ts — Sentry tracking for write failures
  Conversion: notion-to-md for blog content rendering

Resend — transactional email
  Production only (skipped in dev/test — logged to console instead)
  Templates: ConfirmationEmail.tsx, AdminAlertEmail.tsx
  Error: non-blocking, captured by Sentry

Sentry — error tracking
  3 config files: client, server, edge runtimes
  withSentryConfig wrapper in next.config.ts
  Tracks: Notion write failures, Resend failures, performance traces

Google Calendar — integration exists in calendar.ts
  Status: integrated but scope unclear — verify before modifying

Vercel — hosting, preview deploys, env secrets
GitHub Actions — CI/CD (.github/ directory)

---

## Testing

Unit tests:
  Framework: Vitest 4.1.2
  Location: src/lib/__tests__/*.test.ts
  Coverage: v8 provider
  Excluded from coverage: src/lib/notion.ts, src/lib/gsap.ts

Mocking patterns (always follow these):
  vi.mock() for module mocking
  Commonly mocked: server-only, @notionhq/client, resend, @sentry/nextjs
  Mock implementations at top of test files

Fixture naming (always follow this):
  Module-level constants: FULL_PAGE_FIXTURE, MINIMAL_EVENT_FIXTURE
  Must mirror real API response shapes exactly

Assertions:
  Vitest expect API
  Zod safeParse for data shape testing
  toHaveBeenCalledWith / toHaveBeenCalledTimes for mock verification
  No snapshot testing

What gets tested:
  Zod schema validation (valid + invalid data)
  Notion API response → app data type transformation
  Email template construction
  Pure utility functions

What does NOT get tested (by design):
  React components (no component testing setup)
  CSS/styling
  API routes (tested indirectly)
  External integrations (mocked out)

Commands:
  npm test            — run all tests (watch mode)
  npm run test:ci     — CI mode (no watch)
  npx vitest --coverage — with coverage report

E2E tests:
  Framework: Playwright 1.58.2
  Location: tests/*.spec.ts
  CI: single worker (process.env.CI), multi-worker locally
  Base URL: PLAYWRIGHT_TEST_BASE_URL or localhost:3000
  Bypass: x-vercel-protection-bypass header for CI

---

## CI/CD

5 required checks per PR: preflight, lint, typecheck, unit, e2e-preview
Vercel auto-deploys every branch to preview URL
Branch protection active on main — all 5 checks required
Vercel authentication bypass via VERCEL_AUTOMATION_BYPASS_SECRET

---

## Known concerns (file locations confirmed)

Tech debt:
  [MEDIUM] Missing Notion property handling
    Files: src/lib/notion.ts, src/lib/schema.ts
    Issue: Missing/renamed properties cause silent data loss
    Fix: Add property existence checks with logging

  [LOW] In-memory rate limiter
    File: src/lib/rate-limit.ts
    Issue: Map resets on serverless cold start — inconsistent limiting
    Fix: Redis-based rate limiting or accept at current scale

  [MEDIUM] Globe memory leak
    File: src/components/Globe.tsx (GlobeClient.tsx)
    Issue: Three.js renderer not fully cleaned up on unmount
    Fix: renderer.dispose() + geometry/material disposal in cleanup effect

Form UX:
  [MEDIUM] Role field is single-select, should be multi-select
  [LOW] Referral source is free text, should be dropdown
  [MEDIUM] Error messages are generic ("Required") not contextual
  [MEDIUM] Resource submission form needs rework — current inline form is minimal; redesign in future sprint

Security:
  [LOW] Honeypot timing too strict
    File: src/app/api/membership/route.ts
    Fix: Tune threshold based on real timing data

  [MEDIUM] Missing HTML sanitization on user inputs in email templates
    Files: API routes handling form submissions
    Fix: Sanitize before embedding in HTML email templates

  [LOW] Admin email hardcoded
    File: src/app/api/membership/route.ts
    Fix: Move to ADMIN_EMAIL env var

  [MEDIUM] HTML injection in dynamic Notion content
    Files: Components rendering Notion-sourced content
    Risk: XSS if Notion content is compromised
    Fix: Sanitize Notion rich text output before rendering

Performance:
  [LOW-MEDIUM] CircuitBackground scaling on high-DPI displays
    File: src/components/CircuitBackground.tsx
    Fix: Resolution scaling factor, reduce particle count on mobile

  [LOW] Globe type safety — any types in several places
    File: src/components/Globe.tsx
    Fix: Add proper typing for globe arc/point data

Fragile areas:
  [MEDIUM] EventsPageClient error state has no retry mechanism
    File: src/components/EventsPageClient.tsx
    Fix: Add retry button + specific error messaging

  [MEDIUM] Checkbox accessibility — may not convey state to screen readers
    Files: Custom checkbox/radio group components
    Fix: ARIA audit, ensure proper attributes

Missing features:
  [MEDIUM] No Notion sync monitoring — stale content undetectable
    Fix: Health check endpoint + stale data alerting

  [LOW] No analytics tracking
    Fix: Plausible or PostHog

Test gaps:
  [MEDIUM] API error paths untested (rate limit, validation, Notion failures)
  [MEDIUM] No E2E tests for critical user flows yet
  [MEDIUM] Ventures founder/investor Notion submission E2E — verify Type property differentiation (PR #17)
  [MEDIUM] Verify Phone/Country properties appear in Notion after form submission (PR #14)
  [LOW] Test empty phone submission passes validation — optional field (PR #14)
  [LOW] E2E: footer links navigate to /eco, /solutions, /ventures (PR #13)
  [LOW] E2E: invalid email in newsletter form shows inline validation error (PR #13)
  [LOW] Validation edge cases not covered (empty strings, Unicode, max length)

---

## Open items (in priority order)

1. Address known concerns from section above (first priority next sprint)
2. Filter URL state with nuqs
3. GSAP ScrollTrigger fixes
4. Event action buttons driven by Notion URL fields
   (Registration URL, More Info URL, Recap URL)
5. react-hook-form migration
6. Improve existing not-found.tsx (NOT create new — file already exists)
7. Admin revalidate UX fixes
8. Member portal (auth decision: Clerk vs Supabase Auth — decide first)
9. Forms data audit (carried from sprint 04-03)

Note: not-found.tsx already exists at src/app/(marketing)/not-found.tsx.
      Item 6 is an improvement task, not a creation task.

---

## Agile workflow

Co-work = dev operations layer (planning, status, PR descriptions)
Claude Code = actual building (code, tests, commits)

Sprint cycle:
  1. Run "Next feature brief" in Co-work → get briefing
  2. Open Claude Code → build in feature/[name] branch
  3. PR → all 5 CI checks pass → review Vercel preview → merge
  4. Run "Log what shipped" in Co-work
  5. Sunday status check reflects new state

Rules:
  Never push directly to main
  Never skip CI — all 5 checks must pass
  Phase A (mock data) before Phase B (live API)
  One Claude Code session per feature
  Always use withValidation HOF for new API routes
  Always use GSAPCleanup for new GSAP animations

Notion Development Tracker — Co-work handles all updates:
  Database: cd0d162c-6114-41a2-af28-3cba08086f63
  When starting a track → set Status to "In Development"
  When pushing a PR    → set Status to "In Review" + set PR field to GitHub URL
  If blocked           → set Status to "Blocked" + add note in Notes field
  On merge             → set Status to "Done"
  Priority labels: Critical, High, Medium, Low
  All Notion tracker updates happen via Co-work only — never Claude Code.

---

## Git worktree workflow (parallel sessions)

Every Claude Code session runs in its own git worktree.
This gives full isolation — no file conflicts between parallel tracks.

Setup (run ONCE at sprint start from the main repo root):
  ```
  # Create a worktree per track
  git worktree add ../sagie-track-1 -b fix/accessibility-visual-tokens
  git worktree add ../sagie-track-2 -b fix/ui-components
  git worktree add ../sagie-track-3 -b fix/globe-performance
  git worktree add ../sagie-track-4 -b fix/scroll-position
  ```

Starting a Claude Code session:
  ```
  cd ../sagie-track-N
  claude   # opens Claude Code in the worktree
  ```

After PR is merged:
  ```
  cd /path/to/main/sagie.co
  git worktree remove ../sagie-track-N
  ```

Wave 2 tracks (after Wave 1 merges):
  ```
  git pull origin main   # get Wave 1 changes
  git worktree add ../sagie-track-5 -b feature/form-validation-ux
  git worktree add ../sagie-track-6 -b feature/svg-icons
  ```

Rules:
  Every branch = one worktree = one Claude Code session = one PR
  Never work on the same branch from two worktrees
  Always create worktree from latest main
  Clean up worktrees after PR merge — don't let them pile up
  If a worktree gets stale, remove and recreate from fresh main

Helper script (optional — save as scripts/worktree-setup.sh):
  ```bash
  #!/bin/bash
  # Usage: ./scripts/worktree-setup.sh branch-name
  # Example: ./scripts/worktree-setup.sh fix/accessibility-visual-tokens

  BRANCH=$1
  DIRNAME=$(echo "$BRANCH" | sed 's|/|-|g')

  if [ -z "$BRANCH" ]; then
    echo "Usage: $0 <branch-name>"
    exit 1
  fi

  git fetch origin main
  git worktree add "../sagie-${DIRNAME}" -b "$BRANCH" origin/main
  echo "✓ Worktree created at ../sagie-${DIRNAME}"
  echo "  cd ../sagie-${DIRNAME} && claude"
  ```

---

## Scheduled tasks

### SUNDAY 7:00PM — Weekly v2 Status
Read .planning/ folder, CLAUDE.md, and instructions.md.
Surface what is in progress, blocked, next.
Cross-reference v2 milestone list above.
Recommend single highest-priority item for the week.
Flag any known concerns relevant to current work.
Save to: ~/SAGIE-HQ/sagie.co/dev-status-MM-DD-YYYY.md

---

## On-demand tasks

Planning:
  "Next feature brief — what needs building next?"
  "What concerns should I address this sprint?"
  "What's the current state of the v2 milestone?"
  "What's blocking [feature]?"

Active development (run at start of Claude Code session):
  "Read instructions.md and .planning/. I'm about to build
   [feature]. What do I need to know before I start?
   Which concerns are relevant? Which patterns must I follow?"

Post-session:
  "Log what shipped: [feature]. Branch: [branch].
   Update the v2 milestone status in my notes."

PR workflow:
  "Draft a PR description for the [branch] branch."

Security:
  "Which security concerns from instructions.md are unresolved?
   What should I fix before the next deploy?"

Testing:
  "What test gaps exist that are relevant to [feature]?
   What mock patterns should I follow?"
