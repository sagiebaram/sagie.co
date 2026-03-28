# Phase 04: Testing - Research

**Researched:** 2026-03-28
**Domain:** Vitest unit testing + Playwright E2E for Next.js 15 / TypeScript project
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Unit test depth**
- Happy path AND edge cases for all data-mapping functions (blog.ts, events.ts, resources.ts, solutions.ts)
- Edge cases include: missing Notion fields, empty arrays, malformed property data — validates the ?? fallback chains
- Isolated mapping tests — pass Notion-shaped response objects directly, no mocking of @notionhq/client SDK
- Test fixtures as typed constants within test files

**Zod schema and validation tests**
- Test both Zod schemas (valid/invalid inputs) AND the withValidation HOF
- withValidation coverage includes: honeypot field rejection, timing check < 3000ms, Zod error formatting (422 with fieldErrors), JSON parse error handling (400)
- Each schema tested with valid input, missing required fields, and invalid field types

**E2E form strategy**
- Mock API responses via Playwright page.route() — intercept network requests to /api/applications/* endpoints
- No real Notion writes during E2E — deterministic, no test data cleanup
- All 4 forms tested: membership, chapter, solutions, ventures
- Verify form submission flow: fill fields → submit → success response

**E2E content pages**
- Visit each content listing page and verify key content renders
- Pages: blog listing, blog post (slug), events, resources, solutions, homepage
- Verify: page loads without error, content-specific elements visible

**Test file organization**
- Unit tests co-located: src/lib/__tests__/*.test.ts
- E2E tests in top-level tests/ directory (existing Playwright convention)
- Naming: .test.ts for Vitest unit tests, .spec.ts for Playwright E2E

**CI and coverage**
- Create vitest.config.ts with path alias (@/ → src/) and proper TypeScript support
- Track coverage via Vitest reporter but do not enforce thresholds — this is first testing pass
- CI unit job (npx vitest run) should pass green; coverage reported but non-blocking

### Claude's Discretion
- Exact test fixture data shapes — model on real Notion API responses
- Which edge cases per function — prioritize by fallback chain complexity
- Vitest config details (globals, environment, etc.)
- Playwright test helpers or page objects if useful
- Whether to add describe blocks or keep flat test() calls

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TEST-01 | Vitest installed and configured, CI unit test step passes | Vitest v4.x install, vitest.config.ts with @/ alias, server-only/env mock strategy |
| TEST-02 | Unit tests for blog.ts, events.ts, resources.ts, solutions.ts data mapping | vi.mock() for server-only + env + notion, fixture patterns, mapEvent isolation |
| TEST-03 | Unit tests for all Zod schemas and withValidation middleware | schemas.ts field coverage, withValidation timing/honeypot/parse error paths |
| TEST-04 | E2E tests for form submissions and content page rendering | page.route() mock pattern, existing playwright.config.ts, smoke.spec.ts convention |
</phase_requirements>

---

## Summary

This phase adds Vitest for unit testing and extends the existing Playwright setup for E2E coverage. Vitest v4.x is the current version (requires Vite ≥ 6, Node ≥ 20 — both satisfied by this project). The project's CI already has a `unit` job that calls `npx vitest run`, so installing and configuring Vitest will immediately make CI green.

The primary technical challenge is that `blog.ts`, `events.ts`, `resources.ts`, and `solutions.ts` all import from `@/env/server`, which itself imports `server-only`. The `server-only` package throws unconditionally when imported outside a React Server Components context — meaning Vitest's Node environment will throw on module import unless these are mocked. The correct solution is `vi.mock()` stubs at the top of each test file for `server-only`, `@/env/server`, and `@/lib/notion`, allowing the mapping logic to be tested in isolation. The `mapEvent()` function in `events.ts` is already exported as a standalone function and can be tested directly; the other files have inline map lambdas that are tested by calling the exported async functions with mocked dependencies.

For E2E, the existing `playwright.config.ts` is already production-ready. The `page.route()` API intercepts outbound POST requests before they reach the server, returning deterministic mock responses. This avoids writing real Notion data during tests. Playwright's existing smoke test in `tests/smoke.spec.ts` establishes the file/naming conventions to follow.

**Primary recommendation:** Install `vitest` and `@vitest/coverage-v8`, configure with `vi.mock()` for server-only dependencies, and use `page.route()` for all E2E form tests.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vitest | ^4.1.2 | Unit test runner, assertion library, mocking | Vite-native, already referenced in CI `npx vitest run` |
| @vitest/coverage-v8 | ^4.1.2 | V8-based coverage reporter | Ships with vitest, zero extra config |
| @playwright/test | ^1.58.2 | E2E test runner | Already installed as devDep |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| vite | (peer, already in next) | Module resolution for vitest config | Vitest uses Vite under the hood |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| vitest | jest | Vitest is already referenced in CI; jest requires babel transform for ESM |
| @vitest/coverage-v8 | @vitest/coverage-istanbul | V8 is faster and zero-config; istanbul requires babel |

**Installation:**
```bash
npm install --save-dev vitest @vitest/coverage-v8
```

---

## Architecture Patterns

### Recommended Project Structure

```
vitest.config.ts              # new — root-level Vitest config
src/
└── lib/
    └── __tests__/
        ├── blog.test.ts      # new
        ├── events.test.ts    # new
        ├── resources.test.ts # new
        ├── solutions.test.ts # new
        ├── schemas.test.ts   # new
        └── validation.test.ts # new
tests/
├── smoke.spec.ts             # existing
├── forms.spec.ts             # new — E2E form submissions
└── content-pages.spec.ts     # new — E2E content rendering
```

### Pattern 1: vitest.config.ts

**What:** Root-level Vitest configuration with path alias and Node environment
**When to use:** Required once for the entire project

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json'],
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/notion.ts', 'src/lib/notion-monitor.ts'],
    },
  },
})
```

Key notes:
- `environment: 'node'` — data-mapping and validation logic is pure Node; no DOM needed
- `globals: true` — allows `describe`, `test`, `expect`, `vi` without imports
- `resolve.alias` must be at root level (Vite option), not inside `test`
- `@/` maps to `./src/` matching tsconfig `paths`

### Pattern 2: Mocking server-only + env + notion in unit tests

**What:** The `server-only` package throws unconditionally. All lib files import it transitively via `@/env/server`. Use `vi.mock()` to stub the entire dependency chain.
**When to use:** Required at the top of every test file in `src/lib/__tests__/`

```typescript
// src/lib/__tests__/blog.test.ts
import { vi, describe, test, expect } from 'vitest'

// Must be before all imports of modules that chain to server-only
vi.mock('server-only', () => ({}))
vi.mock('@/env/server', () => ({
  env: {
    NOTION_BLOG_DB_ID: 'test-blog-db-id',
    NOTION_TOKEN: 'test-token',
  },
}))
vi.mock('@/lib/notion', () => ({
  notion: {
    databases: {
      query: vi.fn(),
    },
  },
}))
```

Important: `vi.mock()` calls are hoisted automatically by Vitest to the top of the module, before any imports — this is the correct pattern even if they appear after import statements in source order.

### Pattern 3: Data-mapping unit test (inline lambda)

**What:** Test the mapping logic inside `getAllPosts()` by mocking the Notion query response
**When to use:** blog.ts, resources.ts, solutions.ts (all use inline map lambdas)

```typescript
// Source: analysis of blog.ts
import { vi, describe, test, expect, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('@/env/server', () => ({ env: { NOTION_BLOG_DB_ID: 'db-id' } }))
vi.mock('@/lib/notion', () => ({
  notion: { databases: { query: vi.fn() } },
}))
vi.mock('next/cache', () => ({
  unstable_cache: (fn: unknown) => fn,  // passthrough — execute fn directly
}))

import { notion } from '@/lib/notion'
import { getAllPosts } from '@/lib/blog'

const FULL_PAGE_FIXTURE = {
  id: 'page-abc',
  properties: {
    Title: { title: [{ plain_text: 'Test Post' }] },
    Slug: { rich_text: [{ plain_text: 'test-post' }] },
    Category: { select: { name: 'Ecosystem' } },
    Excerpt: { rich_text: [{ plain_text: 'A short excerpt' }] },
    Author: { rich_text: [{ plain_text: 'Sagie Baram' }] },
    'Author Type': { select: { name: 'Sagie' } },
    'Cover Image': { url: 'https://example.com/img.jpg' },
    Featured: { checkbox: true },
    'Publish Date': { date: { start: '2024-01-01' } },
    'Read Time': { number: 5 },
  },
}

describe('getAllPosts', () => {
  beforeEach(() => vi.clearAllMocks())

  test('maps a full Notion page to BlogPost', async () => {
    vi.mocked(notion.databases.query).mockResolvedValue({
      results: [FULL_PAGE_FIXTURE],
    } as never)
    const posts = await getAllPosts()
    expect(posts[0]).toEqual({
      id: 'page-abc',
      title: 'Test Post',
      slug: 'test-post',
      category: 'Ecosystem',
      excerpt: 'A short excerpt',
      author: 'Sagie Baram',
      authorType: 'Sagie',
      coverImage: 'https://example.com/img.jpg',
      featured: true,
      publishDate: '2024-01-01',
      readTime: 5,
    })
  })

  test('falls back when Title is missing', async () => {
    vi.mocked(notion.databases.query).mockResolvedValue({
      results: [{ id: 'page-abc', properties: {} }],
    } as never)
    const posts = await getAllPosts()
    expect(posts[0]?.title).toBe('Untitled')
  })
})
```

### Pattern 4: mapEvent (exported standalone function — events.ts)

**What:** `mapEvent` is a named export; test it directly without mocking the query.
**When to use:** events.ts only

```typescript
// Since mapEvent isn't exported, test via getUpcomingEvents/getPastEvents
// OR refactor mapEvent to be exported in Wave 0
// Workaround: same pattern as blog — mock notion.databases.query
```

Note: `mapEvent` in events.ts is NOT exported (it's a module-private function). The test approach must mock `notion.databases.query` to return fixture data, just like blog.ts.

### Pattern 5: withValidation unit test

**What:** Test the HOF directly — pass a mock Request object, verify Response status and body
**When to use:** validation.ts coverage

```typescript
// Source: analysis of src/lib/validation.ts
import { vi, test, expect } from 'vitest'
vi.mock('server-only', () => ({}))

import { withValidation } from '@/lib/validation'
import { MembershipSchema } from '@/lib/schemas'

function makeRequest(body: unknown, extraHeaders?: Record<string, string>): Request {
  return new Request('http://localhost/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    body: JSON.stringify(body),
  })
}

const mockHandler = vi.fn().mockResolvedValue(Response.json({ success: true }))
const handler = withValidation(MembershipSchema, mockHandler)

test('honeypot field filled → returns 200 silently', async () => {
  const req = makeRequest({ _trap: 'bot', _t: Date.now() - 5000 })
  const res = await handler(req)
  expect(res.status).toBe(200)
  expect(mockHandler).not.toHaveBeenCalled()
})

test('timing < 3000ms → returns 200 silently', async () => {
  const req = makeRequest({ _t: Date.now() - 100 })  // only 100ms elapsed
  const res = await handler(req)
  expect(res.status).toBe(200)
  expect(mockHandler).not.toHaveBeenCalled()
})

test('valid body with sufficient elapsed time → calls handler', async () => {
  const validBody = {
    fullName: 'Test User',
    email: 'test@example.com',
    role: 'Founder',
    location: 'Tel Aviv',
    _t: Date.now() - 5000,
  }
  const req = makeRequest(validBody)
  const res = await handler(req)
  expect(mockHandler).toHaveBeenCalledOnce()
})

test('invalid JSON → 400', async () => {
  const req = new Request('http://localhost/api/test', {
    method: 'POST',
    body: 'not-json',
  })
  const res = await handler(req)
  expect(res.status).toBe(400)
})

test('Zod validation failure → 422 with fieldErrors', async () => {
  const req = makeRequest({ _t: Date.now() - 5000 })  // missing required fields
  const res = await handler(req)
  const data = await res.json()
  expect(res.status).toBe(422)
  expect(data.fieldErrors).toBeDefined()
})
```

### Pattern 6: Playwright page.route() for form E2E

**What:** Intercept POST to /api/applications/* before it reaches the server
**When to use:** All 4 form E2E tests

```typescript
// Source: https://playwright.dev/docs/mock
// tests/forms.spec.ts
import { test, expect } from '@playwright/test'

test('membership form submits successfully', async ({ page }) => {
  // Intercept the API call BEFORE navigating
  await page.route('**/api/applications/membership', async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ json: { success: true }, status: 200 })
    } else {
      await route.continue()
    }
  })

  await page.goto('/apply')
  await page.fill('[name="fullName"]', 'Test User')
  await page.fill('[name="email"]', 'test@example.com')
  // ... fill required fields
  await page.click('[type="submit"]')
  // Assert success state visible
  await expect(page.getByText(/thank you|success/i)).toBeVisible()
})
```

### Anti-Patterns to Avoid

- **Calling exported `getAllPosts()` etc. without mocking `unstable_cache`:** The `unstable_cache` wrapper caches the result and returns a cached function. Mock it as a passthrough: `vi.mock('next/cache', () => ({ unstable_cache: (fn) => fn }))` so the inner function executes directly.
- **Omitting vi.mock() hoisting:** `vi.mock()` is auto-hoisted by Vitest's transform. Do not try to conditionally mock inside tests — always at module level.
- **Using `environment: 'jsdom'` for lib tests:** These are pure Node data-transform functions. jsdom adds overhead with no benefit.
- **Testing `getAllPosts()` without clearing mocks between tests:** `vi.clearAllMocks()` in `beforeEach` prevents cross-test mock state leakage.
- **page.route() set after page.goto():** The route intercept must be registered BEFORE navigation to catch the request.
- **noUncheckedIndexedAccess in fixture access:** TypeScript strict mode requires `posts[0]?.field` not `posts[0].field` — fixtures must be structured so TypeScript can prove the value exists, or use non-null assertions in tests with a comment.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Module mocking | Custom module registry / mock system | `vi.mock()` | Vitest hoists mocks, handles ESM, integrates with TypeScript |
| HTTP request mocking | Custom fetch wrapper in E2E | `page.route()` | Network-level intercept; no app code changes needed |
| Test timing manipulation | Custom Date.now replacement | `vi.spyOn(Date, 'now').mockReturnValue(...)` | Clean, resettable, no global mutation |
| Path alias resolution | Custom tsconfig loader | `resolve.alias` in vitest.config.ts | Vite handles this natively |
| Coverage collection | Custom instrumentation | `@vitest/coverage-v8` | Uses Node's built-in V8 coverage, zero overhead |

**Key insight:** The `server-only` / `env/server` pattern means every lib test needs the same 3 vi.mock() stubs. Extract these to a shared test setup file or copy-paste per file (simple enough at this scale).

---

## Common Pitfalls

### Pitfall 1: `server-only` throws on import in Vitest

**What goes wrong:** Running any test that imports (even transitively) from `src/lib/blog.ts`, `events.ts`, etc. throws `"This module cannot be imported from a Client Component module."` immediately.

**Why it happens:** `server-only/index.js` is a single `throw new Error(...)` statement. Vitest runs in Node, not the Next.js RSC context that suppresses the error.

**How to avoid:** Add `vi.mock('server-only', () => ({}))` as the first statement in every test file that touches lib modules.

**Warning signs:** Error message starts with "This module cannot be imported from a Client Component module."

### Pitfall 2: `unstable_cache` wraps functions and returns a new function

**What goes wrong:** `getAllPosts()` is `unstable_cache(async () => {...}, ...)` — the exported `getAllPosts` is actually the cached wrapper, not the inner function. Mocking `notion.databases.query` returns results but `unstable_cache` may serve cached results from a previous test.

**Why it happens:** `unstable_cache` is a Next.js caching primitive. In test environments it may or may not honor cache semantics depending on Next.js version.

**How to avoid:** Mock `next/cache` entirely: `vi.mock('next/cache', () => ({ unstable_cache: (fn: unknown) => fn }))`. This makes the exported functions execute directly without caching.

**Warning signs:** Second test in suite returns same data as first despite different mock setup.

### Pitfall 3: `noUncheckedIndexedAccess` breaks fixture access

**What goes wrong:** TypeScript strict mode (`noUncheckedIndexedAccess: true` in tsconfig.json) makes `results[0].properties` a type error because `results[0]` is `T | undefined`.

**Why it happens:** The project tsconfig has `"noUncheckedIndexedAccess": true`.

**How to avoid:** Use `results[0]?.properties` or structure fixtures as `const posts: BlogPost[] = await getAllPosts(); const first = posts[0]; if (!first) throw new Error('expected post')`. In test code, using `!` assertions with a comment is acceptable.

**Warning signs:** TypeScript errors in test files about potentially-undefined index access.

### Pitfall 4: Playwright route matching must use glob, not exact path

**What goes wrong:** `page.route('/api/applications/membership', ...)` may not match because it doesn't account for the baseURL prefix.

**Why it happens:** Playwright route patterns need to match the full URL. When running against localhost:3000, the route URL is `http://localhost:3000/api/applications/membership`.

