# Codebase Concerns

**Analysis Date:** 2026-03-28

## Tech Debt

**Loose Type Safety in Notion Integration:**
- Issue: Multiple files use `@typescript-eslint/no-explicit-any` to bypass type checking when working with Notion API responses
- Files: `src/lib/members.ts`, `src/lib/events.ts`, `src/lib/blog.ts`, `src/lib/resources.ts`, `src/lib/solutions.ts`, `src/lib/chapters.ts`, `src/components/GlobeNetwork.tsx`
- Impact: Potential runtime errors when Notion API response shape changes; IDE cannot provide autocomplete or catch missing properties
- Fix approach: Create proper TypeScript types for each Notion API response based on the database schema; use proper type guards instead of `any`

**Rate Limiting Stored in Memory:**
- Issue: Rate limiting in `src/lib/validation.ts` uses an in-memory Map that is lost on server restart
- Files: `src/lib/validation.ts` (lines 6-29)
- Impact: Rate limits reset when server restarts; malicious actors can exploit this; doesn't work with multiple server instances
- Fix approach: Move rate limiting to persistent storage (Redis) or use a service like Cloudflare for edge-level rate limiting

**Excessive Use of `setTimeout` for Initialization:**
- Issue: Globe component uses retry loop with `setTimeout` to wait for initialization (lines 102-108 in `src/components/GlobeNetwork.tsx`)
- Files: `src/components/GlobeNetwork.tsx` (lines 102-108)
- Impact: Polling loop up to 5 seconds wastes resources; adds unpredictable delays; no error boundary if init fails
- Fix approach: Use React lifecycle hooks (onGlobeReady callback) or Promise-based initialization pattern

**Inconsistent Error Handling in API Routes:**
- Issue: All API routes use generic error messages and console.error logging without structured error context
- Files: `src/app/api/applications/membership/route.ts`, `src/app/api/applications/chapter/route.ts`, `src/app/api/applications/ventures/route.ts`, `src/app/api/applications/solutions/route.ts`, `src/app/api/submit-post/route.ts`, `src/app/api/submit-resource/route.ts`, `src/app/api/suggest-event/route.ts`
- Impact: Difficult to debug production issues; errors sent to Sentry lack context; clients receive no helpful error details
- Fix approach: Create structured error handler that logs request context and returns meaningful error codes/messages

## Security Considerations

**Potential XSS Vulnerability in GlobeNetwork Component:**
- Risk: HTML injected via `innerHTML` in line 247 of `src/components/GlobeNetwork.tsx`
- Files: `src/components/GlobeNetwork.tsx` (lines 245-264)
- Current mitigation: City name data comes from internal Notion database; not user-supplied
- Recommendations: Replace `innerHTML` with DOM API (`createElement`, `textContent`); add Content Security Policy header; validate/sanitize all dynamic content before rendering

**Missing CSRF Protection on Form Submissions:**
- Risk: POST endpoints don't validate origin or use CSRF tokens
- Files: `src/app/api/applications/*/route.ts`, `src/app/api/submit-*/route.ts`
- Current mitigation: Honeypot field and 3-second timing check in `src/lib/validation.ts` (lines 55-67)
- Recommendations: Implement SameSite cookie policy; add explicit CSRF token validation; use Referer header checks

**Email Address Validation Already Implemented:**
- Risk: Email field validation exists both client and server-side
- Files: `src/lib/schemas.ts` (lines 5, 35, 47, 67) - email fields use `.email()` validation
- Current mitigation: Server-side Zod validation catches invalid emails; schema enforces max 254 characters
- Recommendations: Email validation is adequate; ensure client validation matches server regex

**Unvalidated Location Mapping Logic:**
- Risk: Location data from forms is mapped to predefined locations without validation
- Files: `src/app/api/applications/membership/route.ts` (lines 18-27)
- Impact: Malicious input could cause unexpected location mappings; silent fallback to "International"
- Recommendations: Validate location input against an enum list; return error if location doesn't match expected values

## Performance Bottlenecks

**Heavy Globe Rendering with Complex Arcs Calculation:**
- Problem: GlobeNetwork component generates all possible inter-chapter arcs (O(n²) complexity) on every render
- Files: `src/components/GlobeNetwork.tsx` (lines 150-165)
- Cause: `arcsData` useMemo recalculates all arcs when `cities` changes; no limit on arc count
- Improvement path: Add a maximum arc limit; use spatial partitioning to only show nearby connections; memoize arc calculation more efficiently

