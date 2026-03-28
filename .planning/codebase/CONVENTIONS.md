# Coding Conventions

**Analysis Date:** 2026-03-28

## Naming Patterns

**Files:**
- React components: PascalCase matching the exported function name — `MembershipForm.tsx`, `SocialProof.tsx`, `FormField.tsx`
- Hooks: camelCase prefixed with `use` — `useScrollReveal.ts`
- Library/utility modules: camelCase — `blog.ts`, `notion-monitor.ts`, `validation.ts`
- API routes: always `route.ts` inside a named directory — `src/app/api/applications/membership/route.ts`
- Constants files: camelCase — `copy.ts`, `tiers.ts`, `faq.ts`
- Schema files: camelCase — `schemas.ts`, `validation.ts`

**Functions:**
- Exported React components: PascalCase — `export function MembershipForm()`
- Hooks: camelCase prefixed `use` — `export function useScrollReveal()`
- Utility/helper functions: camelCase — `export function mapLocation()`, `export function cn()`
- Data-fetching lib functions: camelCase — `export const getAllPosts`, `export const getUpcomingEvents`
- API route handlers: exported as named HTTP method constants — `export const POST = withValidation(...)`

**Variables:**
- Local variables and state: camelCase — `fullName`, `loadTime`, `trapRef`
- Module-level constants: SCREAMING_SNAKE_CASE — `ROLE_MAP`, `SOCIAL_STATS`, `NAV_LINKS`
- Object config constants: SCREAMING_SNAKE_CASE — `SITE`, `METADATA`, `HERO`, `FOUNDER`

**Types and Interfaces:**
- Interfaces: PascalCase prefixed with noun — `BlogPost`, `SAGIEEvent`, `FormFieldProps`, `SectionProps`
- Type aliases: PascalCase — `ButtonVariant`, `ChapterStatus`
- Zod schemas: PascalCase suffixed with `Schema` — `MembershipSchema`, `ChapterSchema`, `VenturesSchema`

## Code Style

**Formatting:**
- No Prettier config present — formatting is managed manually or by editor defaults
- Semicolons: inconsistent; lib files use semicolons, component files use none
- Quotes: single quotes in most files
- Trailing commas: used in multi-line objects and arrays

**Linting:**
- No `.eslintrc` config; linting runs via `next lint` (uses Next.js built-in ESLint config)
- Known suppressions: `@typescript-eslint/no-explicit-any` disabled inline in `src/lib/blog.ts`, `src/lib/events.ts`, `src/lib/resources.ts`, `src/lib/solutions.ts`, and file-level in `src/components/GlobeNetwork.tsx`

**TypeScript:**
- Strict mode enabled — `strict: true` in `tsconfig.json`
- Additional strict flags: `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, `exactOptionalPropertyTypes`
- `allowJs: false` — no JavaScript files permitted
- Target: ES2022
- `as const` used heavily for readonly constant objects

## Import Organization

**Order (observed pattern):**
1. Framework imports — `'next/cache'`, `'next/server'`, `'react'`
2. Internal `@/` alias imports — services, components, lib, constants
3. No third-party grouping distinction enforced

**Path Aliases:**
- `@/*` maps to `./src/*` — used throughout, never relative paths for cross-directory imports
- Example: `import { env } from '@/env/server'`, `import { notion } from '@/lib/notion'`

**`'use client'` directive:**
- Placed as the very first line (before imports) in all client components and hooks
- Required for: all form components, animation components, any `useState`/`useEffect` usage
- Server components (pages with data fetching) have no directive — default server rendering

## Validation Pattern

**Form validation uses two layers:**
1. Client-side: manual field presence checks returning `Record<string, string>` error maps
2. Server-side: Zod schema validation via `withValidation` HOF wrapper in `src/lib/validation.ts`

**Zod schema conventions:**
- Defined in `src/lib/schemas.ts` — one schema per form/resource
- String fields: always `.trim()`, often `.max()` bounded
- Email fields: `.email().max(254).trim().toLowerCase()`
- URL fields: `.url().optional()`
- Enum fields: `z.enum([...])` — never `z.string()` for constrained values

**`withValidation` HOF:**
- Wraps all API POST handlers — `export const POST = withValidation(Schema, async (_req, body) => {...})`
- Handles: JSON parse errors (400), honeypot detection (silently 200), timing check < 3000ms (silently 200), Zod errors (422 with `fieldErrors`)
- Validated `body` is fully typed via `z.infer<S>`

## Error Handling

**API routes:**
- Top-level try/catch inside the `withValidation` handler
- Errors logged with `console.error('[context] failed:', error)`
- Client receives: `NextResponse.json({ error: 'descriptive message' }, { status: 500 })`
- Success response: `NextResponse.json({ success: true })`

**Notion writes:**
- Always wrapped with `notionWrite()` from `src/lib/notion-monitor.ts`
- `notionWrite` captures exceptions to Sentry before re-throwing

**Library functions (data fetching):**
- Optional fields accessed with `??` null coalescing — never optional chaining alone without a fallback
- Silent fallbacks: `p['Title']?.title?.[0]?.plain_text ?? 'Untitled'`
- `getPostBySlug` returns `null` on missing slug, returns empty markdown on conversion failure (silent catch)

**Client forms:**
- Submit errors shown via `errors.submit` state key
- No error boundary components present
- Loading state managed with `loading` boolean disabling the submit button

## Environment Variables

**Validated at startup via Zod:**
- All server env vars validated in `src/env/server.ts` using `EnvSchema.parse(process.env)`
- `import 'server-only'` at top of `src/env/server.ts` prevents client import
- Missing required vars throw at boot time, not at request time

## Logging

**Framework:** `console.error` only — no structured logging library

**Patterns:**
- `console.error('[Context] failed:', error)` in API route catch blocks
- Sentry captures all Notion write failures via `notionWrite` wrapper
- No `console.log` or `console.info` calls in source

## Data Constants

**Pattern:**
- All copy, UI text, and static data lives in `src/constants/` as `as const` typed exports
- Interfaces for constant shapes defined in `src/types/index.ts`
- Constants files import types, never import from lib or components

## Component Design

**Server components (pages):**
- Export default unnamed function or named function — `export default function HomePage()`
- Import and compose section/layout components only — no logic
- Data fetching called directly in the component body (RSC pattern)

**Client components:**
- Named exports — `export function MembershipForm()`
- State grouped into a single `fields` object using `useState`
- Setter curried: `const set = (key: string) => (value: string) => setFields(prev => ({ ...prev, [key]: value }))`
- Inline `style` props used for form layout (not Tailwind) — forms use CSS-in-JS style objects
- Tailwind used for section/page layout and typography

**UI primitives:**
- Accept `React.ComponentPropsWithoutRef<'element'>` for full HTML prop passthrough
- Use `cn()` from `src/lib/utils.ts` for class merging — `clsx` + `tailwind-merge`
- Extend with `className` and `style` optional props

## Module Exports

**Pattern:** Named exports — no default exports from component or lib files (except Next.js pages/layouts which require `export default`)

**Barrel files:** Not used — each file imported directly by path

---

*Convention analysis: 2026-03-28*