**How to avoid:** Use `**/api/applications/membership` glob pattern which matches any host.

**Warning signs:** Form submits but `route.fulfill()` never executes; real Notion write is attempted.

### Pitfall 5: withValidation timing test is flaky if machine is slow

**What goes wrong:** The timing check `Date.now() - loadTime < 3000` could be non-deterministic if test execution takes a variable amount of time.

**Why it happens:** Real `Date.now()` is used; if a test machine is slow, the elapsed time may exceed 3000ms unexpectedly.

**How to avoid:** Mock `Date.now` explicitly: `vi.spyOn(Date, 'now').mockReturnValue(fixedTimestamp)`. In the request body, set `_t` to `fixedTimestamp - 100` (less than 3000ms elapsed) or `fixedTimestamp - 5000` (more than 3000ms elapsed).

---

## Code Examples

### vitest.config.ts (complete)

```typescript
// Source: https://vitest.dev/config/ (v4.1.2)
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json'],
      include: ['src/lib/**/*.ts'],
      exclude: [
        'src/lib/notion.ts',
        'src/lib/notion-monitor.ts',
        'src/lib/gsap.ts',
      ],
    },
  },
})
```

### Standard mock header for all lib unit tests

```typescript
// Place at top of every src/lib/__tests__/*.test.ts file
import { vi } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('next/cache', () => ({
  unstable_cache: (fn: unknown) => fn,
}))
vi.mock('@/env/server', () => ({
  env: {
    NOTION_BLOG_DB_ID: 'mock-blog-db',
    NOTION_EVENT_DB_ID: 'mock-events-db',
    NOTION_RESOURCES_DB_ID: 'mock-resources-db',
    NOTION_SOLUTIONS_DB_ID: 'mock-solutions-db',
    NOTION_MEMBER_DB_ID: 'mock-member-db',
    NOTION_VENTURES_INTAKE_DB_ID: 'mock-ventures-db',
    NOTION_TOKEN: 'mock-token',
    ALLOWED_ORIGINS: 'http://localhost:3000',
    NODE_ENV: 'test',
  },
}))
vi.mock('@/lib/notion', () => ({
  notion: {
    databases: { query: vi.fn() },
    pages: { retrieve: vi.fn() },
  },
}))
```

