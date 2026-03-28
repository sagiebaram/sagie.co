# Codebase Concerns

**Analysis Date:** 2026-03-28

## Tech Debt

**Duplicate type definitions for SolutionProvider:**
- Issue: `SolutionProvider` interface is declared in both `src/constants/solutions.ts` and `src/lib/solutions.ts` with different shapes. The constants version includes `contactEmail` and uses `SolutionCategory` type alias; the lib version includes `servicesOffered`, `bio`, `featured` fields that match Notion data. Pages import from `@/lib/solutions` but the constants version still exists alongside.
- Files: `src/constants/solutions.ts`, `src/lib/solutions.ts`
- Impact: Type confusion, risk of using the wrong type in new code. MOCK_PROVIDERS in constants will never match the shape of live Notion data.
- Fix approach: Delete the interface from `src/constants/solutions.ts`, keep only the lib version.

**Duplicate BlogPost interface:**
- Issue: `BlogPost` is defined identically in `src/constants/blog.ts` and `src/lib/blog.ts` (with minor differences — constants version requires `content` and `publishDate`, lib version makes `publishDate` optional and omits `content`).
- Files: `src/constants/blog.ts`, `src/lib/blog.ts`
- Impact: Both interfaces are in use; adding a new field requires changing two places.
- Fix approach: Remove the interface from `src/constants/blog.ts`, import from `@/lib/blog` everywhere.

**Orphaned MOCK data constants:**
- Issue: `MOCK_POSTS`, `MOCK_EVENTS`, `MOCK_RESOURCES`, `MOCK_PROVIDERS` exist in `src/constants/` but none are imported by any page or component — all pages now fetch from Notion. The mock data in `src/constants/blog.ts` contains placeholder content ("Full post content here.") that was never fleshed out.
- Files: `src/constants/blog.ts`, `src/constants/events.ts`, `src/constants/resources.ts`, `src/constants/solutions.ts`
- Impact: Dead code increases maintenance surface. Future developers may accidentally use mock data instead of Notion data. Six of seven MOCK_POSTS have stub content.
- Fix approach: Delete `MOCK_POSTS`, `MOCK_EVENTS`, `MOCK_RESOURCES`, `MOCK_PROVIDERS` arrays. Keep only interface definitions and category/filter constants needed by UI components.

**`NOTION_DEAL_PIPELINE_DB_ID` required but unused:**
- Issue: `src/env/server.ts` requires `NOTION_DEAL_PIPELINE_DB_ID` via Zod validation, but no lib file or API route references it. The app crashes at startup in any environment where this env var is not set.
- Files: `src/env/server.ts`
- Impact: Unnecessary deployment friction; this env var must be provisioned even though nothing uses it yet.
- Fix approach: Either make it optional (`z.string().optional()`) or implement the functionality that needs it.

**`REVALIDATE_SECRET` required but no revalidation endpoint exists:**
- Issue: `src/env/server.ts` requires `REVALIDATE_SECRET` but there is no `/api/revalidate` route that uses it. The secret is validated at startup but serves no current purpose.
- Files: `src/env/server.ts`
- Impact: Same startup crash risk as above. The cache tags (`notion:blog`, `notion:events`, etc.) defined on `unstable_cache` calls can never be invalidated on-demand.
- Fix approach: Create a `/api/revalidate` route that accepts the secret and calls `revalidateTag`, or make the env var optional until the endpoint is built.

