---
phase: 03-features-globe
plan: "03"
subsystem: api
tags: [next.js, cache-revalidation, sitemap, admin-ui, vitest]

# Dependency graph
requires:
  - phase: 03-features-globe
    provides: blog.ts getAllPosts, notion cache tags (notion:blog, notion:events, notion:resources, notion:solutions, notion:members, notion:chapters), env.REVALIDATE_SECRET

provides:
  - POST /api/revalidate endpoint — secret-gated cache tag flusher
  - /admin/revalidate UI — password-gated admin tool for on-demand revalidation
  - /admin/revalidate/layout.tsx — noindex metadata layout
  - Full async sitemap.ts — 10 static routes + dynamic /blog/[slug] entries
  - Unit tests for revalidation auth/tag logic and sitemap route generation

affects: [04-testing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "revalidateTag(tag, 'max') two-arg form for Next.js 16 cache busting"
    - "Secret-gated admin endpoints — env var optional, endpoint auto-disabled when unset"
    - "Async sitemap with getAllPosts() for dynamic route expansion"

key-files:
  created:
    - src/app/api/revalidate/route.ts
    - src/lib/__tests__/revalidate.test.ts
    - src/app/admin/revalidate/layout.tsx
    - src/app/admin/revalidate/page.tsx
    - src/lib/__tests__/sitemap.test.ts
  modified:
    - src/app/sitemap.ts

key-decisions:
  - "revalidateTag(tag, 'max') two-arg form used — single-arg form is deprecated in Next.js 16"
  - "Endpoint disabled (returns 401) when REVALIDATE_SECRET is undefined — safe default, no partial auth"
  - "Only blog has /[slug] routes — events/resources/solutions listed as single pages only in sitemap"

patterns-established:
  - "Secret-gated API: check !env.REVALIDATE_SECRET || body.secret !== env.REVALIDATE_SECRET before processing"
  - "Admin pages: 'use client', user types secret at runtime — never read from env client-side"

requirements-completed: [FEAT-01, FEAT-04]

# Metrics
duration: 3min
completed: 2026-03-28
---

# Phase 03 Plan 03: Revalidation API, Admin UI, and Full Sitemap Summary

**Secret-gated POST /api/revalidate with revalidateTag(tag, 'max') for 6 notion cache tags, password-gated admin UI, and async sitemap covering 10 static routes plus dynamic blog slugs**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-28T15:11:29Z
- **Completed:** 2026-03-28T15:14:10Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- POST /api/revalidate endpoint with secret auth, per-tag or bulk cache flushing using revalidateTag(tag, 'max')
- Admin UI at /admin/revalidate — client component with password input, per-content-type buttons, and "Refresh All"
- Admin layout with noindex robots metadata to keep admin pages out of search results
- Async sitemap.ts with 10 static routes (with priorities/changeFrequency) + dynamic /blog/[slug] from getAllPosts()
- 11 unit tests total: 6 for revalidation endpoint, 5 for sitemap

## Task Commits

Each task was committed atomically:

1. **Task 1: Revalidation API endpoint, admin page, and tests** - `1bae770` (feat)
2. **Task 2: Expand sitemap with all static and dynamic routes** - `a95eeae` (feat)

**Plan metadata:** TBD (docs: complete plan)

_Note: TDD tasks had RED then GREEN commits within the task._

## Files Created/Modified
- `src/app/api/revalidate/route.ts` - POST handler with secret auth, revalidateTag(tag, 'max') per tag, ALL_TAGS fallback
- `src/lib/__tests__/revalidate.test.ts` - 6 tests covering auth, per-tag, all-tags, malformed JSON
- `src/app/admin/revalidate/layout.tsx` - Server layout with noindex metadata
- `src/app/admin/revalidate/page.tsx` - Client component with password prompt and per-type revalidation buttons
- `src/app/sitemap.ts` - Rewritten async, 10 static routes + dynamic blog slugs from getAllPosts()
- `src/lib/__tests__/sitemap.test.ts` - 5 tests for static routes, dynamic slugs, publishDate, admin exclusion

## Decisions Made
- Used `revalidateTag(tag, 'max')` two-arg form — single-arg deprecated in Next.js 16
- Endpoint returns 401 when `REVALIDATE_SECRET` is undefined — safe default keeps endpoint disabled until configured
- Only `/blog/[slug]` added as dynamic routes — events/resources/solutions have no individual slug pages

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required. `REVALIDATE_SECRET` is already defined as optional in `src/env/server.ts`.

## Self-Check: PASSED

All 6 files exist on disk and both task commits (1bae770, a95eeae) verified in git history.

## Next Phase Readiness
- POST /api/revalidate is ready for editor use once `REVALIDATE_SECRET` env var is set in production
- Sitemap at /sitemap.xml will automatically include new blog posts as they're published
- Admin page at /admin/revalidate is fully functional

---
*Phase: 03-features-globe*
*Completed: 2026-03-28*
