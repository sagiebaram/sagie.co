---
phase: 05-bug-fixes
plan: "03"
subsystem: ui
tags: [react, forms, rate-limiting, error-handling, 429]

# Dependency graph
requires:
  - phase: 02-harden
    provides: "withValidation middleware with rate limiter returning 429 + Retry-After header"
provides:
  - "All 7 form components handle 429 responses with amber warning and timed button disable"
  - "rateLimitUntil + submitWarning state pattern for forms"
affects: [07-form-redesign]

# Tech tracking
tech-stack:
  added: []
  patterns: ["429 rate limit feedback pattern with submitWarning (separate from errors), rateLimitUntil timer, and useEffect cleanup"]

key-files:
  created: []
  modified:
    - src/components/forms/MembershipForm.tsx
    - src/components/forms/ChapterForm.tsx
    - src/components/forms/VenturesForm.tsx
    - src/components/forms/SolutionsForm.tsx
    - src/components/forms/SubmitPostForm.tsx
    - src/components/forms/SuggestEventForm.tsx
    - src/components/ui/SubmitResourceForm.tsx

key-decisions:
  - "submitWarning is separate state from errors object — prevents amber warning from disappearing when user edits fields (setErrors() during validation does not clear submitWarning)"
  - "SubmitResourceForm uses Math.max(0, ...) in useEffect instead of synchronous setState guard — avoids react-hooks/set-state-in-effect lint error in ui/ directory"
  - "rateLimitUntil !== null used as button disabled condition in SubmitResourceForm — avoids react-hooks/purity error for Date.now() in render; the useEffect timer is the source of truth"

patterns-established:
  - "Rate limit feedback: submitWarning state (amber, persists) separate from errors state (red, clears on validate)"
  - "rateLimitUntil timer: set to Date.now() + safeWait * 1000 on 429, cleared by useEffect setTimeout, null = no limit"
  - "Retry-After parsing: parseInt with isNaN guard, fallback 30s"

requirements-completed: [FIX-04]

# Metrics
duration: 4min
completed: 2026-03-28
---

# Phase 5 Plan 03: Rate Limit 429 Handling Summary

**All 7 form components now show an amber warning and disable the submit button on 429 responses, with Retry-After timer auto-clearing the lock**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-28T21:05:08Z
- **Completed:** 2026-03-28T21:09:27Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Fixed silent 200-on-429 bug across MembershipForm, ChapterForm, VenturesForm, SolutionsForm, SubmitPostForm, SuggestEventForm
- Fixed SubmitResourceForm which treated 429 as a generic error (red message) instead of a distinct amber warning
- Established `submitWarning` / `rateLimitUntil` state pattern that persists through field validation cycles

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix MembershipForm, ChapterForm, VenturesForm** - `a21c775` (fix)
2. **Task 2: Fix SolutionsForm, SubmitPostForm, SuggestEventForm, SubmitResourceForm** - `1494741` (fix)

## Files Created/Modified

- `src/components/forms/MembershipForm.tsx` - Added useEffect, submitWarning/rateLimitUntil state, 429 branch in handleSubmit, amber warning display, updated button disabled prop
- `src/components/forms/ChapterForm.tsx` - Same pattern as MembershipForm
- `src/components/forms/VenturesForm.tsx` - Same pattern as MembershipForm
- `src/components/forms/SolutionsForm.tsx` - Same pattern as MembershipForm
- `src/components/forms/SubmitPostForm.tsx` - Same pattern as MembershipForm
- `src/components/forms/SuggestEventForm.tsx` - Same pattern as MembershipForm
- `src/components/ui/SubmitResourceForm.tsx` - Adapted pattern for status-machine form; uses Math.max(0,...) in useEffect and rateLimitUntil !== null for button disabled to satisfy stricter lint rules in ui/ directory

## Decisions Made

- `submitWarning` is kept as separate state from `errors` so it persists when `setErrors()` is called during field validation — the amber warning stays visible even if the user edits a field after hitting the rate limit
- `SubmitResourceForm` uses `Math.max(0, rateLimitUntil - Date.now())` in the useEffect to avoid synchronous `setState` in the effect body, which is flagged as an error by the `react-hooks/set-state-in-effect` rule in the `ui/` directory
- `rateLimitUntil !== null` (no `Date.now()` comparison) used as the button disabled condition in SubmitResourceForm to avoid the `react-hooks/purity` lint error for calling `Date.now()` during render; the useEffect timer is the authoritative source of truth for whether the limit is active

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] SubmitResourceForm useEffect lint error in ui/ directory**
- **Found during:** Task 2 (SubmitResourceForm implementation)
- **Issue:** The `react-hooks/set-state-in-effect` rule (active only in `ui/`) flags synchronous `setState` inside an effect body; `react-hooks/purity` flags `Date.now()` in render expressions
- **Fix:** Used `Math.max(0, ...)` to eliminate the synchronous guard branch in useEffect; used `rateLimitUntil !== null` as the sole button disabled condition (timer-driven rather than Date.now()-comparison)
- **Files modified:** `src/components/ui/SubmitResourceForm.tsx`
- **Verification:** `npx eslint src/components/ui/SubmitResourceForm.tsx` passes with 0 errors
- **Committed in:** `1494741` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — lint-triggered bug fix for stricter rules in ui/ directory)
**Impact on plan:** Functionally equivalent fix; the timer-cleared state approach is actually the more idiomatic React pattern.

## Issues Encountered

The `src/components/ui/` directory has stricter ESLint rules (`react-hooks/purity`, `react-hooks/set-state-in-effect`) than `src/components/forms/`. The same `Date.now()` and synchronous-setState patterns that are valid in `forms/` require adjustment in `ui/`. The `Math.max(0, ...)` pattern and dropping the `Date.now()` render check resolved both errors cleanly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 7 forms are rate-limit-aware and show correct feedback tiers (amber 429, red non-429 error, success state)
- Phase 7 (Form Redesign) will replace these form components with react-hook-form; the `submitWarning`/`rateLimitUntil` pattern should be carried forward into the redesigned versions

---
*Phase: 05-bug-fixes*
*Completed: 2026-03-28*
