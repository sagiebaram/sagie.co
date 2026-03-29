---
phase: 04-testing
plan: 01
subsystem: testing
tags: [vitest, zod, validation, unit-tests, coverage-v8]

# Dependency graph
requires:
  - phase: 02-harden
    provides: withValidation HOF and all Zod schemas that these tests cover
provides:
  - Vitest unit test infrastructure with @/ alias and v8 coverage
  - 38 unit tests for MembershipSchema, ChapterSchema, VenturesSchema, SolutionsSchema
  - 7 unit tests for withValidation (honeypot, timing, JSON error, Zod error, valid flow, rate limit)
affects: [04-02-data-mapping, CI unit job]

# Tech tracking
tech-stack:
  added: [vitest@4.1.2, @vitest/coverage-v8@4.1.2]
  patterns: [vi.mock('server-only') required at top of all lib test files, isolated rate-limit IP per describe block]

key-files:
  created:
    - vitest.config.ts
    - src/lib/__tests__/schemas.test.ts
    - src/lib/__tests__/validation.test.ts
  modified:
    - package.json

key-decisions:
  - "vitest.config.ts include pattern restricted to src/**/*.test.ts — prevents Playwright smoke.spec.ts from being picked up by Vitest runner"
  - "Rate limiter tests use a dedicated IP (10.0.99.1) and isolated handler instance to avoid accumulating state from core validation tests"
  - "Date.now spied on with vi.spyOn for deterministic timing tests — avoids machine-speed flakiness"

patterns-established:
  - "Pattern: vi.mock('server-only', () => ({})) as first statement in all src/lib/__tests__/*.test.ts files"
  - "Pattern: vi.mock('@/env/server', ...) with full env object when validation.ts is under test"
  - "Pattern: afterEach(() => dateSpy.mockRestore()) to clean up Date.now spy between tests"
  - "Pattern: separate describe block with unique IP for rate limit tests — isolates module-level rateStore state"

requirements-completed: [TEST-01, TEST-03]

# Metrics
duration: 8min
completed: 2026-03-28
---

# Phase 04 Plan 01: Vitest Setup and Schema/Validation Tests Summary

**Vitest 4.1.2 installed with @/ path alias, v8 coverage, and 45 passing unit tests covering all Zod schemas and withValidation middleware paths**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-28T10:31:41Z
- **Completed:** 2026-03-28T10:39:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Installed vitest@4.1.2 and @vitest/coverage-v8, configured with @/ alias mapped to ./src, node environment, v8 coverage
- 38 schema tests across all 4 schemas (valid input, missing required fields, invalid types, whitespace trimming, email lowercasing)
- 7 validation tests covering every control flow branch in withValidation (honeypot, timing, JSON parse error, Zod 422, valid flow, rate limit 429 with Retry-After)
- CI unit job (`npx vitest run`) now exits 0 with 45 passing tests

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Vitest and create configuration** - `b2aa90d` (chore)
2. **Task 2: Unit tests for Zod schemas and withValidation middleware** - `65f9d23` (feat)

**Plan metadata:** TBD (docs: complete plan)

## Files Created/Modified
- `vitest.config.ts` - Vitest config with @/ alias, node environment, v8 coverage, include pattern scoped to src/**/*.test.ts
- `package.json` - Added test, test:watch, test:coverage scripts; vitest and @vitest/coverage-v8 as devDependencies
- `src/lib/__tests__/schemas.test.ts` - 38 unit tests for MembershipSchema, ChapterSchema, VenturesSchema, SolutionsSchema
- `src/lib/__tests__/validation.test.ts` - 7 unit tests for withValidation HOF

## Decisions Made
- Scoped vitest `include` to `src/**/*.test.ts` to prevent Playwright's `tests/smoke.spec.ts` from being discovered by Vitest (Playwright's `test()` throws when called outside its runner context)
- Rate limit tests placed in a separate describe block using a unique x-forwarded-for IP (`10.0.99.1`) and fresh handler instance — the rate limiter uses a module-level Map that persists across tests, so isolation is achieved by IP segregation rather than module reset
- Used `vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW)` with `afterEach` restore for deterministic timing tests, following the research recommendation to avoid machine-speed flakiness

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Vitest was picking up `tests/smoke.spec.ts` (Playwright) and failing with "Playwright Test did not expect test() to be called here". Fixed by adding `include: ['src/**/*.test.ts']` to vitest.config.ts test options. This is a Rule 3 (blocking) auto-fix.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Vitest infrastructure ready for Plan 04-02 (data mapping unit tests for blog.ts, events.ts, resources.ts, solutions.ts)
- vi.mock() patterns established and validated — reuse for all subsequent lib test files
- Coverage reporting works; `npm run test:coverage` produces text and JSON output

## Self-Check: PASSED

All created files verified on disk. All task commits verified in git log.

---
*Phase: 04-testing*
*Completed: 2026-03-28*
