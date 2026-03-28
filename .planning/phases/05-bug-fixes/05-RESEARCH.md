# Phase 5: Bug Fixes - Research

**Researched:** 2026-03-28
**Domain:** nuqs URL state, GSAP ScrollTrigger + Next.js navigation, form error handling
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Filter URL behavior**
- Use nuqs for URL param sync on all 4 filterable pages (Blog, Solutions, Resources, Events)
- Single selection per filter dimension (one category, one author at a time)
- Independent filter dimensions — changing category does not reset author (Blog has both)
- Remove param from URL when set to "All" (clean URLs: /blog not /blog?category=All)
- Use replaceState — filter changes do not add browser history entries
- "All" button is the only reset mechanism — no separate "Clear filters" UI
- Filter state animates in as part of page load animation sequence (not instant highlight)

**Animation on filter change**
- Initial page load: full GSAP ScrollTrigger stagger animation (preserve existing behavior)
- Filter content change: subtle fade-in only (~200ms) — no stagger, no slide
- Outgoing filtered items disappear instantly (no exit animation)
- Two distinct animation paths: first-visit scroll reveal vs filter-change fade

**Rate limit message style**
- Warning style with amber/yellow tone — visually distinct from red validation errors
- Friendly text: "You've submitted several times recently. Please wait a few minutes before trying again."
- Submit button temporarily disabled after 429 response
- Disable duration parsed from Retry-After header; fallback to 30 seconds if header missing
- Uses existing `errors.submit` display pattern but with warning color treatment
- Applies to all 7 form components

**Back/forward navigation**
- Filter selections restored from URL params on back/forward (comes free with nuqs)
- Browser default scroll restoration — no custom scroll logic
- Fix covers entire site, not just filtered pages — address root cause
- Content appears instantly on back/forward — no replay of GSAP scroll reveal animations
- Fix at both layers: GSAP cleanup/re-initialization AND Next.js navigation handling
- No extra loading states on back/forward — existing Phase 2 loading.tsx skeletons are sufficient

### Claude's Discretion
- Empty state animation treatment (fade vs instant) on filter change
- GSAP ScrollTrigger refresh strategy (kill + recreate vs refresh)
- Root cause diagnosis approach for back/forward rendering bug
- Exact amber/yellow color value for rate limit warning (should fit site design tokens)
- CSS transition vs GSAP for the subtle filter-change fade-in
- nuqs configuration details (shallow routing, throttle, etc.)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FIX-01 | Filter state stored in URL params (nuqs) so Blog/Solutions/Resources filters persist and are shareable | nuqs `useQueryState` / `useQueryStates` with `clearOnDefault: true` and `history: 'replace'`; NuqsAdapter in root layout |
| FIX-02 | GSAP ScrollTrigger refreshes when filter state changes so filtered components render correctly | Two-mode animation: `useLayoutEffect` with GSAP ctx keyed on filter value triggers scroll reveal on mount; CSS opacity transition for filter-change fade |
| FIX-03 | Browser back/forward navigation renders pages without requiring a manual refresh | Root cause is stale GSAP ScrollTrigger instances after bfcache restoration; fix is `pageshow` listener + `ScrollTrigger.refresh()` in GSAPCleanup |
| FIX-04 | User sees a clear error message when form submission is rate-limited (429) | Check `response.status === 429`, parse `Retry-After` header, disable button with countdown, display warning-styled message in `errors.submit` slot |
</phase_requirements>

---

## Summary

Phase 5 addresses four distinct bugs: filter state not surviving page transitions (FIX-01), GSAP animations firing once and then going blank when filters change (FIX-02), pages rendering blank after browser back/forward navigation (FIX-03), and 429 rate-limit responses being silently treated as successes in all 7 forms (FIX-04).

