# Track 3: Globe + Performance Fixes

**Branch:** `fix/globe-performance`
**Priority:** High | **Effort:** S-M (2-3hr)
**Sprint:** 04-05-2026 (04-06 → 04-07)

---

## Goal

Make the globe visible on tablet and mobile, fix point sizing, add proper TypeScript types, and optimize CircuitBackground for high-DPI screens.

## Notion Tracker Items

| Task | Page ID | Priority |
|------|---------|----------|
| Track 3: Globe + Performance Fixes | 33a5efbd-09e3-8162-aada-cd44a79e5502 | High |

**On start:** set status to "In Development"
**On PR:** set status to "In Review" + add PR URL
**On merge:** set status to "Done"

## Files to Create/Modify

- `src/components/GlobeClient.tsx`
- `src/components/GlobeNetwork.tsx`
- `src/components/GlobeShell.tsx`
- `src/components/ui/CircuitBackground.tsx`
- `src/types/index.ts` or `src/types/globe.ts` (new if needed)

## Acceptance Criteria

- [ ] Globe renders and is interactive on tablet (768px-1024px) and mobile (<768px)
- [ ] Globe point size is 0.1, altitude is 0.010
- [ ] No `any` types remain in Globe components — all data (arcs, points, labels) has proper TypeScript interfaces
- [ ] CircuitBackground scales correctly on high-DPI (2x, 3x) displays without performance degradation
- [ ] CircuitBackground reduces particle count on mobile (< 768px)
- [ ] No console errors or warnings from Globe or CircuitBackground
- [ ] `npm run typecheck` passes with no new type errors

## Technical Context

- **Globe:** Uses `react-globe.gl` (2.37.0) + `three` (0.183.2). The globe is rendered in `GlobeClient.tsx` (client component with `"use client"`), data in `GlobeNetwork.tsx`, wrapper in `GlobeShell.tsx`.
- **CircuitBackground:** `src/components/ui/CircuitBackground.tsx` — canvas-based particle animation. Known concern: scaling on high-DPI.
- **GSAPCleanup:** If any GSAP animations exist in these components, wrap with GSAPCleanup.

## Implementation Details

1. **Globe visibility on tablet/mobile:**
   - Check if the globe is hidden via CSS (`hidden`, `display: none`, or responsive class like `lg:block`)
   - If hidden, make it visible at all breakpoints. If performance is the concern, consider a static fallback image at mobile sizes or a smaller globe
   - Ensure the container is responsive — the globe should scale to fit its container width
   - Test touch interactions (rotate, zoom) work on mobile

2. **Globe point config:**
   - Find where point size and altitude are configured (likely props on the Globe component or in GlobeNetwork data)
   - Set `pointRadius: 0.1` and `pointAltitude: 0.010` (or equivalent prop names)

3. **Globe type safety:**
   - Define interfaces for: `GlobePoint` (lat, lng, size, color, label), `GlobeArc` (startLat, startLng, endLat, endLng, color), `GlobeLabel`
   - Replace all `any` types in GlobeClient, GlobeNetwork, GlobeShell with these interfaces
   - Add types to the callback functions (onClick, onHover, etc.)

4. **CircuitBackground optimization:**
   - Add `window.devicePixelRatio` awareness — scale canvas resolution but limit to 2x max
   - Detect mobile via `window.innerWidth < 768` and reduce particle count (e.g., 50% of desktop count)
   - Use `requestAnimationFrame` efficiently — ensure animation loop is cleaned up on unmount
   - Consider `will-change: transform` CSS optimization
