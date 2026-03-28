# Project Research Summary

**Project:** sagie.co v2.0 Polish & Interactivity
**Domain:** Next.js App Router community/marketing site — brownfield polish milestone
**Researched:** 2026-03-28
**Confidence:** HIGH

## Executive Summary

This is a brownfield polish milestone on a mature Next.js 16 App Router + Notion CMS site. The v2.0 scope covers five capability areas: filter state bugs, event action buttons (including calendar integration), form redesign, admin feedback improvements, and a custom 404 illustration. The central finding across all four research streams is that the existing stack is already sufficient — only two new npm packages are needed (`react-hook-form` and `@hookform/resolvers`), and the remaining four capability areas are solved architecturally with the packages already installed. The right approach is surgical modification of 12 files, not structural overhaul.

The architecture recommendation is to preserve all existing patterns: server-fetches-once / client-filters-locally for listing pages, `withValidation` HOF for all API routes, and `AnimatePresence`/`motion` for UI transitions. The one contested design decision — whether to move filter state to URL params — was researched from both directions: FEATURES.md recommends `nuqs` for shareability while ARCHITECTURE.md argues against URL params because they trigger unnecessary server round-trips on a client-filtered listing page. The ARCHITECTURE.md position is more conservative and preserves existing patterns; the FEATURES.md position adds genuine user-facing value (shareable filtered URLs). This tradeoff should be settled in requirements, not assumed either way.

The dominant risks are all cross-cutting: GSAP ScrollTrigger interference with React re-renders (affects both filter fix and form redesign), the React Compiler's memoization potentially breaking honeypot timing (affects all seven forms), and silent Zod schema / Notion field mismatches that produce 200-OK responses with data loss. All three risks are preventable with explicit test assertions and incremental verification rather than requiring architectural changes.

---

## Key Findings

### Recommended Stack

The project adds exactly two new npm packages: `react-hook-form@^7.72.0` (React 19 compatible, replaces the manual `useState`-per-field + `validate()` pattern across seven forms) and `@hookform/resolvers@^5.2.2` (bridges existing Zod v4 schemas to RHF). Everything else — `motion`/`AnimatePresence` for the calendar modal, browser Blob API for ICS generation, `usePathname` + `router.refresh()` for navigation fix, `gsap.context()` cleanup for filter fix — uses packages already in `package.json`.

**Core technologies (new additions):**
- `react-hook-form@^7.72.0`: Form state + inline validation — eliminates per-field `useState`, enables `mode: 'onBlur'` inline validation ergonomics
- `@hookform/resolvers@^5.2.2`: Zod v4 resolver — bridges existing schemas to RHF with no schema rewrites (import from `zod` not `zod/v4` to avoid current TS edge cases)

**Existing capabilities relied upon:**
- `motion`/`AnimatePresence`: Calendar modal open/close + filter card transitions
- `gsap` + `@gsap/react` `useGSAP`: Fix ScrollTrigger stale triggers via deps parameter on `useScrollReveal`
- `next/navigation` `usePathname` + `useRouter`: Navigation rendering fix via `popstate` listener
- Browser `Blob` API: Client-side ICS generation (zero bundle cost, CSP check required before shipping)
- Zod v4 + `withValidation` HOF: All form security and validation stays unchanged on the server

### Expected Features

**Must have (table stakes) — bug fixes blocking current users:**
- Filter state bug fixed — selecting a second filter currently wipes rendered components
- Browser back/forward blank page fixed — pages go white on history pop
- Rate limit (429) shown as user-readable form error — currently silent
- Event action buttons wired — Register, More Info, Read Recap, Add to Calendar
- Form schema / Notion field alignment — silent data loss on current submissions

**Should have (quality + UX):**
- Add to Calendar modal with Google, Outlook, Apple/ICS, Office 365 options
- Inline form validation on blur (not on submit) with per-field error messages
- Dropdown and checkbox inputs replacing free-text for fixed-choice fields
- Admin revalidation per-button loading state + 401 key-rotation redirect
- Custom 404 illustration matching circuit-board site aesthetic

