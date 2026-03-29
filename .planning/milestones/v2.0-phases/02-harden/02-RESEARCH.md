# Phase 02: Harden - Research

**Researched:** 2026-03-28
**Domain:** Next.js 16 security hardening, rate limiting, CSP nonces, error/loading boundaries
**Confidence:** HIGH

## Summary

Phase 2 adds defensive layers to an existing Next.js 16.2.1 App Router site. The work spans five requirements: IP-based rate limiting on all API routes (SEC-01), Origin header checking (SEC-02), CSP nonce injection replacing `unsafe-inline` (SEC-03), Sentry sample rate reduction (SEC-04), and error/loading boundaries for every route segment (FEAT-05).

The critical architectural insight for this phase is that **Next.js 16 renamed `middleware.ts` to `proxy.ts`**. All CSP nonce injection and Origin checking that would previously live in `middleware.ts` must now live in `proxy.ts` at the project root with a named `export function proxy()`. The project has no proxy.ts yet — it needs to be created from scratch.

The CSP nonce approach forces every page to dynamic rendering (no static export), which is acceptable for this site since all pages already consume Notion data at request time. Rate limiting is implemented in-memory using a `Map<string, {count, firstHit}>` inside `withValidation` in `src/lib/validation.ts` — no Redis or external dependency needed for a single-instance community marketing site. All other changes are mechanical: three Sentry config files to update, and `error.tsx` + `loading.tsx` files to add across every route segment.

**Primary recommendation:** Build proxy.ts for nonce+origin, extend withValidation for rate limiting, update three Sentry files to 0.1, add 14 error/loading files across the 7 route segments.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Error Pages**
- Warm and on-brand tone — friendly messaging with SAGIE branding
- Context-aware error messages — different messaging per area (e.g. blog vs forms vs general)
- Actions: Retry button + Home link + email contact link (mailto: to team email)
- Custom illustrations per error type — not icons, not text-only
- Use existing site background effects (GridBackground/CircuitBackground) for visual consistency
- Redesign not-found.tsx (404) to share the same visual language as error.tsx pages — unified error experience

**Loading Skeletons**
- Shimmer/pulse skeleton style — animated gradient sweep over placeholder shapes
- Brand-colored shimmer — dark background with subtle accent-colored gradient, using existing design tokens from globals.css
- Tailored per page — each loading.tsx mirrors its page's actual layout (blog shows card grid, events shows list, forms show field placeholders)
- Form pages get form-specific skeletons (input shapes, label bars, submit button shape)
- Slow and smooth animation — ~2 second sweep cycle for premium feel
- Navbar and Footer always visible during loading (Next.js App Router default — skeleton only covers page content area)

**Rate Limiting**
- Inline form error display — uses existing `errors.submit` pattern, no new toast/snackbar system needed
- Friendly tone: "You've submitted several times recently. Please wait a few minutes before trying again."
- Applies to all API routes (POST and any future endpoints), not just form submissions
- Include `Retry-After` header in 429 responses for well-behaved clients and crawlers

**Sentry Configuration**
- tracesSampleRate: 0.1 (10%) in production — sufficient for a community marketing site

### Claude's Discretion
- Rate limiter implementation approach (in-memory vs external store)
- CSP nonce generation and injection mechanism
- Exact skeleton layout details per page
- Error illustration style and implementation
- Origin check implementation details
- Shimmer CSS implementation (CSS animation vs JS)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SEC-01 | API routes enforce IP-based rate limiting (target: 5 submissions per IP per 10 min) | In-memory Map inside withValidation; IP from x-forwarded-for or connection.remoteAddress |
| SEC-02 | API routes check Origin header against allowedOrigins | allowedOrigins Set already exported from src/env/server.ts; check in withValidation or proxy.ts |
| SEC-03 | CSP script-src uses per-request nonces instead of unsafe-inline | proxy.ts nonce generation; 'nonce-${nonce}' + 'strict-dynamic' replaces unsafe-inline |
| SEC-04 | Sentry tracesSampleRate lowered to 0.1-0.2 in production | Three config files: sentry.client.config.ts, sentry.server.config.ts, sentry.edge.config.ts |
| FEAT-05 | error.tsx and loading.tsx boundaries exist for all route segments | 7 segments identified; each needs error.tsx (client component) + loading.tsx |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.1 | Framework — proxy.ts, error.tsx, loading.tsx conventions | Already installed; v16 renamed middleware→proxy |
| @sentry/nextjs | 10.46.0 | Error/performance monitoring with tracing | Already installed; just config change |
| zod | 4.3.6 | Schema validation used in withValidation wrapper | Already installed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Node.js crypto | built-in | `crypto.randomUUID()` for nonce generation | Used in proxy.ts; no install needed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| In-memory Map rate limiter | Upstash Redis / rate-limiter-flexible | Redis survives restarts and scales across instances, but requires an external service. In-memory is sufficient for a community marketing site on a single Vercel deployment where restarts reset attack windows naturally |
| proxy.ts nonces | SRI (experimental) + next.config.ts hashes | SRI preserves static rendering but is marked experimental in Next.js. Nonces are the production-recommended approach |
| CSS animation shimmer | JS-driven shimmer | CSS-only is more performant, no JS overhead, works without hydration |