The filter bugs (FIX-01 and FIX-02) are tightly coupled. The current filter components use `useState`, which resets on every navigation. Migrating all four filter components to `useQueryState` from nuqs solves FIX-01 and also provides the dependency key needed to run two different animation paths: a full GSAP ScrollTrigger stagger on first mount, and a fast CSS opacity fade when the filter value changes. The GSAP `toggleActions: 'play none none none'` pattern currently in `useScrollReveal` means it fires once and is dead — it must not fire again on filter changes, only on actual page load.

The back/forward bug (FIX-03) has two root causes. First, GSAP ScrollTrigger instances from a previous page visit may not be fully killed on navigation because the current `GSAPCleanup` only runs on unmount and may not catch bfcache restoration. Second, when the browser restores a page from bfcache (back-forward cache), React does not re-mount components — the `pageshow` event fires with `event.persisted === true` instead, and GSAP needs to be told to refresh its trigger positions. The fix lives in `GSAPCleanup.tsx`: add a `pageshow` listener that calls `ScrollTrigger.refresh()` when `event.persisted` is true. This is the correct entry point because `GSAPCleanup` is already mounted globally in `layout.tsx`.

The rate-limit fix (FIX-04) is a uniform patch across all 7 form components. The current pattern calls `fetch()` and unconditionally calls `setSuccess(true)` in the try block regardless of response status. The fix checks `response.ok` and specifically handles `response.status === 429` to display an amber-colored warning in the existing `errors.submit` slot with a disabled-button countdown parsed from the `Retry-After` response header.

**Primary recommendation:** Install nuqs, wrap root layout with NuqsAdapter, migrate four filter components from useState to useQueryState, update useScrollReveal to support a filter-change mode, patch GSAPCleanup for bfcache, and uniformly fix all form handleSubmit functions to check 429 responses.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| nuqs | ^2.x | URL search param state manager (like useState but in URL) | Official docs recommend for Next.js App Router; shallow routing built-in; 6kb gzipped; type-safe |
| gsap (existing) | ^3.14.2 | Animation engine with ScrollTrigger | Already in project; no change needed |
| motion/react (existing) | ^12.38.0 | Filter-change fade animation | Already in project; AnimatePresence already used in ResourcesDirectory and EventsPageClient |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS opacity transition | n/a | Filter-change fade (~200ms) | Simpler than GSAP for a single opacity tween; no additional dependency |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| nuqs | next/navigation useSearchParams + router.replace | nuqs is a thin wrapper over exactly this but handles batching, serialization, and shallow routing ergonomics automatically |
| CSS transition for filter fade | GSAP for filter fade | GSAP adds complexity here; CSS `opacity` transition is sufficient and avoids GSAP ScrollTrigger interaction issues |
| motion/react AnimatePresence for filter fade | CSS transition | Both work; CSS is lighter; motion already in project so either is acceptable |

**Installation:**
```bash
npm install nuqs
```

---

## Architecture Patterns

### nuqs Integration Pattern

**NuqsAdapter in root layout (required once):**
```typescript
// src/app/layout.tsx
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" ...>
      <body>
        <GSAPCleanup />
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
```

**Single-dimension filter (SolutionsFilter, ResourceFilter, EventFilter):**
```typescript
// Source: https://nuqs.dev/docs/basic-usage
import { useQueryState, parseAsString } from 'nuqs'

const [activeCategory, setActiveCategory] = useQueryState(
  'category',
  parseAsString.withDefault('All').withOptions({
    history: 'replace',    // replaceState — no history entries
    shallow: true,         // client-only, no server round-trip
    clearOnDefault: true,  // removes param when value is 'All'
  })
)
```

**Two-dimension filter (BlogFilter — category + author):**
```typescript
import { useQueryStates, parseAsString } from 'nuqs'

const [filters, setFilters] = useQueryStates(
  {
    category: parseAsString.withDefault('All'),
    author: parseAsString.withDefault('All'),
  },
  {
    history: 'replace',
    shallow: true,
    clearOnDefault: true,
  }
)
// Access: filters.category, filters.author
// Update: setFilters({ category: 'Design' }) — only touches that key
```

