---
phase: 05-bug-fixes
plan: 02
subsystem: ui
tags: [nuqs, url-params, filter, react, gsap, animation]

# Dependency graph
requires:
  - phase: 05-bug-fixes plan 01
    provides: nuqs installed, NuqsAdapter in root layout, useScrollReveal filterKey support, UseScrollRevealOptions exported
provides:
  - All 4 filter components (Blog, Solutions, Resources, Events) use nuqs for URL-persisted filter state
  - BlogFilter: useQueryStates for category+author dimensions with ?category=&author= URL params
  - SolutionsFilter: useQueryState for category with ?category= URL param
  - ResourcesDirectory: useQueryState for category with ?category= URL param, filterKey wired to grid
  - EventsPageClient: useQueryState for location with ?location= URL param, EventFilter rendered and wired
  - EventFilter converted to controlled component (stateless, receives active+onChange from parent)
affects: [05-bug-fixes, phase-06-event-interactivity]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - nuqs useQueryState/useQueryStates with history:replace + shallow:true for filter URL params
    - Controlled filter components — parent owns nuqs state, child receives active+onChange
    - filterKey passed to useScrollReveal — any filter change triggers 200ms CSS fade, skips stagger replay
    - Graceful degradation for location filter — filters on chapter field; shows all if field is null

key-files:
  created: []
  modified:
    - src/components/ui/BlogFilter.tsx
    - src/components/ui/SolutionsFilter.tsx
    - src/constants/solutions.ts
    - src/components/sections/ResourcesDirectory.tsx
    - src/components/ui/EventFilter.tsx
    - src/app/(marketing)/events/EventsPageClient.tsx

key-decisions:
  - "EventFilter is a controlled component consistent with ResourceFilter — parent (EventsPageClient) owns nuqs location state"
  - "EventsPageClient location filter matches against event.chapter field (graceful degradation — shows all events when chapter is null, correct when populated)"
  - "filterKey concatenation strategy for BlogFilter: category|author — any change to either dimension triggers fade"

patterns-established:
  - "Controlled filter component pattern: filter UI receives active prop + onChange, parent holds nuqs state"
  - "filterKey for useScrollReveal: pass activeCategory/activeLocation so filter changes fade content instead of replaying stagger"

requirements-completed: [FIX-01, FIX-02]

# Metrics
duration: 15min
completed: 2026-03-28
---

# Phase 05 Plan 02: nuqs Filter Migration Summary

**All 4 filterable pages (Blog, Solutions, Resources, Events) migrated to nuqs URL-persisted filter state with CSS fade on filter change via filterKey**

## Performance

- **Duration:** 15 min
- **Started:** 2026-03-28T21:12:00Z
- **Completed:** 2026-03-28T21:27:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Migrated BlogFilter to useQueryStates for two independent filter dimensions (?category=&author=)
- Migrated SolutionsFilter, ResourcesDirectory, and EventsPageClient to useQueryState for single-dimension filters
- Converted EventFilter to a controlled component — nuqs state lives in EventsPageClient parent
- All filters use history:replace + shallow:true (no new history entries on filter change)
- filterKey wired to useScrollReveal in all grid components — filter changes trigger 200ms fade, not stagger replay
- Standardized FILTER_OPTIONS 'all' to 'All' for nuqs clearOnDefault correctness

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate BlogFilter and SolutionsFilter to nuqs** - `922af20` (feat)
2. **Task 2: Migrate ResourcesDirectory and EventsPageClient to nuqs** - `27679a4` (feat)

**Plan metadata:** (docs commit — see final commit)

## Files Created/Modified
- `src/components/ui/BlogFilter.tsx` - useQueryStates for category+author with filterKey
- `src/components/ui/SolutionsFilter.tsx` - useQueryState for category with filterKey
- `src/constants/solutions.ts` - Standardized FILTER_OPTIONS 'all' to 'All'
- `src/components/sections/ResourcesDirectory.tsx` - useQueryState for category, filterKey on gridRef
- `src/components/ui/EventFilter.tsx` - Converted to controlled component (removed internal useState, added active prop)
- `src/app/(marketing)/events/EventsPageClient.tsx` - useQueryState for location filter, EventFilter rendered in upcoming section

## Decisions Made
- EventFilter converted to controlled component to match ResourceFilter pattern — parent holds state, child is pure UI
- Location filter matches on event.chapter field (graceful degradation): all events shown when chapter is null, filtered correctly once Notion data is populated
- filterKey uses string concatenation for BlogFilter (category|author) so any dimension change triggers the fade

## Deviations from Plan

None - plan executed exactly as written. EventFilter already had active+onChange props in the working tree — changes were consistent with plan spec.

## Issues Encountered
None — implementation was straightforward. Lint passed with 0 errors (12 pre-existing warnings in unrelated lib files).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 4 filter pages now have URL-persisted state — shareable/bookmarkable filter URLs work
- FIX-01 (URL filter params) and FIX-02 (GSAP re-trigger fix) fully satisfied
- Ready for Phase 05 Plan 03 (rate limit 429 handling) or Phase 06 (event interactivity)

---
*Phase: 05-bug-fixes*
*Completed: 2026-03-28*