**Notion Query Without Pagination:**
- Problem: All Notion queries retrieve all results without pagination
- Files: `src/lib/members.ts` (line 49), `src/lib/events.ts` (lines 28, 48), `src/lib/blog.ts`, `src/lib/resources.ts`, `src/lib/solutions.ts`
- Cause: Notion API is queried directly without handling pagination; if a database has 1000+ items, response becomes slow
- Improvement path: Implement pagination with database_id and start_cursor; add filtering to reduce result set

**Expensive Path Generation in CircuitBackground:**
- Problem: Circuit background generates up to 60 paths with ~10 segments each, recalculated on resize
- Files: `src/components/ui/CircuitBackground.tsx` (lines 40-110)
- Cause: No caching of generated paths; random generation makes it non-deterministic between renders
- Improvement path: Cache generated paths; use fixed random seed for consistency; debounce resize handler

**Fetch GeoJSON on Every Globe Mount:**
- Problem: Country polygons are fetched from `/data/ne_110m_admin_0_countries.geojson` on every component mount
- Files: `src/components/GlobeNetwork.tsx` (lines 74-79)
- Cause: No caching; file is large when uncompressed
- Improvement path: Use Next.js static data fetching with caching; import as static asset instead of fetch

## Fragile Areas

**GlobeNetwork Three.js Integration:**
- Files: `src/components/GlobeNetwork.tsx`
- Why fragile:
  - Relies on external library `react-globe.gl` with unstable API
  - Uses dynamic import with type assertions (`as any` on lines 8, 15)
  - Imperative DOM manipulation (line 169, querySelector)
  - Complex event listener setup that may leak if component unmounts during initialization
  - Polling-based initialization with 50 retry attempts
- Safe modification:
  - Add cleanup for all event listeners in useEffect return
  - Test unmount scenarios thoroughly
  - Create type-safe wrapper types instead of using `any`
  - Replace polling with onGlobeReady callback
- Test coverage: No unit tests for GlobeNetwork component; only covered by e2e tests in `tests/forms.spec.ts` and `tests/content-pages.spec.ts`

**Complex Form Submission Flow:**
- Files: Application form routes in `src/app/api/applications/*/route.ts`, `src/app/api/submit-post/route.ts`, `src/app/api/submit-resource/route.ts`
- Why fragile:
  - Notion write failures are caught but emails are fire-and-forget with `void` and `Promise.allSettled`
  - If email send fails after Notion succeeds, user doesn't know submission failed
  - Long exception chains with multiple external dependencies (Notion, Resend, Sentry)
  - Email sending is non-critical but user expects confirmation
- Safe modification:
  - Store submission state in database before sending emails
  - Implement retry mechanism for failed emails
  - Add transaction-like behavior or explicit user notification
  - Consider making email send blocking (not fire-and-forget) for critical flows
- Test coverage: Forms tested with e2e tests (`tests/forms.spec.ts`) but no unit tests for API route logic; mocking is used in tests but real error scenarios not covered

**Event Type Casting Without Validation:**
- Files: `src/lib/events.ts`, `src/lib/members.ts`, `src/lib/blog.ts`, `src/lib/resources.ts`, `src/lib/solutions.ts`, `src/lib/chapters.ts` - all use `mapEvent()` pattern
- Why fragile:
  - Casts raw Notion response to typed object without validating required fields exist
  - Falls back to defaults (`?? null`, `?? 'Untitled'`) silently
  - Changes to Notion schema could produce silently wrong data
  - Type `any` suppresses all error checking during mapping
- Safe modification:
  - Add Zod schema validation to mapEvent functions
  - Log warnings when fallbacks are used
  - Add data quality monitoring/metrics
  - Create strict types for Notion responses with proper validation
- Test coverage: Unit tests exist (`src/lib/__tests__/`) but don't validate mapping error scenarios

## Scaling Limits

**In-Memory Rate Limiting Map:**
- Current capacity: Rate limiting map grows without bound
- Limit: Server memory will eventually be consumed if rate limiter is not cleared; Map stores one entry per unique IP for 10-minute window
- Scaling path: Use Redis-backed rate limiting or implement periodic cleanup with TTL; use Cloudflare rate limiting for edge-level protection

**Static Geolocation Data Hardcoded:**
- Current capacity: CITY_COORDS in `src/lib/members.ts` supports ~12 cities (Miami, New York, Dallas, Tel Aviv, Singapore, Dubai, London, Los Angeles, San Francisco, Chicago, Austin, Boston)
- Limit: Adding new chapters requires code changes and redeployment
- Scaling path: Move city coordinates to Notion database; fetch dynamically with caching via `unstable_cache`

