# Codebase Structure

## Directory Layout

```
sagie.co/
├── src/
│   ├── app/                    # Next.js App Router pages and API routes
│   │   ├── (marketing)/        # Route group for public-facing pages
│   │   │   ├── apply/          # Application forms (chapter, solutions, ventures)
│   │   │   │   ├── chapter/
│   │   │   │   ├── solutions/
│   │   │   │   └── ventures/   # Sub-routes: founder/, investor/
│   │   │   ├── blog/           # Blog listing + [slug] dynamic route
│   │   │   ├── contact/
│   │   │   ├── eco/            # Ecosystem page
│   │   │   ├── events/         # Events listing (client-side filtering)
│   │   │   ├── privacy/
│   │   │   ├── resources/
│   │   │   ├── solutions/
│   │   │   ├── suggest-event/
│   │   │   ├── terms/
│   │   │   └── ventures/
│   │   ├── admin/              # Admin pages (revalidation UI)
│   │   │   └── revalidate/
│   │   ├── api/                # API routes
│   │   │   ├── applications/   # chapter/, membership/, solutions/, ventures/
│   │   │   ├── contact/
│   │   │   ├── events/[id]/ics/  # ICS calendar download
│   │   │   ├── revalidate/     # On-demand ISR endpoint
│   │   │   ├── submit-post/
│   │   │   ├── submit-resource/
│   │   │   ├── subscribe/      # Beehiiv newsletter
│   │   │   └── suggest-event/
│   │   ├── globals.css         # Tailwind v4 imports + custom styles
│   │   ├── layout.tsx          # Root layout (fonts, providers, analytics)
│   │   ├── not-found.tsx
│   │   └── sitemap.ts          # Dynamic sitemap from Notion data
│   │
│   ├── components/
│   │   ├── forms/              # Form components (7 forms)
│   │   │   ├── ChapterForm.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── MembershipForm.tsx
│   │   │   ├── SolutionsForm.tsx
│   │   │   ├── SubmitPostForm.tsx
│   │   │   ├── SuggestEventForm.tsx
│   │   │   └── VenturesForm.tsx
│   │   ├── layout/             # Navbar.tsx, Footer.tsx
│   │   ├── mdx/                # BlogContent.tsx (markdown rendering)
│   │   ├── sections/           # Page sections (Hero, Pillars, FAQ, etc.)
│   │   └── ui/                 # Reusable UI primitives (30+ components)
│   │       ├── ScrollReveal.tsx
│   │       ├── Section.tsx
│   │       ├── GridBackground.tsx
│   │       ├── SplitTextReveal.tsx
│   │       └── ...
│   │
│   ├── constants/              # Static data (copy, FAQ, tiers, pillars, etc.)
│   ├── emails/                 # React Email templates (admin alert, confirmation)
│   ├── env/                    # server.ts — Zod-validated env schema
│   ├── hooks/                  # useCardTilt.ts, useScrollReveal.ts
│   ├── lib/                    # Core business logic and data fetching
│   │   ├── __tests__/          # Vitest unit tests (11 test files)
│   │   ├── notion.ts           # Notion client + query helpers
│   │   ├── notion-utils.ts     # Property extraction utilities
│   │   ├── blog.ts             # Blog data fetching
│   │   ├── events.ts           # Events data fetching
│   │   ├── email.ts            # Resend email sending
│   │   ├── schemas.ts          # Zod validation schemas
│   │   ├── validation.ts       # withValidation helper
│   │   ├── gsap.ts             # GSAP dynamic import + lazy loading
│   │   ├── calendar.ts         # Google Calendar + ICS generation
│   │   └── ...
│   │
│   └── types/                  # TypeScript type definitions
│       ├── index.ts            # Shared types
│       └── events.ts           # Event-specific types
│
├── tests/                      # Playwright E2E tests
├── public/                     # Static assets
├── .planning/                  # GSD planning documents
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind v4 config (if present)
├── vitest.config.ts            # Vitest configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── .env.example                # Environment variable template
```

## Key Locations

### Entry Points
- `src/app/layout.tsx` — Root layout with fonts, theme, analytics, Sentry
- `src/app/(marketing)/page.tsx` — Homepage
- `src/app/api/*/route.ts` — API route handlers

### Data Layer
- `src/lib/notion.ts` — Notion client initialization and query wrappers
- `src/lib/notion-utils.ts` — Property extraction from Notion responses
- `src/lib/blog.ts`, `events.ts`, `solutions.ts`, etc. — Domain-specific data fetchers
- `src/env/server.ts` — Environment validation with Zod + `server-only` guard

### Form Pipeline
- `src/lib/schemas.ts` — Zod schemas for all form types
- `src/lib/validation.ts` — `withValidation` wrapper for API routes
- `src/app/api/applications/*/route.ts` — Form submission handlers
- `src/lib/email.ts` — Sends confirmation + admin emails via Resend

### Animation System
- `src/lib/gsap.ts` — Dynamic GSAP + plugin imports
- `src/components/ui/ScrollReveal.tsx` — Scroll-triggered reveal animations
- `src/components/ui/SplitTextReveal.tsx` — Text split animations
- `src/components/ui/GridBackground.tsx` — Parallax grid backgrounds
- `src/hooks/useScrollReveal.ts` — GSAP ScrollTrigger hook

### Testing
- `src/lib/__tests__/*.test.ts` — Unit tests (11 files)
- `tests/` — Playwright E2E tests
- `vitest.config.ts` — Vitest config (node environment, V8 coverage on `src/lib/`)

## Naming Conventions

| Category | Convention | Example |
|----------|-----------|---------|
| Components | PascalCase `.tsx` | `ScrollReveal.tsx`, `Hero.tsx` |
| Libraries | camelCase `.ts` | `notion.ts`, `email.ts` |
| Route segments | kebab-case dirs | `suggest-event/`, `submit-post/` |
| Constants | camelCase `.ts` | `copy.ts`, `pillars.ts` |
| Test files | `*.test.ts` | `blog.test.ts` |
| Types | PascalCase exports | `Event`, `BlogPost` |
| Hooks | `use` prefix camelCase | `useCardTilt.ts` |
| Route groups | `(name)` | `(marketing)` |
| Dynamic routes | `[param]` | `[slug]`, `[id]` |

## Where to Add New Code

| Scenario | Location |
|----------|----------|
| New public page | `src/app/(marketing)/new-page/page.tsx` |
| New API route | `src/app/api/new-route/route.ts` |
| New form | Schema in `src/lib/schemas.ts`, component in `src/components/forms/`, API route in `src/app/api/` |
| New Notion data source | Fetcher in `src/lib/`, DB ID in `.env`, add to `src/env/server.ts` |
| New UI component | `src/components/ui/NewComponent.tsx` |
| New page section | `src/components/sections/NewSection.tsx` |
| New constant/copy | `src/constants/new-data.ts` |
| New unit test | `src/lib/__tests__/module.test.ts` |
| New E2E test | `tests/new-flow.spec.ts` |
