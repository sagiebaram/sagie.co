# Session: launch/simple-homepage

## Goal
Ship sagie.co with ONLY the homepage visible in production. All other routes blocked behind a "Coming Soon" page. No navbar. All CTAs disabled. Zero forms accessible.

This is a production-safe, reversible change. Everything stays in the codebase — we're gating, not deleting.

---

## Pre-flight

```bash
# 1. Stash any uncommitted work on current branch
git stash push -m "wizard-api-wip-04-26"

# 2. Switch to main and pull latest
git checkout main
git pull origin main

# 3. Create the launch branch
git checkout -b launch/simple-homepage
```

---

## Changes (in order)

### 1. Create middleware.ts — Route gate (PRODUCTION ONLY)

**File:** `src/middleware.ts` (new file)

Logic:
- Only active when `NODE_ENV === 'production'` (or check for a `NEXT_PUBLIC_LAUNCH_MODE=simple` env var — see note below)
- Allow these paths through: `/`, `/_next/*`, `/api/*`, `/coming-soon`, `/favicon.ico`, `/sitemap.xml`, `/robots.txt`, all files in `/public/*` (images, fonts, static assets)
- Everything else → `NextResponse.rewrite(new URL('/coming-soon', request.url))`
- Use rewrite (NOT redirect) so the URL stays visible and crawlers don't index wrong paths

**Env var approach (recommended):**
Use `NEXT_PUBLIC_LAUNCH_MODE` set to `"simple"` in Vercel production env.
- When `"simple"` → gate routes
- When absent or any other value → normal site behavior
- This way dev, preview, and local all work normally without the gate
- And we can flip it off in Vercel dashboard without a deploy

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ALLOWED_PATHS = new Set(['/', '/coming-soon'])

const ALLOWED_PREFIXES = [
  '/_next',
  '/api',
  '/favicon',
  '/sitemap',
  '/robots',
]

export function middleware(request: NextRequest) {
  // Only gate in launch mode
  if (process.env.NEXT_PUBLIC_LAUNCH_MODE !== 'simple') {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  // Allow exact matches
  if (ALLOWED_PATHS.has(pathname)) {
    return NextResponse.next()
  }

  // Allow prefix matches (static assets, API, Next.js internals)
  if (ALLOWED_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Allow static files (images, fonts, etc.)
  if (pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|css|js|map)$/)) {
    return NextResponse.next()
  }

  // Block everything else → Coming Soon
  return NextResponse.rewrite(new URL('/coming-soon', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
```

### 2. Create /coming-soon page

**File:** `src/app/(marketing)/coming-soon/page.tsx`

Design requirements:
- Match the existing site aesthetic (dark background, CircuitBackground, same fonts)
- Centered content, vertically centered
- Heading: "COMING SOON" — font-display, uppercase, large
- Subtext: "We're building something worth the wait." — font-body, muted
- Single button: "Back to Home →" linking to `/`
- Use existing `Button` component (variant="outline")
- Use `CircuitBackground` component
- Add proper metadata export: title "Coming Soon — SAGIE"
- NO forms, NO email capture, NO newsletter signup

Reference the existing `not-found.tsx` at `src/app/not-found.tsx` for design language — similar vibe, simpler content.

### 3. Hide Navbar from homepage

**File:** `src/app/(marketing)/page.tsx`

- Remove the `<Navbar />` component from the render
- Keep the import commented out (not deleted) for easy restore: `// import { Navbar } from '@/components/layout/Navbar'`
- The SectionNav (dot navigation) should stay — it navigates within the page

### 4. Disable all "Apply to Join" CTAs

These are the exact locations. Each needs a different treatment:

**a) Hero section** — `src/components/sections/Hero.tsx` line 41
- Change: `<Button variant="primary" href="/apply" className="hero-cta">{HERO.primaryCta}</Button>`
- To: A disabled-looking button with "Coming Soon" text
- Implementation: Replace with a `<span>` styled to look like a muted/disabled button. No link. Use existing button classes but with reduced opacity and `cursor-default`.
```tsx
<span className="hero-cta inline-block font-body uppercase text-button tracking-button px-[34px] py-4 opacity-40 cursor-default border border-border-subtle text-foreground-muted">
  Coming Soon
</span>
```

**b) FinalCTA section** — `src/components/sections/FinalCTA.tsx` line 105
- Same treatment as Hero — disabled span, "Coming Soon"

**c) Tiers section** — `src/components/sections/Tiers.tsx` line 77-87
- The `tier.ctaActive` branch has `<a href="/apply">` 
- Change the active branch to render the same as the inactive branch (a non-clickable span)
- OR: set all tiers to ctaActive: false if that's a data flag

