# Testing Patterns

**Analysis Date:** 2026-03-28

## Test Framework

**Runner:**
- Vitest 4.1.2
- Config: `vitest.config.ts`
- Environment: Node.js
- Globals enabled (no explicit describe/test imports needed in global scope, but explicit imports used)

**Assertion Library:**
- Vitest built-in assertions via `expect()`
- Custom matchers available: `toHaveBeenCalledOnce()`, `resolves.not.toThrow()`

**Run Commands:**
```bash
npm run test              # Run all tests once
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report (v8 provider)
```

## Test File Organization

**Location:**
- Co-located in `src/lib/__tests__/` directory
- Pattern: Source file `src/lib/filename.ts` has test file `src/lib/__tests__/filename.test.ts`
- All test files use `.test.ts` extension (not `.spec.ts`)

**Naming:**
- Test files match source filenames: `validation.ts` → `validation.test.ts`
- Descriptive test names using describe blocks: `describe('MembershipSchema')`, `describe('withValidation')`

**Structure:**
```
src/lib/__tests__/
├── validation.test.ts      # Handler + rate limiting tests
├── schemas.test.ts         # Zod schema validation tests
├── email.test.ts           # Email sending tests
├── blog.test.ts            # Blog post mapping tests
├── solutions.test.ts       # Solution provider mapping tests
├── events.test.ts          # Event mapping tests
├── resources.test.ts       # Resource mapping tests
├── members.test.ts         # Member data tests
├── sitemap.test.ts         # Sitemap generation tests
└── revalidate.test.ts      # Revalidation tests
```

## Test Structure

**Suite Organization:**
```typescript
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest'

// Mock external dependencies FIRST
vi.mock('server-only', () => ({}))
vi.mock('@/env/server', () => ({
  env: { /* mock values */ }
}))

// Import the module being tested AFTER mocks
import { functionToTest } from '@/lib/module'

// -----------------------------------------------
// Fixtures
// -----------------------------------------------
const VALID_FIXTURE = { /* test data */ }

// -----------------------------------------------
// Tests
// -----------------------------------------------
describe('FunctionName', () => {
  beforeEach(() => {
    // Reset state
  })

  afterEach(() => {
    // Cleanup
  })

  test('does X when Y', () => {
    // Arrange
    // Act
    // Assert
  })
})
```

**Patterns:**
- Section dividers for organization: `// ---------------------------------------------------------------------------`
- Mock setup at module top before any imports
- Fixtures defined after mocks, before test suites
- One describe block per function/component being tested
- Each test follows Arrange-Act-Assert pattern (implicit)
- `beforeEach()` clears mocks and resets state
- `afterEach()` restores spies and cleans up

## Mocking

**Framework:** Vitest `vi.*` utilities

**Patterns:**

Mock server-only module:
```typescript
vi.mock('server-only', () => ({}))
```

Mock environment variables:
```typescript
vi.mock('@/env/server', () => ({
  env: {
    NOTION_TOKEN: 'mock-token',
    ALLOWED_ORIGINS: 'http://localhost:3000',
  }
}))
```

Mock Next.js utilities:
```typescript
vi.mock('next/cache', () => ({
  unstable_cache: (fn: unknown) => fn,  // Remove caching in tests
}))
```

Mock Notion client:
```typescript
vi.mock('@/lib/notion', () => ({
  notion: {
    databases: { query: vi.fn() },
    pages: { retrieve: vi.fn() },
  },
}))
```

Mock class-based services:
```typescript
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

Create function mocks:
```typescript
const mockHandler = vi.fn().mockResolvedValue(Response.json({ success: true }))
const handler = withValidation(MembershipSchema, mockHandler)
```

Mock Date for deterministic tests:
```typescript
const FIXED_NOW = 1_700_000_000_000
let dateSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  dateSpy = vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW)
})

afterEach(() => {
  dateSpy.mockRestore()
})
```

Spy on globals:
```typescript
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
// After test:
consoleSpy.mockRestore()
```

Mock return value changes:
```typescript
resendMockState.send.mockResolvedValueOnce({ id: 'success' })  // Next call
resendMockState.send.mockRejectedValueOnce(new Error('API error'))  // Next call
```

**What to Mock:**
- External APIs (Notion, Resend, Sentry)
- Environment variables and config
- File system operations
- Time-dependent functions (Date.now)
- Server-only imports
- Next.js utilities that have side effects (caching)

**What NOT to Mock:**
- Schema validation libraries (Zod) — test real validation logic
- Business logic functions — test integration of real implementations
- Utility functions (cn, getIP) — test with real implementations
- Type transformations and data mapping

## Fixtures and Factories

**Test Data:**

Create realistic fixtures with all fields:
```typescript
const FULL_MEMBERSHIP_FIXTURE = {
  fullName: 'Jane Doe',
  email: 'JANE@EXAMPLE.COM',
  role: 'Founder',
  location: 'Tel Aviv',
}
```

Create minimal fixtures for edge cases:
```typescript
const MINIMAL_MEMBERSHIP_FIXTURE = {}  // No properties
```

Create variant fixtures for specific scenarios:
```typescript
const SINGLE_WORD_NAME_FIXTURE = {
  providerName: 'Madonna',
  // ... other fields
}
```

Nest fixture data in Notion page format:
```typescript
const NOTION_PAGE_FIXTURE = {
  id: 'page-abc-123',
  properties: {
    Title: { title: [{ plain_text: 'Post Title' }] },
    Status: { select: { name: 'Published' } },
  },
}
```

Use optional chaining in test assertions:
```typescript
const event = events[0]!  // Non-null assertion in tests
expect(event.name).toBe('Expected Name')
```

**Location:**
- Fixtures defined at module scope after imports, before test suites
- Organized in `// Fixtures` section with comment divider
- Each describe block can reference module-level fixtures
- Fixtures intentionally shared across related test cases

