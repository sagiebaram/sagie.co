# Codebase Concerns

## Technical Debt

### TODO/FIXME Markers
- `src/app/api/applications/membership/route.ts` — TODO markers around missing Notion database properties
- `src/app/api/applications/chapter/route.ts` — Similar TODO for missing properties
- `src/app/api/suggest-event/route.ts` — Error bypass in Notion write operations
- Various API routes use try-catch that swallow errors to avoid blocking form submissions

### Untyped Notion Responses
- Notion API responses are largely untyped — property extraction in `src/lib/notion-utils.ts` uses runtime checks rather than type-safe accessors
- No generated types from Notion database schemas
- Property name mismatches between code and Notion DB only caught at runtime

### Dynamic GSAP Imports
- `src/lib/gsap.ts` uses dynamic imports for GSAP plugins without full type safety
- Multiple components duplicate GSAP initialization patterns
- ScrollTrigger cleanup logic spread across components and hooks

## Security Concerns

### Rate Limiting
- In-memory rate limiter in API routes — resets on deploy/restart
- No persistent rate limiting (Redis, etc.) — vulnerable to abuse across serverless instances
- Rate limit state not shared between Vercel serverless function instances

### Content Injection
- `dangerouslySetInnerHTML` usage in blog content rendering (`src/components/mdx/BlogContent.tsx`)
- Notion content rendered as markdown → HTML pipeline needs sanitization review
- `src/lib/sanitize.ts` exists but coverage of all injection vectors should be verified

### Environment Variables
- `.env.local` contains production secrets (Notion API key, Resend key, etc.)
- `src/env/server.ts` validates env vars with Zod + `server-only` guard — good pattern
- Revalidation endpoint (`src/app/api/revalidate/route.ts`) protected by secret token

## Performance Concerns

### Heavy Client Components
- `src/app/(marketing)/events/EventsPageClient.tsx` — Large client component (~499 lines) handling filtering, sorting, calendar generation
- `src/components/GlobeNetwork.tsx` — Three.js globe with continuous animations, heavy bundle impact
- Globe loaded even on pages where it may not be visible above fold

### Bundle Size
- Three.js (`three`), GSAP, Motion (framer-motion) all included — significant JS payload
- `react-globe.gl` pulls in D3 dependencies
- `country-state-city` package includes full world location data
- No evidence of route-based code splitting beyond Next.js defaults

### Notion API Queries
- No pagination on Notion queries — will fail silently if databases exceed 100 items
- `unstable_cache` used for caching but cache invalidation relies on manual revalidation
- Multiple sequential Notion queries on some pages (blog listing fetches all posts)

## Fragile Areas

### Form Submission Pipeline
- API routes write to Notion then send emails — no transaction guarantees
- If Notion write succeeds but email fails, no retry mechanism
- If Notion write fails, some routes catch and continue (data loss risk)
- No admin notification for failed submissions beyond Sentry

### Notion as Backend
- Single point of failure — all content and form data in Notion
- No fallback or cached content if Notion API is down
- Database property changes in Notion UI can silently break the app
- No schema migration or version tracking for Notion databases

### Animation System
- GSAP ScrollTrigger instances need careful cleanup to avoid memory leaks
- `src/components/ui/GSAPCleanup.tsx` exists as a safety net but relies on component unmount
- Parallax effects (`src/components/ui/GridParallaxWrapper.tsx`) tied to scroll position — performance-sensitive on mobile

## Test Coverage Gaps

### Well-Covered
- `src/lib/` — 11 unit test files covering blog, email, events, members, resources, sanitize, schemas, sitemap, solutions, validation, revalidation

### Not Covered
- API route handlers (`src/app/api/*/route.ts`) — no integration tests
- Email sending (`src/lib/email.ts`) — likely mocked in tests but no E2E email verification
- Globe component — no tests for Three.js rendering
- Animation hooks (`src/hooks/`) — no tests for GSAP interactions
- Form components — no component-level tests
- Admin pages — no tests

### E2E Testing
- Playwright configured but test coverage scope unclear
- `tests/` directory exists but content not fully assessed

## Missing Features / Infrastructure

### Error Recovery
- No retry logic for failed Notion API calls
- No queue for failed email sends
- No audit trail for form submissions beyond Notion entries

### Observability
- Sentry configured for error tracking
- Vercel Analytics for page views
- No structured logging
- No performance monitoring beyond Vercel Speed Insights
- `src/lib/notion-monitor.ts` exists but purpose/coverage unclear

### Content Management
- No preview/draft mode for Notion content
- No content validation before publish
- Blog images served from Notion's CDN (S3 pre-signed URLs that expire)
- No image optimization pipeline for Notion-hosted images
