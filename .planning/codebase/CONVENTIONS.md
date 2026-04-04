# Coding Conventions

**Analysis Date:** 2026-04-04

## Naming Patterns

**Files:**
- Server-side utilities: camelCase with `.ts` extension — `validation.ts`, `sanitize.ts`, `email.ts`
- React components: PascalCase with `.tsx` extension — `BlogFilter.tsx`, `GSAPCleanup.tsx`
- Test files: `[name].test.ts` or `[name].spec.ts` co-located with source or in `__tests__` directory
- API routes: lowercase with hyphens in Next.js `app/api/` routes — `route.ts` files in semantic directories like `api/applications/membership/`

**Functions:**
- camelCase for all functions — `sendEmails()`, `withValidation()`, `sanitizeForEmail()`, `formatDate()`
- Helper functions scoped within components use camelCase — `selectDropdownOption()`, `makeRequest()`
- Async functions are consistently async/await (not promise chains) — `async function sendEmails(...)`

**Variables:**
- camelCase for all variable declarations — `mockHandler`, `validMembership`, `isRateLimited()`
- Constants (module-level, immutable) in UPPER_SNAKE_CASE — `RATE_LIMIT`, `WINDOW_MS`, `FROM_ADDRESS`, `ADMIN_EMAIL`
- Boolean variables/functions start with `is`, `has`, `can`, or `should` — `isRateLimited()`, `isCommunity`, `isActive`
- Destructured variables preserve naming from source — `const { limited, retryAfter } = isRateLimited(ip)`
- Underscore prefix for intentionally unused variables — `const { email: _email, ...rest } = validMembership`

**Types:**
- Interface/type names in PascalCase — `FormType`, `RateEntry`, `Handler<T>`, `BlogPost`
- Union types use clear, descriptive values as strings — `FormType` is a union of form names like `'Membership Application'`, `'Chapter Lead Application'`
- Generic type parameters single-letter uppercase — `<S extends ZodSchema>`, `<T extends Record<string, unknown>>`

## Code Style

**Formatting:**
- No explicit formatter configured; ESLint used for code quality
- Line length: typically fits within ~100-120 character lines but no strict limit enforced
- Indentation: 2 spaces (standard Next.js/React convention)
- Trailing commas: Used in multiline objects/arrays for cleaner diffs
- No semicolons in JSX/TSX files (automatic via ESLint config-next)