**Key nuqs behaviors:**
- `clearOnDefault: true` (the default) — removes param from URL when value equals the default. Since default is `'All'`, `/blog` is clean, `/blog?category=Design` for non-All.
- `history: 'replace'` — uses `replaceState`, filter changes do not add browser history entries.
- `shallow: true` — no server round-trip on filter change; client-only URL update.
- Back/forward navigation restores the URL, so nuqs re-reads the params and component re-renders with correct filter — FIX-01 resolved for free.

### Two-Mode Animation Pattern (FIX-02)

The current `useScrollReveal` uses `useLayoutEffect` with `toggleActions: 'play none none none'` — fires once and is dead. When filter state changes, the DOM updates but GSAP does not re-trigger because the ScrollTrigger already fired.

**Solution:** Accept an optional `filterKey` dependency in `useScrollReveal`. When `filterKey` changes, revert the GSAP context and recreate it. BUT: the recreation must use a different animation style — fade only, no stagger, instant disappear of outgoing.

The cleanest architecture keeps these as **two separate hooks** or a mode flag:

```typescript
// useScrollReveal remains unchanged — page load scroll-reveal
// New: useFilterReveal — CSS transition fade for filter changes
export function useFilterReveal(filterKey: string) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    // Outgoing items disappear instantly (handled by React re-render)
    // Incoming items fade in via CSS transition
    const el = ref.current
    el.style.opacity = '0'
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 200ms ease-out'
      el.style.opacity = '1'
    })
    return () => cancelAnimationFrame(raf)
  }, [filterKey])

  return ref
}
```

Or equivalently, add a `filterKey` prop to `useScrollReveal` and branch:

```typescript
export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const { filterKey, ...animOptions } = options
  const ref = useRef<HTMLDivElement>(null)

  // Page load: GSAP ScrollTrigger (runs only on mount, not on filterKey change)
  useLayoutEffect(() => {
    // ... existing GSAP ctx logic ...
  }, []) // no filterKey in deps — intentionally runs once

  // Filter change: CSS fade (runs on filterKey changes, skips mount)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    if (!ref.current || !filterKey) return
    const el = ref.current
    el.style.opacity = '0'
    const id = requestAnimationFrame(() => {
      el.style.transition = 'opacity 200ms ease-out'
      el.style.opacity = '1'
    })
    return () => cancelAnimationFrame(id)
  }, [filterKey])

  return ref
}
```

Callers (e.g., `SolutionsFilter`) pass the current filter value as `filterKey`:
```typescript
const gridRef = useScrollReveal({ selector: '.dir-card', stagger: 0.08, y: 20, duration: 0.5, filterKey: active })
```

### Back/Forward Fix Pattern (FIX-03)

**Root cause:** When the browser restores a page from bfcache (pressing Back), React does NOT re-mount components. The `pageshow` event fires with `event.persisted === true`. Existing GSAP ScrollTrigger instances may have stale position calculations, causing elements to remain invisible (opacity: 0, y offset still applied from the initial `fromTo` that played and completed).

The current `GSAPCleanup` only kills triggers on component unmount. That handles forward navigation but not bfcache restoration.

**Fix: augment GSAPCleanup to handle bfcache:**
```typescript
// src/components/ui/GSAPCleanup.tsx
'use client'

import { useEffect } from 'react'
import { ScrollTrigger } from '@/lib/gsap'

export function GSAPCleanup() {
  useEffect(() => {
    // Kill stale triggers when navigating away (forward navigation)
    const handleUnload = () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }

    // On bfcache restore (back/forward): refresh ScrollTrigger positions
    // and ensure animated elements are visible (GSAP may have left them
    // at their final 'to' state but ScrollTrigger bounds are stale)
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        // Page restored from bfcache — refresh trigger positions
        ScrollTrigger.refresh()
      }
    }

    window.addEventListener('pagehide', handleUnload)
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      window.removeEventListener('pagehide', handleUnload)
      window.removeEventListener('pageshow', handlePageShow)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return null
}
```

**Note on `pagehide` vs `beforeunload`:** `pagehide` is bfcache-compatible. Using `beforeunload` or `unload` actually prevents bfcache from working (browser disqualifies the page). Use `pagehide` exclusively.

