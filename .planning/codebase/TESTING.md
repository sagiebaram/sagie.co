# Testing Patterns

**Analysis Date:** 2026-04-05

## Test Framework

**Runner:**
- Vitest v4.1.2
- Config: `vitest.config.ts` at project root
- Environment: Node.js (`environment: 'node'`)
- Globals: `globals: true` (no need to import `describe`, `test`, `expect`)

**Assertion Library:**
- Vitest built-in expect (compatible with Jest)

**Run Commands:**
```bash
npm test              # Run all tests (vitest run)
npm run test:watch   # Watch mode (vitest)
npm run test:coverage # Generate coverage report
```

**Coverage Configuration:**
- Provider: v8
- Reporters: text and JSON format
- Included: `src/lib/**/*.ts` (libraries only)
- Excluded: `src/lib/notion.ts`, `src/lib/notion-monitor.ts`, `src/lib/gsap.ts` (external API wrappers)

## Test File Organization

**Location:**
- Co-located in `__tests__` subdirectories next to source files
- Pattern: `src/lib/__tests__/[name].test.ts`
- Examples: `src/lib/__tests__/validation.test.ts`, `src/lib/__tests__/schemas.test.ts`

**Naming:**
- Test file: `[module-name].test.ts`
- Test suites: Descriptive PascalCase matching function/module name: `describe('withValidation')`, `describe('MembershipSchema')`

**Structure:**
```
src/lib/
├── validation.ts
├── schemas.ts
├── email.ts
└── __tests__/
    ├── validation.test.ts
    ├── schemas.test.ts
    └── email.test.ts
```

## Test Structure

**Suite Organization:**
```typescript
describe('withValidation', () => {
  const mockHandler = vi.fn().mockResolvedValue(Response.json({ success: true }))
  const handler = withValidation(MembershipSchema, mockHandler)

  // Shared setup for deterministic testing
  const FIXED_NOW = 1_700_000_000_000
  let dateSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    mockHandler.mockClear()
    dateSpy = vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW)
  })

  afterEach(() => {
    dateSpy.mockRestore()
  })

  test('test case description', async () => {
    // Arrange
    const req = makeRequest({ ... })
    // Act
    const res = await handler(req)
    // Assert
    expect(res.status).toBe(200)
  })
})
```

**Patterns:**
- Setup: `beforeEach()` for fixture reset and mock clearing (e.g., `mockHandler.mockClear()`)
- Teardown: `afterEach()` for cleanup (e.g., `dateSpy.mockRestore()`)
- Assertion: Expect chains for readable assertions: `expect(mockHandler).not.toHaveBeenCalled()`

**Helper Functions in Tests:**
- Test-specific helpers defined at describe block level: `function makeRequest(body, extraHeaders)` in `validation.test.ts`
- Fixtures defined as constants: `const VALID_MEMBERSHIP_BODY = { ... }`
- Reusable fixtures per schema: Each describe block defines its own valid object

## Mocking

**Framework:** Vitest `vi` object

**Setup Pattern:**
```typescript
import { vi, describe, test, expect, beforeEach } from 'vitest'

// Mock entire modules early
vi.mock('server-only', () => ({}))
vi.mock('@/env/server', () => ({
  env: {
    NODE_ENV: 'production',
    RESEND_API_KEY: 'mock-resend-key',
    ADMIN_EMAIL: 'hello@sagie.co',
  },
}))

// Mock class-based modules with state
const resendMockState = {
  send: vi.fn().mockResolvedValue({ id: 'mock-id' }),
}

vi.mock('resend', () => {
  return {
    Resend: class {
      emails = { send: (...args: unknown[]) => resendMockState.send(...args) }
    },
  }
})
```

**Mocking Patterns:**
- Module-level mocks at top of test file (before imports)
- State objects for managing mock return values across tests: `const resendMockState = { send: vi.fn() }`
- `.mockResolvedValue()` for async functions that succeed
- `.mockRejectedValueOnce()` for error testing: `resendMockState.send.mockRejectedValueOnce(sendError)`
- `.mockImplementation()` for complex behavior
- `.mockClear()` in `beforeEach()` to reset call count and arguments

**What to Mock:**
- External services (Resend, Sentry, Notion API)
- Environment variables and config
- Server-only markers
- Date/time for deterministic tests: `vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW)`
- HTTP requests/responses in unit tests

**What NOT to Mock:**
- Schema validation (Zod) - test actual parsing behavior
- Sanitization functions - test actual escaping
- Pure utility functions (string manipulation, formatting)
- Library functions being unit tested (only mock their dependencies)

## Fixtures and Factories

**Test Data:**
```typescript
// Named constants for reusability
const VALID_MEMBERSHIP_BODY = {
  fullName: 'Test User',
  email: 'test@example.com',
  role: 'Founder',
  country: 'IL',
  city: 'Tel Aviv',
  phone: '+972501234567',
}

// Fixture objects with realistic Notion page structure
const FULL_PAGE_FIXTURE = {
  id: 'page-abc-123',
  properties: {
    Title: { title: [{ plain_text: 'My Great Post' }] },
    Slug: { rich_text: [{ plain_text: 'my-great-post' }] },
    Category: { select: { name: 'Spotlight' } },
    // ... more properties
  },
}

// Variation for edge cases (minimal/empty)
const MINIMAL_PAGE_FIXTURE = {
  id: 'page-minimal-456',
  properties: {},
}
```

