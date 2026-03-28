---
status: diagnosed
trigger: "Diagnose why filter selection on /blog causes content to go blank/disappear"
created: 2026-03-28T00:00:00Z
updated: 2026-03-28T00:01:00Z
---

## Current Focus

hypothesis: CONFIRMED - CSS opacity:0 on card classes + GSAP useLayoutEffect not re-running on filter change = new cards permanently invisible
test: Found CSS rule in globals.css:144 that sets opacity:0 on .post-card, .dir-card, .res-card
expecting: n/a - root cause confirmed
next_action: Report diagnosis

## Symptoms

expected: When changing filter (e.g. category), filtered content re-renders and is visible
actual: Content goes blank/disappears when filter is changed
errors: None (visual bug only)
reproduction: Go to /blog, click any filter category other than All
started: Pre-existing bug that Phase 5 nuqs migration did not fix

## Eliminated

(none yet)

## Evidence

- timestamp: 2026-03-28T00:01
  checked: useScrollReveal.ts - useLayoutEffect (lines 20-58)
  found: GSAP fromTo sets opacity:0 on `target` (which is the CHILD elements when selector is used, e.g. '.post-card'). toggleActions 'play none none none' means animation plays once and never replays.
  implication: After initial scroll-triggered animation plays, if React re-renders new DOM elements (new filtered cards), those new elements get opacity:0 from GSAP fromTo initial state but ScrollTrigger won't fire again.

- timestamp: 2026-03-28T00:02
  checked: useScrollReveal.ts - useLayoutEffect dependency array (line 58)
  found: Dependencies are [y, duration, delay, stagger, selector]. filterKey is NOT in the dependency array.
  implication: When filterKey changes (filter selection changes), the useLayoutEffect does NOT re-run. GSAP context is NOT recreated. New DOM elements from React re-render are not picked up by GSAP at all.

- timestamp: 2026-03-28T00:03
  checked: useScrollReveal.ts - useEffect for filterKey (lines 60-82)
  found: The filterKey useEffect sets opacity on `el` (ref.current = the CONTAINER div). It does el.style.opacity = '0' then transitions to '1'.
  implication: This fades the CONTAINER in/out, but the CHILDREN (.post-card elements) have their own inline opacity:0 set by GSAP fromTo. Even when container is opacity:1, children are opacity:0.

- timestamp: 2026-03-28T00:04
  checked: BlogFilter.tsx line 24 and line 121
  found: gridRef is applied to the wrapper div. selector '.post-card' targets Link elements inside. filterKey = filters.category + '|' + filters.author
  implication: Confirms the pattern - GSAP targets children, CSS fade targets container.

- timestamp: 2026-03-28T00:05
  checked: GSAP ctx.revert() behavior
  found: ctx.revert() is in the useLayoutEffect cleanup, but since filterKey is not in deps, cleanup doesn't run on filter change. Old GSAP context persists with stale element references. New elements rendered by React have no GSAP animation applied.
  implication: New post-card elements after filter change are raw DOM - they don't have GSAP fromTo applied, so they should have their natural CSS opacity. BUT the initial GSAP fromTo may have set opacity on elements that still exist in DOM.

- timestamp: 2026-03-28T00:06
  checked: Re-examined the exact flow more carefully
  found: Key insight - gsap.context() with ref scope + gsap.utils.toArray(selector, currentRef) finds children AT MOUNT TIME. When filter changes and React re-renders, the useLayoutEffect does NOT re-run (filterKey not in deps). The old GSAP ScrollTrigger instance is still alive. New .post-card elements were never targeted by any GSAP animation. However, GSAP fromTo with ScrollTrigger may set initial styles on matched elements at creation time.
  implication: Need to determine whether NEW cards (post-filter) actually have opacity:0 or if something else causes blank.

- timestamp: 2026-03-28T00:07
  checked: gsap.fromTo behavior with ScrollTrigger
  found: gsap.fromTo(target, {opacity:0, y}, {opacity:1, y:0, scrollTrigger:{...}}) - GSAP immediately applies the FROM values (opacity:0) to all matched elements. ScrollTrigger then controls WHEN the TO animation plays. With 'play none none none', it plays once when entering viewport.
  implication: The FROM values (opacity:0) are set as inline styles on the original elements at creation. When React re-renders with new filtered content and the useLayoutEffect doesn't re-run, the new elements DON'T get opacity:0 from GSAP. So why are they blank?

- timestamp: 2026-03-28T00:08
  checked: Re-read the useLayoutEffect more carefully - gsap.context(() => {...}, ref)
  found: gsap.context with a scope (ref) means all GSAP selectors within are scoped to that ref. ctx.revert() cleans up all animations in that context. But ctx is only created once (on mount, since deps don't include filterKey).
  implication: Wait - the cleanup DOES run when the component unmounts. But on re-render (same component, new filter value), the useLayoutEffect deps [y, duration, delay, stagger, selector] don't change, so it doesn't re-run.

## Resolution

root_cause: globals.css line 144 sets `opacity: 0` on `.post-card`, `.dir-card`, `.res-card` (and other scroll-reveal classes) as a CSS baseline. GSAP's `fromTo` animation overrides this with inline `opacity: 1` after ScrollTrigger fires. When a filter changes, React renders NEW card DOM elements that have the CSS `opacity: 0` but GSAP never touches them because `filterKey` is not in the useLayoutEffect dependency array (line 58 of useScrollReveal.ts). The filterKey useEffect (lines 60-82) only fades the CONTAINER div, not the individual child elements. Result: new cards are permanently invisible.

**The two interacting causes:**

1. `src/app/globals.css:144` -- CSS rule sets `opacity: 0` on card classes as scroll-reveal initial state
2. `src/hooks/useScrollReveal.ts:58` -- useLayoutEffect deps `[y, duration, delay, stagger, selector]` do NOT include `filterKey`, so GSAP animations are never re-created for new DOM elements after filter change

**The failed workaround:**

3. `src/hooks/useScrollReveal.ts:60-82` -- filterKey useEffect sets opacity on `ref.current` (the container div), but children have their own CSS `opacity: 0` that is unaffected by container opacity transitions

**Exact sequence on filter change:**

1. User clicks filter -> nuqs updates state -> React re-renders
2. Some old `.post-card` DOM nodes are unmounted, new ones are created
3. New DOM nodes get CSS `opacity: 0` from globals.css
4. useLayoutEffect does NOT re-run (filterKey not in deps) -> no GSAP animation on new elements
5. filterKey useEffect fires, fades container div 0->1 over 200ms
6. Children still have CSS `opacity: 0` -> content is invisible
7. Cards that React REUSED (same key) retain inline `opacity: 1` from completed GSAP animation -> those stay visible
8. Net result: partial or total blank depending on how many cards are new vs reused

fix: (diagnosis only - not applying)
verification: (diagnosis only)
files_changed: []