**Note on "content appears instantly" requirement:** GSAP `fromTo` animations that have already completed leave the element at the `to` state (opacity: 1, y: 0). When bfcache restores the page, the DOM is a frozen snapshot — elements are already at their final visible state. `ScrollTrigger.refresh()` simply recalculates bounds so future scroll interactions work correctly. No additional visibility forcing is needed.

### Rate Limit Fix Pattern (FIX-04)

**Root cause:** All 7 forms call `await fetch(...)` and then unconditionally call `setSuccess(true)` regardless of HTTP status. A 429 response is treated the same as a 200.

**Uniform fix pattern for all form handleSubmit functions:**
```typescript
const handleSubmit = async () => {
  const e = validate()
  if (Object.keys(e).length) { setErrors(e); return }
  setLoading(true)
  try {
    const res = await fetch('/api/applications/membership', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...fields, _trap: trapRef.current, _t: loadTime.current }),
    })

    if (res.status === 429) {
      // Parse Retry-After header; fallback to 30 seconds
      const retryAfter = parseInt(res.headers.get('Retry-After') ?? '30', 10)
      const waitSeconds = isNaN(retryAfter) ? 30 : retryAfter
      setErrors({
        submit: "You've submitted several times recently. Please wait a few minutes before trying again."
      })
      setRateLimitUntil(Date.now() + waitSeconds * 1000)
      return
    }

    if (!res.ok) {
      setErrors({ submit: 'Something went wrong. Please try again.' })
      return
    }

    setSuccess(true)
  } catch {
    setErrors({ submit: 'Something went wrong. Please try again.' })
  } finally {
    setLoading(false)
  }
}
```

**Button disabled state with countdown:**
```typescript
const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null)
const isRateLimited = rateLimitUntil !== null && Date.now() < rateLimitUntil

// Clear rate limit after time expires
useEffect(() => {
  if (!rateLimitUntil) return
  const remaining = rateLimitUntil - Date.now()
  if (remaining <= 0) { setRateLimitUntil(null); return }
  const timer = setTimeout(() => setRateLimitUntil(null), remaining)
  return () => clearTimeout(timer)
}, [rateLimitUntil])

// Button: disabled={loading || isRateLimited}
```

**Warning color — no new token needed:** The site has `--color-eco: #2E7D32` (green) and `--silver: #C0C0C0`. There is no amber/yellow token. Use `#B8860B` (dark goldenrod) or `#C8A000` (muted amber) as an inline hex — both read well against the dark background (`#0E0E0C`). This matches the "warning, not error" tone without requiring a new design token.

**Error display pattern:** The existing `errors.submit` slot in each form currently uses `color: '#c0392b'` (red). For the rate limit message, use a separate `submitWarning` slot or check for the warning text and apply amber color. Simplest: use a separate state field `submitWarning` and render it with amber styling, leaving the existing `errors.submit` red for network errors.

**Warning display:**
```typescript
{errors.submitWarning && (
  <span style={{ fontSize: '11px', color: '#B8860B', lineHeight: '1.5' }}>
    {errors.submitWarning}
  </span>
)}
```

### Anti-Patterns to Avoid

- **Setting nuqs `history: 'push'`** — filter changes would add history entries and break the back button. Always use `history: 'replace'` for filter state.
- **Using `beforeunload` for GSAP cleanup** — this event prevents bfcache and causes blank pages on back navigation. Use `pagehide` instead.
- **Calling `ScrollTrigger.getAll().forEach(t => t.kill())` on filter change** — kills all page animations including non-filter ones. Scope cleanup to filter-related refs only.
- **Re-running the GSAP scroll reveal on filter change** — will trigger a new stagger animation on already-visible elements, creating flash/jitter. The scroll-reveal should fire once on mount only.
- **Setting `shallow: false` on filter params** — triggers a server round-trip for every filter click. The content is already client-side; server revalidation is unnecessary and slow.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| URL param serialization/deserialization | Custom URLSearchParams manipulation | nuqs `parseAsString` | Handles edge cases: null vs empty, default removal, batched updates, browser history API |
| Filter state persistence across navigation | sessionStorage or cookie-based state | nuqs (URL is the source of truth) | URL is shareable, bookmarkable; nuqs handles read/write ergonomically |
| Retry-After countdown timer | Complex interval/polling loop | Simple `setTimeout` to clear the disabled state | Single fire after N seconds; no need for live countdown display |

