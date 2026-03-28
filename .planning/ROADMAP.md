# Roadmap: sagie.co

## Overview

The site already works — forms submit, content renders, CI runs. This milestone hardens what exists: first fixing active data loss and crashes, then locking down security, then shipping missing features and a live globe, and finally putting tests in place so regressions can't sneak back in.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Stabilize** - Fix data loss, crashes, and dead code before anything else ships (completed 2026-03-28)
- [x] **Phase 2: Harden** - Lock down security and add error/loading boundaries site-wide (completed 2026-03-28)
- [ ] **Phase 3: Features + Globe** - Revalidation endpoint, email notifications, sitemap, and a live globe
- [ ] **Phase 4: Testing** - Install Vitest, write unit and E2E tests, make CI fully green

## Phase Details

### Phase 1: Stabilize
**Goal**: The site runs cleanly — no silent data loss on forms, no startup crashes, no dead code confusing future work
**Depends on**: Nothing (first phase)
**Requirements**: BUG-01, BUG-02, BUG-03, CLN-01, CLN-02, CLN-03
**Success Criteria** (what must be TRUE):
  1. Submitting the Chapter and Membership forms delivers all fields to Notion — nothing dropped
  2. The globe component mounts and unmounts without leaking a runaway setTimeout loop
  3. The app starts up without crashing when NOTION_DEAL_PIPELINE_DB_ID or REVALIDATE_SECRET are absent from the environment
  4. No MOCK_POSTS, MOCK_EVENTS, MOCK_RESOURCES, or MOCK_PROVIDERS constants remain in the codebase
  5. @typeform/embed-react and dotenv are absent from package.json and node_modules
**Plans:** 2/2 plans complete

Plans:
- [ ] 01-01-PLAN.md — Fix form field mismatches (BUG-01) and optional env vars (BUG-03)
- [ ] 01-02-PLAN.md — Globe setTimeout cleanup (BUG-02), remove mock data (CLN-01), unused packages (CLN-02), duplicate types (CLN-03)

### Phase 2: Harden
**Goal**: Every API route is protected from abuse and every page segment handles errors and loading states gracefully
**Depends on**: Phase 1
**Requirements**: SEC-01, SEC-02, SEC-03, SEC-04, FEAT-05
**Success Criteria** (what must be TRUE):
  1. Submitting a form more than 5 times from the same IP within 10 minutes returns 429
  2. API requests from an unlisted origin are rejected
  3. No unsafe-inline appears in the CSP script-src header — nonces are used instead
  4. Sentry tracesSampleRate is 0.1 or 0.2 in the production config
  5. Every route segment has an error.tsx that renders a user-facing error state and a loading.tsx that renders a skeleton or spinner
**Plans:** 3/3 plans complete

Plans:
- [ ] 02-01-PLAN.md — Security middleware: proxy.ts (CSP nonces + origin check), rate limiting in withValidation, Sentry config update
- [ ] 02-02-PLAN.md — Skeleton component, error.tsx boundaries for all route segments, not-found.tsx redesign
- [ ] 02-03-PLAN.md — Tailored loading.tsx skeletons for all route segments

### Phase 3: Features + Globe
**Goal**: Editors can invalidate the cache on demand, applicants receive email confirmation, the globe shows real member data, and search engines can index every page
**Depends on**: Phase 2
**Requirements**: FEAT-01, FEAT-02, FEAT-03, FEAT-04, GLOBE-01, GLOBE-02
**Success Criteria** (what must be TRUE):
  1. Hitting /api/revalidate with the correct secret flushes the relevant cache tags and returns 200
  2. An applicant who submits any form receives a confirmation email within seconds
  3. The admin team receives an alert email for every new form submission
  4. A sitemap.xml is reachable at /sitemap.xml and includes all static routes plus dynamic blog, events, solutions, and resources URLs
  5. The globe on the homepage loads GeoJSON from /public/ and plots city markers sourced from Notion membership data
**Plans:** 3 plans

Plans:
- [ ] 03-01-PLAN.md — Email system: Resend + React Email templates, sendEmails helper, hook into all 7 API routes
- [ ] 03-02-PLAN.md — Globe data pipeline: bundle GeoJSON, Notion members/chapters libs, refactor GlobeNetwork to real data
- [ ] 03-03-PLAN.md — Revalidation endpoint + admin page, async sitemap with all routes

### Phase 4: Testing
**Goal**: The CI pipeline is fully green, core data-fetching and validation logic is covered by unit tests, and critical user flows are covered by E2E tests
**Depends on**: Phase 3
**Requirements**: TEST-01, TEST-02, TEST-03, TEST-04
**Success Criteria** (what must be TRUE):
  1. Running `npx vitest` locally passes with no errors and the CI unit test step is green
  2. Unit tests cover the data-mapping logic in blog.ts, events.ts, resources.ts, and solutions.ts
  3. Unit tests cover all Zod schemas and the withValidation middleware
  4. E2E tests submit each application form and verify the submission reaches Notion, and visit each content page and verify content renders
**Plans:** 2/3 plans executed

Plans:
- [ ] 04-01-PLAN.md — Install Vitest, configure vitest.config.ts, unit tests for Zod schemas and withValidation
- [ ] 04-02-PLAN.md — Unit tests for blog.ts, events.ts, resources.ts, solutions.ts data mapping
- [ ] 04-03-PLAN.md — E2E tests for form submissions and content page rendering

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Stabilize | 2/2 | Complete   | 2026-03-28 |
| 2. Harden | 3/3 | Complete   | 2026-03-28 |
| 3. Features + Globe | 0/3 | Not started | - |
| 4. Testing | 2/3 | In Progress|  |
