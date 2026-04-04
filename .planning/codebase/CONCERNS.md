# Codebase Concerns

**Analysis Date:** 2026-04-04

## Tech Debt

**Notion Database Properties Missing or Misaligned:**
- Issue: Multiple application routes contain bypass logic for missing Notion database properties. The "Country" and "Phone" fields referenced in code don't exist in the actual Notion databases yet. The "Referral" property is also collected but never stored.
- Files: 
  - `src/app/api/applications/membership/route.ts` (lines 62-63)
  - `src/app/api/applications/solutions/route.ts` (lines 32-33)
  - `src/app/api/applications/ventures/route.ts` (lines 34-35)
  - `src/app/api/applications/chapter/route.ts`
- Impact: Data loss for phone numbers and referral information across all application types. Country field is collected but silently dropped. Notion writes fail silently without alerting admins.
- Fix approach: (1) Create missing "Country" and "Phone" properties in Notion databases with correct field types, (2) Verify "Referral" property exists in Members DB, (3) Remove try-catch bypass logic and surface errors properly, (4) Add Sentry alerts for Notion failures instead of silent console.error

**Notion Write Failures Silent in Production:**
- Issue: All Notion write operations wrap calls in try-catch that logs to console but continues. If Notion fails, the user receives confirmation and email but their data never reaches the database.
- Files:
  - `src/app/api/applications/membership/route.ts` (lines 37-64)
  - `src/app/api/applications/solutions/route.ts` (lines 13-34)
  - `src/app/api/applications/ventures/route.ts` (lines 14-35)
  - `src/app/api/applications/chapter/route.ts` (lines 14-29)
