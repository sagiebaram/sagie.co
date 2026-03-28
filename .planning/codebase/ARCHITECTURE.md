# Architecture

## Pattern

**Next.js App Router** with server-first rendering. Marketing pages use React Server Components for Notion data fetching; interactive forms and animations are client components.

## Layers

```
Browser
  └── Next.js App Router (src/app/)
        ├── Server Components (pages) ── fetch from Notion via src/lib/*
        ├── Client Components (forms, animations) ── POST to API routes
        └── API Routes (src/app/api/) ── validate with Zod, write to Notion
              └── Notion API (@notionhq/client)
              └── Sentry (error tracking)
```

### Presentation Layer
- **Pages:** `src/app/(marketing)/` — server components that call lib functions
- **Sections:** `src/components/sections/` — large page sections (Hero, Pillars, FAQ, etc.)
- **UI:** `src/components/ui/` — reusable primitives (Button, FormField, Section, etc.)
- **Forms:** `src/components/forms/` — client-side form components with honeypot protection
- **Layout:** `src/components/layout/` — Navbar, Footer

### Data Layer
- **Notion client:** `src/lib/notion.ts` — singleton `@notionhq/client` instance
- **Domain modules:** `src/lib/blog.ts`, `src/lib/events.ts`, `src/lib/resources.ts`, `src/lib/solutions.ts`
- **Caching:** `unstable_cache()` with 1-hour revalidation and tag-based keys (`notion:blog`, `notion:events`, etc.)

### Validation Layer
- **Schemas:** `src/lib/schemas.ts` — Zod schemas for all form submissions (Membership, Chapter, Ventures, Solutions, EventSuggestion, SubmitPost)
- **Middleware:** `src/lib/validation.ts` — `withValidation()` HOF wrapping all API route handlers
- **Bot protection:** Honeypot field (`_trap`) + timing check (`_t`, 3s minimum)

### Monitoring Layer
- **Sentry:** Client (`sentry.client.config.ts`), server (`sentry.server.config.ts`), edge (`sentry.edge.config.ts`)
- **Notion writes:** `src/lib/notion-monitor.ts` — `notionWrite()` wrapper captures exceptions to Sentry

## Data Flow

### Read Path (Server Components)
```
Page (RSC) → lib module (e.g. getAllPosts()) → unstable_cache → Notion API → map response → typed interface
```

### Write Path (Form Submissions)
```
Client form → POST /api/* → withValidation(ZodSchema) → honeypot check → Zod parse → notionWrite() → Notion pages.create()
```

### Content Pipeline
- Blog posts: Notion → notion-to-md → markdown string → MDX rendering via `<BlogContent>`
- Resources, Solutions, Events: Notion → typed interfaces → filter/sort in client components

## Entry Points

- `src/app/layout.tsx` — Root layout with Google Fonts (Bebas Neue, DM Sans), GSAP cleanup
- `src/app/(marketing)/page.tsx` — Homepage with section components
- `src/app/api/` — 7 API routes for form submissions
- `next.config.ts` — CSP headers, Sentry config, React Compiler enabled

## Key Abstractions

| Abstraction | Location | Purpose |
|------------|----------|---------|
| `withValidation()` | `src/lib/validation.ts` | HOF: Zod validation + honeypot for all API routes |
| `notionWrite()` | `src/lib/notion-monitor.ts` | Sentry-wrapped Notion write operations |
| `unstable_cache()` | All lib modules | Next.js caching with hourly revalidation |
| `useScrollReveal()` | `src/hooks/useScrollReveal.ts` | GSAP scroll-triggered animations |
| `FormField` | `src/components/ui/FormField.tsx` | Shared form input component |
| `Section` | `src/components/ui/Section.tsx` | Consistent page section wrapper |

## Security

- **CSP headers:** Configured in `next.config.ts` (note: `'unsafe-inline'` for scripts/styles)
- **Environment validation:** `src/env/server.ts` — Zod schema validates all env vars at startup
- **CORS:** `allowedOrigins` defined but not currently enforced in API routes
- **API headers:** `Cache-Control: no-store` on all `/api/*` routes
- **Frame protection:** `X-Frame-Options: DENY`, `frame-ancestors 'none'`