**Installation:** No new packages required for this phase.

---

## Architecture Patterns

### Recommended File Structure Changes
```
src/
├── proxy.ts                               # NEW — nonce generation + origin check (replaces middleware.ts)
├── lib/
│   └── validation.ts                      # MODIFY — add rate limiting layer
├── app/
│   ├── not-found.tsx                      # MODIFY — redesign to match error.tsx visual language
│   ├── (marketing)/
│   │   ├── error.tsx                      # NEW — root marketing error boundary
│   │   ├── loading.tsx                    # NEW — root marketing loading skeleton
│   │   ├── blog/
│   │   │   ├── error.tsx                  # NEW
│   │   │   ├── loading.tsx                # NEW — card grid skeleton
│   │   │   └── [slug]/
│   │   │       ├── error.tsx              # NEW
│   │   │       └── loading.tsx            # NEW — article skeleton
│   │   ├── events/
│   │   │   ├── error.tsx                  # NEW
│   │   │   └── loading.tsx                # NEW — list skeleton
│   │   ├── resources/
│   │   │   ├── error.tsx                  # NEW
│   │   │   └── loading.tsx                # NEW
│   │   ├── solutions/
│   │   │   ├── error.tsx                  # NEW
│   │   │   └── loading.tsx                # NEW
│   │   └── apply/
│   │       ├── error.tsx                  # NEW (covers chapter, ventures, solutions sub-routes)
│   │       └── loading.tsx                # NEW — form skeleton
└── components/ui/
    └── Skeleton.tsx                       # NEW — reusable shimmer skeleton primitive
```

