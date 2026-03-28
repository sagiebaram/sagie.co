---
phase: 06-event-interactivity
plan: "02"
subsystem: ui
tags: [react, nextjs, typescript, notion, calendar, ics]

# Dependency graph
requires:
  - phase: 06-01
    provides: SAGIEEvent type with registrationLink/moreInfoLink/recapLink fields, buildGoogleCalendarUrl, buildOutlookCalendarUrl, /api/events/[id]/ics endpoint

provides:
  - Data-driven action buttons on events page (Register, More Info, Read Recap)
  - Inline Add to Calendar dropdown with Google, Outlook, Apple Calendar, and .ics download
  - Event image rendering with object-cover in image slot
  - Removal of all dead/placeholder buttons (no href="#", no "Notify me when confirmed")

affects: [08-admin-polish-404, future-events-enhancements]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Field-existence gating for action buttons (null check replaces status/type conditionals)
    - ExternalActionLink / InternalActionLink split for external vs internal navigation
    - Inline animated dropdown via framer-motion AnimatePresence for calendar options
    - Calendar helpers in dedicated calendar.ts to avoid server-only import in client components

key-files:
  created: []
  modified:
    - src/app/(marketing)/events/EventsPageClient.tsx
    - src/lib/calendar.ts

key-decisions:
  - "Calendar helpers extracted from events.ts to calendar.ts — server-only import in events.ts caused a runtime error when imported into a client component"
  - "Apple Calendar .ics download uses /api/events/[id]/ics route — CSP blob: restriction confirmed; Download .ics duplicate option removed, kept only Apple Calendar entry"
  - "Read Recap uses Next.js Link (client-side navigation) — recapLink points to internal /blog/* paths"

patterns-established:
  - "ExternalActionLink pattern: anchor with target=_blank + rel=noopener noreferrer + diagonal arrow icon"
  - "InternalActionLink pattern: Next.js Link for same-origin navigation, no external icon"
  - "Field-existence gating: every action button only renders when its data field is non-null"

requirements-completed: [EVT-01, EVT-02, EVT-03, EVT-04, EVT-05]

# Metrics
duration: ~30min
completed: 2026-03-28
---

# Phase 6 Plan 02: Event Interactivity Summary

**Data-driven event action buttons with inline Add to Calendar dropdown, event image rendering, and removal of all dead/placeholder buttons on the events page**

## Performance

- **Duration:** ~30 min
- **Started:** 2026-03-28
- **Completed:** 2026-03-28
- **Tasks:** 2 (1 auto + 1 human-verify checkpoint)
- **Files modified:** 2

## Accomplishments

- Replaced status/type-gated action buttons with field-existence gating — buttons only appear when their Notion data field is populated
- Built ExternalActionLink (opens new tab, diagonal arrow icon), InternalActionLink (Next.js Link, no icon), and AddToCalendarDropdown (inline animated dropdown with Google Calendar, Outlook, Apple Calendar/.ics)
- Wired event image slot to render Notion eventImage URLs with object-cover, showing "No image" placeholder when absent
- Removed "Notify me when confirmed" button entirely and eliminated all href="#" dead links

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewire action buttons, image slot, and Add to Calendar dropdown** - `05cdff8` (feat)
2. **Task 2: Verify event interactivity end-to-end** - approved by user; additional fix committed as `38dd980`

## Files Created/Modified

- `src/app/(marketing)/events/EventsPageClient.tsx` - Replaced ActionLink with ExternalActionLink/InternalActionLink, added AddToCalendarDropdown, rewired image slot, applied field-existence gating on all action buttons
- `src/lib/calendar.ts` - Extracted buildGoogleCalendarUrl and buildOutlookCalendarUrl from events.ts to avoid server-only import error in client component

## Decisions Made

- Calendar helpers extracted from events.ts into a new calendar.ts module — events.ts uses server-only imports (Notion SDK) which cannot be imported in client components; extracting the pure URL-builder functions to calendar.ts unblocked the client-side import
- Duplicate "Download .ics" option removed from Add to Calendar dropdown — user confirmed only "Apple Calendar" entry (with .ics download) is needed; cleaner UX
- Read Recap uses Next.js Link for client-side navigation to internal /blog/* paths

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Extracted calendar helpers to resolve server-only import error**
- **Found during:** Task 1 (rewire action buttons) / discovered during user verification
- **Issue:** buildGoogleCalendarUrl and buildOutlookCalendarUrl lived in events.ts which pulls in the Notion SDK via server-only — importing them into EventsPageClient.tsx (a client component) caused a runtime error
- **Fix:** Created src/lib/calendar.ts with only the two pure URL-builder functions; updated EventsPageClient.tsx import to use @/lib/calendar
- **Files modified:** src/lib/calendar.ts (created), src/app/(marketing)/events/EventsPageClient.tsx (import updated)
- **Verification:** TypeScript noEmit passed; user verified /events page loaded and calendar links worked
- **Committed in:** `38dd980`

---

**Total deviations:** 1 auto-fixed (1 blocking import error)
**Impact on plan:** Required for the feature to work at all in a client component. No scope creep.

## Issues Encountered

- Server-only import conflict when importing calendar URL builders from events.ts into a client component — resolved by extracting helpers to calendar.ts (see Deviations above)

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Event interactivity is fully shipped: all action buttons data-driven, Add to Calendar dropdown functional, images rendering
- Phase 06 plan 01 + 02 are both complete — Phase 06 is done
- No blockers for subsequent phases

---
*Phase: 06-event-interactivity*
*Completed: 2026-03-28*