**Defer to v2+:**
- Multi-step forms for membership/ventures applications (high complexity, not data-critical)
- Timestamp audit log in admin dashboard (localStorage or server-side)
- "Notify me when confirmed" event feature (requires email capture without auth)
- Shareable filtered URL bookmarks (contested — see Executive Summary)
- Server-side ICS API route `/api/events/[id]/ics` (nice-to-have; client-side Blob covers current need if CSP is updated)

### Architecture Approach

The existing layered architecture — Server Component pages fetch from Notion once, pass typed data to `'use client'` filter/display components, forms POST through `withValidation` HOF, admin is self-contained — should be preserved entirely. Changes are additive: one new file (`CalendarModal.tsx`) and targeted modifications to 12 existing files. No new architectural patterns are introduced. The key structural decisions already made in v1 (no global state manager, no server-side filtering on filter click, centralized security in `withValidation`) are all validated by research and should not be revisited.

**Major components and changes:**

1. `useScrollReveal.ts` (MODIFY) — add `deps` parameter so ScrollTrigger re-runs on filter state changes
2. `layout.tsx` / `GSAPCleanup.tsx` (MODIFY) — add `popstate` listener calling `router.refresh()` for bfcache fix
3. `CalendarModal.tsx` (NEW) — client component, receives `SAGIEEvent`, constructs calendar URLs + ICS blob client-side
4. `EventsPageClient.tsx` (MODIFY) — wire action button hrefs, add CalendarModal state
5. `src/lib/events.ts` (MODIFY) — add `registrationLink`, `moreInfoLink`, `recapLink` to `SAGIEEvent`
6. `src/lib/utils.ts` (MODIFY) — add shared `handleApiError(res)` helper
7. All 7 form components (MODIFY) — add RHF, inline validation, 429 display
8. `admin/revalidate/page.tsx` (MODIFY) — per-action states, 401 redirect
9. `not-found.tsx` (MODIFY) — replace basic SVG with branded circuit illustration

### Critical Pitfalls

1. **GSAP ScrollTrigger stale triggers after filter change** — fix `useScrollReveal` to accept a `deps` array (like `useEffect`) and call `ScrollTrigger.refresh()` on change; use `useGSAP` context for automatic cleanup. Never add a `key` prop to the filter wrapper — it replays hero animations on every filter click.

2. **Back/forward blank page (bfcache ineligibility)** — add `popstate` listener in a top-level client component calling `router.refresh()`. Do NOT add `router.refresh()` on every `popstate` naively — scope it carefully to avoid full server re-renders on every back press.

3. **React Compiler breaking form honeypot timing** — `loadTime.current = Date.now()` must live in a `useEffect` with empty deps, not inline during render. After any form redesign verify `_t` in POST body via Network tab. Recovery if broken: add `'use no memo'` to affected form files temporarily.

4. **Zod schema / Notion field mismatch (silent data loss)** — maintain strict 1:1 rule: add schema entry before building the field in UI. After any form change, inspect the actual Notion entry created to verify all fields landed. Zod `.strip()` silently drops unknown keys — a 200 OK does not prove data was written.

5. **ICS Blob URL blocked by CSP in production** — the existing nonce-based CSP system likely does not include `blob:`. Check before shipping client-side ICS generation. If CSP update is blocked, fall back to a `/api/events/[id]/ics` route handler (1 hour of work, same ICS string generation logic).

6. **Calendar URL timezone errors** — treat event times as "floating" (no UTC `Z` suffix) unless Notion provides an explicit IANA timezone. Pass `YYYYMMDDTHHMMSS` (no Z) to Google Calendar. Use `encodeURIComponent()` on every URL parameter value individually — event names with `&` or `#` break URL parsing silently.

---

## Implications for Roadmap

Based on research, the architecture file provides the most grounded phase structure (derived from actual codebase dependencies). The suggested structure is 5 phases:

### Phase 1: Foundation Fixes
**Rationale:** Two of the fixes (`useScrollReveal` deps parameter, `handleApiError` shared helper) are dependencies of later phases. Resolving them first avoids duplicated work and enables Phase 2 work to proceed in parallel. Navigation fix (`popstate` listener) is independent and belongs here as it has no downstream dependencies.
**Delivers:** Fixed back/forward navigation, shared error handling utility, and a `useScrollReveal` hook capable of re-running on filter change
**Addresses:** Back/forward blank page bug; foundation for filter fix and all form rate-limit work
**Avoids:** GSAP stale trigger pitfall (Pitfall 2), bfcache blank page pitfall (Pitfall 1)
**Research flag:** Standard patterns — skip research phase

