---
phase: 03-features-globe
plan: 02
subsystem: ui
tags: [globe, react-globe-gl, notion, geojson, three.js]

requires:
  - phase: 01-stabilize
    provides: GlobeNetwork component with cancelledRef cleanup pattern
provides:
  - Notion members.ts and chapters.ts data libs with ISR caching
  - GlobeShell server component + GlobeClient wrapper for real Notion data
  - Bundled GeoJSON in /public/data/
  - NOTION_CHAPTERS_DB_ID optional env var
affects: [globe, homepage]

tech-stack:
  added: []
  patterns: [server component data fetch + client render wrapper, static city-to-coordinates lookup]

key-files:
  created:
    - src/lib/members.ts
    - src/lib/chapters.ts
    - src/lib/__tests__/members.test.ts
    - src/components/GlobeClient.tsx
    - src/components/GlobeShell.tsx
    - public/data/ne_110m_admin_0_countries.geojson
  modified:
    - src/env/server.ts
    - src/components/GlobeNetwork.tsx

key-decisions:
  - "NOTION_CHAPTERS_DB_ID optional in env schema — globe falls back to empty chapters when not configured"
  - "Static CITY_COORDS lookup table — no geocoding API dependency"
  - "GlobeShell as Server Component fetches data, GlobeClient passes props to GlobeNetwork"
  - "Heat glow via scaled pointRadius/pointAltitude based on member count"

patterns-established:
  - "Server/Client split: GlobeShell (RSC) fetches data → GlobeClient (use client) renders"
  - "City coordinate lookup: static CITY_COORDS map in members.ts"

requirements-completed: [GLOBE-01, GLOBE-02]

duration: 6min
completed: 2026-03-28
---

# Plan 03-02: Globe Data Pipeline Summary

**GeoJSON bundled locally, Notion members/chapters data libs created, GlobeNetwork refactored from mock data to real Notion member/chapter data with heat glow**

## Performance

- **Duration:** ~6 min
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Bundled ne_110m GeoJSON in /public/data/ — no more runtime GitHub fetch (GLOBE-01)
- members.ts with getMemberCities() aggregating Notion Members DB by city with static lat/lng lookup
- chapters.ts with getChapters() querying Notion Chapters DB for active chapter data
- GlobeNetwork refactored to accept cities/chapters as props instead of MOCK_CITIES
- GlobeShell server component fetches data at ISR time, GlobeClient bridges to client renderer
- Heat glow effect: pointRadius/pointAltitude scale with member count (GLOBE-02)

## Task Commits

1. **Task 1: Data libs + GeoJSON** - `f7cc65c` (feat) — Bundle GeoJSON, create members.ts, chapters.ts, unit tests
2. **Task 2: Refactor GlobeNetwork** - `f9cd0b5` (feat) — Props-based GlobeNetwork, GlobeClient wrapper, GlobeShell server component

## Files Created/Modified
- `public/data/ne_110m_admin_0_countries.geojson` - Bundled country polygons (no GitHub fetch)
- `src/lib/members.ts` - getMemberCities() with unstable_cache, CITY_COORDS lookup
- `src/lib/chapters.ts` - getChapters() with unstable_cache
- `src/lib/__tests__/members.test.ts` - Unit tests for member city aggregation
- `src/components/GlobeShell.tsx` - Server component fetching member/chapter data
- `src/components/GlobeClient.tsx` - Client wrapper passing props to GlobeNetwork
- `src/components/GlobeNetwork.tsx` - Refactored to accept cities/chapters props, heat glow
- `src/env/server.ts` - Added optional NOTION_CHAPTERS_DB_ID

## Decisions Made
- NOTION_CHAPTERS_DB_ID made optional — globe gracefully degrades with empty chapters
- Static CITY_COORDS lookup table — avoids geocoding API dependency, easy to extend
- GlobeShell/GlobeClient split follows Next.js server/client boundary best practices

## Deviations from Plan
None - plan executed as specified

## User Setup Required
**External services require manual configuration:**
- Create Chapters database in Notion with schema: Name, Status, Location, Chapter Lead, Contact, Description, Founded, Agreement
- Set NOTION_CHAPTERS_DB_ID environment variable
- Update Members DB Location field to city names (Miami, Dallas, Tel Aviv, etc.)

## Next Phase Readiness
- Globe ready for production once Notion databases are configured
- Static CITY_COORDS table needs entries for all member cities

---
*Phase: 03-features-globe*
*Completed: 2026-03-28*
