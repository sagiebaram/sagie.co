# Coding Conventions

**Analysis Date:** 2026-04-05

## Naming Patterns

**Files:**
- Lowercase kebab-case: `validation.ts`, `sanitize.ts`, `useCardTilt.ts`
- React components: PascalCase: `FormField.tsx`, `BlogContent.tsx`, `AnimatedSection.tsx`
- Test files: `[name].test.ts` or `[name].test.tsx` co-located in `__tests__` subdirectory: `src/lib/__tests__/validation.test.ts`
- API routes follow Next.js conventions: `src/app/api/contact/route.ts`, `src/app/api/applications/solutions/route.ts`

**Functions:**
- Camelcase for regular functions: `getIP()`, `isRateLimited()`, `sanitizeForEmail()`, `escapeIcsText()`
- React hooks: `use*` prefix in camelCase: `useCardTilt()`, `useScrollReveal()`
- Exported handler functions: `POST`, `GET` (Next.js API convention)
- Internal helper functions: camelCase: `handleSelect()`, `handleKeyDown()`, `makeRequest()`

**Variables:**
- Camelcase for local variables and constants: `rateStore`, `RATE_LIMIT`, `WINDOW_MS`, `glowColor`, `prefersReduced`
- State variables: camelCase: `isOpen`, `isFocused`, `highlightedIndex`, `otherText`
- Type variables: PascalCase for generics: `T extends ZodSchema`, `T extends Record<string, unknown>`
- Constants: SCREAMING_SNAKE_CASE: `RATE_LIMIT`, `WINDOW_MS`, `FROM_ADDRESS`, `ADMIN_EMAIL`, `FIXED_NOW`, `RATE_TEST_IP`

**Types:**
- Interface names: PascalCase: `FormFieldProps`, `UseCardTiltOptions`, `OptionGroup`, `Pillar`, `Persona`
- Type aliases: PascalCase: `FormType`, `Handler<T>`, `RateEntry`
- Union types: descriptive PascalCase: `ChapterStatus = 'live' | 'soon' | 'open'`, `ButtonVariant = 'primary' | 'ghost' | 'outline'`

## Code Style

**Formatting:**
- Uses implicit Prettier configuration (inferred from codebase)
- Single quotes for strings: `'server-only'`, `'@/lib/validation'`
- Semicolons omitted (no-semi convention in most lib/component files)
- 2-space indentation (standard for Next.js/Node.js)
- Trailing commas in multiline objects/arrays: `{ ...VALID_MEMBERSHIP_BODY }`
- Line wrapping at logical boundaries, not enforced at specific column