**Fire-and-Forget Email Sending:**
- Current capacity: Emails are sent asynchronously without queue management; uses `Promise.allSettled` to allow partial failures
- Limit: If Resend API is slow or rate-limited, multiple requests could queue up in memory; no retry mechanism
- Scaling path: Use job queue (BullMQ, AWS SQS) for email delivery; add retry logic and dead-letter queue; monitor email delivery metrics

## Dependencies at Risk

**react-globe.gl (v2.37.0):**
- Risk: Library depends on Three.js and has complex WebGL rendering; minimal type safety; CityData types are inferred not validated
- Impact: Major version bumps could break visualization; bugs in library affect core feature
- Migration plan: Have a fallback map visualization (MapBox, Leaflet); abstract globe logic behind interface; add fallback UI for WebGL failures

**@notionhq/client (v2.2.15):**
- Risk: Notion API changes could break queries; client library must be updated; no breaking change detection
- Impact: New Notion features won't be accessible until client is updated; breaking changes require code refactor
- Migration plan: Wrap Notion calls in adapter layer; use API versioning; monitor Notion changelog; test API integration regularly

**React 19 (^19.2.4):**
- Risk: Major version with React Compiler enabled; unstable API; caret dependency allows major version jumps
- Impact: Compiler errors could affect build; unintended behavior changes; babel-plugin-react-compiler used
- Migration plan: Pin to specific version once stable; test thoroughly before updates; monitor React release notes

## Missing Critical Features

**No Admin Dashboard for Managing Submissions:**
- Problem: Applications received via forms go directly to Notion; no built-in admin UI for review/approval
- Blocks: Admins must manually check Notion to review and approve applications; no workflow automation
- Impact: Slow turnaround time; no visibility into submission pipeline; can't track approval status or send custom responses

**No Email Queue or Retry Mechanism:**
- Problem: Emails are sent with `Promise.allSettled` but failed sends only log to Sentry via captureException
- Blocks: Failed email deliveries may go unnoticed; no automatic retry of failed sends
- Impact: Users may not receive confirmations; admins may not get alerts of new applications; no visibility into email delivery status

**No Protection Against Coordinated Spam:**
- Problem: Rate limiting in `src/lib/validation.ts` uses in-memory storage and resets on server restart
- Blocks: Coordinated spam attacks across multiple server instances can bypass limits; no persistence between deploys
- Impact: Form endpoints vulnerable to spam/DoS attacks; no built-in spam detection or filtering

**Silent Data Quality Issues:**
- Problem: Form data is validated by Zod but mapping logic (e.g., location mapping) silently falls back to defaults
- Blocks: Invalid or unexpected data produces incorrect results without error or notification
- Impact: Data quality issues go undetected; admin doesn't know about malformed submissions

## Test Coverage Gaps

**No Unit Tests for API Routes:**
- What's not tested: Notion write failures, email send failures, edge cases in form submission, retry behavior
- Files: `src/app/api/applications/*/route.ts`, `src/app/api/submit-*/route.ts`
- Risk: Bugs in error handling and data transformation go undetected; regressions happen during refactors
- Priority: High - these are critical user-facing features that can silently fail

**No Tests for Validation Edge Cases:**
- What's not tested: Boundary conditions in Zod schemas (max string lengths of 5000, 2000, etc.), honeypot timing edge cases, rate limit boundaries
- Files: `src/lib/validation.ts`, `src/lib/schemas.ts`
- Risk: Validation can be bypassed by sending payloads at schema boundaries; off-by-one errors in timing checks
- Priority: Medium - covered by integration tests but edge cases may slip through

**GlobeNetwork Has No Component Tests:**
- What's not tested: Component lifecycle, event listener cleanup, resize handling, state management, unmount during loading
- Files: `src/components/GlobeNetwork.tsx`
- Risk: Memory leaks from event listeners; undefined behavior during rapid mount/unmount; polling timeout edge cases
- Priority: Medium - e2e tests cover happy path but edge cases like unmount during loading aren't tested

**No Load Testing for Notion Queries:**
- What's not tested: Performance with large result sets (>1000 items), behavior when Notion API is slow or rate-limited
- Files: `src/lib/members.ts`, `src/lib/events.ts`, `src/lib/blog.ts`, `src/lib/resources.ts`, `src/lib/solutions.ts`
- Risk: Site performance degrades if Notion databases grow large; no pagination handling means full fetch every time
- Priority: Low - not critical until databases scale significantly but should be addressed before growth

---

*Concerns audit: 2026-03-28*
