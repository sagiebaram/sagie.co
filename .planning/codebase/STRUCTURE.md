# Structure

## Directory Layout

```
sagie.co/
├── .github/workflows/         # CI/CD pipelines
│   ├── ci.yml                 # Lint, type-check, unit tests
│   └── e2e-preview.yml        # Playwright E2E on preview deploys
├── .planning/                 # GSD planning documents
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (marketing)/       # Route group for marketing pages
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── apply/         # Application forms (chapter, solutions, ventures)
│   │   │   ├── blog/          # Blog listing + [slug] detail
│   │   │   ├── events/        # Events listing
│   │   │   ├── resources/     # Resources directory
│   │   │   ├── solutions/     # Solutions marketplace
│   │   │   └── suggest-event/ # Event suggestion form
│   │   ├── api/               # API route handlers
│   │   │   ├── applications/  # chapter/, membership/, solutions/, ventures/
│   │   │   ├── submit-post/   # Blog post submissions
│   │   │   ├── submit-resource/ # Resource submissions
│   │   │   └── suggest-event/ # Event suggestions
│   │   ├── layout.tsx         # Root layout
│   │   ├── not-found.tsx      # 404 page
│   │   ├── sitemap.ts         # Dynamic sitemap
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── sections/          # Full-page sections (Hero, Pillars, FAQ, etc.)
│   │   ├── forms/             # Form components (ChapterForm, VenturesForm, etc.)
│   │   ├── ui/                # Reusable UI primitives (Button, FormField, etc.)
│   │   ├── layout/            # Navbar, Footer
│   │   ├── mdx/               # BlogContent MDX renderer
│   │   ├── GlobeNetwork.tsx   # 3D globe visualization
│   │   └── GlobeShell.tsx     # Globe lazy-loading wrapper
│   ├── constants/             # Static content and configuration
│   │   ├── copy.ts            # Site metadata, hero copy
│   │   ├── pillars.ts         # SAGIE pillars content
│   │   ├── tiers.ts           # Membership tiers
│   │   ├── faq.ts             # FAQ items
│   │   ├── personas.ts        # Target audience personas
│   │   ├── blog.ts            # Blog categories
│   │   ├── events.ts          # Event type constants + mock data
│   │   ├── resources.ts       # Resource categories + mock data
│   │   └── solutions.ts       # Solution categories + mock data
│   ├── env/
│   │   └── server.ts          # Environment variable validation (Zod)
│   ├── hooks/
│   │   └── useScrollReveal.ts # GSAP scroll animation hook
│   ├── lib/
│   │   ├── notion.ts          # Notion client singleton
│   │   ├── notion-monitor.ts  # Sentry-wrapped Notion writes
│   │   ├── blog.ts            # Blog data fetching
│   │   ├── events.ts          # Events data fetching
│   │   ├── resources.ts       # Resources data fetching
│   │   ├── solutions.ts       # Solutions data fetching
│   │   ├── schemas.ts         # Zod validation schemas
│   │   └── validation.ts      # withValidation() HOF
│   └── types/
│       └── index.ts           # Shared TypeScript interfaces
├── sentry.client.config.ts    # Sentry browser config
├── sentry.server.config.ts    # Sentry server config
├── sentry.edge.config.ts      # Sentry edge config
├── next.config.ts             # Next.js config + CSP + Sentry
├── playwright.config.ts       # Playwright E2E config
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript config (strict)
└── package.json               # Dependencies and scripts
```

## Key Locations

| What | Where |
|------|-------|
| Homepage | `src/app/(marketing)/page.tsx` |
| API routes | `src/app/api/` (7 routes) |
| Notion data fetching | `src/lib/blog.ts`, `events.ts`, `resources.ts`, `solutions.ts` |
| Form validation schemas | `src/lib/schemas.ts` |
| API validation middleware | `src/lib/validation.ts` |
| Environment config | `src/env/server.ts` |
| Security headers | `next.config.ts` |
| Static content/copy | `src/constants/` |
| Animations | `src/hooks/useScrollReveal.ts`, `src/components/ui/GSAPCleanup.tsx` |

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ChapterForm.tsx`, `FormField.tsx` |
| Lib modules | camelCase | `blog.ts`, `notion-monitor.ts` |
| Constants | camelCase files, UPPER_CASE exports | `copy.ts` → `METADATA`, `SITE` |
| API routes | kebab-case directories | `submit-post/route.ts` |
| Hooks | camelCase with `use` prefix | `useScrollReveal.ts` |
| Types | PascalCase interfaces | `BlogPost`, `Resource`, `Solution` |
| Zod schemas | PascalCase with `Schema` suffix | `MembershipSchema`, `ChapterSchema` |
| Route groups | parenthesized | `(marketing)` |

## File Count

~89 TypeScript/TSX files across the project.
