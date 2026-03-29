---
phase: 06-event-interactivity
plan: 01
subsystem: api
tags: [notion, ics, calendar, events, typescript]

# Dependency graph
requires:
  - phase: 05-bug-fixes
    provides: events.ts with SAGIEEvent interface and mapEvent function
provides:
  - SAGIEEvent interface extended with registrationLink, moreInfoLink, recapLink fields
  - Exported mapEvent function for use in route handlers
  - Time extraction from Notion datetime Event Date property
  - buildGoogleCalendarUrl, buildOutlookCalendarUrl, buildIcsContent, escapeIcsText exported from events.ts
  - GET /api/events/[id]/ics route handler producing RFC 5545 ICS files
affects: [06-02-event-interactivity-ui, any phase using SAGIEEvent interface]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - RFC 5545 ICS generation via string building (no library) with CRLF line endings
    - Google Calendar deep link with URLSearchParams encoding
    - Outlook Web calendar deep link with ISO date params
    - Next.js 16 async params pattern in API routes

key-files:
  created:
    - src/app/api/events/[id]/ics/route.ts
  modified:
    - src/lib/events.ts
    - src/lib/__tests__/events.test.ts

key-decisions:
  - "mapEvent exported (not kept private) to allow ICS route to reuse existing Notion property mapping"
  - "ICS generated via manual string building with CRLF — no ical library needed for single-event output"
  - "All-day events end date is +1 day per RFC 5545 spec (exclusive end date)"
  - "Timed events use UTC Z suffix and +1 hour end time as convention for 1-hour default duration"
  - "Google Calendar URL uses URLSearchParams for safe encoding of all params"

patterns-established:
  - "ICS route pattern: notion.pages.retrieve -> mapEvent -> buildIcsContent -> Response with text/calendar headers"
  - "Calendar URL builders accept SAGIEEvent directly — no separate param object needed"

requirements-completed: [EVT-01, EVT-02, EVT-03, EVT-04]

# Metrics
duration: 2min
completed: 2026-03-28
---

# Phase 6 Plan 01: Event Interactivity Data Model Summary

**SAGIEEvent extended with registrationLink/moreInfoLink/recapLink, RFC 5545 ICS generation and calendar URL builders exported, and /api/events/[id]/ics route handler created**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-28T22:09:45Z
- **Completed:** 2026-03-28T22:12:16Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Extended SAGIEEvent interface with three new URL fields (registrationLink, moreInfoLink, recapLink) and time extraction from Notion datetime
- Exported mapEvent plus four calendar helpers (buildGoogleCalendarUrl, buildOutlookCalendarUrl, buildIcsContent, escapeIcsText) from events.ts
- Created /api/events/[id]/ics GET route with Next.js 16 async params, Notion page retrieval, and proper ICS headers
- Test suite grew from 6 to 30 passing tests covering all new behaviors

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend SAGIEEvent data model and update tests** - `a7cf597` (feat)
2. **Task 2: Create ICS API route handler** - `2cd4714` (feat)

**Plan metadata:** (forthcoming docs commit)

_Note: Task 1 followed TDD — tests written first (RED), then implementation (GREEN), all 30 tests passing_

## Files Created/Modified
- `src/lib/events.ts` - Extended interface, exported mapEvent, added escapeIcsText/buildGoogleCalendarUrl/buildOutlookCalendarUrl/buildIcsContent
- `src/lib/__tests__/events.test.ts` - Added TIMED_EVENT_FIXTURE, new URL properties to FULL_EVENT_FIXTURE, 24 new tests covering all calendar helpers
- `src/app/api/events/[id]/ics/route.ts` - New ICS download endpoint using Next.js 16 async params pattern

## Decisions Made
- Exported mapEvent (was private) so the ICS route handler can reuse it — avoids duplicating Notion property access patterns
- Used manual string building for ICS instead of an ical library — single-event output is simple enough, avoids an extra dependency
- All-day events: end date = start + 1 day (RFC 5545 §3.6.1 exclusive end date)
- Timed events: end = start + 1 hour (convention; plan did not specify event duration field)
- Google Calendar URL uses URLSearchParams for proper percent-encoding across all params including details/description

## Deviations from Plan

None - plan executed exactly as written. mapEvent was already being considered for export in the plan's action steps; no unplanned changes were needed.

## Issues Encountered
None — tests passed on first implementation attempt after the RED phase.

## User Setup Required
None - no external service configuration required. Notion property names used (Registration Link, More Info Link, Recap Link) must match the actual Notion database schema; if they differ, mapEvent mappings in events.ts need updating.

## Next Phase Readiness
- Plan 02 (UI) can now import SAGIEEvent fields and calendar builder functions directly from @/lib/events
- ICS download works end-to-end at /api/events/[id]/ics — plan 02 just needs to wire up the Add to Calendar dropdown with this URL
- No blockers for plan 02

## Self-Check: PASSED

- FOUND: src/lib/events.ts
- FOUND: src/lib/__tests__/events.test.ts
- FOUND: src/app/api/events/[id]/ics/route.ts
- FOUND: .planning/phases/06-event-interactivity/06-01-SUMMARY.md
- FOUND commit a7cf597: feat(06-01): extend SAGIEEvent model and add calendar helper functions
- FOUND commit 2cd4714: feat(06-01): create GET /api/events/[id]/ics route handler
- All 30 tests passing
- TypeScript: no errors

---
*Phase: 06-event-interactivity*
*Completed: 2026-03-28*