**Linting:**
- ESLint with `eslint-config-next` (Next.js recommended rules)
- Config: `eslint.config.mjs` (flat config, ESLint v9+)
- Ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`
- Run: `npm run lint`

**Imports:**
Order follows standard pattern:
1. Built-in/third-party modules (`react`, `next/*`, `zod`, etc.)
2. Internal modules using `@/` alias
3. Type-only imports marked with `type` keyword
4. 'use client' directive at top of client components

Example from `BlogFilter.tsx`:
```typescript
'use client'

import { useQueryStates, parseAsString } from 'nuqs'
import { BLOG_CATEGORIES, BLOG_AUTHORS } from '@/constants/blog'
import type { BlogPost } from '@/lib/blog'
import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'
```

**Path Aliases:**
- `@/*` resolves to `./src/*` (configured in `tsconfig.json`)
- Used throughout codebase for all internal imports

## Error Handling

**Pattern:**
- `try/catch` blocks for JSON parsing and async operations
- Null/undefined coalescing with `??` operator
- Safe property access: `arr[0]?.trim() ?? 'default'`
- Validation errors returned as structured response objects with field-level error mapping

**Response Format:**
Validation failures return 422 status with:
```typescript
{ error: 'Validation failed', fieldErrors: Record<string, string[]> }
```

**Sentry Integration:**
- Import: `import * as Sentry from '@sentry/nextjs'`
- Usage: `Sentry.captureException(err, { tags: { service: '...', type: '...' } })`
- Applied in error paths with context tags (e.g., `email.test.ts` mocks `@sentry/nextjs`)

**Console Logging:**
- `console.error()` with context prefix — `console.error('[ApplyError]', error)`
- `console.warn()` for non-fatal issues — `console.warn('Beehiiv not configured')`
- `console.log()` for debug info in test/development scenarios — `console.log('[email] skip (non-production): ${formType}')`
- Prefixed with category in brackets for log traceability

## Validation

**Zod Schema Pattern:**
- Validation applied at function entry with `schema.safeParse(raw)`
- Custom refinements for complex logic — `locationSuperRefine()` validates country→state→city cascade
- Transform functions clean input — `.trim()`, `.toLowerCase()`, `.transform((val) => ...)`
- Error messages are user-friendly, displayed per field

**Example from `schemas.ts`:**
```typescript
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, 'Email is too short.')
  .email('Please enter a valid email address.')
  .refine(..., 'Email address format is invalid.')
```

## Logging

**Framework:** `console.*` methods (no dedicated logging library)

**Patterns:**
- Errors logged with category prefix — `[EmailService]`, `[ValidationError]`
- Avoid spammy logging in production; use environment checks — `if (env.NODE_ENV !== 'production') console.log(...)`
- Sentry captures exceptions for production monitoring
- Test logs in mocks verify behavior — `expect(consoleSpy).toHaveBeenCalledWith(...)`

## Comments

**When to Comment:**
- Complex algorithms or non-obvious logic (e.g., spam detection regex in `schemas.ts`)
- Block-level comments for major sections using `// -----------` separators
- JSDoc comments for exported functions explaining parameters and return

**JSDoc/TSDoc:**
- Applied to exported functions — `/** ... */` blocks
- Documents intent and security considerations
- Example from `sanitize.ts`:
```typescript
/**
 * Escapes HTML entities in user input to prevent injection in email
 * templates and as a belt-and-suspenders measure before Notion writes.
 */
export function sanitizeForEmail(input: string): string
```

**Block Separators:**
- Long test files use `// ---------------------------------------------------------------------------` to organize test groups by schema/feature

## Function Design

**Size:**
- Utility functions kept small (<40 lines)
- Handler functions wrap smaller helper functions
- Large test functions use sub-helpers for clarity

**Parameters:**
- Named parameters for clarity — `withValidation(schema, handler)`
- Destructured object parameters for components — `{ posts }: { posts: BlogPost[] }`
- Type parameters explicit — `<S extends ZodSchema>`

**Return Values:**
- Functions return structured data when possible (objects with known keys)
- Async functions return `Promise<Response>` for API handlers, `Promise<void>` for side-effect operations
- Validation returns `z.SafeParseReturnType` (success/failure discriminated union)

## Module Design

**Exports:**
- Named exports preferred — `export function sendEmails(...)`
- Types exported separately — `export type FormType = '...' | '...'`
- Barrel imports used for grouped constants — `import { BLOG_CATEGORIES, BLOG_AUTHORS } from '@/constants/blog'`

**Module Structure:**
- Utility modules in `src/lib/` (business logic, validation, data fetching)
- Components in `src/components/` (UI with subdirectories: `ui/`, `mdx/`)
- Constants in `src/constants/`
- Types in `src/types/`
- API routes follow Next.js app directory structure

## TypeScript Strict Mode

**Strict Compiler Flags:**
- `strict: true` — All strict checks enabled
- `noUncheckedIndexedAccess: true` — Array/object access checked
- `noImplicitOverride: true` — Override methods must use `override` keyword
- `noImplicitReturns: true` — All code paths must return
- `exactOptionalPropertyTypes: true` — Optional properties must be assignable to undefined
- `skipLibCheck: true` — Skip node_modules type checking

**Type Safety Patterns:**
- All function parameters typed — no `any` types
- Return types explicit for exported functions
- Use non-null assertion `!` sparingly with explanation — `posts[0]!` when index guaranteed to exist
- Exhaustiveness checks for discriminated unions

---

*Convention analysis: 2026-04-04*
