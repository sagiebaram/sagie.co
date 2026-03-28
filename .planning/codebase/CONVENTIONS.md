# Coding Conventions

**Analysis Date:** 2026-03-28

## Naming Patterns

**Files:**
- Lowercase with hyphens for directories: `src/lib/`, `src/components/`, `src/app/`
- Lowercase filenames for utilities: `validation.ts`, `schemas.ts`, `email.ts`
- PascalCase for component files: `GlobeClient.tsx`, `GlobeNetwork.tsx`
- Descriptive names for API routes: `route.ts` within feature directories like `/applications/solutions/`
- Test files paired with source: `filename.test.ts` in `__tests__/` directory

**Functions:**
- camelCase for all function names: `withValidation()`, `sendEmails()`, `getAllPosts()`, `getPostBySlug()`
- Exported functions use descriptive verbs: `get*`, `send*`, `fetch*` prefixes for clarity
- Higher-order functions follow currying pattern: `withValidation(schema, handler)` returns wrapped handler
- Helper functions (non-exported) remain camelCase: `getIP()`, `isRateLimited()`

**Variables:**
- camelCase for all variables: `mockHandler`, `FIXED_NOW`, `loadTime`, `fieldErrors`
- UPPER_SNAKE_CASE for constants and configuration values:
  - `RATE_LIMIT = 5`
  - `WINDOW_MS = 10 * 60 * 1000`
  - `FROM_ADDRESS = 'SAGIE <hello@sagie.co>'`
  - `ADMIN_EMAIL = 'hello@sagie.co'`
  - `RATE_TEST_IP = '10.0.99.1'`
- Underscore prefix for private/destructured variables to mark unused: `const { email: _email, ...rest } = validMembership`

**Types:**
- PascalCase for all type/interface names: `BlogPost`, `Chapter`, `SAGIEEvent`, `RateEntry`, `Handler<T>`
- Type union literals as string literals: `FormType = 'Membership Application' | 'Chapter Lead Application'`
- Use `interface` for exported data structures, `type` for aliases and generics
- Zod schema names use PascalCase: `MembershipSchema`, `ChapterSchema`, `VenturesSchema`

## Code Style

**Formatting:**
- No explicit formatter configured (relying on TypeScript compiler defaults)
- Consistent two-space indentation observed
- Single quotes not enforced; libraries use both single and double quotes
- Semicolons used throughout
- Type annotations on all function parameters and return types (strict mode)

**Linting:**
- Next.js built-in linting via `npm run lint`
- Strict TypeScript: `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, `exactOptionalPropertyTypes` enabled
- Comments with eslint directives when needed: `// eslint-disable-next-line @typescript-eslint/no-explicit-any` in `src/lib/blog.ts:29`
- Type assertions using `as` when mapping external API responses to internal types

**ESLint Comments:**
- Used sparingly to suppress specific rules when unavoidable (e.g., when dealing with untyped external APIs)
- Always include explanation or keep to minimum scope

## Import Organization

**Order:**
1. External/third-party imports: `import { NextResponse } from 'next/server'`
2. Internal library imports: `import { notion } from '@/lib/notion'`
3. Type imports: `import type { CityData } from '@/lib/members'`, `import type { FormType } from '@/lib/email'`
4. Relative imports (rare): `.nextjs/cache`, `./GlobeNetwork`

**Path Aliases:**
- Single path alias configured: `@/*` maps to `./src/*`
- All internal imports use `@/` prefix: `@/lib/`, `@/env/`, `@/components/`, `@/lib/__tests__/`
- Zod imports group together: `import { z, ZodSchema } from 'zod'`

**Import Syntax:**
- Named imports for utilities: `import { unstable_cache } from 'next/cache'`
- Default imports for dynamic components: `import dynamic from 'next/dynamic'`
- Type-only imports use `type` keyword: `import type { ClassValue } from 'clsx'`
- Namespace imports for modules: `import * as Sentry from '@sentry/nextjs'`

## Error Handling

**Patterns:**
- Try-catch blocks wrap async operations and external API calls
- Broad `catch` with generic error handling:
  ```typescript
  try {
    // operation
  } catch (error) {
    console.error('Context message:', error)
    return NextResponse.json({ error: 'User-facing message' }, { status: 500 })
  }
  ```
- Sentry error capture for production issues: `Sentry.captureException(err, { tags: { service: 'resend', type: 'confirmation' } })`
- Promise.allSettled used for multiple async operations to avoid single failure blocking others: `await Promise.allSettled(sends)`
- Zod safeParse always used with success check: `const result = schema.safeParse(raw); if (!result.success) { ... }`
- Field-level error collection from Zod validation: `fieldErrors[path] = [...(fieldErrors[path] ?? []), issue.message]`

**HTTP Status Codes:**
- 200: Success (including honeypot/timing traps returning silently)
- 400: Malformed JSON
- 422: Validation failure (Zod schema violations)
- 429: Rate limiting exceeded
- 500: Server error (with generic error message to client)

## Logging

**Framework:** `console` (built-in, no logger library)

**Patterns:**
- `console.error()` for errors with context: `console.error('Solutions application failed:', error)`
- `console.log()` for development logging: `console.log('[email] skip (non-production): ${formType}')`
- Contextual prefixes in brackets: `[email]`, `[service]`
- Log before attempting recovery or alternative path

## Comments

**When to Comment:**
- Section dividers for logical groupings: `// ---------------------------------------------------------------------------`
- Inline explanations for non-obvious validation logic (e.g., honeypot fields, timing traps)
- Never used for stating obvious facts (e.g., "get the user" above `getUser()`)
- Uncommon patterns or business logic get brief explanatory comment

**JSDoc/TSDoc:**
- Not used; types are self-documenting via TypeScript interfaces and strict mode
- Return types and parameter types are explicit in function signatures
- No @param or @returns comments needed

## Function Design

**Size:**
- Most functions 20-50 lines
- Validation functions typically 30-40 lines (including comment sections)
- Async handlers delegate to composition of smaller helpers
- No visible enforcement of line limits

**Parameters:**
- Always explicitly typed: `async function sendEmails(formType: FormType, applicantEmail: string | null, submissionData: Record<string, unknown>): Promise<void>`
- Generic type parameters used for reusable utilities: `<T>`, `<S extends ZodSchema>`
- Request/Response objects passed implicitly in Next.js API patterns: `async (_req: Request, body) => { ... }`
- Single object parameter preferred over multiple positional: `withValidation(schema, handler)`

**Return Values:**
- Explicit Promise types: `Promise<Response>`, `Promise<void>`, `Promise<BlogPost[]>`
- No implicit any returns; functions always specify return type
- Async functions always return Promise (never raw values)

## Module Design

**Exports:**
- Named exports for functions: `export function sendEmails(...) { ... }`
- Named exports for types: `export interface BlogPost { ... }`
- Named exports for schemas: `export const MembershipSchema = z.object(...)`
- Type exports use `type` keyword: `export type FormType = '...' | '...'`
- Default exports used only for dynamic Next.js components

**Barrel Files:**
- Not used; imports specify full paths: `@/lib/validation`, `@/lib/email`
- Each module has single responsibility
- Encourages explicit dependency tracking

**Module-level State:**
- Module-level objects for stateful utilities: `const rateStore = new Map<string, RateEntry>()`
- Module-level constants: `const FROM_ADDRESS = '...'`
- Single instance pattern: `const resend = new Resend(env.RESEND_API_KEY)`
- Mocking strategy accommodates module-level state in tests

---

*Convention analysis: 2026-03-28*