**d) ChapterMap section** — `src/components/sections/ChapterMap.tsx` line 40
- "Start a Chapter →" button links to `/apply/chapter`
- Replace with disabled span: "Coming Soon"

**e) Footer** — `src/components/layout/Footer.tsx`
- Lines 67-79: "Apply to Join" and "Start a Chapter" and "Contact" are TransitionLinks to /apply, /apply/chapter, /contact
- Replace these three with plain `<span>` elements (same text but no link, muted styling)
- Lines 90-96: "Privacy Policy" and "Terms of Service" links → these are legal pages, keep them accessible OR disable if you want strict / only. **Decision: disable them too** — middleware will handle the rewrite anyway, but removing the links is cleaner.
- Lines 22-27: Navigate section links to /solutions, /eco, /ventures → replace with non-clickable spans
- Keep the external links (LinkedIn, Instagram, sagiebaram.com) — those go offsite and should stay

### 5. Update SectionNav label

**File:** `src/app/(marketing)/page.tsx` line 29
- Change `{ id: 'cta', label: 'Join' }` → `{ id: 'cta', label: 'CTA' }` or keep as-is
- Actually keep as "Join" — it's an in-page nav to the FinalCTA section, which still exists

### 6. Sitemap — homepage only in launch mode

**File:** `src/app/sitemap.ts`

- When `NEXT_PUBLIC_LAUNCH_MODE === 'simple'`, return ONLY the homepage entry
- Otherwise return the full sitemap
- This prevents search engines from indexing routes that show "Coming Soon"

```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.NEXT_PUBLIC_LAUNCH_MODE === 'simple') {
    return [{
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    }]
  }
  // ... existing full sitemap
}
```

### 7. robots.txt consideration

If there's no `robots.txt` or `src/app/robots.ts`, consider adding one that disallows crawling of non-homepage routes during launch mode. Low priority — the middleware rewrite + sitemap change handles most of it.

---

## What NOT to change

- Do NOT delete any existing pages, components, API routes, or forms
- Do NOT modify any Notion integration code
- Do NOT change any env vars that affect data fetching
- Do NOT touch the root layout (`src/app/layout.tsx`)
- Do NOT modify the not-found.tsx — it still serves its purpose
- Keep all tests passing — update tests if they navigate to blocked routes

---

## Testing checklist

1. `npm run lint` — passes
2. `npm run typecheck` — passes  
3. `npm run test:ci` — passes (update tests that expect /apply navigation)
4. Local dev: ALL routes accessible (middleware not active)
5. With `NEXT_PUBLIC_LAUNCH_MODE=simple` in `.env.local`:
   - `/` renders homepage without Navbar, CTAs disabled
   - `/blog`, `/apply`, `/events`, etc. → show Coming Soon page
   - `/coming-soon` renders directly
   - Static assets load normally
   - `/_next/*` works
6. E2E tests: may need `NEXT_PUBLIC_LAUNCH_MODE` unset in test env

---

## Env var to add

**Vercel Production environment only:**
```
NEXT_PUBLIC_LAUNCH_MODE=simple
```

Do NOT add to Vercel Preview or Development environments.

---

## PR title
`feat: simple homepage launch — route gating, disabled CTAs, no navbar`

## PR description
Ship a production-ready landing page showing only the homepage.

Changes:
- Added Next.js middleware that gates all non-/ routes behind a "Coming Soon" page when `NEXT_PUBLIC_LAUNCH_MODE=simple`
- Created `/coming-soon` page matching site design language
- Removed Navbar from homepage (commented import for easy restore)
- Replaced all "Apply to Join" CTAs with disabled "Coming Soon" buttons (Hero, FinalCTA, Tiers, ChapterMap, Footer)
- Disabled internal navigation links in Footer
- Sitemap returns homepage-only in launch mode
- All changes are reversible by removing the env var

Env setup required: Set `NEXT_PUBLIC_LAUNCH_MODE=simple` in Vercel Production environment.