### Minimal Notion page fixture shape

```typescript
// Matches real @notionhq/client response shape
const makeNotionPage = (id: string, props: Record<string, unknown>) => ({
  id,
  properties: props,
})

// Title property fixture
const titleProp = (text: string) => ({ title: [{ plain_text: text }] })
// Rich text property fixture
const richTextProp = (text: string) => ({ rich_text: [{ plain_text: text }] })
// Select property fixture
const selectProp = (name: string) => ({ select: { name } })
// Checkbox property fixture
const checkboxProp = (val: boolean) => ({ checkbox: val })
// Number property fixture
const numberProp = (n: number) => ({ number: n })
// URL property fixture
const urlProp = (url: string) => ({ url })
// Date property fixture
const dateProp = (start: string) => ({ date: { start } })
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Jest for Vite/Next projects | Vitest (native Vite runner) | ~2022, Vitest v1 | No babel transform, ESM native, ~10x faster |
| Separate test environment per file | `vi.mock()` with hoisting | Vitest v1+ | Single Node process, deterministic mock ordering |
| Playwright `page.intercept()` | `page.route()` | Playwright v1.0 | `page.route()` is the stable API |
| coverage/istanbul | coverage/v8 | Node.js v10+ | V8 is built-in, no transpilation required |

**Deprecated/outdated:**
- `@testing-library/react` for these tests: Not needed — the targets are pure data-transform functions, not React components
- `msw` (Mock Service Worker): Overkill for this scope; `page.route()` handles E2E and `vi.mock()` handles unit

---

## Open Questions

1. **`mapEvent` is not exported from events.ts**
   - What we know: `mapEvent` is a module-private function called inside `getUpcomingEvents` and `getPastEvents`
   - What's unclear: Whether to export it for direct testing, or test through the public API (mock `notion.databases.query`)
   - Recommendation: Test through the public API (mock query) — consistent with blog.ts/resources.ts/solutions.ts approach. No refactor needed.

2. **Playwright E2E requires running app server**
   - What we know: `playwright.config.ts` doesn't define a `webServer` block — assumes app is running separately
   - What's unclear: Whether E2E runs against localhost in CI (no `webServer` config) or against a deployed preview URL
   - Recommendation: Existing CI doesn't run E2E in the unit job. E2E tests remain local/manual for this phase per existing pattern. No CI E2E job needed.

3. **`notion-to-md` in blog.ts `getPostBySlug`**
   - What we know: `getPostBySlug` calls `n2m.pageToMarkdown()` which is a live Notion SDK call
   - What's unclear: Whether TEST-02 requires testing `getPostBySlug` or only the mapping in `getAllPosts`
   - Recommendation: `getPostBySlug` does not contain mapping logic — it delegates to `n2m`. Test `getAllPosts` only for blog.ts. `getPostBySlug` is integration territory.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest v4.x (to be installed) |
| Config file | `vitest.config.ts` — Wave 0 |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run --coverage` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TEST-01 | `npx vitest run` exits 0 in CI | smoke | `npx vitest run` | ❌ Wave 0 (needs vitest.config.ts) |
| TEST-02 | blog.ts maps Notion pages → BlogPost with fallbacks | unit | `npx vitest run src/lib/__tests__/blog.test.ts` | ❌ Wave 0 |
| TEST-02 | events.ts maps Notion pages → SAGIEEvent with fallbacks | unit | `npx vitest run src/lib/__tests__/events.test.ts` | ❌ Wave 0 |
| TEST-02 | resources.ts maps Notion pages → Resource with fallbacks | unit | `npx vitest run src/lib/__tests__/resources.test.ts` | ❌ Wave 0 |
| TEST-02 | solutions.ts maps Notion pages → SolutionProvider with fallbacks | unit | `npx vitest run src/lib/__tests__/solutions.test.ts` | ❌ Wave 0 |
| TEST-03 | MembershipSchema/ChapterSchema/etc. accept valid + reject invalid | unit | `npx vitest run src/lib/__tests__/schemas.test.ts` | ❌ Wave 0 |
| TEST-03 | withValidation honeypot/timing/422/400 paths | unit | `npx vitest run src/lib/__tests__/validation.test.ts` | ❌ Wave 0 |
| TEST-04 | Membership/chapter/solutions/ventures forms submit → success | E2E | `npx playwright test tests/forms.spec.ts` | ❌ Wave 0 |
| TEST-04 | Blog/events/resources/solutions/homepage render content | E2E | `npx playwright test tests/content-pages.spec.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run` (unit tests only, ~5s)
- **Per wave merge:** `npx vitest run --coverage` (full unit suite with coverage)
- **Phase gate:** Full unit suite green + manual E2E verification before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `vitest.config.ts` — root-level config with @/ alias, node env, v8 coverage
- [ ] `src/lib/__tests__/` directory — create before writing any test files
- [ ] Framework install: `npm install --save-dev vitest @vitest/coverage-v8`
- [ ] `package.json` test script: add `"test": "vitest run"` and `"test:watch": "vitest"` for convenience

