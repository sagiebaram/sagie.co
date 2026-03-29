# Phase 4: Testing - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

CI pipeline fully green, core data-fetching and validation logic covered by unit tests, critical user flows covered by E2E tests. This phase adds Vitest configuration, unit tests for data-mapping and validation, and Playwright E2E tests for forms and content pages.

</domain>

<decisions>
## Implementation Decisions

### Unit test depth
- Happy path AND edge cases for all data-mapping functions (blog.ts, events.ts, resources.ts, solutions.ts)
- Edge cases include: missing Notion fields, empty arrays, malformed property data — validates the ?? fallback chains
- Isolated mapping tests — pass Notion-shaped response objects directly, no mocking of @notionhq/client SDK
- Test fixtures as typed constants within test files

### Zod schema and validation tests
- Test both Zod schemas (valid/invalid inputs) AND the withValidation HOF
- withValidation coverage includes: honeypot field rejection, timing check < 3000ms, Zod error formatting (422 with fieldErrors), JSON parse error handling (400)
- Each schema tested with valid input, missing required fields, and invalid field types

### E2E form strategy
- Mock API responses via Playwright page.route() — intercept network requests to /api/applications/* endpoints
- No real Notion writes during E2E — deterministic, no test data cleanup
- All 4 forms tested: membership, chapter, solutions, ventures
- Verify form submission flow: fill fields → submit → success response

### E2E content pages
- Visit each content listing page and verify key content renders
- Pages: blog listing, blog post (slug), events, resources, solutions, homepage
- Verify: page loads without error, content-specific elements visible

### Test file organization
- Unit tests co-located: src/lib/__tests__/*.test.ts
- E2E tests in top-level tests/ directory (existing Playwright convention)
- Naming: .test.ts for Vitest unit tests, .spec.ts for Playwright E2E

### CI and coverage
- Create vitest.config.ts with path alias (@/ → src/) and proper TypeScript support
- Track coverage via Vitest reporter but do not enforce thresholds — this is first testing pass
- CI unit job (npx vitest run) should pass green; coverage reported but non-blocking

### Claude's Discretion
- Exact test fixture data shapes — model on real Notion API responses
- Which edge cases per function — prioritize by fallback chain complexity
- Vitest config details (globals, environment, etc.)
- Playwright test helpers or page objects if useful
- Whether to add describe blocks or keep flat test() calls

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `playwright.config.ts`: Already configured with baseURL, Vercel bypass header, CI single-worker
- `tests/smoke.spec.ts`: Existing Playwright smoke test — pattern to follow for E2E
- `src/lib/schemas.ts`: All Zod schemas (MembershipSchema, ChapterSchema, VenturesSchema, etc.)
- `src/lib/validation.ts`: withValidation HOF wrapping all API POST handlers
- `src/lib/blog.ts`, `events.ts`, `resources.ts`, `solutions.ts`: Data-mapping functions to test

### Established Patterns
- API routes: `export const POST = withValidation(Schema, handler)` — consistent across all 4 form routes
- Data fetching: Functions receive Notion API responses and map via property access with ?? fallbacks
- TypeScript strict mode: noUncheckedIndexedAccess means tests must handle index access carefully
- Path alias: @/* → ./src/* — Vitest config needs this mapped

### Integration Points
- CI workflow: `.github/workflows/ci.yml` has unit job calling `npx vitest run` — needs vitest installed and configured
- Playwright config: baseURL from env var, Vercel bypass secret for preview deploys
- 4 API routes: membership, chapter, solutions, ventures — all follow withValidation pattern

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-testing*
*Context gathered: 2026-03-28*
