# Testing

## Current State

Testing infrastructure is **configured but largely unused**. Only a single smoke test exists.

## Frameworks

| Framework | Purpose | Status |
|-----------|---------|--------|
| Playwright | E2E testing | Configured, 1 smoke test |
| Vitest | Unit/integration | Referenced in CI but **not installed** |

## Test Files

### Playwright E2E
- `tests/smoke.spec.ts` — Single test checking homepage title loads
- Config: `playwright.config.ts` — Chromium only, `baseURL: http://localhost:3000`

### Unit Tests
- **None exist.** No `*.test.ts` or `*.spec.ts` files in `src/`.

## CI Pipeline

- `.github/workflows/ci.yml` — Runs lint, type-check, and references unit tests
- `.github/workflows/e2e-preview.yml` — Playwright E2E against Vercel preview deployments

## Coverage Gaps

### Critical (no tests at all)
- **API routes:** 7 endpoints with Zod validation, Notion writes, honeypot logic — zero test coverage
- **Zod schemas:** `src/lib/schemas.ts` — 6 schemas untested
- **Data fetching:** `src/lib/blog.ts`, `events.ts`, `resources.ts`, `solutions.ts` — Notion response mapping untested
- **Form components:** 6 forms with client-side validation — untested
- **`withValidation()` HOF:** Core middleware wrapping all API routes — untested

### Infrastructure Issues
- `vitest` referenced in CI workflow but not in `package.json` — unit test CI step would fail
- No mocking strategy for Notion API
- No test fixtures or factories
- No coverage thresholds configured

## Recommended Expansion

1. Install Vitest and add unit tests for Zod schemas and data mapping functions
2. Add API route integration tests using Playwright's `request` API
3. Add form interaction E2E tests
4. Set up Notion API mocking for lib module tests
