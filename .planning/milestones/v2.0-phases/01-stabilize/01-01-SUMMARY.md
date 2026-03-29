---
phase: 01-stabilize
plan: "01"
subsystem: api
tags: [zod, notion, forms, validation, next.js]

# Dependency graph
requires: []
provides:
  - MembershipForm submits successfully with all fields reaching Notion (location, whatTheyNeed, howTheyKnowSagie, referral)
  - ChapterForm submits whyLead, background, and chapterVision to Notion
  - App boots without NOTION_DEAL_PIPELINE_DB_ID or REVALIDATE_SECRET set
affects: [02-enhance, 03-grow]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Zod schema is the single source of truth — form field names must match schema keys exactly"
    - "Optional env vars use .optional() in EnvSchema; required ones do not"

key-files:
  created: []
  modified:
    - src/lib/schemas.ts
    - src/components/forms/MembershipForm.tsx
    - src/components/forms/ChapterForm.tsx
    - src/app/api/applications/chapter/route.ts
    - src/app/api/applications/membership/route.ts
    - src/env/server.ts

key-decisions:
  - "tier field given default('Explorer') so form never needs to send it — it's admin-assigned at review time"
  - "referral field added to MembershipSchema and Notion write — previously collected but silently dropped"
  - "NOTION_DEAL_PIPELINE_DB_ID and REVALIDATE_SECRET made optional — no routes consume them yet"

patterns-established:
  - "Form state keys must exactly match schema field names to avoid silent 422 failures"

requirements-completed: [BUG-01, BUG-03]

# Metrics
duration: 15min
completed: 2026-03-28
---

# Phase 1 Plan 01: Fix Form Field Alignment and Env Var Optionality Summary

**Zod schema alignment fix: MembershipForm field rename (city/building/whySagie -> location/whatTheyNeed/howTheyKnowSagie) eliminates 422 errors; ChapterForm background/chapterVision now reach Notion**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-28T00:00:00Z
- **Completed:** 2026-03-28T00:15:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- MembershipForm no longer returns 422 — `tier` defaults to Explorer, `location` field name now matches schema
- All MembershipForm user-entered data (location, whatTheyNeed, howTheyKnowSagie, referral) reaches Notion
- ChapterForm background and chapterVision fields now written to Notion (were previously stripped by validation)
- App starts without NOTION_DEAL_PIPELINE_DB_ID or REVALIDATE_SECRET set
- Full Next.js production build passes with no TypeScript errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix MembershipForm and ChapterForm field alignment with schemas** - `b03619d` (fix)
2. **Task 2: Add background and chapterVision to chapter route handler, and make env vars optional** - `e31820c` (fix)

**Plan metadata:** (pending final commit)

## Files Created/Modified
- `src/lib/schemas.ts` - Added tier default, referral field, background and chapterVision to ChapterSchema
- `src/components/forms/MembershipForm.tsx` - Renamed state keys: city->location, building->whatTheyNeed, whySagie->howTheyKnowSagie
- `src/components/forms/ChapterForm.tsx` - Renamed state key: whyCity->whyLead
- `src/app/api/applications/chapter/route.ts` - Added Background and Chapter Vision Notion property writes
- `src/app/api/applications/membership/route.ts` - Added Referral Notion property write
- `src/env/server.ts` - Made NOTION_DEAL_PIPELINE_DB_ID and REVALIDATE_SECRET optional

## Decisions Made
- `tier` given `.default('Explorer')` because it is admin-assigned at review time, not a user-facing choice
- `referral` added to the schema (not just form) so it is validated and written to Notion rather than silently dropped
- Env vars made optional rather than removed — they will be needed in future phases

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `npx next lint` and `npm run lint` fail with "Invalid project directory provided, no such directory: .../sagie.co/lint" — this appears to be a pre-existing issue in the repository unrelated to this plan's changes. TypeScript (`npx tsc --noEmit`) and `npx next build` both pass cleanly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Both forms (Membership and Chapter) are now fully functional and writing all user data to Notion
- App can boot without the two unused env vars
- Ready to proceed to Plan 01-02 (cleanup / CLN-series tasks)

---
*Phase: 01-stabilize*
*Completed: 2026-03-28*

## Self-Check: PASSED

- FOUND: src/lib/schemas.ts
- FOUND: src/components/forms/MembershipForm.tsx
- FOUND: src/components/forms/ChapterForm.tsx
- FOUND: src/app/api/applications/chapter/route.ts
- FOUND: src/app/api/applications/membership/route.ts
- FOUND: src/env/server.ts
- FOUND: .planning/phases/01-stabilize/01-01-SUMMARY.md
- FOUND commit: b03619d (Task 1)
- FOUND commit: e31820c (Task 2)
