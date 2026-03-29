---
phase: 02-harden
plan: 01
subsystem: infra
tags: [csp, nonce, rate-limiting, sentry, security, next-proxy]

# Dependency graph
requires: []
provides:
  - proxy.ts with per-request CSP nonces and origin checking for all API routes
  - In-memory IP rate limiting (5 req/10 min) inside withValidation
  - Sentry tracesSampleRate reduced to 0.1 in production across all three configs
affects: [02-02, 02-03, 03-content, 04-testing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - proxy.ts at project root (Next.js 16 convention) for per-request CSP nonces
    - In-memory Map rate limiter with window-expiry logic inside withValidation
    - Conditional Sentry sample rate via NODE_ENV check

key-files:
  created:
    - proxy.ts
  modified:
    - next.config.ts
    - src/lib/validation.ts
    - sentry.client.config.ts
    - sentry.server.config.ts
    - sentry.edge.config.ts

key-decisions:
  - "proxy.ts owns full CSP header; next.config.ts retains only static security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)"
  - "Origin check only rejects when origin header is present AND not in ALLOWED_ORIGINS — missing origin (same-origin / server-to-server) is allowed through"
  - "Rate limiter lives in withValidation, not proxy.ts — keeps proxy stateless and fast; rate limit check runs before honeypot to reject abusive IPs first"

patterns-established:
  - "proxy.ts pattern: all per-request header generation (nonce, CSP) belongs in proxy.ts not next.config.ts"
  - "Rate limiter pattern: getIP reads x-forwarded-for first (Vercel real client IP), falls back to unknown"

requirements-completed: [SEC-01, SEC-02, SEC-03, SEC-04]

# Metrics
duration: 2min
completed: 2026-03-28
---

# Phase 02 Plan 01: Security Middleware Summary

**CSP nonce injection via proxy.ts (replacing unsafe-inline), IP-based rate limiting in withValidation (5 req/10 min), and Sentry sample rate reduction to 0.1 in production**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-28T14:15:26Z
- **Completed:** 2026-03-28T14:17:14Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Created proxy.ts at project root with per-request nonce generation (crypto.randomUUID + base64), origin checking for /api/* routes returning 403 for unlisted origins, full CSP with nonce-based script-src and strict-dynamic
- Extended withValidation with in-memory rate limiter — 5 requests per IP per 10 minutes, 429 + Retry-After header with friendly user message
- Updated all three Sentry configs to use 0.1 tracesSampleRate in production, 1.0 in dev
- Removed CSP and script-src from next.config.ts — proxy.ts now owns the full CSP header

## Task Commits

Each task was committed atomically:

1. **Task 1: Create proxy.ts with CSP nonces and origin checking** - `18223f0` (feat)
2. **Task 2: Add rate limiting to withValidation and update Sentry configs** - `6ab3719` (feat)

## Files Created/Modified
- `proxy.ts` - Per-request CSP nonce generation, /api/* origin checking, full CSP header with nonce + strict-dynamic
- `next.config.ts` - Removed CSP header and script-src; only static security headers remain
- `src/lib/validation.ts` - Added RateEntry type, rateStore Map, getIP(), isRateLimited() helpers, rate check before honeypot
- `sentry.client.config.ts` - tracesSampleRate conditional on NODE_ENV
- `sentry.server.config.ts` - tracesSampleRate conditional on NODE_ENV
- `sentry.edge.config.ts` - tracesSampleRate conditional on NODE_ENV

## Decisions Made
- proxy.ts owns full CSP; next.config.ts retains only static security headers — avoids duplicate CSP headers which would cause the most restrictive to win and potentially block legitimate scripts
- Origin check only rejects when origin header is present AND not in ALLOWED_ORIGINS — missing origin (same-origin / server-to-server requests) allowed through to avoid breaking health checks and future webhooks
- Rate limiter in withValidation (not proxy.ts) — keeps proxy stateless and fast; in-memory Map appropriate for single-instance community site where cold starts naturally reset attack windows

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- SEC-01 through SEC-04 complete — all four security requirements satisfied
- proxy.ts is ready for future use as context source for component nonce reading via headers()
- Phase 02 Plan 02 (error.tsx + loading.tsx boundaries) can proceed without dependencies on this plan

---
*Phase: 02-harden*
*Completed: 2026-03-28*