### Pattern 1: proxy.ts — Nonce + Origin Check
**What:** Generate a per-request nonce in proxy.ts, set it in both request headers (x-nonce) and the CSP response header. Check Origin header against allowedOrigins for all /api/* routes.
**When to use:** All page routes (nonce), all /api/* routes (origin check)

```typescript
// Source: https://nextjs.org/docs/app/guides/content-security-policy (verified 2026-03-25)
// proxy.ts at project root
import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'

  // Origin check for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin') ?? ''
    const allowedOriginsStr = process.env.ALLOWED_ORIGINS ?? ''
    const allowed = new Set(allowedOriginsStr.split(',').map(s => s.trim()))
    if (origin && !allowed.has(origin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' https: data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "connect-src 'self' https://api.notion.com https://*.ingest.sentry.io",
  ].join('; ')

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', cspHeader)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', cspHeader)
  // Preserve other security headers from next.config.ts (X-Frame-Options etc. stay there)
  return response
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```

**Critical:** The existing CSP in `next.config.ts` has `script-src 'self' 'unsafe-inline'`. When proxy.ts is live, the `script-src` in next.config.ts must be removed (or kept only as fallback without unsafe-inline). Proxy-generated CSP headers take precedence over next.config.ts headers for matched routes. The safest approach: keep non-script-src headers in next.config.ts and let proxy.ts own the full CSP.

**Dynamic rendering note:** Pages that read `headers()` (for nonces) opt into dynamic rendering automatically. For this site, all Notion-data pages are already dynamic — no `connection()` call needed.

### Pattern 2: In-Memory Rate Limiter inside withValidation
**What:** Extend `withValidation` in `src/lib/validation.ts` to track requests per IP using a `Map`. Return 429 with `Retry-After` header when threshold exceeded.
**When to use:** All API POST routes (wrapped by withValidation automatically)

```typescript
// Source: verified pattern — Node.js built-in Map, no library needed
// Add to src/lib/validation.ts (before the withValidation function)

type RateEntry = { count: number; firstHit: number }
const rateStore = new Map<string, RateEntry>()
const RATE_LIMIT = 5
const WINDOW_MS = 10 * 60 * 1000 // 10 minutes

function getIP(req: Request): string {
  // x-forwarded-for is set by Vercel/proxies
  const forwarded = (req as Request & { headers: Headers }).headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() ?? 'unknown'
}

function isRateLimited(ip: string): { limited: boolean; retryAfter: number } {
  const now = Date.now()
  const entry = rateStore.get(ip)
  if (!entry || now - entry.firstHit > WINDOW_MS) {
    rateStore.set(ip, { count: 1, firstHit: now })
    return { limited: false, retryAfter: 0 }
  }
  if (entry.count >= RATE_LIMIT) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - entry.firstHit)) / 1000)
    return { limited: true, retryAfter }
  }
  entry.count++
  return { limited: false, retryAfter: 0 }
}
```

Then inside `withValidation`, before the honeypot check:
```typescript
const ip = getIP(req)
const { limited, retryAfter } = isRateLimited(ip)
if (limited) {
  return NextResponse.json(
    { error: "You've submitted several times recently. Please wait a few minutes before trying again." },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } }
  )
}
```

**Memory note:** The Map grows one entry per unique IP seen within the window. For a community marketing site, this is negligible. Entries older than WINDOW_MS are effectively dead weight but harmless — a periodic cleanup is an optional nice-to-have, not required.

### Pattern 3: error.tsx — Client Component Error Boundary
**What:** Each route segment error.tsx receives `error` (Error) and `reset` (function) props. Must be `'use client'`.
**When to use:** Every directory under `src/app/` that has a `page.tsx`

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/error (verified 2026-03-25)
// Example: src/app/(marketing)/blog/error.tsx
'use client'

import { useEffect } from 'react'

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Sentry automatically captures this via the error boundary integration
    console.error(error)
  }, [error])

  return (
    // Brand-styled error UI with GridBackground/CircuitBackground
    // Retry button calls reset(), Home link goes to '/', mailto: contact link
    <div>...</div>
  )
}
```

**Boundary scope:** error.tsx does NOT catch errors thrown by the layout.tsx in the same segment. It wraps the page.tsx below it. This means the root `(marketing)/layout.tsx` (if it exists) errors are not caught by `(marketing)/error.tsx` — they bubble to the app-level `app/error.tsx`.

### Pattern 4: loading.tsx — Suspense Skeleton
**What:** loading.tsx automatically wraps page.tsx in a React Suspense boundary. It renders while the server component loads its data.
**When to use:** Every route segment that fetches async data (all Notion-powered pages)

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/loading (verified 2026-03-25)
// Example: src/app/(marketing)/blog/loading.tsx
// No 'use client' needed — can be a server component (no state/effects)

export default function BlogLoading() {
  return (
    // Mirror actual blog layout with skeleton shapes
    // Use CSS animation shimmer (see Skeleton.tsx pattern below)
    <div>...</div>
  )
}
```

### Pattern 5: Reusable Skeleton Component
**What:** A `Skeleton` primitive using CSS animation for the shimmer sweep.
**When to use:** All loading.tsx files compose from this primitive.

```typescript
// src/components/ui/Skeleton.tsx
// 'use client' only needed if using hooks — pure CSS animation doesn't need it
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', className)}
    />
  )
}
```

CSS to add to `globals.css`:
```css
/* ── Skeleton shimmer ── */
@keyframes skeleton-sweep {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-card) 25%,
    var(--border-default) 50%,
    var(--bg-card) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-sweep 2s ease-in-out infinite;
  border-radius: 2px;
}
```

### Pattern 6: Sentry Production Sampling
**What:** Set `tracesSampleRate` conditionally based on `NODE_ENV`.
**When to use:** All three Sentry config files.

```typescript
// Source: https://docs.sentry.io/platforms/javascript/guides/nextjs/tracing/configure-sampling/
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
})
```

### Anti-Patterns to Avoid
- **Checking origin inside route.ts handlers directly:** The `allowedOrigins` check belongs in proxy.ts (for all routes at once) or in `withValidation` (for API routes specifically). Don't scatter it into each route file.
- **Rate limiting in proxy.ts:** Proxy runs on the Node.js runtime in Next.js 16 but is intended for request transformation/routing — not for stateful in-memory stores. The rate limiting Map should live in `src/lib/validation.ts` which runs in the Node.js server context. This keeps the proxy.ts fast and stateless.
- **Keeping `unsafe-inline` in script-src:** Once proxy.ts injects nonces, `unsafe-inline` in script-src must be removed. Browsers ignore nonces if `unsafe-inline` is also present (in non-strict-dynamic aware browsers), and it defeats the purpose entirely.
- **Adding `'use client'` to loading.tsx:** Loading skeletons are pure presentation with no state or browser APIs. They should be server components (no directive) to keep them lightweight.
- **One giant shared error.tsx at root only:** Each content area needs its own contextual error.tsx to support the "context-aware messaging" requirement. A root-level error.tsx alone cannot vary messaging by area.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Nonce generation | Custom random string generator | `crypto.randomUUID()` (Node built-in) | UUID is cryptographically secure, base64-encoded output is the official Next.js pattern |
| Rate limit data structure | Complex eviction algorithms | Simple `Map` with timestamp check | For this traffic volume, a Map with window-expiry is correct. Full LRU cache adds complexity with no benefit |
| Skeleton animation | JS-driven requestAnimationFrame loop | CSS `@keyframes` + `background-position` | CSS GPU-composited, runs off main thread, no hydration dependency |
| CSP header string building | Manual string concatenation scattered everywhere | Single array joined in proxy.ts | One place to audit, one place to change |

---

## Common Pitfalls

### Pitfall 1: proxy.ts vs next.config.ts Header Conflict
**What goes wrong:** Both proxy.ts and next.config.ts set `Content-Security-Policy`. The result is two CSP headers, or the wrong one wins. Browsers apply the most restrictive CSP when multiple are present — which could block legitimate scripts.
**Why it happens:** Existing project has CSP in `next.config.ts`; new nonce-based CSP goes into `proxy.ts`.
**How to avoid:** Remove `script-src` from next.config.ts CSP (or remove the full CSP header from next.config.ts and let proxy.ts own it entirely). Keep other security headers (X-Frame-Options, X-Content-Type-Options, etc.) in next.config.ts — those are static and don't need per-request generation.
**Warning signs:** Console shows `Refused to execute inline script because it violates the following Content Security Policy directive` even after nonce is set.

### Pitfall 2: Style CSP with Nonces
**What goes wrong:** Adding nonces to `style-src` blocks Google Fonts or other CDN styles.
**Why it happens:** The existing style-src includes `https:` and `'unsafe-inline'`. If you nonce-gate styles, you must ensure all inline styles (React's style prop generates them) have nonces — which is complex.
**How to avoid:** Keep `style-src 'self' 'unsafe-inline'` unchanged. The requirement is only for `script-src`. Nonces on styles is optional hardening beyond SEC-03 scope.
**Warning signs:** Page renders unstyled; network tab shows blocked stylesheets.

### Pitfall 3: IP Extraction on Vercel
**What goes wrong:** `req.socket?.remoteAddress` returns Vercel's internal proxy IP, not the real user IP. All users appear to come from the same IP and everyone gets rate limited together.
**Why it happens:** Vercel (and most CDN/reverse proxy setups) sit between the real client and the Node.js process.
**How to avoid:** Always read `x-forwarded-for` header first: `req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()`. This is set by Vercel to the real client IP.
**Warning signs:** Rate limit triggers on the first request from any user.

### Pitfall 4: Dynamic Rendering Performance Impact
**What goes wrong:** Adding proxy.ts with nonce headers causes all pages to become dynamically rendered. Pages that were previously statically generated at build time now require a server request on every visit.
**Why it happens:** Nonces must be unique per request; Next.js cannot cache a page that has a different nonce each time.
**How to avoid:** This is acceptable for this site (all pages already read Notion data dynamically). The performance impact is mitigated by Vercel's edge network. Document this tradeoff explicitly.
**Warning signs:** Build output shows all pages as "dynamic" rather than "static" — expected behavior, not a bug.

### Pitfall 5: error.tsx Without 'use client'
**What goes wrong:** TypeScript build error or runtime crash because error.tsx uses `reset` callback (a function prop from Next.js) but is not marked as a client component.
**Why it happens:** The `reset` prop and `useEffect` usage require client-side rendering.
**How to avoid:** Always add `'use client'` as the first line of every error.tsx file.
**Warning signs:** `TypeError: reset is not a function` or build error about hooks in server components.

### Pitfall 6: Rate Limit Map Memory Growth
**What goes wrong:** The Map accumulates stale entries for IPs that submitted once and never returned. Over months of traffic, this can grow unbounded.
**Why it happens:** No eviction logic for entries older than the window.
**How to avoid:** The WINDOW_MS check already prevents false positives. For a low-traffic community site, periodic server restarts (Vercel cold starts) clear the Map naturally. Optional: add periodic cleanup with `setInterval` clearing entries where `now - firstHit > WINDOW_MS`.
**Warning signs:** Memory usage creeping up over days (unlikely at this scale but worth noting).

---

## Code Examples

### Full route segments that need error.tsx + loading.tsx

Based on the current file tree audit:

| Segment Directory | Has page.tsx | Needs error.tsx | Needs loading.tsx | Data Source |
|---|---|---|---|---|
| `src/app/(marketing)/` | no (has layout) | YES | YES | layout-level catch |
| `src/app/(marketing)/blog/` | YES | YES | YES | Notion blog list |
| `src/app/(marketing)/blog/[slug]/` | YES | YES | YES | Notion single post |
| `src/app/(marketing)/events/` | YES | YES | YES | Notion events |
| `src/app/(marketing)/resources/` | YES | YES | YES | Notion resources |
| `src/app/(marketing)/solutions/` | YES (or dir?) | YES | YES | Notion solutions |
| `src/app/(marketing)/apply/` | no direct page | YES | YES | form pages below |
| `src/app/(marketing)/apply/chapter/` | YES | (inherited) | (inherited) | form |
| `src/app/(marketing)/apply/ventures/` | YES | (inherited) | (inherited) | form |
| `src/app/(marketing)/apply/solutions/` | YES | (inherited) | (inherited) | form |
| `src/app/(marketing)/suggest-event/` | YES | YES | YES | form |
| `src/app/not-found.tsx` | — | n/a (redesign) | n/a | — |

**Notes:**
- `apply/chapter`, `apply/ventures`, `apply/solutions` inherit from `apply/error.tsx` + `apply/loading.tsx` — no need for individual files unless context-aware messaging requires it.
- The `(marketing)` route group layout does not automatically get an error boundary in the group; adding `error.tsx` at `(marketing)/error.tsx` catches errors from that layout's children.
- Solutions directory shows only `page.tsx` in the audit — confirm no sub-routes need separate boundaries.

**Total new files:** approximately 14 (error.tsx + loading.tsx for 7 key segments) plus 1 proxy.ts, 1 Skeleton.tsx component, 3 Sentry config updates, 1 validation.ts update, 1 not-found.tsx redesign.

### Sentry Config — All Three Files
```typescript
// sentry.client.config.ts, sentry.server.config.ts, sentry.edge.config.ts
// Source: https://docs.sentry.io/platforms/javascript/guides/nextjs/tracing/configure-sampling/
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  // client-only: keep existing replay settings
})
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `middleware.ts` with `export function middleware()` | `proxy.ts` with `export function proxy()` | Next.js 16.0.0 | File rename required; function export name must be `proxy` not `middleware` |
| CSP headers in `next.config.ts` only | Per-request nonces in `proxy.ts` | Next.js 13+ (stable v16) | Static CSP becomes dynamic; pages shift from static to dynamic rendering |
| `tracesSampleRate: 1.0` (capture everything) | `tracesSampleRate: 0.1` in production | Best practice, always | Reduces Sentry quota consumption by 90% |

