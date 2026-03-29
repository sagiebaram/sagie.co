---
phase: 08-admin-polish-404
plan: 01
subsystem: ui
tags: [react, nextjs, typescript, admin, revalidation]

# Dependency graph
requires:
  - phase: 03-features-globe
    provides: /api/revalidate endpoint with 401/200 response shapes
provides:
  - Per-button async status tracking (Map<string, ButtonStatus>) for admin revalidate page
  - Inline SVG feedback icons (Spinner, CheckIcon, XIcon) with auto-dismiss timers
  - 401 detection resetting to secret prompt with amber hint message
  - icon-spin and pulse-node keyframes in globals.css
affects: [08-02]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Per-button Map<string, Status> pattern for independent async feedback without global lock"
    - "timersRef + scheduleReset for auto-dismiss with stale timer cleanup on rapid clicks"
    - "Button variant class strings applied to native <button> elements (Button.tsx is <a>-only)"

key-files:
  created: []
  modified:
    - src/app/admin/revalidate/page.tsx
    - src/app/globals.css

key-decisions:
  - "Per-button Map state with functional updater (new Map(prev).set(k,v)) prevents stale closure mutation"
  - "timersRef stores timeout IDs per key; existing timer cleared before scheduling new one on rapid clicks"
  - "resetToPrompt(wasUnauthorized) cancels all pending timers and clears all state atomically"
  - "ALL_KEY sentinel '__all__' gives Refresh All its own independent status entry in the Map"

patterns-established:
  - "Spinner/CheckIcon/XIcon as co-located inline SVG functions — no external icon library needed for admin pages"
  - "ButtonContent({ status, label }) renders appropriate icon+label combination based on status enum"

requirements-completed: [POL-01, POL-02]

# Metrics
duration: 2min
completed: 2026-03-28
---

# Phase 08 Plan 01: Admin Revalidate — Per-Button Async Feedback Summary

**Per-button Map<string, ButtonStatus> state with Spinner/CheckIcon/XIcon SVG feedback, scheduleReset timer management, and 401-triggered auto-reset to secret prompt with amber hint**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-28T22:25:23Z
- **Completed:** 2026-03-28T22:26:58Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments

- Replaced single global `loading`/`result` state with `Map<string, ButtonStatus>` tracking — all 6 content-type buttons plus Refresh All now operate independently in parallel
- Added Spinner, CheckIcon, XIcon inline SVG components; ButtonContent renders appropriate icon based on per-button status
- Implemented scheduleReset with timersRef for stale-timer cleanup, 3s auto-dismiss for success/error, and 2s delayed reset on 401 with amber hint message
- Added `icon-spin` and `pulse-node` keyframes to globals.css with `prefers-reduced-motion` guard; `pulse-node` pre-staged for Plan 02

## Task Commits

Each task was committed atomically:

1. **Task 1: Refactor admin page to per-button status with 401 reset and Button styling** - `16e1e2d` (feat)

**Plan metadata:** (docs commit — see final)

## Files Created/Modified

- `src/app/admin/revalidate/page.tsx` - Complete refactor: ButtonStatus type, statuses Map, timersRef, scheduleReset, resetToPrompt, Spinner/CheckIcon/XIcon/ButtonContent SVG components, Button.tsx variant classes on native buttons
- `src/app/globals.css` - Added icon-spin + pulse-node @keyframes with prefers-reduced-motion media query

## Decisions Made

- `new Map(prev).set(key, status)` functional updater pattern prevents in-place mutation of React state Maps
- `timersRef.current` keyed by button key — existing timer for that key is cleared before scheduling new one, preventing timer accumulation on rapid clicks
- `resetToPrompt(wasUnauthorized)` is the single authoritative reset point — clears `secretEntered`, `secret`, `statuses`, and all timers in one call
- Button.tsx is an `<a>` tag and cannot accept onClick — applied its variant class strings directly to native `<button>` elements per the plan's interface spec

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `pulse-node` keyframe is pre-staged in globals.css for Plan 08-02 consumption
- Admin page compiles cleanly; per-button status architecture is in place
- No blockers for Phase 08 Plan 02

---
*Phase: 08-admin-polish-404*
*Completed: 2026-03-28*

## Self-Check: PASSED

- FOUND: src/app/admin/revalidate/page.tsx
- FOUND: src/app/globals.css
- FOUND: .planning/phases/08-admin-polish-404/08-01-SUMMARY.md
- FOUND commit: 16e1e2d
