# Testing Patterns

**Analysis Date:** 2026-04-04

## Test Framework

**Runner:**
- Vitest v4.1.2
- Config: `vitest.config.ts`
- Environment: `node` (unit tests)

**Assertion Library:**
- Vitest built-in `expect()` function
- No external assertion library

**Run Commands:**
```bash
npm test              # Run all tests once
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report (v8 provider)
```

**Coverage Configuration:**
```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json'],
  include: ['src/lib/**/*.ts'],
  exclude: [
    'src/lib/notion.ts',
    'src/lib/notion-monitor.ts',
    'src/lib/gsap.ts',
  ],
}
```

## Test File Organization

**Location:**
- Co-located with source in `src/lib/__tests__/` directory
- Pattern: `src/lib/__tests__/[module].test.ts`

**Naming:**
- Test files: `[name].test.ts` for unit tests
- E2E tests: `tests/[name].spec.ts` for Playwright

**File Structure:**
```
src/lib/__tests__/
├── schemas.test.ts         # Zod schema validation
├── validation.test.ts      # withValidation() handler wrapper
├── email.test.ts           # sendEmails() function
├── sanitize.test.ts        # sanitizeForEmail() utilities
├── blog.test.ts            # getAllPosts() fetching
├── solutions.test.ts
├── resources.test.ts
├── events.test.ts
├── members.test.ts
├── sitemap.test.ts
└── revalidate.test.ts
```

## Test Structure

**Suite Organization:**
Using `describe()` blocks to group related tests by feature/schema:

```typescript
describe('MembershipSchema', () => {
  const validMembership = { ... }
  
  test('accepts a fully valid input', () => {
    // Test implementation
  })
  
  test('rejects missing email', () => {
    // Test implementation
  })
})
```

**Setup/Teardown Patterns:**

1. **Mock Setup (Module-level):**
```typescript
vi.mock('server-only', () => ({}))
vi.mock('@/env/server', () => ({
  env: { /* mocked config */ }
}))
```

2. **beforeEach() for Test Isolation:**
```typescript
beforeEach(() => {
  mockHandler.mockClear()
  dateSpy = vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW)
})

afterEach(() => {
  dateSpy.mockRestore()
})
```

3. **Global State Cleanup:**
When tests accumulate state (e.g., rate limiter), separate test suites for isolated state:
```typescript
// Each describe block gets its own handler instance
const mockHandler = vi.fn()
const handler = withValidation(MembershipSchema, mockHandler)
```

**Assertion Pattern:**
```typescript
test('example test', () => {
  const result = MembershipSchema.safeParse(validMembership)
  expect(result.success).toBe(true)
  if (result.success) {
    expect(result.data.email).toBe('jane@example.com')
  }
})
```

Type narrowing after `safeParse()` ensures `result.data` type safety.

## Mocking

**Framework:** Vitest built-in `vi` module

**Mock Patterns:**

1. **Module Mocking:**
```typescript
vi.mock('server-only', () => ({}))
vi.mock('resend', () => ({
  Resend: class { 
    emails = { send: (...args: unknown[]) => resendMockState.send(...args) }
  }
}))
```

2. **Function Mocking:**
```typescript
const mockHandler = vi.fn().mockResolvedValue(Response.json({ success: true }))
const mockQuery = vi.mocked(notion.databases.query)

mockQuery.mockResolvedValueOnce({ results: [FULL_PAGE_FIXTURE] } as never)
```

3. **Spy Mocking:**
```typescript
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW)

// After test:
consoleSpy.mockRestore()
dateSpy.mockRestore()
```

4. **Stateful Mock Objects:**
When a mock needs to persist state across multiple calls:
```typescript
const resendMockState = {
  send: vi.fn().mockResolvedValue({ id: 'mock-id' }),
}

vi.mock('resend', () => {
  return {
    Resend: class {
      emails = { send: (...args: unknown[]) => resendMockState.send(...args) }
    }
  }
})

// Later:
resendMockState.send.mockRejectedValueOnce(new Error('API error'))
```

**What to Mock:**
- External services: `resend`, `@sentry/nextjs`, `@notionhq/client`
- Server-only modules: `server-only` (mocked as empty)
- Environment variables: `@/env/server`
- Next.js built-ins: `next/cache`, `next/server`

**What NOT to Mock:**
- Zod schemas (test actual validation logic)
- Utility functions under test (`sanitizeForEmail`, `isRateLimited`)
- Standard library modules (`Date`, but may spy to control time)

## Fixtures and Factories

**Test Data:**
Test data defined at top of describe blocks for reuse:

```typescript
const validMembership = {
  fullName: 'Jane Doe',
  email: 'JANE@EXAMPLE.COM',
  role: 'Founder',
  country: 'IL',
  city: 'Tel Aviv',
  phone: '+972501234567',
}

const FULL_PAGE_FIXTURE = {
  id: 'page-abc-123',
  properties: {
    Title: { title: [{ plain_text: 'My Great Post' }] },
    // ... more properties
  }
}
```

**Factory Functions:**
Test helpers wrapped in functions for parameterization:

```typescript
function makeRequest(body: unknown, extraHeaders?: Record<string, string>): Request {
  return new Request('http://localhost/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    body: JSON.stringify(body),
  })
}
```

**Location:**
- Fixtures defined in test file near `describe()` block
- Shared across multiple test suites in same file
- Import actual types from source (e.g., `type BlogPost from '@/lib/blog'`)

## Coverage

**Requirements:** No explicit coverage threshold enforced

**View Coverage:**
```bash
npm run test:coverage
```

