# Testing

## Framework

- **Test runner**: Vitest 4.1.2
- **Coverage provider**: v8
- **Config**: `vitest.config.ts`

## Structure

### Location
- Tests in `src/lib/__tests__/*.test.ts` (co-located `__tests__` directories)
- Test utilities alongside test files

### Organization
- `describe` blocks for grouping related tests
- `test` (or `it`) for individual test cases
- `beforeEach` / `afterEach` hooks for setup/teardown

## Patterns

### Mocking
- `vi.mock()` for module mocking
- Commonly mocked modules:
  - `server-only` (no-op mock for server-only imports)
  - Notion client (`@notionhq/client`)
  - Resend email client
  - `@sentry/nextjs`
- Mock implementations defined at top of test files

### Fixtures
- Test data defined at module level as constants
- Named descriptively: `FULL_PAGE_FIXTURE`, `MINIMAL_EVENT_FIXTURE`, etc.
- Fixtures mirror real API response shapes

### Assertions
- Vitest `expect` API
- Zod schema validation with `safeParse` for data shape testing
- Mock call verification (`toHaveBeenCalledWith`, `toHaveBeenCalledTimes`)
- Snapshot testing not used

## Coverage

- v8 coverage provider configured in `vitest.config.ts`
- Specific files excluded from coverage:
  - `src/lib/notion.ts` (external API wrapper)
  - `src/lib/gsap.ts` (animation library wrapper)

## Running Tests

```bash
npm test           # Run all tests
npm run test:ci    # CI mode (no watch)
npx vitest --coverage  # With coverage report
```

## What Gets Tested

- **Schema validation**: Zod schemas tested with valid/invalid data
- **Data transformation**: Notion API response → app data types
- **Email templates**: Resend email construction
- **Utility functions**: Pure function logic

## What Doesn't Get Tested

- React components (no component testing setup)
- E2E flows (no Playwright/Cypress)
- API routes (tested indirectly through integration)
- CSS/styling
