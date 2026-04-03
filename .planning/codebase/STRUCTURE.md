# Structure

## Root Directory

```
sagie.co/
├── src/                    # Application source code
├── tests/                  # Playwright E2E tests
├── public/                 # Static assets
├── .planning/              # GSD planning documents
├── next.config.ts          # Next.js configuration
├── vitest.config.ts        # Unit test configuration
├── playwright.config.ts    # E2E test configuration
├── eslint.config.mjs       # ESLint flat config
├── postcss.config.mjs      # PostCSS/Tailwind config
├── tsconfig.json           # TypeScript config
├── sentry.client.config.ts # Sentry client-side config
├── sentry.server.config.ts # Sentry server-side config
├── sentry.edge.config.ts   # Sentry edge runtime config
└── package.json            # Dependencies and scripts
```

## Source Directory (`src/`)

```
src/
├── app/                    # Next.js App Router pages and API routes
├── components/             # React components
├── lib/                    # Business logic, data fetching, utilities
├── types/                  # TypeScript type definitions
├── hooks/                  # Custom React hooks
├── emails/                 # React Email templates
├── constants/              # Static data and content
└── env/                    # Environment variable validation
```

## App Directory (`src/app/`)

### Route Groups
- `(marketing)/` — Public-facing pages (route group, no URL segment)
- `admin/` — Admin panel
- `api/` — API routes

### Marketing Pages
| Route | File | Description |
|-------|------|-------------|
| `/` | `(marketing)/page.tsx` | Homepage |
| `/events` | `(marketing)/events/page.tsx` | Events listing |
| `/blog` | `(marketing)/blog/page.tsx` | Blog listing |
| `/blog/[slug]` | `(marketing)/blog/[slug]/page.tsx` | Blog post detail |
| `/resources` | `(marketing)/resources/page.tsx` | Resources directory |
| `/solutions` | `(marketing)/solutions/page.tsx` | Solutions page |
| `/apply` | `(marketing)/apply/page.tsx` | General application |
| `/apply/chapter` | `(marketing)/apply/chapter/page.tsx` | Chapter application |
| `/apply/solutions` | `(marketing)/apply/solutions/page.tsx` | Solutions application |
| `/apply/ventures` | `(marketing)/apply/ventures/page.tsx` | Ventures application |
| `/suggest-event` | `(marketing)/suggest-event/page.tsx` | Event suggestion form |

### Shared Route Files
- `layout.tsx` — Root layout (Navbar + Footer)
- `not-found.tsx` — 404 page
- `sitemap.ts` — Dynamic sitemap generation
- `globals.css` — Global styles and Tailwind directives
- `error.tsx` / `loading.tsx` — Per-route error and loading states

## Components (`src/components/`)

### Organization
```
components/
├── forms/          # Form components (one per application type)
├── layout/         # Navbar, Footer
├── mdx/            # MDX/blog content rendering
├── sections/       # Homepage and page sections
├── ui/             # Reusable UI primitives
├── GlobeClient.tsx # 3D globe (client component)
├── GlobeNetwork.tsx # Globe network data/arcs
└── GlobeShell.tsx  # Globe wrapper with loading
```

### Sections (`sections/`)
Homepage sections rendered in order: `Hero`, `SocialProof`, `Pillars`, `WhoItsFor`, `Belief`, `FounderBridge`, `Tiers`, `ChapterMap`, `FAQ`, `FinalCTA`

### Forms (`forms/`)
One form component per application type: `MembershipForm`, `ChapterForm`, `SolutionsForm`, `VenturesForm`, `SuggestEventForm`, `SubmitPostForm`

### UI Primitives (`ui/`)
Reusable components: `Button`, `Section`, `Eyebrow`, `FormField`, `ScrollReveal`, `AnimatedSection`, `CircuitBackground`, `GridBackground`, `Skeleton`, `ErrorPage`, `Logo`

## Library (`src/lib/`)

```
lib/
├── __tests__/        # Unit tests
├── notion.ts         # Notion API client and data fetching
├── schemas.ts        # Zod validation schemas
├── validation.ts     # Form validation logic
├── email.ts          # Email sending via Resend
├── blog.ts           # Blog data fetching/transformation
├── events.ts         # Events data fetching/transformation
├── members.ts        # Members data operations
├── chapters.ts       # Chapters data operations
├── resources.ts      # Resources data operations
├── solutions.ts      # Solutions data operations
├── calendar.ts       # Google Calendar integration
├── notion-monitor.ts # Notion sync monitoring
├── gsap.ts           # GSAP animation utilities
└── utils.ts          # General utilities (cn, formatDate, etc.)
```

## Other Directories

### Types (`src/types/`)
- `index.ts` — Shared TypeScript interfaces
- `events.ts` — Event-specific types

### Hooks (`src/hooks/`)
- `useScrollReveal.ts` — Scroll-triggered reveal animation hook

### Emails (`src/emails/`)
- `ConfirmationEmail.tsx` — User confirmation email (React Email)
- `AdminAlertEmail.tsx` — Admin notification email (React Email)

### Constants (`src/constants/`)
Static content and data: `copy.ts`, `faq.ts`, `personas.ts`, `pillars.ts`, `solutions.ts`, `tiers.ts`, `blog.ts`

### Environment (`src/env/`)
- `server.ts` — Server-side env validation (Zod)

## Tests

### Unit Tests
- Location: `src/lib/__tests__/*.test.ts`
- Framework: Vitest
- Config: `vitest.config.ts`

### E2E Tests
- Location: `tests/`
- Framework: Playwright
- Config: `playwright.config.ts`

## Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Components | PascalCase | `MembershipForm.tsx`, `Hero.tsx` |
| Utilities | camelCase | `notion.ts`, `utils.ts` |
| Constants | camelCase file, UPPER_CASE exports | `copy.ts` → `HERO_COPY` |
| Types | PascalCase | `EventType`, `BlogPost` |
| Routes | kebab-case directories | `apply/chapter/`, `suggest-event/` |
| Tests | `*.test.ts` | `schemas.test.ts` |
| Hooks | `use` prefix | `useScrollReveal.ts` |

## Path Aliases

- `@/*` → `src/*` (configured in `tsconfig.json`)
- Example: `import { cn } from '@/lib/utils'`

## Where to Add New Code

| Adding... | Location |
|-----------|----------|
| New page | `src/app/(marketing)/route-name/page.tsx` |
| API endpoint | `src/app/api/endpoint-name/route.ts` |
| Reusable component | `src/components/ui/ComponentName.tsx` |
| Page section | `src/components/sections/SectionName.tsx` |
| Form | `src/components/forms/FormName.tsx` |
| Data fetching | `src/lib/domain-name.ts` |
| Types | `src/types/index.ts` or `src/types/domain.ts` |
| Constants | `src/constants/topic.ts` |
| Unit test | `src/lib/__tests__/module.test.ts` |
| E2E test | `tests/feature.spec.ts` |
