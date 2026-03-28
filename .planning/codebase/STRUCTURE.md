# Codebase Structure

## Directory Layout

```
src/
  app/                          # Next.js App Router
    (marketing)/                # Route group - all public pages
      apply/                    # Application forms (membership, chapter, solutions, ventures)
      blog/                     # Blog listing + [slug] dynamic routes
      events/                   # Events listing with client-side filtering
      resources/                # Resources directory
      solutions/                # Solutions listing
      suggest-event/            # Event suggestion form
      page.tsx                  # Homepage
    api/                        # API routes
      applications/             # Form submission endpoints (membership, chapter, solutions, ventures)
      submit-post/              # Blog post submission
      submit-resource/          # Resource submission
      suggest-event/            # Event suggestion submission
    layout.tsx                  # Root layout
    sitemap.ts                  # Dynamic sitemap generation
    not-found.tsx               # 404 page
    globals.css                 # Global styles + Tailwind
  components/
    forms/                      # Form components (MembershipForm, ChapterForm, SolutionsForm, VenturesForm, SuggestEventForm, SubmitPostForm)
    layout/                     # Navbar, Footer
    mdx/                        # BlogContent renderer
    sections/                   # Page sections (Hero, Pillars, Tiers, FAQ, FounderBridge, ChapterMap, etc.)
    ui/                         # Reusable UI primitives (Button, FormField, Logo, ScrollReveal, AnimatedSection, etc.)
    GlobeNetwork.tsx            # 3D globe visualization (standalone)
  constants/                    # Static data (copy, tiers, pillars, personas, faq, events, solutions, resources, forms, blog)
  hooks/                        # Custom hooks (useScrollReveal)
  lib/                          # Library integrations (notion.ts, blog.ts, gsap)
  types/                        # TypeScript interfaces (Pillar, Persona, Tier, FAQItem, Chapter, etc.)
```

## Key Locations

| Purpose | Location |
|---------|----------|
| Add a new page | `src/app/(marketing)/` |
| Add an API endpoint | `src/app/api/` |
| Add a form | `src/components/forms/` + `src/app/api/` route |
| Add a homepage section | `src/components/sections/` |
| Add a reusable UI component | `src/components/ui/` |
| Add static content/copy | `src/constants/` |
| Add a TypeScript type | `src/types/index.ts` |
| Add a custom hook | `src/hooks/` |
| Add a library wrapper | `src/lib/` |

## Naming Conventions

- **Components**: PascalCase, one component per file (`MembershipForm.tsx`, `ScrollReveal.tsx`)
- **Pages**: `page.tsx` inside route directories (Next.js convention)
- **API routes**: `route.ts` inside api directories
- **Constants**: camelCase exports, UPPER_CASE for config-like values
- **Types**: PascalCase interfaces in `src/types/index.ts`
- **Hooks**: `use` prefix, camelCase (`useScrollReveal.ts`)
- **Route groups**: Parenthesized directories `(marketing)` for layout grouping without URL impact

## File Patterns

- **Form flow**: `src/components/forms/XForm.tsx` → `fetch('/api/applications/x')` → `src/app/api/applications/x/route.ts` → Notion API
- **Content pages**: `src/app/(marketing)/x/page.tsx` → imports sections from `src/components/sections/` → uses constants from `src/constants/`
- **Dynamic content**: Notion DB queries in page server components → render with client components for interactivity
- **Animations**: GSAP via `src/lib/gsap` → `useScrollReveal` hook or inline `gsap.context()` usage