---

## Sources

### Primary (HIGH confidence)

- https://vitest.dev/config/ — resolve.alias, test.environment, test.globals, coverage config
- https://vitest.dev/guide/ — current version (v4.1.2), install requirements
- https://playwright.dev/docs/mock — page.route() API and POST mock pattern
- Direct code analysis: `src/lib/validation.ts`, `src/lib/schemas.ts`, `src/lib/blog.ts`, `src/lib/events.ts`, `src/lib/resources.ts`, `src/lib/solutions.ts`
- Direct inspection: `node_modules/server-only/index.js` — confirmed unconditional throw
- `.github/workflows/ci.yml` — confirmed `npx vitest run` unit job exists
- `playwright.config.ts` — confirmed existing baseURL, bypass header, CI single-worker config

### Secondary (MEDIUM confidence)

- Pattern analysis of `tsconfig.json` — `noUncheckedIndexedAccess: true` affects test fixture typing
- Pattern: `vi.mock()` auto-hoisting behavior — documented in Vitest guide, consistent with observed behavior

### Tertiary (LOW confidence)

- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Vitest already referenced in CI; Playwright already installed
- Architecture: HIGH — All source files read directly; mock strategy verified against actual server-only package
- Pitfalls: HIGH — server-only throw verified by reading package source; timing pitfall derived from reading validation.ts implementation

**Research date:** 2026-03-28
**Valid until:** 2026-09-28 (stable libraries; re-verify if Vitest major version changes)