**Location:**
- Defined in describe blocks or at top of test file
- Reused across multiple test cases
- Destructuring used to create variations: `const { email: _email, ...rest } = validMembership`

**Factory Pattern:**
- Simple functions for common request creation: `function makeRequest(body, extraHeaders): Request`
- Fixtures declared as constants, not generated (for clarity and reproducibility)

## Coverage

**Requirements:** No explicit coverage threshold enforced (coverage runs but not required)

**View Coverage:**
```bash
npm run test:coverage
```

**Coverage Output:** Text and JSON reports generated by v8 provider

**Note:** Coverage generation includes `src/lib/**` but excludes external API wrappers (Notion, GSAP)

## Test Types

**Unit Tests:**
- Scope: Individual functions, schemas, utilities
- Approach: Test pure logic with mocked dependencies
- Examples: `validation.test.ts` tests `withValidation()` handler wrapper with mocked Zod schema
- Fixtures: Test data objects representing realistic inputs
- See: `src/lib/__tests__/schemas.test.ts` (620+ lines testing all Zod schema variations)

**Integration Tests:**
- Scope: Multiple modules working together (e.g., validation + email)
- Approach: Mock external services, test flow through libraries
- Example: `email.test.ts` tests `sendEmails()` with mocked Resend client and Sentry
- Database integration: Not tested (uses mocked Notion API)
- No dedicated E2E tests for integration flows

**E2E Tests:**
- Framework: Playwright (`@playwright/test` v1.58)
- Location: `tests/` directory with 3 active spec files:
  - `tests/smoke.spec.ts` — basic page load checks
  - `tests/content-pages.spec.ts` — content page rendering
  - `tests/forms.spec.ts` — form submission and blur validation
- Config: `baseURL` from `PLAYWRIGHT_TEST_BASE_URL` env var, Vercel bypass header
- CI: `workers: 1` in CI environment
- Network mocking: `page.route()` pattern for API interception
- Helpers: `mockApplicationRoute()` and `mockRoute()` for API mocking

## Common Patterns

**Async Testing:**
```typescript
test('valid body with sufficient elapsed time -> calls handler once', async () => {
  const req = makeRequest({ _t: FIXED_NOW - 5000, ...VALID_MEMBERSHIP_BODY })
  const res = await handler(req)
  expect(mockHandler).toHaveBeenCalledOnce()
  const data = await res.json() as { success: boolean }
  expect(data.success).toBe(true)
})
```

**Error Testing:**
```typescript
test('captures Sentry exception when resend.emails.send rejects', async () => {
  const sendError = new Error('Resend API error')
  resendMockState.send.mockRejectedValueOnce(sendError)

  await sendEmails('Membership Application', 'user@example.com', { name: 'Test User' })

  expect(Sentry.captureException).toHaveBeenCalled()
})
```

**Schema Validation Testing:**
```typescript
test('accepts a fully valid input', () => {
  const result = MembershipSchema.safeParse(validMembership)
  expect(result.success).toBe(true)
})

test('rejects missing email', () => {
  const { email: _email, ...rest } = validMembership
  const result = MembershipSchema.safeParse(rest)
  expect(result.success).toBe(false)
})

test('lowercases email', () => {
  const result = MembershipSchema.safeParse({ ...validMembership, email: 'JANE@EXAMPLE.COM' })
  expect(result.success).toBe(true)
  if (result.success) {
    expect(result.data.email).toBe('jane@example.com')
  }
})
```

**State-Isolated Tests:**
```typescript
// Fresh handler instance to isolate rate limit state
const RATE_TEST_IP = '10.0.99.1'
const rateMockHandler = vi.fn().mockResolvedValue(Response.json({ success: true }))
const rateHandler = withValidation(MembershipSchema, rateMockHandler)

test('6th request from same IP within window -> 429 with Retry-After header', async () => {
  const res = await rateHandler(makeRateRequest())
  expect(res.status).toBe(429)
  const retryAfter = res.headers.get('Retry-After')
  expect(retryAfter).not.toBeNull()
  expect(Number(retryAfter)).toBeGreaterThan(0)
})
```

**Type Safety in Assertions:**
```typescript
// Type-safe JSON parsing in tests
const data = await res.json() as { fieldErrors: Record<string, string[]> }
expect(data.fieldErrors).toBeDefined()

// Type-safe mock access
const calls = resendMockState.send.mock.calls
expect((calls[0]![0] as { to: string }).to).toBe('user@example.com')
```

## Test Coverage

**Core Modules with Tests:**
- `src/lib/validation.ts` - rate limiting, honeypot, timing checks, JSON parsing
- `src/lib/schemas.ts` - all Zod schemas (membership, chapter, ventures, solutions, blog post)
- `src/lib/email.ts` - send flow, error handling, non-production behavior
- `src/lib/blog.ts` - Notion page mapping, fixtures, fallbacks
- `src/lib/resources.ts`
- `src/lib/solutions.ts`
- `src/lib/events.ts`
- `src/lib/sanitize.ts`
- `src/lib/revalidate.ts`
- `src/lib/sitemap.ts`
- `src/lib/members.ts`

**Test Statistics:**
- Total test files: 11 (all in `src/lib/__tests__/`)
- Lines of test code: ~2000+ across all test files
- Largest test file: `schemas.test.ts` (620 lines covering schema validation variations)

---

*Testing analysis: 2026-04-05*
