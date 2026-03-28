# Testing Patterns

**Analysis Date:** 2026-03-28

## Test Framework

**Runner:**
- Playwright `^1.58.2`
- Config: `playwright.config.ts` (excluded from `tsconfig.json` compilation)

**Assertion Library:**
- Playwright built-in `expect`

**Run Commands:**
```bash
npx playwright test              # Run all tests
npx playwright test --ui         # Interactive UI mode
npx playwright test --reporter=html  # HTML report
```

**No unit test framework present** — Jest, Vitest, and similar are not installed. There are no `.test.ts` or `.test.tsx` files.

## Test File Organization

**Location:**
- All tests in `tests/` directory at project root
- Single file currently: `tests/smoke.spec.ts`

**Naming:**
- Pattern: `[description].spec.ts`

**Structure:**
```
tests/
└── smoke.spec.ts     # Smoke/E2E tests only
```

## Test Structure

**Suite Organization:**
```typescript
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/SAGIE/i);
});
```

**Patterns:**
- Tests use individual `test()` calls — no `describe` blocks in current code
- Async/await throughout
- No setup/teardown hooks present

## Playwright Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL ?? 'http://localhost:3000',
    extraHTTPHeaders: {
      'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET ?? '',
    },
  },
  workers: process.env.CI ? 1 : undefined,
});
```

**Key details:**
- Base URL configurable via `PLAYWRIGHT_TEST_BASE_URL` env var — defaults to `http://localhost:3000`
- Vercel preview protection bypass via `VERCEL_AUTOMATION_BYPASS_SECRET` header — allows running against Vercel preview deployments
- CI mode: single worker (`workers: 1`) to prevent flakiness
- No browser projects configured explicitly — uses Playwright defaults (Chromium)

## Mocking

**Framework:** None

**Patterns:**
- No mocking infrastructure present — tests run against live server
- No API mocking (MSW, etc.) configured

## Fixtures and Factories

**Test Data:**
- None — current tests navigate to live pages only

**Location:**
- No fixtures directory

## Coverage

**Requirements:** None enforced

**View Coverage:**
- Not configured

## Test Types

**Unit Tests:**
- Not present — no unit test framework installed

**Integration Tests:**
- Not present

**E2E Tests:**
- Framework: Playwright
- Scope: Smoke tests only — verifies page title loads
- File: `tests/smoke.spec.ts`

## Common Patterns

**Async Testing:**
```typescript
test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/SAGIE/i);
});
```

**Adding New Tests:**
- Add `.spec.ts` files to `tests/`
- Use `page.goto('/')` with relative paths — base URL injected from config
- Use `expect(page).toHaveTitle()`, `expect(page.locator(...)).toBeVisible()`, etc.
- For Vercel preview testing, set `PLAYWRIGHT_TEST_BASE_URL` and `VERCEL_AUTOMATION_BYPASS_SECRET` env vars

## Testing Gaps

**Not tested:**
- Form submissions and API route behavior
- Client-side validation logic in form components
- Notion data fetching (`src/lib/blog.ts`, `src/lib/events.ts`, etc.)
- Animation and scroll reveal behavior
- All apply pages (`/apply/*`)
- Error states and 404 page

**Coverage is minimal** — only a single homepage title check exists. The test suite is a placeholder skeleton.

---

*Testing analysis: 2026-03-28*
