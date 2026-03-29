# Phase 5: Bug Fixes - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix filter state persistence, back/forward navigation rendering, GSAP animation re-trigger on filter change, and rate limit feedback across all forms. Delivers FIX-01, FIX-02, FIX-03, FIX-04.

</domain>

<decisions>
## Implementation Decisions

### Filter URL behavior
- Use nuqs for URL param sync on all 4 filterable pages (Blog, Solutions, Resources, Events)
- Single selection per filter dimension (one category, one author at a time)
- Independent filter dimensions — changing category does not reset author (Blog has both)
- Remove param from URL when set to "All" (clean URLs: /blog not /blog?category=All)
- Use replaceState — filter changes do not add browser history entries
- "All" button is the only reset mechanism — no separate "Clear filters" UI
- Filter state animates in as part of page load animation sequence (not instant highlight)

### Animation on filter change
- Initial page load: full GSAP ScrollTrigger stagger animation (preserve existing behavior)
- Filter content change: subtle fade-in only (~200ms) — no stagger, no slide
- Outgoing filtered items disappear instantly (no exit animation)
- Two distinct animation paths: first-visit scroll reveal vs filter-change fade

### Rate limit message style
- Warning style with amber/yellow tone — visually distinct from red validation errors
- Friendly text: "You've submitted several times recently. Please wait a few minutes before trying again." (from Phase 2 decision)
- Submit button temporarily disabled after 429 response
- Disable duration parsed from Retry-After header; fallback to 30 seconds if header missing
- Uses existing `errors.submit` display pattern but with warning color treatment
- Applies to all 7 form components

### Back/forward navigation
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

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useScrollReveal` (src/hooks/useScrollReveal.ts): Current GSAP hook — needs modification to handle filter-change re-trigger
- `BlogFilter`, `SolutionsFilter`, `ResourceFilter`, `EventFilter` (src/components/ui/): All 4 filter components follow same useState pattern — all need nuqs migration
- `errors.submit` pattern in all 7 form components: Existing error display slot for rate limit messages
- `GSAPCleanup` (src/components/ui/GSAPCleanup.tsx): GSAP context manager — relevant for navigation cleanup
- `Skeleton` (src/components/ui/Skeleton.tsx): Existing loading component from Phase 2

### Established Patterns
- Filter components use `useState` + `useScrollReveal` — nuqs replaces useState, animation logic adapts
- Form components: `handleSubmit` → `fetch()` → `setSuccess(true)` without checking response status — 429s treated as success
- GSAP animations: `toggleActions: 'play none none none'` — fires once, never re-triggers
- All forms follow identical submit pattern — fix can be applied uniformly

### Integration Points
- 4 filter components: useState → nuqs useQueryState migration
- 7 form components: handleSubmit needs response status checking (especially 429)
- useScrollReveal hook: needs to support both scroll-reveal and filter-change animation modes
- Root layout or GSAPCleanup: may need navigation event handling for back/forward fix

</code_context>

<specifics>
## Specific Ideas

- Filter change animation should feel snappy — disappear old items instantly, fade in new ones quickly
- Rate limit should feel like a gentle nudge ("slow down") not an error ("you broke it") — amber/yellow reinforces this
- Back/forward should feel instant — returning to a page you've already seen shouldn't re-animate anything
- Phase 2 rate limit text confirmed: "You've submitted several times recently. Please wait a few minutes before trying again."

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-bug-fixes*
*Context gathered: 2026-03-28*