## Coverage

**Requirements:**
- Configured but not enforced
- V8 provider with text and JSON reporters

**View Coverage:**
```bash
npm run test:coverage
```

**Coverage Configuration:**
- Include: `src/lib/**/*.ts`
- Exclude:
  - `src/lib/notion.ts` (external API wrapper)
  - `src/lib/notion-monitor.ts` (monitoring/debugging utility)
  - `src/lib/gsap.ts` (animation library wrapper)

## Test Types

**Unit Tests:**
- Scope: Single function or schema validation
- Approach: Test with mocked dependencies, realistic input data
- Example: `MembershipSchema.safeParse(validMembership)` tests validation rules
- Example: `withValidation` tests honeypot detection, rate limiting, JSON parsing separately

**Integration Tests:**
- Scope: Handler + validation + Notion API interaction
- Approach: Mock Notion client but test full request flow
- Example: `POST /api/applications/solutions` with valid data creates Notion page
- Example: Email sending called after Notion write succeeds

**E2E Tests:**
- Framework: Playwright 1.58.2
- Config: `playwright.config.ts` (not in test focus, but present in devDependencies)
- Used for: Full user workflows (form submission → confirmation)
- Not deeply analyzed in this focus

## Common Patterns

**Async Testing:**
```typescript
test('async operation succeeds', async () => {
  const result = await asyncFunction()
  expect(result).toBe(expectedValue)
})

// With mocks:
mockQuery.mockResolvedValueOnce({ results: [fixture] } as never)
const items = await getItems()
expect(items).toHaveLength(1)
```

**Error Testing:**
```typescript
// Capture Sentry exception
resendMockState.send.mockRejectedValueOnce(sendError)
await sendEmails('Form', 'user@example.com', { name: 'Test' })
expect(Sentry.captureException).toHaveBeenCalled()

// No throw on error
await expect(
  sendEmails('Form', 'user@example.com', { name: 'Test' })
).resolves.not.toThrow()
```

**Timing Tests:**
```typescript
// Use fixed time for determinism
const FIXED_NOW = 1_700_000_000_000
let dateSpy = vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW)

test('timing < 3000ms rejected', async () => {
  const req = makeRequest({ _t: FIXED_NOW - 100 })  // 100ms elapsed
  const res = await handler(req)
  expect(res.status).toBe(200)  // Silently rejected
})
```

**Rate Limiting Tests:**
```typescript
// Fresh handler instance per describe block to isolate rate state
const testHandler = withValidation(Schema, mockFn)

test('first 5 requests succeed', async () => {
  for (let i = 0; i < 5; i++) {
    const res = await testHandler(makeRequest())
    expect(res.status).not.toBe(429)
  }
})

test('6th request rate limited', async () => {
  const res = await testHandler(makeRequest())
  expect(res.status).toBe(429)
  expect(res.headers.get('Retry-After')).not.toBeNull()
})
```

**Schema Validation Tests:**
```typescript
test('accepts valid input', () => {
  const result = Schema.safeParse(validData)
  expect(result.success).toBe(true)
})

test('rejects invalid field', () => {
  const result = Schema.safeParse({ ...validData, email: 'not-an-email' })
  expect(result.success).toBe(false)
})

test('transforms data (trim, lowercase)', () => {
  const result = Schema.safeParse({ ...validData, email: 'USER@EXAMPLE.COM' })
  expect(result.success).toBe(true)
  if (result.success) {
    expect(result.data.email).toBe('user@example.com')
  }
})
```

**Notion Mapping Tests:**
```typescript
// Full fixture
mockQuery.mockResolvedValueOnce({ results: [FULL_FIXTURE] } as never)
const items = await getItems()
const item = items[0]!
expect(item.title).toBe('Expected Title')

// Minimal fixture (test defaults)
mockQuery.mockResolvedValueOnce({ results: [MINIMAL_FIXTURE] } as never)
const items = await getItems()
const item = items[0]!
expect(item.title).toBe('Untitled')  // Default value
```

---

*Testing analysis: 2026-03-28*