**Deprecated/outdated:**
- `middleware.ts` as file name: deprecated in Next.js 16, replaced by `proxy.ts`. Migration codemod available: `npx @next/codemod@canary middleware-to-proxy .`
- `export function middleware()`: deprecated, use `export function proxy()` instead
- `script-src 'unsafe-inline'`: replaced by nonces + strict-dynamic for CSP compliance

---

## Open Questions

1. **Does solutions route have sub-routes requiring separate error boundaries?**
   - What we know: `src/app/(marketing)/solutions/` shows only `page.tsx`
   - What's unclear: The audit shows a `solutions` directory under `apply/` too — these are different routes
   - Recommendation: Treat `(marketing)/solutions/` as a single segment; `apply/solutions/` inherits from `apply/error.tsx`

2. **Proxy.ts origin check: reject requests with no Origin header?**
   - What we know: Browsers always send Origin on cross-origin requests; same-origin page navigation omits it
   - What's unclear: Direct server-to-server API calls (health checks, future webhooks) won't send Origin
   - Recommendation: Only reject when `origin` header is present AND not in allowedOrigins. Allow missing origin (direct/same-origin requests). This avoids breaking legitimate non-browser callers.

3. **next.config.ts CSP coordination with proxy.ts**
   - What we know: Both can set Content-Security-Policy; proxy.ts runs after next.config.ts headers
   - What's unclear: Does proxy.ts override or append to next.config.ts CSP?
   - Recommendation: Remove the `script-src` line from next.config.ts CSP entirely. Let proxy.ts own the complete CSP header. Keep X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy in next.config.ts (those are static and correct as-is).

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed yet (TEST-01 is Phase 4) |
| Config file | none — Wave 0 creates if needed |
| Quick run command | n/a — no test runner configured |
| Full suite command | n/a |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SEC-01 | 6th request from same IP within 10 min returns 429 | manual-only | n/a (no test framework yet) | ❌ |
| SEC-02 | Request with unlisted Origin returns 403 | manual-only | n/a | ❌ |
| SEC-03 | CSP header contains nonce, no unsafe-inline in script-src | manual-only (curl or browser DevTools) | n/a | ❌ |
| SEC-04 | tracesSampleRate is 0.1 in production sentry configs | code review | n/a | ❌ |
| FEAT-05 | Every route segment renders error.tsx on thrown error; loading.tsx on slow fetch | manual-only (throw test, network throttle) | n/a | ❌ |

