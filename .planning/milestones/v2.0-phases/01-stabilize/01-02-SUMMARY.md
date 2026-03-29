---
phase: 01-stabilize
plan: 02
subsystem: ui, infra
tags: [globe, memory-leak, setTimeout, cleanup, dead-code, constants, npm, typeform]

# Dependency graph
requires: []
provides:
  - Globe component with cancelledRef cleanup and 50-retry limit on initGlobe
  - Clean constants files with no MOCK data or duplicate interfaces
  - package.json without @typeform/embed-react or dotenv
affects: [any phase using GlobeNetwork component, any phase reading constants files]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "cancelledRef pattern: useRef(false) with cleanup useEffect to guard async callbacks after unmount"
    - "Retry limit pattern: pass retries counter into recursive setTimeout calls, cap at 50"

key-files:
  created: []
  modified:
    - src/components/GlobeNetwork.tsx
    - src/constants/blog.ts
    - src/constants/solutions.ts
    - package.json
    - package-lock.json
  deleted:
    - src/constants/events.ts
    - src/constants/resources.ts

key-decisions:
  - "Deleted constants/events.ts and constants/resources.ts entirely — zero external imports confirmed before deletion"
  - "Kept MOCK_CITIES and MOCK_ARCS in GlobeNetwork.tsx — these are presentation data local to the component, not cross-file mock constants"
  - "next lint fails in Next.js 16 (lint sub-command removed) — verified TypeScript clean compile and successful build instead"

patterns-established:
  - "cancelledRef pattern: always add cancelledRef + cleanup useEffect when using setTimeout loops in React components"

requirements-completed: [BUG-02, CLN-01, CLN-02, CLN-03]

# Metrics
duration: 3min
completed: 2026-03-28
---

# Phase 1 Plan 2: Memory Leak Fix + Dead Code Deletion Summary

**Globe setTimeout loop stopped on unmount via cancelledRef, four MOCK_* constant arrays deleted, two duplicate type interfaces removed, and two unused npm packages uninstalled.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-28T00:22:09Z
- **Completed:** 2026-03-28T00:24:33Z
- **Tasks:** 2
- **Files modified:** 5 (2 deleted, 3 updated)

## Accomplishments
- Globe no longer leaks setTimeout calls when component unmounts — cancelledRef pattern guards initGlobe
- initGlobe now caps retries at 50 (5 seconds) preventing infinite retry loops
- Deleted MOCK_POSTS, MOCK_EVENTS, MOCK_RESOURCES, MOCK_PROVIDERS — no stale mock data in codebase
- Removed duplicate BlogPost interface from constants/blog.ts (real type lives in lib/blog.ts)
- Removed duplicate SolutionProvider interface from constants/solutions.ts (real type lives in lib/solutions.ts)
- Removed @typeform/embed-react and dotenv from package.json — both were orphaned after Typeform removal

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix Globe setTimeout cleanup and delete mock data + duplicate types** - `a57fd43` (fix)
2. **Task 2: Uninstall unused npm packages** - `c076e54` (chore)

**Plan metadata:** (pending final commit)

## Files Created/Modified
- `src/components/GlobeNetwork.tsx` - Added cancelledRef, cleanup useEffect, retries limit in initGlobe
- `src/constants/blog.ts` - Removed BlogPost interface and MOCK_POSTS; kept BLOG_CATEGORIES and BLOG_AUTHORS
- `src/constants/solutions.ts` - Removed SolutionProvider interface and MOCK_PROVIDERS; kept SolutionCategory, SERVICE_CATEGORIES, FILTER_OPTIONS
- `src/constants/events.ts` - Deleted (MOCK_EVENTS + SagieEvent interface, zero external imports)
- `src/constants/resources.ts` - Deleted (MOCK_RESOURCES + Resource interface, zero external imports)
- `package.json` - Removed @typeform/embed-react and dotenv
- `package-lock.json` - Regenerated after package removal

## Decisions Made
- Kept `MOCK_CITIES` and `MOCK_ARCS` in GlobeNetwork.tsx — they are presentation data local to the component, not the cross-file mock constants targeted by CLN-01.
- Deleted constants/events.ts and constants/resources.ts entirely after confirming zero external imports with grep.
- `next lint` fails in Next.js 16 (lint sub-command removed from CLI). Used TypeScript compile + `next build` for equivalent verification — both passed cleanly.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

`npx next lint` / `npm run lint` fails with "Invalid project directory provided, no such directory: .../lint" in Next.js 16.2.1 — the `lint` sub-command appears to have been removed from the Next.js CLI in v16. This is a pre-existing issue, not caused by these changes. TypeScript compilation (`npx tsc --noEmit`) and `npm run build` both passed cleanly and provide equivalent verification.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Globe memory leak fixed — safe to ship
- Constants files are clean — no confusion for future phases adding real data
- All TypeScript types for BlogPost and SolutionProvider should be imported from lib/ (lib/blog.ts, lib/solutions.ts) — never from constants/

---
*Phase: 01-stabilize*
*Completed: 2026-03-28*

## Self-Check: PASSED

- GlobeNetwork.tsx exists with cancelledRef: FOUND
- constants/blog.ts exists (BLOG_CATEGORIES/BLOG_AUTHORS only): FOUND
- constants/solutions.ts exists (SolutionCategory/SERVICE_CATEGORIES/FILTER_OPTIONS only): FOUND
- constants/events.ts deleted: CONFIRMED
- constants/resources.ts deleted: CONFIRMED
- Commit a57fd43 (fix): FOUND
- Commit c076e54 (chore): FOUND
- Commit ce3b3fb (docs/metadata): FOUND
- TypeScript: clean
- next build: passing