### Phase 2: Bug Fixes (Filter + Rate Limit Display)
**Rationale:** Depends on Phase 1 (`useScrollReveal` deps, `handleApiError`). These are the highest-impact user-facing bugs. Filter is broken for current users. Rate limit produces silent failures across all seven forms.
**Delivers:** Working filter state on Blog/Solutions/Resources pages; human-readable 429 feedback on all forms
**Addresses:** Filter state bug in `BlogFilter`, `SolutionsFilter`, `ResourceFilter`; rate limit UX across 7 form components
**Uses:** `useScrollReveal` with deps (Phase 1); `handleApiError` helper (Phase 1)
**Avoids:** GSAP selector scope mismatch (Pitfall 8); over-engineering filter state with URL params
**Research flag:** Standard patterns — skip research phase

### Phase 3: Event Action Buttons + Calendar Modal
**Rationale:** SAGIEEvent data model change (`registrationLink`, `moreInfoLink`, `recapLink`) must precede button wiring and modal build. This phase is self-contained relative to Phases 1-2 and can overlap with Phase 4 if resourcing allows.
**Delivers:** Working Register, More Info, Read Recap, and Add to Calendar buttons; CalendarModal with Google/Outlook/Apple/ICS options
**Addresses:** Event action buttons (all four types); ICS calendar download; conditional button display by event status
**Implements:** `CalendarModal.tsx` (new component); `SAGIEEvent` interface extensions; client-side ICS Blob generation
**Avoids:** Calendar URL timezone errors (Pitfall 6); ICS CSP violation (Pitfall 7); deprecated Outlook `/0/` URL path
**Research flag:** CSP `blob:` check needed before shipping — verify existing nonce headers allow `blob:` downloads on Vercel production

### Phase 4: Form Redesign (Schema + UX)
**Rationale:** Schema audit must precede UI changes to prevent silent field loss. The form redesign is independent of Phases 3 and can run in parallel. This is the highest-risk phase due to React Compiler honeypot timing concerns and the breadth of change (7 components).
**Delivers:** Seven redesigned forms with dropdowns/checkboxes for fixed-choice fields, inline blur-triggered validation via RHF, and verified Notion field alignment
**Addresses:** Silent data loss from schema mismatches; inline validation UX; dropdown/checkbox inputs; `react-hook-form` adoption
**Uses:** `react-hook-form@^7.72.0` + `@hookform/resolvers@^5.2.2` (only new packages in this milestone)
**Avoids:** React Compiler honeypot timing (Pitfall 3); Zod schema mismatch silent loss (Pitfall 4); honeypot removal during redesign (Pitfall 5)
**Research flag:** React Compiler interaction with `loadTime.current` needs manual end-to-end test after each form is redesigned — not resolvable by static analysis

### Phase 5: Admin Polish + 404 Illustration
**Rationale:** Fully independent of all other phases. Zero breaking risk. Can slot in anywhere after Phase 1. Grouped together because both are cosmetic/UX with no shared dependencies on other milestone phases.
**Delivers:** Admin revalidation with per-button loading states and 401 key-rotation redirect; branded circuit-board 404 illustration with CSS animation
**Addresses:** Admin revalidation UX (per-action states, 401 auto-redirect); custom 404 page SVG illustration
**Avoids:** Lottie/Canvas on 404 (use inline SVG + CSS keyframes); React Toastify bloat (use inline state or `sonner` 3kb)
**Research flag:** Standard patterns — skip research phase

### Phase Ordering Rationale

- Phase 1 before Phase 2: `useScrollReveal` deps fix and `handleApiError` are both shared dependencies with no workaround
- Phase 2 before further phases: Establishes that existing GSAP + filter architecture is stable before adding more client complexity
- Phase 3 can overlap Phase 4: The two feature areas (events, forms) touch disjoint parts of the codebase
- Phase 5 any time after Phase 1: Admin and 404 have zero dependencies; they can be built in parallel with any other phase