**Key insight:** nuqs is a thin, purpose-built wrapper over `window.history` + React state. Its value is eliminating the 15+ lines of boilerplate per filter component for parsing, encoding, and batching URL updates. The total migration cost (4 filter components) is low; the benefit (FIX-01 fully solved, back/forward filter restoration free) is high.

---

## Common Pitfalls

### Pitfall 1: NuqsAdapter Missing from Root Layout
**What goes wrong:** `useQueryState` throws at runtime with a provider error.
**Why it happens:** nuqs requires `NuqsAdapter` as a context provider in the component tree.
**How to avoid:** Add `NuqsAdapter` to `src/app/layout.tsx` wrapping `{children}`. This is a one-time setup.
**Warning signs:** Console error "nuqs: missing adapter" or similar provider context error on any filtered page.

### Pitfall 2: Filter Default Value Mismatch
**What goes wrong:** URL shows no param for "All" (correct), but the button highlight shows wrong state on initial load.
**Why it happens:** nuqs returns `null` when the param is absent, not the string `'All'`. If components compare `activeCategory === 'All'` against a null value, the "All" button won't highlight.
**How to avoid:** Always use `.withDefault('All')` — nuqs returns `'All'` when the param is absent, ensuring the comparison works correctly. Never compare `null` directly against filter button values.

### Pitfall 3: GSAP Scroll Reveal Firing on Filter Change
**What goes wrong:** Filtering content causes a jarring stagger animation that replays on every filter click.
**Why it happens:** If `filterKey` is added to the GSAP `useLayoutEffect` dependency array, the full scroll-reveal fires on each filter change.
**How to avoid:** Keep the GSAP scroll-reveal `useLayoutEffect` with an empty dependency array (runs once on mount). Add a completely separate `useEffect` for the filter-change fade that explicitly skips the first render.

### Pitfall 4: `beforeunload` Blocking bfcache
**What goes wrong:** Pages never restore from bfcache, so back navigation always triggers a full reload (slow) and GSAP re-initialization issues surface on every navigation.
**Why it happens:** Any `beforeunload` or `unload` event listener on `window` disqualifies the page from bfcache. The original `GSAPCleanup` had neither, but if a developer adds one, bfcache breaks.
**How to avoid:** Use `pagehide` for cleanup. Never add `unload` or `beforeunload` listeners.

### Pitfall 5: 429 Retry-After Header Not Readable from CORS
**What goes wrong:** `res.headers.get('Retry-After')` returns null even though the server sets it.
**Why it happens:** Same-origin requests on this site (forms post to `/api/applications/*`) are not CORS requests, so all headers are readable. This pitfall does NOT apply here.
**Note:** The fallback to 30 seconds handles the null case regardless.

### Pitfall 6: Rate Limit Error Clears on Next Keystroke
**What goes wrong:** User sees the rate limit warning then starts editing a field, error disappears.
**Why it happens:** Current forms clear `errors` on every state change via re-validation on submit attempt. If `submitWarning` is stored inside the same `errors` object, any `setErrors()` call overwrites it.
**How to avoid:** Keep `submitWarning` as separate state from field-level `errors`, or never include it in the `errors` object passed to `setErrors` — use a dedicated `setRateLimitError` setter.

---

## Code Examples

