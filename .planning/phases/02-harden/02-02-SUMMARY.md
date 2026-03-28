---
phase: 02-harden
plan: 02
subsystem: ui/error-handling
tags: [error-boundaries, skeleton, not-found, ui-components]
requirements: [FEAT-05]

dependency_graph:
  requires: []
  provides:
    - Skeleton shimmer primitive (foundation for loading.tsx in plan 03)
    - ErrorPage shared layout component
    - 8 route-segment error boundaries
    - Redesigned 404 page
  affects:
    - src/app/(marketing)/** (all marketing routes now have error boundaries)
    - src/app/not-found.tsx

tech_stack:
  added: []
  patterns:
    - Error boundary per route segment using Next.js error.tsx convention
    - Shared ErrorPage layout component to avoid duplication
    - Inline SVG illustrations per error type
    - GridBackground reused in error/404 pages for visual consistency
    - CSS keyframe shimmer animation on .skeleton class using design tokens

key_files:
  created:
    - src/components/ui/Skeleton.tsx
    - src/components/ui/ErrorPage.tsx
    - src/app/(marketing)/error.tsx
    - src/app/(marketing)/blog/error.tsx
    - src/app/(marketing)/blog/[slug]/error.tsx
    - src/app/(marketing)/events/error.tsx
    - src/app/(marketing)/resources/error.tsx
    - src/app/(marketing)/solutions/error.tsx
    - src/app/(marketing)/apply/error.tsx
    - src/app/(marketing)/suggest-event/error.tsx
  modified:
    - src/app/globals.css (added skeleton-sweep keyframes and .skeleton class)
    - src/app/not-found.tsx (full redesign to match error page visual language)

decisions:
  - Used GridBackground (not CircuitBackground) in error pages — simpler, no client-side canvas needed, works in server context without additional hydration
  - ErrorPage shared component accepts optional onRetry prop — not-found.tsx stays as server component without importing client ErrorPage, uses standalone layout instead
  - contact@sagie.co sourced from src/constants/copy.ts as the canonical team email
  - Inline SVG illustrations kept minimal and geometric to match brand aesthetic

metrics:
  duration: 3 minutes
  completed_date: "2026-03-28"
  tasks_completed: 2
  files_changed: 12
---

# Phase 02 Plan 02: Error Boundaries and Skeleton Primitive Summary

Skeleton shimmer primitive, 8 context-aware Next.js error boundaries across all marketing route segments, shared ErrorPage layout component, and redesigned 404 page — all using GridBackground and design tokens for visual consistency.

## What Was Built

### Task 1: Skeleton Component and Shimmer CSS

- Created `src/components/ui/Skeleton.tsx` — a simple div wrapper that applies the `.skeleton` CSS class
- Added `skeleton-sweep` keyframes and `.skeleton` class to `globals.css`
- Uses `--bg-card` and `--border-default` design tokens for a brand-consistent shimmer
- 2s ease-in-out sweep cycle, 200% gradient background-size shift
- Foundation for loading.tsx skeleton screens in plan 03

### Task 2: Error Boundaries and 404 Redesign

- Created `src/components/ui/ErrorPage.tsx` — shared client component accepting `title`, `message`, `illustration`, and optional `onRetry` props
- All error pages use `GridBackground` for the dark grid texture background
- Three actions on every error page: Try again (retry), Go home (/), Contact us (mailto:contact@sagie.co)
- Context-aware messaging per segment (blog stories vs. events vs. application forms)
- Each error.tsx has a unique inline SVG illustration (geometric/abstract, ~80x80px)
- not-found.tsx redesigned as a server component (no `'use client'`) matching the error page visual language — large 404 heading, friendly copy, home + contact actions, same GridBackground

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

**Clarification on not-found.tsx approach:** The plan noted not-found.tsx should remain a server component and not import the client ErrorPage. Followed exactly: not-found.tsx is standalone with the same visual pattern but no client-side reset function, keeping it a server component.

## Verification

- `npx tsc --noEmit` — zero errors
- `npm run build` — successful, all routes built (static + SSG + dynamic)
- All 8 error.tsx files exist with `'use client'` directive
- Each error.tsx logs to console via `useEffect` on error prop change
- not-found.tsx redesigned with matching visual language (GridBackground, font-display, font-body, same action pattern)
- Skeleton.tsx exports `Skeleton` component
- globals.css contains `skeleton-sweep` animation and `.skeleton` class

## Self-Check: PASSED

All files created and commits verified:

- `src/components/ui/Skeleton.tsx` — FOUND
- `src/components/ui/ErrorPage.tsx` — FOUND
- `src/app/(marketing)/error.tsx` — FOUND
- `src/app/not-found.tsx` — FOUND
- Commit `70f95b1` (Task 1) — FOUND
- Commit `2b2f9f9` (Task 2) — FOUND