**`@typeform/embed-react` is an unused dependency:**
- Issue: `package.json` lists `@typeform/embed-react: ^5.0.0` as a production dependency. The file that used it (`src/components/ui/TypeformEmbed.tsx`) was deleted per git status. No remaining source file imports it.
- Files: `package.json`
- Impact: Adds ~85 KB to the bundle unnecessarily (Typeform's embed SDK is not tree-shakeable).
- Fix approach: `npm uninstall @typeform/embed-react`

**`dotenv` is an unused production dependency:**
- Issue: `package.json` lists `dotenv: ^17.3.1` as a production dependency. Next.js handles `.env` file loading natively. No source file imports `dotenv`.
- Files: `package.json`
- Impact: Minor bundle weight.
- Fix approach: `npm uninstall dotenv`

**Hardcoded location mapping in membership route:**
- Issue: `src/app/api/applications/membership/route.ts` contains a `mapLocation()` function with hardcoded city-name string matching. Any city not in the list falls through to `'International'`. This is fragile and non-exhaustive (e.g. "SF" doesn't match "san francisco").
- Files: `src/app/api/applications/membership/route.ts`
- Impact: Incorrect location classification silently stored in Notion without error.
- Fix approach: Accept a location string from a bounded select input on the form, or remove server-side mapping and store raw user input.

**`unsafe-inline` in CSP script-src:**
- Issue: `next.config.ts` sets `script-src 'self' 'unsafe-inline'`. This negates the XSS protection that CSP script-src is meant to provide.
- Files: `next.config.ts`
- Impact: Content Security Policy provides no practical script injection protection.
- Fix approach: Generate nonces per-request via Next.js middleware and use `'nonce-{value}'` instead of `'unsafe-inline'`. Next.js 14+ supports this natively.

**Globe fetches external GeoJSON at runtime with no fallback:**
- Issue: `src/components/GlobeNetwork.tsx` fetches GeoJSON from `raw.githubusercontent.com` on every mount. If the fetch fails, the globe renders without country borders but continues running — the error is only logged.
- Files: `src/components/GlobeNetwork.tsx` (line 92–98)
- Impact: Globe visual quality degrades silently in network-restricted environments or if GitHub's CDN is unavailable. No retry logic.
- Fix approach: Download the GeoJSON file and serve it from `/public/`, eliminating the external dependency.

**Globe city and arc data is hardcoded mock data:**
- Issue: `MOCK_CITIES` and `MOCK_ARCS` in `src/components/GlobeNetwork.tsx` are static with fictional member counts. The member counts (82, 45, 24, 38) are not sourced from Notion.
- Files: `src/components/GlobeNetwork.tsx`
- Impact: Globe will show stale data as the community grows. No connection to real membership data.
- Fix approach: Accept cities/arcs as props sourced from a Notion query, or accept member counts as props from the parent.

**`initGlobe` uses a recursive `setTimeout` polling pattern:**
- Issue: `src/components/GlobeNetwork.tsx` `initGlobe()` function calls itself with `setTimeout(initGlobe, 100)` until `globeRef.current` is populated. There is no maximum retry count or cleanup on unmount.
- Files: `src/components/GlobeNetwork.tsx` (line 114–144)
- Impact: If the globe never mounts (SSR edge case, component unmounted quickly), this creates an infinite loop of setTimeout callbacks that never resolve.
- Fix approach: Use a ref cleanup flag (`let cancelled = false`) and check it before each retry, returning early if the component has unmounted.

## Security Considerations

**No rate limiting on any API route:**
- Risk: All 7 API routes (`/api/applications/*`, `/api/submit-post`, `/api/submit-resource`, `/api/suggest-event`) accept unlimited requests. The honeypot + timing check in `withValidation` provides anti-bot friction but is bypassable by any developer-level attacker.
- Files: `src/lib/validation.ts`, all files in `src/app/api/`
- Current mitigation: Honeypot field, 3-second minimum elapsed time check.
- Recommendations: Add IP-based rate limiting using Vercel's `@vercel/kv` or an edge middleware with a token bucket. Target: 5 submissions per IP per 10 minutes for application routes.

**`allowedOrigins` is parsed but never enforced:**
- Risk: `src/env/server.ts` exports an `allowedOrigins` Set populated from the `ALLOWED_ORIGINS` env var, but no API route or middleware actually checks the incoming `Origin` header against this set.
- Files: `src/env/server.ts`, all files in `src/app/api/`
- Current mitigation: None. Any origin can POST to any form route.
- Recommendations: Add an origin check in `withValidation` or in a middleware that wraps all `/api` routes.

**`NEXT_PUBLIC_SENTRY_DSN` is public:**
- Risk: The Sentry DSN is exposed client-side via the `NEXT_PUBLIC_` prefix. This is standard Sentry practice and necessary for client-side error capture, but means anyone can submit arbitrary events to the Sentry project.
- Files: `sentry.client.config.ts`
- Current mitigation: Sentry's own rate limiting. This is acceptable unless the Sentry project has no inbound rate limits configured.
- Recommendations: Set an inbound data filter in Sentry's project settings to block events from non-sagie.co origins.

**`tracesSampleRate: 1.0` across all Sentry configs:**
- Risk: 100% trace sampling captures every server request in production, which can expose sensitive request data (form payloads, IP addresses) in Sentry traces.
- Files: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
- Current mitigation: None.
- Recommendations: Lower `tracesSampleRate` to `0.1` or `0.2` in production. Keep `replaysOnErrorSampleRate: 1.0` which is appropriate.

**Blog post submission stores content directly in Notion without sanitization:**
- Risk: `src/app/api/submit-post/route.ts` writes raw user-submitted post content to Notion. The content is later rendered via `react-markdown` which is safe, but any downstream process that renders Notion pages directly (e.g. Notion's own web rendering) will show unsanitized content.
- Files: `src/app/api/submit-post/route.ts`
- Current mitigation: Zod max-length constraints (5000 chars). Status is set to `Review` so content requires manual approval before publishing.
- Recommendations: Acceptable for now given the manual review step. No immediate action required.

## Performance Bottlenecks

**Blog post page makes two sequential Notion API calls:**
- Problem: `src/app/(marketing)/blog/[slug]/page.tsx` calls `getPostBySlug(slug)` which internally calls `getAllPosts()`, then the page also calls `getAllPosts()` again to compute the "next post" navigation. This results in two cache lookups and one uncached `n2m.pageToMarkdown()` call.
- Files: `src/app/(marketing)/blog/[slug]/page.tsx`, `src/lib/blog.ts`
- Cause: `getPostBySlug` is not cached; only `getAllPosts` is cached. The page calls `getAllPosts` a second time independently.
- Improvement path: Deduplicate by passing the already-fetched post list into `getPostBySlug`, or cache `getPostBySlug` with per-slug cache keys.

**`react-globe.gl` and `three` add significant bundle weight:**
- Problem: `react-globe.gl` depends on `three.js` (~600 KB gzipped). The globe is only shown in the `SocialProof` section on desktop (`hidden md:block`).
- Files: `src/components/GlobeShell.tsx`, `src/components/GlobeNetwork.tsx`
- Cause: Three.js cannot be tree-shaken. Even with `next/dynamic` and `ssr: false`, it is included in the client bundle for all desktop visitors regardless of whether they scroll to the globe.
- Improvement path: The `dynamic` import already defers the load; current approach is acceptable. Consider additionally lazy-loading `GlobeShell` itself with `next/dynamic` from `SocialProof` to defer the bundle until the section is visible.

**Solutions cache TTL is 12 hours (`revalidate: 43200`):**
- Problem: New solution providers approved in Notion won't appear on the site for up to 12 hours without manual cache busting.
- Files: `src/lib/solutions.ts`
- Cause: No on-demand revalidation endpoint exists (see REVALIDATE_SECRET concern above).
- Improvement path: Build the `/api/revalidate` endpoint and trigger it from a Notion automation on provider status changes.

## Fragile Areas

**Notion property name coupling:**
- Files: `src/lib/blog.ts`, `src/lib/events.ts`, `src/lib/resources.ts`, `src/lib/solutions.ts`
- Why fragile: Every data fetch function accesses Notion properties by exact string name (e.g. `p['Event Name']`, `p['Author Type']`, `p['Cover Image']`). Renaming any property in Notion silently breaks data mapping — fields return `undefined` and fall through to defaults without error.
- Safe modification: When changing a Notion property name, update the corresponding string in the lib file simultaneously. Consider adding a runtime validation step using Zod on the raw Notion response.
- Test coverage: No unit tests for any lib function. No integration tests for Notion data mapping.

**`withValidation` timing check is clock-dependent:**
- Files: `src/lib/validation.ts`
- Why fragile: The bot-timing check uses `Date.now() - loadTime` where `loadTime` comes from the client-submitted `_t` field. A client can set `_t` to any past timestamp to bypass the 3-second check. The check provides friction against naive bots but not determined ones.
- Safe modification: Do not rely on this as a security control. Use it as one signal among several.
- Test coverage: Not tested.

**`SocialProof` stat parsing is hardcoded:**
- Files: `src/components/sections/SocialProof.tsx`
- Why fragile: `STAT_VALUES` maps only `'200+'` and `'1'` to animated CountUp values. Any change to stat values in `SOCIAL_STATS` constants that doesn't exactly match these keys will silently render as static text instead of animating.
- Safe modification: Update `STAT_VALUES` whenever `SOCIAL_STATS` values change, or refactor to parse the suffix and number from the value string dynamically.
- Test coverage: None.

## Test Coverage Gaps

**No unit tests for any lib function:**
- What's not tested: All Notion data-fetching and mapping logic in `src/lib/blog.ts`, `src/lib/events.ts`, `src/lib/resources.ts`, `src/lib/solutions.ts`.
- Files: `src/lib/`
- Risk: Notion property renames or API shape changes break data silently. Pages render empty or with default values.
- Priority: High

**No unit tests for API route validation logic:**
- What's not tested: `withValidation` middleware, all schemas in `src/lib/schemas.ts`, honeypot/timing bypass logic.
- Files: `src/lib/validation.ts`, `src/lib/schemas.ts`, `src/app/api/`
- Risk: Validation regressions allow malformed data into Notion databases.
- Priority: High

**Only one smoke test (homepage title):**
- What's not tested: Form submission flows, events page, blog page, blog post detail, solutions page, resources page. No test for empty-state rendering when Notion returns no results.
- Files: `tests/smoke.spec.ts`
- Risk: Any page-level regression goes undetected until production.
- Priority: Medium

**No error.tsx or loading.tsx anywhere:**
- What's not tested: No Next.js error boundaries are defined for any route segment. Unhandled exceptions in server components surface as unformatted Next.js 500 pages.
- Files: `src/app/` (missing `error.tsx`)
- Risk: Notion API downtime or misconfiguration shows a generic error page with no recovery path.
- Priority: Medium

## Missing Critical Features

**No on-demand cache revalidation:**
- Problem: Cache tags (`notion:blog`, `notion:events`, `notion:solutions`, `notion:resources`) are defined but there is no `/api/revalidate` endpoint to invalidate them. Content updates in Notion are only reflected after TTL expiry (ranging from 5 minutes for events to 12 hours for solutions).
- Blocks: Operators cannot push content updates immediately without manual deployment or waiting for TTL.

**No confirmation email after form submission:**
- Problem: When a user submits any application (membership, chapter, ventures, solutions) or suggestion, they receive only a client-side success message. No email confirmation is sent to the applicant or to the admin.
- Blocks: Applicants have no record of their submission. Admins must check Notion manually to discover new applications.

**Sitemap only includes the homepage:**
- Problem: `src/app/sitemap.ts` returns a single entry for the root URL. All other routes (`/blog/*`, `/events`, `/resources`, `/solutions`, `/apply/*`) are excluded from the sitemap.
- Files: `src/app/sitemap.ts`
- Blocks: Search engine indexing of content pages.

---

*Concerns audit: 2026-03-28*
