---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: Polish & Interactivity
status: planning
stopped_at: Completed 05-05-PLAN.md
last_updated: "2026-03-28T23:54:01.705Z"
last_activity: 2026-03-28 — Roadmap created, ready for plan-phase 5
progress:
  total_phases: 8
  completed_phases: 7
  total_plans: 23
  completed_plans: 22
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-28)

**Core value:** Community members and prospective members can discover SAGIE's value, consume content, and apply to join — with every submission reliably reaching the team and every piece of content appearing promptly.
**Current focus:** Phase 5 — Bug Fixes (first v2.0 phase)

## Current Position

Phase: 5 — Bug Fixes
Plan: Not started
Status: Ready to plan
Last activity: 2026-03-28 — Roadmap created, ready for plan-phase 5

```
v2.0 Progress: [░░░░░░░░░░░░░░░░░░░░] 0% (0/4 phases)
```

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: —
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 5. Bug Fixes | TBD | - | - |
| 6. Event Interactivity | TBD | - | - |
| 7. Form Redesign | TBD | - | - |
| 8. Admin Polish + 404 | TBD | - | - |

**Recent Trend:**

- Last 5 plans: —
- Trend: —
| Phase 05-bug-fixes P01 | 5 | 2 tasks | 4 files |
| Phase 05-bug-fixes P03 | 4 | 2 tasks | 7 files |
| Phase 05-bug-fixes P02 | 15 | 2 tasks | 6 files |
| Phase 06-event-interactivity P01 | 2 | 2 tasks | 3 files |
| Phase 08-admin-polish-404 P01 | 2 | 1 tasks | 2 files |
| Phase 07-form-redesign P01 | 8 | 3 tasks | 5 files |
| Phase 07-form-redesign P02 | 9 | 2 tasks | 2 files |
| Phase 08-admin-polish-404 P02 | 10 | 2 tasks | 1 files |
| Phase 05-bug-fixes P04 | 2 | 1 tasks | 1 files |
| Phase 06-event-interactivity P02 | 30 | 2 tasks | 2 files |
| Phase 05-bug-fixes P05 | 14 | 2 tasks | 8 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Init: Fix bugs before adding features — broken forms are losing real user data now
- Init: Vitest for unit testing — already referenced in CI, lightweight, Vite-native
- Init: Keep Notion as sole backend — already deeply integrated, team uses it daily
- [Phase 01-stabilize]: tier field given default('Explorer') — admin-assigned at review time, not user-facing
- [Phase 01-stabilize]: referral field added to MembershipSchema and Notion write — previously collected by form but silently dropped
- [Phase 01-stabilize]: NOTION_DEAL_PIPELINE_DB_ID and REVALIDATE_SECRET made optional — no routes consume them yet, will be needed in future phases
- [Phase 01-stabilize]: Deleted constants/events.ts and constants/resources.ts entirely — zero external imports confirmed before deletion
- [Phase 01-stabilize]: MOCK_CITIES and MOCK_ARCS kept in GlobeNetwork.tsx — local presentation data, not cross-file mock constants targeted by CLN-01
- [Phase 01-stabilize]: cancelledRef pattern established for guarding setTimeout loops in React components on unmount
- [Phase 02-harden]: proxy.ts owns full CSP; next.config.ts retains only static security headers to avoid duplicate CSP header conflicts
- [Phase 02-harden]: Origin check only rejects when origin header is present AND not in ALLOWED_ORIGINS — missing origin (same-origin/server-to-server) allowed through
- [Phase 02-harden]: Rate limiter in withValidation (not proxy.ts) — keeps proxy stateless; in-memory Map sufficient for single-instance community site
- [Phase 02-harden]: Used GridBackground (not CircuitBackground) in error pages — simpler, no client-side canvas hydration needed
- [Phase 02-harden]: ErrorPage shared component with optional onRetry — not-found.tsx stays as server component
- [Phase 02-harden]: All loading.tsx files are pure server components (no use client) — shimmer presentation needs no state or hooks
- [Phase 02-harden]: Each skeleton mirrors actual page layout: blog uses 3-col card grid, events uses accordion rows with type dividers, forms mirror exact field grid layout
- [Phase 04-testing]: vitest include pattern restricted to src/**/*.test.ts to prevent Playwright specs being discovered by Vitest
- [Phase 04-testing]: Rate limiter tests use unique IP per describe block to isolate module-level rateStore state across tests
- [Phase 04-testing]: Forms mocked via page.route() POST interception — tests form UI flow without Notion dependency
- [Phase 04-testing]: Content page assertions use regex text matching against static heading copy — tolerates any Notion data state
- [Phase 04-testing]: Read source files before writing tests — property key names are case-sensitive (Author Type, Cover Image, etc.)
- [Phase 04-testing]: Fixture pattern FULL_PAGE_FIXTURE + MINIMAL_PAGE_FIXTURE covers all ?? fallback chains across data-mapping modules
- [Phase 03-features-globe]: revalidateTag(tag, 'max') two-arg form used — single-arg deprecated in Next.js 16
- [Phase 03-features-globe]: Revalidation endpoint returns 401 when REVALIDATE_SECRET is undefined — safe default, endpoint disabled until configured
- [Phase 03-features-globe]: Only /blog/[slug] added as dynamic sitemap routes — events/resources/solutions have no individual slug pages
- [v2.0-roadmap]: nuqs adopted for filter URL params (FIX-01) — requirements confirmed shareability as user need
- [v2.0-roadmap]: Phases 6 and 7 are independent (disjoint code areas) and can be executed in parallel
- [v2.0-roadmap]: Only two new packages needed for v2.0 — react-hook-form@^7.72.0 and @hookform/resolvers@^5.2.2 (Phase 7 only); nuqs covers Phase 5 filter fix using existing patterns
- [Phase 05-bug-fixes]: npm install nuqs used --legacy-peer-deps due to pre-existing @eslint/js@10 vs eslint@9 peer conflict
- [Phase 05-bug-fixes]: UseScrollRevealOptions exported so Plan 02 filter components can type filterKey usage
- [Phase 05-bug-fixes]: filterKey useEffect uses isFirstRender ref to skip mount — GSAP useLayoutEffect owns initial animation
- [Phase 05-bug-fixes]: submitWarning is separate state from errors object — amber warning persists through field validation cycles
- [Phase 05-bug-fixes]: SubmitResourceForm uses Math.max(0,...) in useEffect and rateLimitUntil !== null for disabled prop — avoids react-hooks/set-state-in-effect and react-hooks/purity lint errors in ui/ directory
- [Phase Phase 05-bug-fixes]: EventFilter is a controlled component consistent with ResourceFilter — parent (EventsPageClient) owns nuqs location state
- [Phase Phase 05-bug-fixes]: EventsPageClient location filter matches against event.chapter field (graceful degradation — shows all events when chapter is null)
- [Phase Phase 05-bug-fixes]: filterKey concatenation for BlogFilter: category|author — any change triggers fade
- [Phase 06-event-interactivity]: mapEvent exported (not private) so ICS route can reuse Notion property mapping without duplication
- [Phase 06-event-interactivity]: ICS generated via manual string building with CRLF — no ical library needed for single-event output
- [Phase 06-event-interactivity]: All-day ICS events end date = start + 1 day per RFC 5545 exclusive end date spec
- [Phase 08-admin-polish-404]: Per-button Map<string, ButtonStatus> with functional updater (new Map(prev).set()) prevents stale closure mutation in admin revalidate page
- [Phase 08-admin-polish-404]: timersRef keyed by button key clears stale timers before scheduling new ones; resetToPrompt cancels all timers atomically on 401 or manual reset
- [Phase 07-form-redesign]: Zod v4 uses { error: string } not errorMap for enum error messages — auto-fixed during Task 2
- [Phase 07-form-redesign]: FormField value/onChange made optional for backward compat — new forms use registration prop only
- [Phase 07-form-redesign]: z.input<typeof Schema> for useForm generic avoids exactOptionalPropertyTypes incompatibility with .default() fields
- [Phase Phase 08-admin-polish-404]: CircuitBrokenIllustration replaces NotFoundIllustration in not-found.tsx — inline style tag binds .broken-node class to pulse-node animation; keyframes remain in globals.css
- [Phase 05-bug-fixes]: Child card opacity override in filterKey useEffect rAF callback — uses gsap.utils.toArray(selector, el) to set inline opacity:1, overriding CSS opacity:0 on newly rendered cards
- [Phase 06-event-interactivity]: Calendar helpers extracted from events.ts to calendar.ts — server-only import in events.ts caused runtime error in client component
- [Phase 06-event-interactivity]: Apple Calendar .ics download uses /api/events/[id]/ics route; duplicate Download .ics option removed from dropdown
- [Phase 05-bug-fixes]: optionalUrl uses z.string().optional().transform().pipe() — z.preprocess gives unknown input type incompatible with zodResolver; optional-based transform preserves string|undefined input matching resolver output
- [Phase 05-bug-fixes]: All 6 form components parse 422 fieldErrors from server and display first error at 13px — raised from 11px which was invisible on dark backgrounds

### Pending Todos

- Verify whether registrationLink, moreInfoLink, recapLink Notion properties already exist in the events database or need to be created (Phase 6 dependency)
- Check CSP blob: allowance before shipping client-side ICS download in Phase 6 — if blocked, pivot to /api/events/[id]/ics route handler

### Blockers/Concerns

None active.

## Session Continuity

Last session: 2026-03-28T23:54:01.703Z
Stopped at: Completed 05-05-PLAN.md
Resume file: None
