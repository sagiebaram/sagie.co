---
phase: 05-bug-fixes
plan: 01
subsystem: ui
tags: [nuqs, gsap, scroll-trigger, bfcache, animation, react-hooks]

# Dependency graph
requires: []
provides:
  - nuqs installed and NuqsAdapter wrapping all app children in root layout
  - GSAPCleanup bfcache-aware with pagehide/pageshow handlers
  - useScrollReveal filterKey option for CSS opacity fade on filter changes
affects: [05-02, any phase using URL state or scroll-reveal animations]

# Tech tracking
tech-stack:
  added: [nuqs@2.8.9]
  patterns:
    - NuqsAdapter at root layout for app-wide URL state management
    - bfcache-safe lifecycle using pagehide/pageshow (not beforeunload/unload)
    - Two-mode animation pattern: GSAP stagger on mount, 200ms CSS fade on filter change

key-files:
  created: []
  modified:
    - src/app/layout.tsx
    - src/components/ui/GSAPCleanup.tsx
    - src/hooks/useScrollReveal.ts
    - package.json

key-decisions:
  - "nuqs installed with --legacy-peer-deps due to pre-existing @eslint/js peer conflict (not caused by nuqs)"
  - "UseScrollRevealOptions exported so Plan 02 filter components can type filterKey usage"
  - "filterKey useEffect skips mount via isFirstRender ref — scroll-reveal GSAP handles initial visibility"

patterns-established:
  - "bfcache pattern: pagehide kills ScrollTrigger instances; pageshow with e.persisted calls refresh()"
  - "filter animation pattern: set opacity 0, then rAF to set transition + opacity 1 for 200ms fade"

requirements-completed: [FIX-01, FIX-02, FIX-03]

# Metrics
duration: 5min
completed: 2026-03-28
---

# Phase 5 Plan 01: Bug Fixes Infrastructure Summary

**nuqs installed with NuqsAdapter at root, GSAPCleanup bfcache-hardened via pagehide/pageshow, and useScrollReveal extended with filterKey-driven 200ms CSS opacity fade**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-28T21:04:56Z
- **Completed:** 2026-03-28T21:09:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- nuqs 2.8.9 installed; NuqsAdapter wraps all page children in root layout, enabling useQueryState across the entire app
- GSAPCleanup rewritten with pagehide (kills triggers on forward nav) and pageshow (refreshes triggers on bfcache restore), fixing the back/forward blank page bug without blocking bfcache
- useScrollReveal gains optional filterKey: skips mount animation (GSAP handles that), then applies a 200ms CSS opacity fade on subsequent key changes — two distinct animation modes per the FIX-02 requirement

## Task Commits

Each task was committed atomically:

1. **Task 1: Install nuqs and add NuqsAdapter to root layout** - `d604b98` (feat)
2. **Task 2: Fix GSAPCleanup for bfcache and extend useScrollReveal with filterKey** - `40f556c` (feat)

## Files Created/Modified

- `src/app/layout.tsx` - Added NuqsAdapter import and wraps children in body
- `src/components/ui/GSAPCleanup.tsx` - Replaced minimal cleanup with bfcache-aware pagehide/pageshow handlers
- `src/hooks/useScrollReveal.ts` - Added filterKey option, second useEffect for CSS fade, exported interface
- `package.json` / `package-lock.json` - nuqs@2.8.9 added as dependency

## Decisions Made

- **--legacy-peer-deps for npm install:** Pre-existing @eslint/js@10 vs eslint@9 peer conflict in the project prevented clean install. Used --legacy-peer-deps as the safe workaround — this conflict predates this plan.
- **Exported UseScrollRevealOptions interface:** Plan 02 filter components will pass filterKey; exporting the interface prevents repetition and enables typed usage downstream.
- **isFirstRender ref pattern for filterKey effect:** The filterKey useEffect must skip the initial mount because GSAP's useLayoutEffect owns the first-render animation. A ref flag (not state) avoids triggering additional renders.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

Pre-existing npm peer dependency conflict (@eslint/js@10 requires eslint@10 but project has eslint@9). Resolved with `--legacy-peer-deps`. This is a pre-existing project configuration issue unrelated to this plan's scope.

## User Setup Required

None - no external service configuration required.

## Self-Check: PASSED

All files confirmed present on disk. Commits d604b98 and 40f556c confirmed in git log.

## Next Phase Readiness

- Plan 02 can now use `useQueryState` from nuqs anywhere in the app
- Filter components can pass `filterKey` to `useScrollReveal` to get the two-mode animation behavior
- bfcache back/forward blank page bug is fixed at the infrastructure level

---
*Phase: 05-bug-fixes*
*Completed: 2026-03-28*