### Research Flags

**Phases needing deeper research or verification during planning:**
- **Phase 3:** CSP `blob:` allowance on Vercel production — check `middleware.ts` / `next.config.ts` before building ICS download; if blocked, pivot to API route (already designed in FEATURES.md)
- **Phase 4:** React Compiler interaction with `useRef` timing in form components — requires manual test harness after each form redesign; not a design-time decision but a build-time verification requirement

**Phases with well-documented standard patterns (skip research-phase):**
- **Phase 1:** `popstate` listener pattern and `useScrollReveal` deps extension are documented in GSAP + Next.js official sources
- **Phase 2:** Filter bug fix is a direct application of Phase 1 changes; `handleApiError` is a simple utility extraction
- **Phase 5:** Admin UI state machine and SVG illustration are well-understood, zero-dependency patterns

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | react-hook-form v7.72.0 and @hookform/resolvers v5.2.2 verified against npm registry and GitHub releases; React 19 compatibility confirmed; Zod v4 import path caveat documented with workaround |
| Features | HIGH | Priority ordering derived from direct dependency analysis; calendar URL formats verified against IDF official docs and RFC 5545; inline validation timing validated by Baymard + NN/g research |
| Architecture | HIGH | Based on direct codebase analysis (not training data); component boundaries, file paths, and interface shapes verified against actual source files |
| Pitfalls | HIGH | All critical pitfalls verified against codebase (`CONCERNS.md`) + official sources (GSAP docs, Next.js GitHub issues); phase mapping explicit |

**Overall confidence:** HIGH

### Gaps to Address

- **Filter state — URL params vs local state:** FEATURES.md recommends `nuqs` for shareable filtered URLs; ARCHITECTURE.md recommends staying with `useState` to avoid server round-trips. Both positions are well-reasoned. This is a product decision, not a technical one — resolve in requirements by asking whether shareable filtered URLs are a stated user need.

- **`nuqs` package adoption:** If URL params are chosen for filter state, `nuqs` requires a `<NuqsAdapter>` wrapper in `layout.tsx` — a one-time setup cost. If local state is kept, `nuqs` is not needed. The decision gates which approach is implemented in Phase 2.

- **Notion event fields existence:** `registrationLink`, `moreInfoLink`, `recapLink` need to exist as Notion database properties before Phase 3 can ship to production. Architecture research confirms these are absent from the current `SAGIEEvent` interface. Verify whether these Notion properties already exist in the database (they may exist but not be mapped) or need to be created.

- **CSP blob: allowance:** Cannot be verified until the current CSP headers are inspected at build time. Low-cost to check; potentially requires an API route pivot if `blob:` is disallowed.

---

## Sources

### Primary (HIGH confidence)

- Next.js 16.2.1 official docs — `router.refresh()` behavior, `not-found.tsx` API, `useSearchParams` — verified 2026-03-28
- GSAP React docs (gsap.com/resources/React/) — `useGSAP`, `ctx.revert()`, ScrollTrigger cleanup patterns
- IDF Add-to-Calendar docs (interactiondesignfoundation.github.io) — Google Calendar, Outlook Live, Outlook 365 URL formats
- RFC 5545 iCalendar VEVENT spec (icalendar.org) — ICS format for `.ics` generation
- react-hook-form GitHub releases — v7.72.0 React 19 compatibility confirmed
- Direct codebase analysis: `src/` files, `.planning/codebase/` audit docs

### Secondary (MEDIUM confidence)

- nuqs.dev documentation + GitHub (47ng/nuqs) — `useQueryState` API, Next.js App Router adapter
- ziyili.dev — `router.refresh()` vs `revalidatePath` for navigation bug
- @hookform/resolvers GitHub issues #799, #813 — Zod v4 `zod/v4` import path edge case

### Tertiary (LOW confidence)

- Google Calendar URL parameters — cross-referenced from multiple blog sources; official Google Calendar API docs differ from web URL approach but consistent across community docs
- React Compiler purity behavior with `useRef` — inferred from compiler documentation; no official statement on this specific pattern

---

*Research completed: 2026-03-28*
*Ready for roadmap: yes*