**Linting:**
- Tool: ESLint v9.39.4
- Config: `eslint.config.mjs` uses Next.js extended config (`eslint-config-next`)
- Ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`
- TS strict mode enabled in `tsconfig.json`

**TypeScript Settings:**
- `target: ES2022`
- `strict: true` - enforces strict null checks, function returns, etc.
- `noUncheckedIndexedAccess: true` - array/object access must be checked
- `noImplicitOverride: true` - overriding methods must use `override` keyword
- `noImplicitReturns: true` - all code paths must return a value
- `exactOptionalPropertyTypes: true` - optional properties cannot be explicitly `undefined`
- `jsx: "react-jsx"` - new JSX transform (no `React` import needed)
- Path alias `@/*` maps to `./src/*` for clean imports

## Import Organization

**Order:**
1. External dependencies (npm packages): `import { z } from 'zod'`, `import { parsePhoneNumberFromString } from 'libphonenumber-js'`
2. Next.js modules: `import { NextResponse } from 'next/server'`, `import type { SAGIEEvent } from '@/types/events'`
3. Server-only directives: `import 'server-only'` at top of file
4. Internal modules using `@/` alias: `import { withValidation } from '@/lib/validation'`
5. React/hooks: `import { useState, useRef, useEffect } from 'react'`, `import type { UseFormRegisterReturn } from 'react-hook-form'`

**Path Aliases:**
- Always use `@/` prefix instead of relative paths: `@/lib/validation`, `@/env/server`, `@/types/events`
- Never use relative imports like `../../../lib/validation`

## Error Handling

**Patterns:**
- Try-catch blocks for async operations that might throw: See `src/app/api/contact/route.ts`
  ```typescript
  try {
    const body = sanitizeRecord(rawBody)
    void sendEmails('Contact Form', body.email, body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form submission failed:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
  ```

- Schema validation using Zod `.safeParse()` to avoid exceptions: `const result = schema.safeParse(raw)` then check `result.success`
- Never throw in handlers; always return appropriate HTTP response: `NextResponse.json({ error: ... }, { status: 4xx })`
- Type-safe error tracking with Sentry tags: `Sentry.captureException(err, { tags: { service: 'resend', type: 'confirmation' } })`
- Silent error handling for non-critical async operations: `void sendEmails(...)` with `.catch()` to prevent unhandled rejections

## Logging

**Framework:** `console` module (standard Node.js)

**Patterns:**
- Debug/informational: `console.log()` for non-critical paths: `console.log(\`[email] skip (non-production): ${formType}\`)`
- Errors: `console.error()` for exceptions: `console.error('Contact form submission failed:', error)`
- Prefixed context strings for search: `[service_name]` or `[type]` in logs: `[email]`, `[Sentry]`
- Non-production environments use log messages, not sends: See email service pattern in `src/lib/email.ts`

## Comments

**When to Comment:**
- Complex algorithms with multiple steps: See RFC references in `escapeIcsText()`: `// backslash, semicolon, comma, and newline must be escaped`
- Non-obvious business logic: `// 10 minutes` for `WINDOW_MS = 10 * 60 * 1000`
- Honeypot and timing checks: `// Honeypot check — bots fill hidden field` in `src/lib/validation.ts`
- References to external specs: `// RFC 5545 §3.3.11`, `// RFC 5321 limits`

**Block Comments:**
- Section dividers for logical grouping:
  ```typescript
  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  ```

**JSDoc/TSDoc:**
- Used selectively for public API functions and complex behavior
- Single-line JSDoc for simple utilities: `/** Escape text per RFC 5545 §3.3.11 */`
- Multi-line JSDoc with parameter/return descriptions:
  ```typescript
  /**
   * Build a Google Calendar deep link for the given event.
   * - All-day events: dates=YYYYMMDD/YYYYMMDD+1
   * - Timed events:   dates=YYYYMMDDTHHmmss/YYYYMMDDTHHmmss (start + 1 hour)
   */
  export function buildGoogleCalendarUrl(event: SAGIEEvent): string
  ```

## Function Design

**Size:** Functions are typically 5-30 lines for single responsibility
- Handlers: Minimal, delegate to library functions: `src/app/api/contact/route.ts` (16 lines)
- Utilities: Focused on single operation: `sanitizeForEmail()` is 9 lines
- Complex logic broken into smaller helpers: Rate limiting extracted to `isRateLimited()`, `getIP()`

**Parameters:**
- Use object destructuring for multiple parameters: `{ scale = 1.04, glowColor }` in `useCardTilt()`
- Type parameters on handler generics: `Handler<z.infer<S>>` in validation wrapper
- Optional parameters use trailing `?` in interfaces: `glowColor?: string | undefined`

**Return Values:**
- Explicit return types always specified: `Promise<Response>`, `{ limited: boolean; retryAfter: number }`
- Void functions used sparingly, mostly for event handlers: `onValueChange?.('Other')`
- Promise-returning functions for async: `async (req: Request): Promise<Response>`
- Tuple returns for multiple values: `[hh, mm] = event.time.split(':')`

## Module Design

**Exports:**
- Named exports preferred: `export function sanitizeForEmail()`, `export function withValidation()`
- Default exports rare (only for Next.js pages/layouts)
- Type exports: `export type FormType = 'Membership Application' | ...`
- Interface exports for component props: `export interface FormFieldProps`

**Barrel Files:**
- Used in type directories: `src/types/index.ts` re-exports all type definitions
- Avoid over-nesting; direct imports from modules preferred

**Organization Within Files:**
- Imports at top
- Constants and type definitions near top
- Utility functions before main exports
- Main component/function at bottom
- Test helpers in separate `__tests__` directories

## Validation & Safety

**Input Validation:**
- All user input validated with Zod schemas: `MembershipSchema`, `ContactSchema`, etc.
- Schemas use `.safeParse()` for safe error handling
- Email validation: comprehensive checks for RFC 5321 compliance
- Phone validation: `libphonenumber-js` library with E.164 normalization
- Custom refine rules for spam detection: repeated characters, excessive URLs
- Unicode-aware name validation: `[\p{L}\p{M}][\p{L}\p{M}'\-\s.]{0,98}[\p{L}\p{M}.]`

**Sanitization:**
- HTML entity escaping in emails: `sanitizeRecord()` escapes all string values
- Honeypot and timing checks for bot protection in `withValidation()`
- Rate limiting per IP with sliding window: 5 requests per 10 minutes

---

*Convention analysis: 2026-04-05*
