# Track 4: Scroll Position Fix

**Branch:** `fix/scroll-position`
**Priority:** High | **Effort:** S (1-2hr)
**Sprint:** 04-05-2026 (04-06 → 04-07)

---

## Goal

Fix the page load scroll reveal behavior — currently scrolls back to the top on initial load instead of preserving the user's scroll position.

## Notion Tracker Items

| Task | Page ID | Priority |
|------|---------|----------|
| Track 4: Scroll Position Fix | 33a5efbd-09e3-813e-ad64-e8cf4b216d58 | High |

**On start:** set status to "In Development"
**On PR:** set status to "In Review" + add PR URL
**On merge:** set status to "Done"

## Files to Create/Modify

- `src/components/ui/ScrollReveal.tsx`
- `src/hooks/useScrollReveal.ts`
- `src/components/ui/TransitionLink.tsx`
- `src/components/ui/PageHeroAnimation.tsx`

## Acceptance Criteria

- [ ] When navigating between pages, the new page loads at the expected position (top for new navigations, preserved for back/forward)
- [ ] Browser back/forward button preserves scroll position
- [ ] Scroll reveal animations still fire correctly when scrolling down
- [ ] Page transitions (View Transition API from PR #29) still work smoothly
- [ ] No flash of content at wrong scroll position on page load

## Technical Context

- **ScrollReveal:** `src/components/ui/ScrollReveal.tsx` — wraps sections with IntersectionObserver-based reveal.
- **useScrollReveal:** `src/hooks/useScrollReveal.ts` — custom hook for scroll-triggered animations.
- **TransitionLink:** `src/components/ui/TransitionLink.tsx` — handles page transitions using View Transition API (PR #29).
- **PageHeroAnimation:** `src/components/ui/PageHeroAnimation.tsx` — hero entrance animation.
- **The bug:** On initial page load (or page transition), the scroll position resets to top. This likely happens because:
  1. ScrollReveal sets elements to `opacity: 0` initially, and
  2. The page height changes as elements become visible, causing scroll position to shift, OR
  3. The TransitionLink or PageHeroAnimation explicitly scrolls to top

## Implementation Details

1. **Diagnose the cause:**
   - Check if `window.scrollTo(0, 0)` or `scrollTop = 0` is called anywhere in TransitionLink, PageHeroAnimation, or layout components
   - Check if Next.js `scrollRestoration` is being overridden
   - Check if the View Transition API callbacks reset scroll

2. **Fix scroll restoration:**
   - If Next.js scroll restoration is disabled, re-enable it or implement manual restoration
   - If a component is explicitly scrolling to top, add a condition: only scroll to top on forward navigation, not on back/forward or same-page reload
   - Consider using `history.scrollRestoration = 'manual'` with a custom implementation that saves/restores position

3. **Ensure animations still work:**
   - ScrollReveal should still trigger on scroll — the fix should preserve position without breaking IntersectionObserver triggers
   - Test: navigate to a page, scroll down, navigate away, press back — should return to previous scroll position with all content visible
