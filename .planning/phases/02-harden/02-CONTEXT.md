# Phase 2: Harden - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Every API route is protected from abuse (IP-based rate limiting, origin checks, CSP nonces) and every page segment handles errors and loading states gracefully. Sentry tracing is tuned for production.

</domain>

<decisions>
## Implementation Decisions

### Error Pages
- Warm and on-brand tone — friendly messaging with SAGIE branding
- Context-aware error messages — different messaging per area (e.g. blog vs forms vs general)
- Actions: Retry button + Home link + email contact link (mailto: to team email)
- Custom illustrations per error type — not icons, not text-only
- Use existing site background effects (GridBackground/CircuitBackground) for visual consistency
- Redesign not-found.tsx (404) to share the same visual language as error.tsx pages — unified error experience

### Loading Skeletons
- Shimmer/pulse skeleton style — animated gradient sweep over placeholder shapes
- Brand-colored shimmer — dark background with subtle accent-colored gradient, using existing design tokens from globals.css
- Tailored per page — each loading.tsx mirrors its page's actual layout (blog shows card grid, events shows list, forms show field placeholders)
- Form pages get form-specific skeletons (input shapes, label bars, submit button shape)
- Slow and smooth animation — ~2 second sweep cycle for premium feel
- Navbar and Footer always visible during loading (Next.js App Router default — skeleton only covers page content area)

### Rate Limiting
- Inline form error display — uses existing `errors.submit` pattern, no new toast/snackbar system needed
- Friendly tone: "You've submitted several times recently. Please wait a few minutes before trying again."
- Applies to all API routes (POST and any future endpoints), not just form submissions
- Include `Retry-After` header in 429 responses for well-behaved clients and crawlers

### Sentry Configuration
- tracesSampleRate: 0.1 (10%) in production — sufficient for a community marketing site

### Claude's Discretion
- Rate limiter implementation approach (in-memory vs external store)
- CSP nonce generation and injection mechanism
- Exact skeleton layout details per page
- Error illustration style and implementation
- Origin check implementation details
- Shimmer CSS implementation (CSS animation vs JS)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `withValidation` (src/lib/validation.ts): Already wraps all API POST routes — rate limiting and origin checks can extend this layer
- `allowedOrigins` (src/env/server.ts): Already exported as a set — ready for origin header checking
- `errors.submit` state pattern in form components: Rate limit errors can use the same display mechanism
- `GridBackground` / `CircuitBackground` (src/components/ui/): Available for error page backgrounds
- `cn()` utility (src/lib/utils.ts): Class merging for skeleton component styling
- `not-found.tsx` (src/app/): Existing 404 page to be redesigned for visual consistency

### Established Patterns
- API routes always use `withValidation(Schema, handler)` — new middleware should compose with this
- CSP headers currently set in `next.config.ts` — nonce injection will need to modify this approach
- Sentry configs exist at `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
- Design tokens defined as CSS custom properties in `src/app/globals.css`
- `'use client'` directive required for any component with animations or state

### Integration Points
- `next.config.ts`: CSP header modification for nonces
- `src/app/layout.tsx`: Root layout where nonces could be generated per-request
- `src/lib/validation.ts`: Rate limiting middleware integration point
- Every route segment under `src/app/`: Needs `error.tsx` and `loading.tsx` files
- `src/env/server.ts`: `allowedOrigins` already available for origin checking

</code_context>

<specifics>
## Specific Ideas

- Error pages should feel like part of the site, not a dead end — warm community tone
- Loading experience should feel premium and deliberate — "the site is preparing something for you"
- Rate limiting should be invisible to normal users — only abusers encounter it

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-harden*
*Context gathered: 2026-03-28*
