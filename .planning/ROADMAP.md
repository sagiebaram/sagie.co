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
- [x] **Phase 3: Features + Globe** - Revalidation endpoint, email notifications, sitemap, and a live globe (completed 2026-03-28)
- [x] **Phase 4: Testing** - Install Vitest, write unit and E2E tests, make CI fully green (completed 2026-03-28)
- [ ] **Phase 5: Bug Fixes** - Fix filter state, back/forward nav, GSAP re-trigger, and rate limit feedback
- [x] **Phase 6: Event Interactivity** - Wire event action buttons and build Add to Calendar modal (completed 2026-03-28)
- [ ] **Phase 7: Form Redesign** - Schema audit, react-hook-form adoption, inline validation, dropdowns/checkboxes
- [x] **Phase 8: Admin Polish + 404** - Revalidation UI feedback, key rotation fix, custom 404 illustration (completed 2026-03-28)

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

**Plans:** 3/3 plans complete

Plans:
- [ ] 04-01-PLAN.md — Install Vitest, configure vitest.config.ts, unit tests for Zod schemas and withValidation
- [ ] 04-02-PLAN.md — Unit tests for blog.ts, events.ts, resources.ts, solutions.ts data mapping
- [ ] 04-03-PLAN.md — E2E tests for form submissions and content page rendering

---

## v2.0 Polish & Interactivity

### Phase 5: Bug Fixes

**Goal**: Users can navigate the site and use filters without encountering blank pages or broken renders, and see clear feedback when forms are rate-limited
**Depends on**: Nothing (first v2.0 phase; v1.0 complete)
**Requirements**: FIX-01, FIX-02, FIX-03, FIX-04
**Success Criteria** (what must be TRUE):

1. User selects a second filter on Blog, Solutions, or Resources — filtered content renders immediately without the page going blank
2. User hits browser back or forward and the page renders correctly without needing a manual refresh
3. User who submits a form and triggers the rate limit sees a clear, readable error message on the form rather than a silent failure
4. Filter selections appear in the URL so the filtered view can be bookmarked or shared

**Plans:** 4/5 plans executed

Plans:
- [x] 05-01-PLAN.md — Install nuqs, NuqsAdapter, bfcache fix in GSAPCleanup, filterKey in useScrollReveal
- [x] 05-02-PLAN.md — Migrate all 4 filter components from useState to nuqs with URL params and fade animation
- [x] 05-03-PLAN.md — Fix 429 rate limit feedback in all 7 form components
- [ ] 05-04-PLAN.md — (gap closure) Fix filterKey useEffect to target child card elements with inline opacity
- [ ] 05-05-PLAN.md — (gap closure) Transform empty URL strings in schemas, add 422 error parsing to forms

### Phase 6: Event Interactivity

**Goal**: Users can take action on events directly from the events page — register, get details, read recap, or add to their calendar
**Depends on**: Phase 5
**Requirements**: EVT-01, EVT-02, EVT-03, EVT-04, EVT-05
**Success Criteria** (what must be TRUE):

1. User clicks Register on an event and lands on the external registration page in a new tab
2. User clicks Add to Calendar and sees a modal with working links for Google Calendar, Outlook, and Apple Calendar, plus a downloadable .ics file
3. User clicks More Info on an event and lands on the external info page
4. User clicks Read Recap on a past event and lands on the recap content
5. Action buttons only appear when the corresponding Notion field is populated — no dead or broken buttons appear for events missing those fields

**Plans:** 2/2 plans complete

Plans:
- [ ] 06-01-PLAN.md — Extend SAGIEEvent data model with URL fields, calendar URL builders, ICS content generator, API route
- [ ] 06-02-PLAN.md — Rewire EventsPageClient action buttons, Add to Calendar dropdown, event images

### Phase 7: Form Redesign

**Goal**: Users filling out any form receive immediate inline validation feedback and interact with structured input controls for fixed-choice fields, and every submission lands completely in Notion
**Depends on**: Phase 5
**Requirements**: FORM-01, FORM-02, FORM-03
**Success Criteria** (what must be TRUE):

1. User who tabs away from a required field sees a per-field error message immediately — validation fires on blur, not only on submit
2. Fixed-choice fields (e.g. country, membership tier, chapter role) are rendered as dropdown selects or checkbox groups — no free-text inputs for constrained choices
3. A form submission that passes client-side validation results in every field appearing correctly in the corresponding Notion database entry — no silent field loss

**Plans:** 1/3 plans executed

Plans:
- [ ] 07-01-PLAN.md — Install react-hook-form, update FormField (registration prop + checkbox-group), add friendly error messages to schemas, role enum
- [ ] 07-02-PLAN.md — Migrate MembershipForm and VenturesForm (complex forms with new fields, dropdowns, checkbox group, sections)
- [ ] 07-03-PLAN.md — Migrate ChapterForm, SolutionsForm, SubmitPostForm, SuggestEventForm, SubmitResourceForm + update E2E tests

### Phase 8: Admin Polish + 404

**Goal**: Admins get clear per-action feedback when revalidating cache entries, and visitors who land on a missing page see a branded 404 experience
**Depends on**: Phase 5
**Requirements**: POL-01, POL-02, POL-03
**Success Criteria** (what must be TRUE):

1. Admin clicks a revalidate button and sees a per-button loading state while the request is in flight, then a success or failure indicator when it resolves
2. Admin whose revalidation secret has rotated is returned to the access prompt correctly instead of landing on a broken redirect
3. Visitor who navigates to a non-existent URL sees a custom 404 page with a branded SVG/CSS illustration matching the site's circuit-board aesthetic

**Plans:** 2/2 plans complete

Plans:
- [ ] 08-01-PLAN.md — Refactor admin revalidation page to per-button status with 401 reset and Button styling
- [ ] 08-02-PLAN.md — Replace 404 illustration with branded circuit-board broken-path SVG

---

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6/7 (parallel) -> 8

| Phase | Plans Complete | Status | Completed |
| ----- | -------------- | ------ | --------- |
| 1. Stabilize | 2/2 | Complete | 2026-03-28 |
| 2. Harden | 3/3 | Complete | 2026-03-28 |
| 3. Features + Globe | 3/3 | Complete | 2026-03-28 |
| 4. Testing | 3/3 | Complete | 2026-03-28 |
| 5. Bug Fixes | 4/5 | In Progress|  |
| 6. Event Interactivity | 2/2 | Complete   | 2026-03-28 |
| 7. Form Redesign | 1/3 | In Progress| |
| 8. Admin Polish + 404 | 2/2 | Complete   | 2026-03-28 |