### nuqs: Two-Dimension Filter (BlogFilter)
```typescript
// Source: https://nuqs.dev/docs/basic-usage
'use client'
import { useQueryStates, parseAsString } from 'nuqs'

const [filters, setFilters] = useQueryStates(
  {
    category: parseAsString.withDefault('All'),
    author: parseAsString.withDefault('All'),
  },
  { history: 'replace', shallow: true }
)

// Derived values
const activeCategory = filters.category   // 'All' when param absent
const activeAuthor = filters.author

// Update only one dimension
setFilters({ category: newCategory })     // author unchanged
setFilters({ author: newAuthor })         // category unchanged
setFilters({ category: 'All' })           // removes ?category from URL
```

### nuqs: Single-Dimension Filter (SolutionsFilter, ResourceFilter, EventFilter)
```typescript
// Source: https://nuqs.dev/docs/options
'use client'
import { useQueryState, parseAsString } from 'nuqs'

const [active, setActive] = useQueryState(
  'category',
  parseAsString.withDefault('All').withOptions({ history: 'replace', shallow: true })
)
// active === 'All' when URL has no ?category param
// setActive('Design') → URL becomes ?category=Design
// setActive('All')    → URL becomes clean (no param)
```

### GSAPCleanup with bfcache support
```typescript
// Source: MDN pageshow event, GSAP ScrollTrigger docs
'use client'
import { useEffect } from 'react'
import { ScrollTrigger } from '@/lib/gsap'

export function GSAPCleanup() {
  useEffect(() => {
    const handlePageHide = () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        ScrollTrigger.refresh()
      }
    }
    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('pageshow', handlePageShow)
    return () => {
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('pageshow', handlePageShow)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])
  return null
}
```

### Rate Limit Response Handling
```typescript
// Pattern for all 7 form handleSubmit functions
const res = await fetch(endpoint, { method: 'POST', ...options })

if (res.status === 429) {
  const retryAfterRaw = res.headers.get('Retry-After')
  const waitSeconds = retryAfterRaw ? parseInt(retryAfterRaw, 10) : 30
  const safeWait = isNaN(waitSeconds) ? 30 : waitSeconds
  setSubmitWarning("You've submitted several times recently. Please wait a few minutes before trying again.")
  setRateLimitUntil(Date.now() + safeWait * 1000)
  setLoading(false)
  return
}

if (!res.ok) {
  setErrors({ submit: 'Something went wrong. Please try again.' })
  setLoading(false)
  return
}

setSuccess(true)
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `useState` for filter values | `useQueryState` / `useQueryStates` from nuqs | This phase | Filter state survives navigation, shareable URLs |
| `unload` event for GSAP cleanup | `pagehide` event | bfcache adoption ~2022+ | `pagehide` is bfcache-compatible; `unload` disqualifies page from bfcache |
| Unconditional `setSuccess(true)` after any response | Check `res.ok` and `res.status` before `setSuccess` | This phase | 429 (and other errors) properly shown to user |

**Deprecated/outdated patterns in this codebase:**
- `useState` in filter components: replaced by `useQueryState` from nuqs
- `beforeunload` / `unload` in cleanup: should be `pagehide`; current `GSAPCleanup` correctly uses neither (no `beforeunload`), but needs `pagehide` + `pageshow` added

---

## Open Questions

1. **SolutionsFilter URL param key name**
   - What we know: the existing filter uses values like `'all'` (lowercase) while Blog/Resources/Events use `'All'` (capitalized)
   - What's unclear: should the URL use `?category=all` or `?category=All` — minor but matters for `clearOnDefault` behavior
   - Recommendation: standardize on `'All'` (capitalized) across all four filters for consistency; update SolutionsFilter default from `'all'` to `'All'`

2. **EventFilter — location-based filter vs category filter**
   - What we know: `EventFilter` filters by location (`'All'`, `'Miami'`, `'Tel Aviv'`, `'Online'`), not category
   - What's unclear: the URL param name — use `?location=Miami` (semantic) or `?category=Miami` (uniform) across all filters
   - Recommendation: use `?location=...` for EventFilter to be semantically accurate; all other three use `?category=...`

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest ^4.1.2 (unit) + Playwright ^1.58.2 (E2E) |
| Config file | `vitest.config.ts` (unit), `playwright.config.ts` (E2E) |
| Quick run command | `npm test` (Vitest unit suite) |
| Full suite command | `npx playwright test` (requires running dev server) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FIX-01 | Filter param appears in URL on selection; absent when 'All' | E2E (Playwright) | `npx playwright test tests/filters.spec.ts` | ❌ Wave 0 |
| FIX-01 | Back/forward restores filter selection from URL | E2E (Playwright) | `npx playwright test tests/filters.spec.ts` | ❌ Wave 0 |
| FIX-02 | Grid fades in on filter change without running stagger animation | E2E (Playwright / visual) | manual-only — animation timing not easily automated | manual-only |
| FIX-03 | Page content visible after browser back navigation | E2E (Playwright) | `npx playwright test tests/navigation.spec.ts` | ❌ Wave 0 |
| FIX-04 | 429 response shows warning message; button disabled | E2E (Playwright) | `npx playwright test tests/forms.spec.ts` | ❌ needs new test case |

### Sampling Rate
- **Per task commit:** `npm test` (unit suite — fast, no server needed)
- **Per wave merge:** `npx playwright test tests/filters.spec.ts tests/navigation.spec.ts tests/forms.spec.ts`
- **Phase gate:** Full Playwright suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/filters.spec.ts` — covers FIX-01: URL param sync, "All" produces clean URL, back/forward restores filter
- [ ] `tests/navigation.spec.ts` — covers FIX-03: page content visible after simulated back navigation
- [ ] New test case in `tests/forms.spec.ts` — covers FIX-04: mock 429 response, assert warning message displayed and button disabled