**Rationale for manual-only:** The Vitest/testing setup (TEST-01 through TEST-04) is deferred to Phase 4. Automated testing of Next.js middleware/proxy and error boundaries requires either Playwright E2E or a full test harness not yet configured. Verification for this phase is via:
- `curl -H "Origin: https://evil.com" http://localhost:3000/api/applications/membership` → expect 403
- `curl -X POST http://localhost:3000/api/applications/membership` (6 times fast) → 6th returns 429
- Browser DevTools → Network tab → page response headers → verify CSP has `nonce-` and no `unsafe-inline`
- Sentry config files → grep for `tracesSampleRate` and confirm value

### Sampling Rate
- **Per task commit:** Manual curl/browser check of the specific change
- **Per wave merge:** Full manual checklist per success criteria in phase description
- **Phase gate:** All 5 success criteria TRUE before `/gsd:verify-work`

### Wave 0 Gaps
- No test framework installed (deferred to Phase 4 per REQUIREMENTS.md)
- Manual verification commands documented in success criteria above

---

## Sources

### Primary (HIGH confidence)
- [Next.js official CSP guide](https://nextjs.org/docs/app/guides/content-security-policy) — verified 2026-03-25, version 16.2.1; nonce generation, proxy.ts pattern, strict-dynamic
- [Next.js proxy.ts file convention](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) — verified 2026-03-25; confirmed middleware→proxy rename in v16.0.0
- [Next.js error.tsx convention](https://nextjs.org/docs/app/api-reference/file-conventions/error) — client component requirement, reset prop
- [Next.js loading.tsx convention](https://nextjs.org/docs/app/api-reference/file-conventions/loading) — Suspense boundary wrapping
- [Sentry tracing configuration](https://docs.sentry.io/platforms/javascript/guides/nextjs/tracing/configure-sampling/) — tracesSampleRate range 0.0–1.0, production recommendation

### Secondary (MEDIUM confidence)
- In-memory Map rate limiting pattern — verified by multiple Next.js community sources; aligned with official Next.js middleware/proxy patterns for simple use cases

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already in project, no new installs
- Architecture: HIGH — patterns verified against Next.js 16.2.1 official docs
- Pitfalls: HIGH — CSP/nonce pitfalls verified against official docs; rate limiting pitfalls from well-established Node.js patterns
- Validation: HIGH — confirmed no test framework in project; manual verification approach is correct

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (Next.js releases frequently; proxy.ts is stable as of v16.0.0)
