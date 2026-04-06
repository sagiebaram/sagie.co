# Track 7: Test Coverage Expansion

**Branch:** `test/coverage-expansion`
**Priority:** Medium | **Effort:** L (separate agent — run in parallel)
**Sprint:** 04-05-2026 (04-06 → 04-07)

---

## Goal

Generate comprehensive unit tests and E2E tests for untested modules and critical user flows.

## Notion Tracker Items

| Task | Page ID | Priority |
|------|---------|----------|
| Track 7: Test Coverage Expansion | 33a5efbd-09e3-812c-98c9-d196979e84fe | Medium |

**On start:** set status to "In Development"
**On PR:** set status to "In Review" + add PR URL
**On merge:** set status to "Done"

## Files to Create/Modify

- `src/lib/__tests__/validation.test.ts` — withValidation HOF tests
- `src/lib/__tests__/email.test.ts` — sendEmails tests (if not existing)
- `src/lib/__tests__/blog.test.ts` — blog data transformation tests
- `src/lib/__tests__/events.test.ts` — events data transformation tests
- `src/lib/__tests__/members.test.ts` — members data tests
- `src/lib/__tests__/chapters.test.ts` — chapters data tests
- `src/lib/__tests__/resources.test.ts` — resources data tests
- `src/lib/__tests__/solutions.test.ts` — solutions data tests
- `src/lib/__tests__/calendar.test.ts` — calendar integration tests
- `tests/homepage.spec.ts` — E2E homepage critical path
- `tests/forms.spec.ts` — E2E form submission flows
- `tests/blog.spec.ts` — E2E blog navigation + slug rendering
- `tests/navigation.spec.ts` — E2E nav links, footer links, 404

## Acceptance Criteria

- [ ] Unit tests exist for ALL lib modules (validation, email, blog, events, members, chapters, resources, solutions, calendar)
- [ ] Unit tests cover: valid data, invalid data, edge cases, error paths
- [ ] E2E tests cover: homepage load, form submission (at least membership), blog listing + slug, 404 page
- [ ] API error path tests: rate limiting returns 429, invalid data returns 422, Notion failure returns 500
- [ ] Ventures form E2E: verify founder vs investor Type property differentiation
- [ ] All tests pass: `npm run test:ci` and `npx playwright test`
- [ ] No snapshot tests (project convention)

## Technical Context

- **Unit testing:** Vitest 4.1.2 with `@vitest/coverage-v8`. Mocking: `vi.mock()` for modules.
- **Commonly mocked:** `server-only`, `@notionhq/client`, `resend`, `@sentry/nextjs`
- **Fixture pattern:** Module-level constants named `FULL_PAGE_FIXTURE`, `MINIMAL_EVENT_FIXTURE` — must mirror real Notion API response shapes.
- **E2E:** Playwright 1.58.2. CI runs single worker. Base URL from `PLAYWRIGHT_TEST_BASE_URL` or localhost:3000.
- **Bypass header:** `x-vercel-protection-bypass` with `VERCEL_AUTOMATION_BYPASS_SECRET` for CI preview testing.

## Implementation Details

1. **Unit tests — pattern to follow:**
   - Read existing tests in `src/lib/__tests__/` to understand the mocking pattern
   - For each lib module: create fixtures from real Notion API shapes, test the transformation functions, test error handling
   - For validation.ts: test rate limiting (mock Date.now), honeypot detection, Zod schema validation, all error responses

2. **E2E tests — critical paths:**
   - Homepage: loads, all sections visible, globe renders (or fallback), nav works
   - Forms: navigate to /apply, fill out membership form, submit, verify success state
   - Blog: listing loads, filters work, click into a post, post renders correctly
   - Navigation: all nav links resolve, footer links work, /nonexistent returns 404 page

3. **Run tests before marking done:**
   - `npm run test:ci` — all unit tests pass
   - `npx playwright test` — all E2E tests pass (requires dev server running)