- Impact: Application data could be lost without admin knowledge. Users think they've applied but no record exists in Notion.
- Fix approach: Either fail the API response when Notion fails (current: don't since emails still send), or implement a queue/retry system. Current behavior of silently failing while confirming success to user is dangerous.

**Location Mapping Hard-coded in Code:**
- Issue: The `mapLocation()` function in membership route uses string matching on city names to categorize locations. This is fragile and doesn't scale.
- Files: `src/app/api/applications/membership/route.ts` (lines 19-28)
- Impact: New cities aren't automatically categorized. Logic is duplicated across code. Changes require code redeploy.
- Fix approach: Move location mapping to a database or configuration file. Use country/state codes (which are now captured) instead of string matching on city names.

**Rate Limiting in Memory (Not Production-Safe):**
- Issue: Rate limiting uses a Map stored in module state (`rateStore` in `src/lib/validation.ts`). In production, each server instance maintains separate state. Horizontal scaling defeats rate limiting.
- Files: `src/lib/validation.ts` (lines 7, 16-29)
- Impact: Coordinated bot attacks across server instances succeed. Single server can process 5 requests per 10-minute window per IP, but with N servers, attackers multiply throughput by N. No persistence across deployments.
- Fix approach: Use Redis or similar distributed cache for rate limiting. Accept that memory-based approach works only for single-instance deployments.

**Email Failures Not Tracked Properly:**
- Issue: `sendEmails()` uses `Promise.allSettled()` which silently swallows individual email failures. Errors are captured to Sentry but function always resolves successfully.
- Files: `src/lib/email.ts` (lines 71)
- Impact: API returns 200 to user even if confirmation email failed to send. Admin might not receive alert. No retry mechanism.
- Fix approach: Consider whether missing confirmation/admin emails should fail the API response. If not, implement explicit retry with exponential backoff for failed email sends.

## Known Bugs

**Honeypot/Timing Detection Silently Accepts Spam:**
- Symptoms: If a bot fills the honeypot field `_trap` or submits too quickly, the API returns 200 with `{ ok: true }` but doesn't actually call the handler.
- Files: `src/lib/validation.ts` (lines 55-67)
- Trigger: Send POST with `_trap` field filled, or with `_t` timestamp showing < 3000ms elapsed.
- Workaround: Spam still goes to email but not to Notion. Check email for spam.
- Note: This is actually intentional design to confuse bots. However, the asymmetry (200 success response + email sent) could be confusing if honeypot is accidentally triggered by legitimate users.

**Form State Test Isolation Issue:**
- Symptoms: Rate limiter tests document that `rateStore` is module-level and persists across test suites, requiring careful IP management to avoid test state bleed.
- Files: `src/lib/__tests__/validation.test.ts` (lines 104-155, especially comments on 146-148)
- Trigger: Running test suites in order exposes shared state.
- Workaround: Use unique IP addresses per test. Reset not implemented.
- Fix approach: Either reset `rateStore` between tests (requires test-only export), or accept that test isolation requires IP uniqueness.

## Security Considerations

**Email Addresses Exposed in Admin Alerts:**
- Risk: All admin alert emails include full submission data including email addresses. If ADMIN_EMAIL account is compromised or forwarded insecurely, user emails are exposed.
- Files: `src/lib/email.ts` (lines 56-69), and all application routes that call `sendEmails()`
- Current mitigation: ADMIN_EMAIL is environment-controlled. Resend email service is used (not self-hosted).
- Recommendations: (1) Consider sending admin alerts to a secure, monitored email, (2) Implement PII redaction in admin emails if data needs to be forwarded, (3) Add audit logging for who accessed admin emails.

**Phone Numbers in Plain Text Across Systems:**
- Risk: Phone numbers are validated, normalized to E.164, then stored in plain text in Notion and sent in emails. No encryption.
- Files: `src/lib/schemas.ts` (phoneSchema), all application routes, `src/lib/email.ts`
- Current mitigation: Notion database access is restricted to SAGIE team. Phone field is now part of schema but doesn't exist in database yet.
- Recommendations: (1) When creating Notion "Phone" property, ensure database is private, (2) Consider encrypting sensitive data before storing, (3) Implement access logging in Notion.

**HTML Sanitization in Email Context Only:**
- Risk: Data sanitization (HTML entity escaping) happens only before email send and Notion write. If data is accessed via API or exported later without re-sanitizing, XSS is possible.
- Files: `src/lib/sanitize.ts`, called in all application routes
- Current mitigation: Sanitization covers the main output paths (email, Notion).
- Recommendations: (1) Document that sanitization is output-specific, not input-specific, (2) If API exports data later, re-sanitize based on output format, (3) Consider using a library like DOMPurify for more robust HTML handling.

**IP Address Extraction From X-Forwarded-For:**
- Risk: `getIP()` trusts the first IP in `x-forwarded-for` header without validation. Attackers can spoof this header if not behind a trusted proxy.
- Files: `src/lib/validation.ts` (lines 11-14)
- Current mitigation: Rate limiting is weak anyway (in-memory). Spoofed IP just changes the limiting bucket.
- Recommendations: (1) Validate that request truly comes through trusted proxy (check deployment environment), (2) Consider using `x-real-ip` as fallback, (3) Add logging when rate limit is triggered to detect abuse patterns.

**No CSRF Protection on Form Endpoints:**
- Risk: POST endpoints accept requests from any origin without CSRF token validation.
- Files: All routes in `src/app/api/applications/` and `src/app/api/` (contact, subscribe, etc.)
- Current mitigation: None detected. Requests can be made cross-origin.
- Recommendations: (1) Implement CSRF token validation (check for Origin/Referer header match or token in request body), (2) Set SameSite cookie attribute on session cookies if used, (3) Consider using a CSRF middleware.

## Performance Bottlenecks

**Globe Component (GlobeNetwork) Downloads GeoJSON on Every Render:**
- Problem: Fetches `/data/ne_110m_admin_0_countries.geojson` in useEffect without caching.
- Files: `src/components/GlobeNetwork.tsx` (lines 82-86)
- Cause: No caching headers, no memoization. Fresh request on mount.
- Improvement path: (1) Serve GeoJSON with long cache headers, (2) Use useMemo to avoid re-fetching if component re-mounts, (3) Consider bundling GeoJSON as part of build if file is small.

**Large Component Files (200-450 lines):**
- Problem: `EventsPageClient.tsx` (454 lines), `GlobeNetwork.tsx` (439 lines), `FormField.tsx` (374 lines) are difficult to test and reason about.
- Files: `src/app/(marketing)/events/EventsPageClient.tsx`, `src/components/GlobeNetwork.tsx`, `src/components/ui/FormField.tsx`
- Cause: Multiple concerns (rendering, state management, event handling) in single file.
- Improvement path: (1) Extract helper components and hooks, (2) Separate data fetching from presentation, (3) Use composition to reduce cognitive load.

**Three.js / React Globe Bundle Size Not Optimized:**
- Problem: React Globe uses Three.js and includes large polygon geometry data. No code splitting or lazy loading mentioned.
- Files: `src/components/GlobeNetwork.tsx` (line 9, uses dynamic import)
- Cause: `dynamic()` import mitigates some issue but doesn't code-split related data.
- Improvement path: (1) Measure actual bundle impact, (2) Consider intersection observer to load globe only when visible, (3) Compress GeoJSON further if possible.

**No Caching Strategy for Notion Content:**
- Problem: Blog, resources, solutions, and events are fetched from Notion on every request. No ISR, no SWR, no client-side caching visible.
- Files: Library functions in `src/lib/blog.ts`, `src/lib/resources.ts`, `src/lib/solutions.ts`, `src/lib/events.ts`
- Cause: Vercel deployment likely handles ISR via Next.js config, but strategy is not explicit.
- Improvement path: (1) Document revalidation strategy in comments, (2) Add TTL headers to Notion API calls if possible, (3) Monitor Notion API quota usage.

## Fragile Areas

**Form Schema Validation Network:**
- Files: `src/lib/schemas.ts` (239 lines)
- Why fragile: Complex Zod schemas with custom refine rules. Location cascade validation is interdependent. Changes to one field (e.g., phone format) require test updates across all form schemas.
- Safe modification: (1) Test all forms after any phone/email/location schema change, (2) Use snapshot testing for schema error messages, (3) Document cross-schema dependencies.
- Test coverage: Schemas have tests in `src/lib/__tests__/schemas.test.ts` (615 lines) which is thorough.

**Location Cascade Dependency:**
- Files: `src/lib/schemas.ts` (locationSuperRefine function, lines 121-137), `src/lib/locationData.ts`
- Why fragile: The country-state-city cascade depends on two sources: `country-state-city` library and curated `locationData.ts`. Mismatch causes validation failures.
- Safe modification: (1) Keep `locationData.ts` and library data in sync, (2) Test that country codes in locationData match library, (3) Document which countries use state field.
- Test coverage: Location validation tested in `src/lib/__tests__/schemas.test.ts`.

**Notion Database Property Mapping:**
- Files: All application routes in `src/app/api/applications/`
- Why fragile: Hard-coded Notion property names and types. Adding a field requires changes in schema, route, and Notion database. Missing properties cause silent failures.
- Safe modification: (1) Create checklist of schema field → Notion property mapping, (2) Implement migration/setup script to create/verify Notion properties, (3) Add validation that required Notion properties exist before writing.
- Test coverage: No tests for actual Notion writes (they're mocked or bypassed).

## Scaling Limits

**In-Memory Rate Limiting:**
- Current capacity: 5 requests per IP per 10 minutes per server instance.
- Limit: With N server instances, capacity multiplies by N. No coordination between instances.
- Scaling path: Replace with Redis or similar distributed cache. Current approach breaks under load balancing.

**Notion API Rate Limits:**
- Current capacity: Notion free tier allows ~3 requests/second, paid allows more but not unlimited.
- Limit: No explicit rate limiting in code. If traffic spikes, Notion requests might get throttled or rejected.
- Scaling path: Implement queue/retry with exponential backoff for Notion writes. Consider batch writes for bulk operations.

**Email Service Capacity:**
- Current capacity: Resend service limits depend on plan. Default Resend plan allows reasonable throughput.
- Limit: No throttling in code. If all 5 applications + admin alerts + confirmation emails spike, may hit limits.
- Scaling path: Implement email queue. Monitor Resend quota. Add fallback provider.

## Dependencies at Risk

**country-state-city Library (^3.2.1):**
- Risk: Library is maintained but not extremely popular. City/state data can become outdated.
- Impact: If library stops being maintained, curated lists in `locationData.ts` become the only source of truth.
- Migration plan: Data is simple enough to migrate to own JSON file if library abandoned.

**React Globe (^2.37.0):**
- Risk: Library wraps Three.js and depends on browser WebGL support. Not universally available (some older browsers, enterprise firewalls).
- Impact: Globe visualization fails silently in unsupported environments. Fallback UI exists but may not be discoverable.
- Migration plan: Keep fallback UI robust. Monitor library updates for bug fixes. Consider lighter alternative if possible.

**Notion SDK (@notionhq/client ^2.2.15):**
- Risk: Notion maintains this SDK but API is still evolving. Breaking changes possible in major versions.
- Impact: Forms could fail silently if API changes. Current bypass logic masks these failures.
- Migration plan: Monitor Notion SDK releases. Lock minor version until tested. Implement proper error handling before Notion breaks.

## Missing Critical Features

**No Audit Log for Admin Data Access:**
- Problem: Who accessed what application data in Notion is not logged. Compliance/GDPR implications.
- Blocks: Proper data governance, compliance audits.

**No Retries for Failed Email/Notion Operations:**
- Problem: Single failures are permanent. No automatic retry, no manual retry mechanism.
- Blocks: Reliability of data ingestion.

**No Bulk Export or Backup of Application Data:**
- Problem: No visible mechanism to export applications from Notion. Vendor lock-in risk.
- Blocks: Data portability, disaster recovery.

**No Spam Analysis or Machine Moderation:**
- Problem: Honeypot and timing checks are basic. Sophisticated spam can still get through.
- Blocks: Scaling to larger user base will require better spam filtering.

## Test Coverage Gaps

**API Route Integration Tests:**
- What's not tested: Actual Notion writes are bypassed in tests. Email sends are not tested. Cross-field validation is not tested end-to-end.
- Files: `src/app/api/applications/*/route.ts` (all 4 routes)
- Risk: A regression in Notion property names or email format would not be caught until production.
- Priority: High

**Form Component Submission:**
- What's not tested: User form submission flow end-to-end. Rate limiting on client-side handling. Network error scenarios.
- Files: `src/components/forms/*Form.tsx` (7 different forms)
- Risk: Form errors could break user experience without test coverage.
- Priority: Medium (E2E tests in `/tests/forms.spec.ts` may cover this)

**Location Cascade on Different Countries:**
- What's not tested: Actual cascade behavior for all countries with state field. City data consistency.
- Files: `src/lib/locationData.ts` and location validation in schemas
- Risk: Users in some countries see broken cascades but others don't.
- Priority: Medium

**GlobeNetwork Component Rendering:**
- What's not tested: Rendering logic, interactivity, responsive behavior. Dynamic import fallback.
- Files: `src/components/GlobeNetwork.tsx`
- Risk: Subtle bugs in globe rendering (e.g., animation hiccups, unresponsive controls) would not be caught.
- Priority: Low (mostly visual)

---

*Concerns audit: 2026-04-04*
