# Coding Conventions

**Analysis Date:** 2026-03-28

## Naming Patterns

**Files:**
- React components: PascalCase — `MembershipForm.tsx`, `ScrollReveal.tsx`, `AnimatedSection.tsx`
- Non-component TypeScript: camelCase — `blog.ts`, `utils.ts`, `notion-monitor.ts`
- Route handlers: `route.ts` (Next.js App Router convention)
- Page files: `page.tsx` (Next.js App Router convention)
- Hooks: camelCase prefixed with `use` — `useScrollReveal.ts`

**Functions and Components:**
- React components: PascalCase named exports — `export function Hero()`, `export function FormField(...)`
- Utility functions: camelCase named exports — `export function cn(...)`, `export function withValidation(...)`
- Internal/private helpers: camelCase — `function mapEvent(...)`, `function mapLocation(...)`
- Async data fetchers: camelCase describing what they get — `getAllPosts`, `getPostBySlug`, `getUpcomingEvents`

**Variables and Constants:**
- Local variables: camelCase — `const loadTime`, `const fieldErrors`
- Module-level constants: ALL_CAPS for primitive/object literals exported as const — `HERO`, `BELIEF`, `SITE`, `NAV_LINKS`, `SOCIAL_STATS`
- Type-mapped constants: PascalCase object names — `ROLE_MAP`, `STAT_VALUES`

**Types and Interfaces:**
- Interfaces: PascalCase, prefixed with name context — `BlogPost`, `SAGIEEvent`, `FormFieldProps`
- Type aliases: PascalCase — `ButtonVariant`, `ChapterStatus`
- Zod schemas: PascalCase suffixed with `Schema` — `MembershipSchema`, `VenturesSchema`, `EnvSchema`

## Code Style

**Formatting:**
- No Prettier config detected; formatting is consistent but not enforced by a config file
- Single quotes for strings in most files (`'use client'`, `import { cn } from '@/lib/utils'`)
- Trailing commas used in multi-line objects and arrays
- Semicolons used in some files, omitted in others — not fully consistent

**Linting:**
- ESLint via `next lint` (Next.js built-in ESLint config)
- `@typescript-eslint/no-explicit-any` is the most suppressed rule — suppressed with inline comments in `src/lib/blog.ts`, `src/lib/events.ts`, `src/lib/resources.ts`, `src/lib/solutions.ts`
- File-level disable for `any` in `src/components/GlobeNetwork.tsx`

**TypeScript:**
- `strict: true` enabled in `tsconfig.json`
- `noUncheckedIndexedAccess: true` — array/record access returns `T | undefined`
- `noImplicitReturns: true` — all code paths must return
- `exactOptionalPropertyTypes: true` — optional props must be `undefined`, not absent
- `allowJs: false` — TypeScript only, no `.js` files

## Import Organization

**Order (observed pattern):**
1. Framework/Next.js imports — `import { NextResponse } from 'next/server'`
2. External libraries — `import { z } from 'zod'`, `import { gsap } from 'gsap'`
3. Internal aliases starting with `@/` — `import { notion } from '@/lib/notion'`
4. Relative imports (used only for co-located files) — `import { ShareButton } from './ShareButton'`

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- All cross-directory imports use `@/` — never `../../`
- Relative imports only for files in the same directory (e.g., dynamic route segments)

## Error Handling

**API Route Pattern:**
All API routes use `withValidation()` wrapper from `src/lib/validation.ts`, which handles:
- JSON parse errors → `400` with `{ error: 'Request body must be valid JSON' }`
- Validation failures → `422` with `{ error: 'Validation failed', fieldErrors: {...} }`
- Bot/spam detection → silently returns `200` (honeypot + timing check)

Inside validated handlers, errors are caught with try/catch:
```typescript
export const POST = withValidation(SomeSchema, async (_req, body) => {
  try {
    await notionWrite(() => notion.pages.create({...}))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Operation failed:', error)
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
})
```

**Notion Write Pattern:**
All Notion write operations go through `notionWrite()` from `src/lib/notion-monitor.ts`, which captures exceptions to Sentry before re-throwing.

**Data Fetching (lib functions):**
Read operations use `try/catch` with graceful fallbacks:
```typescript
try {
  const mdBlocks = await n2m.pageToMarkdown(post.id)
  return { ...post, markdown }
} catch {
  return { ...post, markdown: '' }
}
```

**Form Client-Side:**
Forms validate locally before submitting, and display field-level and submit-level error states:
```typescript
const [errors, setErrors] = useState<Record<string, string>>({})
// On catch: setErrors({ submit: 'Something went wrong. Please try again.' })
```

## Logging

**Server-side:** `console.error(...)` in API route catch blocks, always with a descriptive prefix string: `'Membership application failed:'`, `'Ventures application failed:'`

**Error tracking:** Sentry via `src/lib/notion-monitor.ts` for Notion write failures. Sentry initialized in `sentry.server.config.ts`, `sentry.client.config.ts`, `sentry.edge.config.ts`.

**No structured logging library** — plain `console.error` only.

## Comments

**When to Comment:**
- Explain non-obvious logic: `// Honeypot check — bots fill hidden field`
- Suppress lint rules inline with a comment on the line before
- Short inline comments for layout/structural sections in JSX: `{/* Mobile-only logo */}`

**No JSDoc/TSDoc** — function signatures are self-documenting via TypeScript types.

## Component Design

**Server vs. Client Components:**
- Default: Server Components (no directive)
- Client Components require `'use client'` as first line — used for components with state, effects, event handlers, or browser APIs
- Examples: all form components, animation components, filter components are `'use client'`

**Props Pattern:**
- Props interfaces are defined inline in the same file, not exported unless reused
- Interface extends HTML element props when appropriate: `interface ButtonProps extends React.ComponentPropsWithoutRef<'a'>`
- Optional props use `| undefined` explicitly due to `exactOptionalPropertyTypes`

**Styling:**
- Two styling patterns coexist:
  1. Tailwind CSS via `cn()` utility (preferred for layout/section components): `className={cn('relative z-[1]', className)}`
  2. Inline `style` objects (used in form components and UI primitives): `style={{ display: 'flex', gap: '20px' }}`
- `cn()` from `src/lib/utils.ts` combines `clsx` + `tailwind-merge`
- CSS custom properties (design tokens) for colors and typography: `var(--silver)`, `var(--text-primary)`, `var(--font-display)`

## Module Design

**Exports:**
- All exports are named exports — no default exports except Next.js required defaults (`page.tsx`, `layout.tsx`, `route.ts`)
- Constants files export named `const` objects — `export const HERO = {...} as const`

**Barrel Files:**
- Not used — each module is imported directly by path

**Environment Variables:**
- All server-side env vars accessed exclusively through `src/env/server.ts`
- `src/env/server.ts` imports `server-only` to prevent client-side leakage
- Env vars validated at startup with Zod schema — crashes fast if missing

**Data Caching:**
- Notion read functions wrapped with `unstable_cache` from `next/cache`
- Cache keys follow pattern: `['notion:{entity}:{scope}']` — e.g., `['notion:blog:index']`
- Tags follow: `['notion:{entity}']` — e.g., `['notion:blog']`
- Revalidation: 3600s (1hr) for blog/resources, 300s (5min) for events

---

*Convention analysis: 2026-03-28*