*(FIX-02 animation correctness is manual-only: verifying a 200ms CSS fade vs stagger replay requires visual inspection, not assertion)*

---

## Sources

### Primary (HIGH confidence)
- https://nuqs.dev/docs/basic-usage — useQueryState hook API, default values, null behavior
- https://nuqs.dev/docs/options — history (push/replace), shallow, clearOnDefault options
- https://nuqs.dev/docs/adapters — NuqsAdapter for Next.js App Router layout.tsx setup
- https://github.com/47ng/nuqs — library README, current version confirmation

### Secondary (MEDIUM confidence)
- https://gsap.com/community/forums/topic/40128-using-scrolltriggers-in-nextjs-with-usegsap/ — scoping ScrollTrigger to components, cleanup patterns
- https://medium.com/@thomasaugot/optimizing-gsap-animations-in-next-js-15-best-practices-for-initialization-and-cleanup-2ebaba7d0232 — ScrollTrigger.refresh() after initialization, 100ms timing buffer pattern
- https://github.com/vercel/next.js/issues/44477 — bfcache behavior differences in Next.js (MEDIUM — issue thread, not official docs)
- MDN PageTransitionEvent / pageshow event — `event.persisted` for bfcache detection (standard web platform API, HIGH confidence)

### Tertiary (LOW confidence)
- https://gsap.com/community/forums/topic/34287-scrolltriggerrefresh-not-working-upon-changing-route-in-nextjs/ — route transition fixed height causing ScrollTrigger miscalculation (community forum, unverified for this project's specific setup)

---

## Metadata

**Confidence breakdown:**
- Standard stack (nuqs): HIGH — verified via official docs at nuqs.dev
- nuqs API (useQueryState, options): HIGH — official docs
- Architecture (filter migration): HIGH — direct code inspection of all 4 filter components + nuqs API
- Back/forward fix (pageshow + persisted): HIGH — standard web platform API (MDN); confirmed pattern in Next.js community
- GSAP cleanup (pagehide vs beforeunload): HIGH — bfcache spec; GSAP community confirmation
- Rate limit fix: HIGH — direct code inspection of all form components; pattern is straightforward status-code checking
- Animation two-mode pattern: MEDIUM — no official source; design decision from CONTEXT.md + CSS transition approach is conventional

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (nuqs v2 is stable; Next.js 16 App Router bfcache behavior is established)
