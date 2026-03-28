---
phase: 05-bug-fixes
plan: "04"
subsystem: ui
tags: [gsap, scroll-reveal, filter, opacity, animation]

# Dependency graph
requires:
  - phase: 05-bug-fixes
    provides: filterKey useEffect and UseScrollRevealOptions with selector field (Plans 01 & 02)
provides:
  - filterKey useEffect sets inline opacity:1 on child card elements after filter change
affects: [blog, solutions, resources, events listing pages using useScrollReveal with selector + filterKey]

# Tech tracking
tech-stack:
  added: []
  patterns: [gsap.utils.toArray in filterKey useEffect to override CSS opacity:0 on re-rendered children]

key-files:
  created: []
  modified:
    - src/hooks/useScrollReveal.ts

key-decisions:
  - "Child card opacity override happens inside the rAF callback alongside container fade — ensures DOM nodes exist before querying"
  - "selector added to filterKey useEffect dependency array — safe because selector is a stable string prop"

patterns-established:
  - "Filter change animation: fade container via rAF, then immediately set child.style.opacity='1' to override CSS initial state"

requirements-completed: [FIX-01, FIX-02]

# Metrics
duration: 2min
completed: 2026-03-28
---

# Phase 5 Plan 04: Fix Filter Blank Content Summary

**gsap.utils.toArray child opacity override in filterKey useEffect prevents card elements from staying invisible after filter changes**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-28T22:48:26Z
- **Completed:** 2026-03-28T22:50:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- filterKey useEffect now targets child card elements via gsap.utils.toArray(selector, el) inside the rAF callback
- Each matching child gets inline style.opacity = '1', overriding the CSS opacity:0 from globals.css
- selector added to useEffect dependency array for correctness

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix filterKey useEffect to target child elements** - `71c25ea` (fix)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `src/hooks/useScrollReveal.ts` - Added child opacity override in filterKey useEffect rAF callback; selector added to dependency array

## Decisions Made
- Child opacity is set inside the rAF callback (not before) — this ensures React has committed the new DOM nodes before gsap.utils.toArray queries them
- selector added to dependency array — stable string prop, no unnecessary re-runs

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All five bug-fix plans (05-01 through 05-04) are now complete
- Filter content visibility is fully fixed across /blog, /solutions, /resources, and /events
- Phase 5 is complete; ready to proceed to Phase 6 (Event Interactivity)

---
*Phase: 05-bug-fixes*
*Completed: 2026-03-28*