Generates text and JSON reports covering:
- `src/lib/**/*.ts` (all business logic)
- Excludes: `notion.ts`, `notion-monitor.ts`, `gsap.ts` (external SDK wrappers)

## Test Types

**Unit Tests:**
- Scope: Individual functions in isolation
- Approach: Mock external dependencies, test logic paths
- Location: `src/lib/__tests__/[name].test.ts`
- Examples:
  - `schemas.test.ts` — Tests Zod schemas with valid/invalid inputs
  - `validation.test.ts` — Tests `withValidation()` wrapper (honeypot, rate limiting, Zod integration)
  - `sanitize.test.ts` — Tests HTML entity escaping
  - `email.test.ts` — Tests email sending with mocked Resend service

**Integration Tests:**
- Scope: Multiple components/services together
- Approach: Mock only external APIs, test real data transformations
- Location: `src/lib/__tests__/` (same as unit, marked by test name)
- Examples:
  - `blog.test.ts` — Tests `getAllPosts()` with mocked Notion SDK, verifies field mapping

**E2E Tests:**
- Framework: Playwright v1.58.2
- Config: `playwright.config.ts`
- Location: `tests/[name].spec.ts`
- Environment: `http://localhost:3000` (configurable via `PLAYWRIGHT_TEST_BASE_URL`)
- Examples:
  - `forms.spec.ts` — Tests form submission flows (country/city selection, validation, success state)
  - `smoke.spec.ts` — Basic smoke tests
  - `content-pages.spec.ts` — Markdown content rendering

**Playwright Pattern:**
```typescript
import { test, expect } from '@playwright/test';

async function selectDropdownOption(page, fieldName, optionText) {
  await page.locator(`[data-dropdown="${fieldName}"]`).click()
  await page.locator(`#${fieldName}-listbox`).getByRole('option', { name: optionText }).click()
}

async function mockApplicationRoute(page, formName) {
  await page.route(`**/api/applications/${formName}`, async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    } else {
      await route.continue();
    }
  });
}

test('membership form submits and shows success state', async ({ page }) => {
  await mockApplicationRoute(page, 'membership');
  await page.goto('/apply');
  
  await page.fill('[name="fullName"]', 'Ada Lovelace');
  await page.fill('[name="email"]', 'ada@example.com');
  await selectDropdownOption(page, 'country', 'United Kingdom');
  await selectDropdownOption(page, 'city', 'London');
  
  await page.getByRole('button', { name: /submit application/i }).click();
  await expect(page.getByText('Application received')).toBeVisible({ timeout: 10000 });
});
```

## Common Patterns

**Async Testing:**

Vitest's global `expect()` with `resolves`/`rejects`:
```typescript
await expect(
  sendEmails('Membership Application', 'user@example.com', { name: 'Test' })
).resolves.not.toThrow()
```

For handlers returning `Response`:
```typescript
const res = await handler(req)
expect(res.status).toBe(422)
const data = await res.json() as { fieldErrors: Record<string, string[]> }
expect(data.fieldErrors).toBeDefined()
```

**Error Testing:**

1. Validation failure:
```typescript
test('rejects invalid email format', () => {
  const result = MembershipSchema.safeParse({ ...validMembership, email: 'not-an-email' })
  expect(result.success).toBe(false)
})
```

2. Exception capture:
```typescript
test('captures Sentry exception when resend.emails.send rejects', async () => {
  const sendError = new Error('Resend API error')
  resendMockState.send.mockRejectedValueOnce(sendError)
  
  await sendEmails('Membership Application', 'user@example.com', { name: 'Test User' })
  
  expect(Sentry.captureException).toHaveBeenCalled()
})
```

3. Non-throwing error handling:
```typescript
test('does not throw when resend.emails.send rejects', async () => {
  resendMockState.send.mockRejectedValue(new Error('Network error'))
  
  await expect(
    sendEmails('Membership Application', 'user@example.com', { name: 'Test' })
  ).resolves.not.toThrow()
})
```

**Field Transformation Testing:**

Testing Zod transforms that clean input:
```typescript
test('lowercases email', () => {
  const result = MembershipSchema.safeParse({ ...validMembership, email: 'JANE@EXAMPLE.COM' })
  expect(result.success).toBe(true)
  if (result.success) {
    expect(result.data.email).toBe('jane@example.com')
  }
})

test('trims whitespace from fullName', () => {
  const result = MembershipSchema.safeParse({ ...validMembership, fullName: '  Jane Doe  ' })
  expect(result.success).toBe(true)
  if (result.success) {
    expect(result.data.fullName).toBe('Jane Doe')
  }
})
```

**Rate Limiting Testing:**

Isolated handler per describe block to avoid state bleed:
```typescript
describe('withValidation - rate limiting', () => {
  const RATE_TEST_IP = '10.0.99.1'
  const rateMockHandler = vi.fn().mockResolvedValue(Response.json({ success: true }))
  const rateHandler = withValidation(MembershipSchema, rateMockHandler)
  
  test('first 5 requests from same IP succeed', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await rateHandler(makeRateRequest())
      expect(res.status).not.toBe(429)
    }
  })
  
  test('6th request from same IP within window -> 429', async () => {
    const res = await rateHandler(makeRateRequest())
    expect(res.status).toBe(429)
    const retryAfter = res.headers.get('Retry-After')
    expect(retryAfter).not.toBeNull()
  })
})
```

## Missing Test Coverage

Notable untested areas:
- Component rendering and interaction (no Jest/Vitest component tests; only E2E coverage)
- API routes beyond validation layer (Notion writes, email sends mocked)
- Error pages (`error.tsx` files) have console.error but no automated tests
- GSAP animations excluded from coverage (external library wrapper)

---

*Testing analysis: 2026-04-04*
