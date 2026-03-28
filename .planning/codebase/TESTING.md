# Testing

## Current State

**No test infrastructure exists in this project.**

- No test framework configured (no Jest, Vitest, Playwright, or Cypress)
- No test files in `src/` directory
- No test scripts in `package.json`
- No CI/CD test pipeline
- Test files found only in `node_modules/` (from dependencies)

## What Needs Testing

### High Priority
- **API routes** (`src/app/api/`): 6 POST endpoints that write to Notion — no validation, no rate limiting
- **Form validation** (`src/components/forms/`): Client-side only validation logic
- **Notion integration** (`src/lib/notion.ts`): Data fetching and page creation

### Medium Priority
- **Dynamic content pages**: Blog, events, solutions, resources — all fetch from Notion
- **Sitemap generation** (`src/app/sitemap.ts`): Generates routes from Notion data

### Lower Priority
- **UI components**: Mostly presentational, low risk
- **Animations**: GSAP scroll triggers — difficult to test, visual-only
- **Constants**: Static data, unlikely to break

## Recommendations

If adding tests, consider:
- **Vitest** for unit/integration tests (fast, Next.js compatible)
- **Playwright** for E2E form submission flows
- **MSW** (Mock Service Worker) for mocking Notion API in tests
