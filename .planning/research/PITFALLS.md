# Pitfalls Research

**Domain:** Next.js App Router — adding filter fix, navigation fix, calendar modal, form redesign, 404 illustration to brownfield community site
**Researched:** 2026-03-28
**Confidence:** HIGH (all critical pitfalls verified against codebase + official sources)

---

## Critical Pitfalls

### Pitfall 1: Back/Forward Navigation Blanks Because Next.js Sends `no-store` Cache-Control on HTML

**What goes wrong:**
Browser back and forward buttons produce a blank or partially-rendered page until the user manually refreshes. This is the existing reported bug. The root cause is Next.js's default `Cache-Control: no-store` header on HTML responses, which disqualifies pages from the browser's native back/forward cache (bfcache). When the browser tries to restore the page from bfcache it finds the page ineligible, re-fetches from the network, and the React hydration cycle races with the navigation animation — producing a visible blank state.

**Why it happens:**
Next.js App Router sends `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` on HTML page responses by default. This is correct for preventing stale HTML being served from intermediary proxies, but it also blocks bfcache in all major browsers. When navigation pops the history stack, the browser cannot restore the frozen page snapshot — it must fully re-navigate, which re-runs server components, re-hydrates, and re-runs GSAP ScrollTrigger setup. Any async step in that chain that hasn't resolved before paint leaves a blank.

**How to avoid:**
The fix has two parts. First, intercept the `popstate` event in a top-level client component (or in `app/layout.tsx` using a `useEffect`) and call `router.refresh()` only if the page was previously exiting a stale state — this forces a fresh server component render rather than relying on the broken cached snapshot. Second, do NOT add `router.refresh()` naively on every `popstate` because it triggers a full server re-render on every back press, killing performance.

The correct pattern used by the community:
```typescript
// In a client component mounted in layout.tsx
useEffect(() => {
  const handlePop = () => router.refresh()
  window.addEventListener('popstate', handlePop)
  return () => window.removeEventListener('popstate', handlePop)
}, [router])
```

Verify whether the blank is caused by GSAP ScrollTrigger scroll positions persisting from the previous page scroll before blaming the router cache — both can produce visually blank results.

**Warning signs:**
- Pages load fine on direct URL navigation but go white on back-press
- Content appears after a manual refresh
- Browser DevTools shows the HTML request was re-fetched (not served from disk cache) on back-navigation
- GSAP ScrollTrigger console warnings about stale trigger points

**Phase to address:** Phase 1 (navigation rendering bug fix)

---

### Pitfall 2: GSAP `useScrollReveal` Stale Triggers After Filter Change

**What goes wrong:**
After a filter button is clicked, new items render but the GSAP reveal animation does not fire. Items appear fully visible (already played) or fully invisible (pinned at start state, opacity 0) and never animate. This is the existing filter state bug. The root cause is that GSAP's `ScrollTrigger` caches DOM positions on first mount. When the filter changes the DOM contents — hiding some cards, showing new ones — the cached scroll positions no longer correspond to real element positions, so triggers fire at the wrong scroll offsets or not at all.

**Why it happens:**
The `useScrollReveal` hook is called with a `selector` string (e.g., `'.dir-card'`). If the ref is attached to a wrapper div, GSAP queries for `.dir-card` children at mount time and creates trigger instances with fixed scroll positions. When React re-renders with new filtered data (without unmounting the wrapper), GSAP still holds references to the old trigger instances. The new elements match the same CSS class but their trigger instances were never created; old stale triggers point to DOM nodes that may have been removed.

**How to avoid:**
Two complementary strategies. First, pass the active filter value as a dependency to `ScrollTrigger.refresh()` — call it in a `useEffect` that fires when `active` filter state changes. Second, in `useScrollReveal`, return a cleanup function that kills all ScrollTrigger instances (`ScrollTrigger.getAll().forEach(t => t.kill())`) before the hook re-runs. Use the `@gsap/react` `useGSAP` hook instead of raw `useEffect` for this — it handles cleanup automatically with its context system.

Avoid putting a `key` prop on the filter wrapper to force a full React unmount/remount — this causes the hero animation to replay on every filter click, which is jarring.

**Warning signs:**
- Cards appear but no entrance animation plays
- Cards appear permanently hidden (opacity 0 from the initial animation state)
- Console shows GSAP warnings about triggers attached to elements that are no longer in DOM
- Filter works correctly on first page load but breaks on second filter selection (matches the reported bug: "second filter selection wipes rendered components until refresh")

**Phase to address:** Phase 1 (filter state bug fix)

---

### Pitfall 3: React Compiler (babel-plugin-react-compiler) Breaking Form Event Handler Timing

**What goes wrong:**
After form redesign adds `useState` for dropdowns, checkboxes, or multi-step state, the React Compiler's automatic memoization may skip re-renders that the form logic depends on. Specifically: `onChange` handlers that read from a ref (like `trapRef.current` or `loadTime.current`) while also updating state may have their timing altered. The symptom is subtle: the honeypot or timing check fires incorrectly (legitimate fast submissions get silently accepted as bot-filled, or bot submissions get through).

**Why it happens:**
The project runs `babel-plugin-react-compiler` (confirmed in STACK.md). The compiler optimizes based on purity assumptions. The existing forms use a pattern where `loadTime.current = Date.now()` is set during initial render and read during submit — this is an imperative pattern that reads mutable state captured in a closure. The compiler may optimize away what it considers a "pure" re-render path, altering when `loadTime.current` is first assigned relative to the first render committed to the DOM. If the assignment is delayed, the timing diff sent to the server (`Date.now() - loadTime`) will be smaller than expected and the 3-second threshold check (`elapsed < 3000`) will reject legitimate submissions.

**How to avoid:**
Keep `loadTime.current = Date.now()` in a `useEffect` with an empty dependency array (not inline during render) to make it compiler-safe. This guarantees it fires after the first commit, not during the render phase. Verify the honeypot and timing protection still work end-to-end after any form redesign with a manual test: submit immediately after page load (should silently accept), submit after 3+ seconds (should go through to the API).

**Warning signs:**
- Forms submit successfully in development but silently fail in production after redesign
- The `_t` timestamp in POST body is significantly smaller than expected
- React Compiler diagnostic output shows the form component was optimized

**Phase to address:** Phase 3 (form redesign)

---

### Pitfall 4: Zod Schema / Client Field Mismatch — Silent Data Loss

**What goes wrong:**
Form redesign adds new fields (e.g., checkboxes for `category`, dropdown for `tier`) but the corresponding Zod schema in `src/lib/schemas.ts` is not updated, or fields are renamed on the client without updating the schema key names. The server silently drops the new field because `schema.safeParse()` strips unknown keys by default. Notion receives the submission with the new field missing. No error is thrown — the form shows success. Admins see incomplete entries in Notion.

**Why it happens:**
Zod schemas use `z.object()` which strips unknown properties by default (equivalent to `.strip()`). If a client sends `{ category: ['Founder'] }` but the schema expects no `category` field (or expects a string), the parse succeeds with the field omitted. The existing codebase already has this problem: PROJECT.md explicitly notes "some silently drop fields due to schema mismatches." Adding more fields during redesign multiplies the risk.

**How to avoid:**
Maintain a strict 1:1 mapping rule: every new form field gets a schema entry before the field is built. When renaming fields, update the schema first, then the client. After adding any field, manually inspect the Notion entry after a test submission — don't rely on the API returning 200 as proof the field landed.

For the `category` array field in `MembershipSchema` (already defined as `z.array(z.enum([...]))`), verify the client sends an actual array, not a comma-separated string. The `FormField` component's `type="select"` currently returns a string, not an array — this mismatch already exists and redesign must not assume it is fixed without explicit code change.

**Warning signs:**
- Notion entries show empty fields after form redesign
- API returns 200 but Notion properties are `null`
- `console.log(result.data)` in the route handler shows expected fields as undefined

**Phase to address:** Phase 3 (form redesign) — schema changes must happen before or alongside field changes, never after

---

### Pitfall 5: Honeypot Field Broken by DOM Reordering During Form Redesign

**What goes wrong:**
The redesigned form breaks bot protection because the honeypot `<input type="text" name="_trap">` is rendered conditionally, repositioned in the JSX, or accidentally removed during a copy-paste refactor. The server's `withValidation` middleware checks `body._trap` — if the field is missing from the POST body entirely (not just empty), the middleware skips the check and the honeypot provides no protection.

Separately: if the redesign wraps inputs in a `<form>` element with `onSubmit` instead of the current `onClick` pattern, `<input type="hidden" name="_t">` will be included in `FormData` but NOT in the manually-constructed JSON body — causing `body._t` to be undefined on the server, making `elapsed = Date.now() - 0 = large number`, and the timing check always passes regardless of how fast the bot submits.

**Why it happens:**
The current forms bypass native form submission entirely — they use `onClick` on a `<button>` and manually serialize `{ ...fields, _trap: trapRef.current, _t: loadTime.current }`. The redesign may switch to a `<form onSubmit>` pattern for accessibility, which changes how the payload is assembled. `loadTime.current` must be explicitly included in the JSON body in both patterns.

**How to avoid:**
Keep the JSON serialization layer explicit. Do not rely on `FormData` or native form serialization to include `_trap` and `_t`. Verify both fields appear in the request payload (check Network tab in DevTools) after any form structure change. Add a server-side log or Sentry breadcrumb that records whether `_t` is present in each submission.

**Warning signs:**
- `_trap` absent from POST body in Network tab
- `_t` value is 0 or undefined in POST body
- Rate of bot submissions increases after form redesign

**Phase to address:** Phase 3 (form redesign)

---

### Pitfall 6: Calendar URL Generation — Timezone and Date Format Errors

**What goes wrong:**
The "Add to Calendar" modal generates URLs that create events at the wrong time. The most common failure mode: a SAGIE event stored in Notion as a plain date string (e.g., `"2026-04-15"`) with no time component is passed directly to Google Calendar's `dates` parameter, producing an all-day event that shows up on the correct date in one timezone but one day earlier or later in another. The secondary failure: events with a time component use a static UTC offset (e.g., `+03:00`) instead of an IANA timezone identifier, which fails to account for daylight saving transitions.

**Why it happens:**
The `SAGIEEvent` type stores `date: string | null` and `time: string | null` as separate fields (confirmed in `src/lib/events.ts`). The date is a Notion `date.start` property which returns ISO 8601 (`YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ss.sssZ`) but without timezone context. If you concatenate date + time naively and pass to `new Date()`, JavaScript interprets `YYYY-MM-DD` as UTC midnight, not local midnight — causing a day offset for users west of UTC.

Google Calendar's `dates` parameter requires `YYYYMMDDTHHmmssZ` (UTC) or `YYYYMMDDTHHMMSS` (no timezone = floating local time). Outlook uses ISO 8601 with optional trailing `Z`. Apple Calendar (via `.ics`) uses `DTSTART` in iCalendar format with `TZID` property.

**How to avoid:**
Treat all event times as "floating" (no timezone) unless the event data explicitly includes a timezone identifier. For Google Calendar: omit the trailing `Z` and pass the raw local datetime as `YYYYMMDDTHHmmss` — this creates the event at that wall-clock time in the user's local calendar, which is almost always what community events intend. For all-day events (no time component): use the `YYYYMMDD/YYYYMMDD` format with the end date one day after start.

For `.ics` download: use `DTSTART;VALUE=DATE:YYYYMMDD` for all-day events. Do not attempt to include `TZID` unless the data source provides a proper IANA timezone — an incorrect TZID is worse than no TZID.

For the Outlook URL: use `startdt=YYYY-MM-DDTHH:mm:ss` without the trailing `Z` for floating time, or with `Z` for UTC-anchored events.

Always `encodeURIComponent()` every parameter value individually before appending to the URL. Special characters in event titles (ampersands, commas, parentheses) will break URL parsing if unencoded.

**Warning signs:**
- Calendar event appears one day off for users in US/EU timezones
- Event title containing `&` truncates at `&` in calendar app
- ICS file downloads but calendar app shows parsing error or empty event

**Phase to address:** Phase 2 (event action buttons)

---

### Pitfall 7: ICS File Download Blocked by CSP `blob:` Restriction

**What goes wrong:**
The `.ics` download works in development but is silently blocked in production on Vercel. The Content Security Policy configured in the project (confirmed in STACK.md: "CSP and security headers with nonces — v1.0") may not include `blob:` in the `default-src` or `object-src` directives. Browser-side ICS generation creates a `Blob`, generates a `URL.createObjectURL(blob)` URL, then programmatically clicks an `<a>` element — all of which requires `blob:` to not be blocked by CSP.

**Why it happens:**
`URL.createObjectURL` produces a `blob:` scheme URL. If the CSP header does not include `blob:` in `default-src` or explicitly in `connect-src`, the browser blocks the URL creation silently in some browsers (Firefox) or throws a SecurityError. The existing CSP headers likely cover standard cases and were not designed with blob downloads in mind.

**How to avoid:**
Inspect the current CSP configuration in `next.config.ts` or middleware. Add `blob:` to the relevant CSP directive before implementing the ICS download. Alternatively, serve the ICS file from a `/api/calendar/[id].ics` route — this avoids client-side blob creation entirely and makes the URL shareable, cacheable by the browser, and not dependent on client JS running successfully. The route approach also handles the case where JavaScript is disabled or the blob URL expires.

**Warning signs:**
- Download works in localhost but not on Vercel preview
- Browser console shows CSP violation report mentioning `blob:`
- The download link appears to work (no error shown to user) but no file is saved

**Phase to address:** Phase 2 (event action buttons)

---

### Pitfall 8: `useScrollReveal` Ref Attached to New Grid Wrapper Breaks GSAP Selector Scope

**What goes wrong:**
The filter bug fix or form redesign changes the DOM structure around components that use `useScrollReveal`. The hook receives a `selector` string and a `ref` — GSAP scopes its element query to the `ref` container. If the redesign wraps the filtered cards in an extra `<div>`, removes a wrapper, or changes the ref attachment point, GSAP finds zero elements matching the selector and silently skips animation. No error is thrown.

**Why it happens:**
The `useScrollReveal` hook (used in `BlogFilter`, `SolutionsFilter`, `EventAccordion`) queries descendants using `gsap.utils.toArray(selector, ref.current)`. If `ref.current` is null at the time of the `useEffect` run (because the element is conditionally rendered), or if the selector string no longer matches the rendered children (class name changed during redesign), the animation is a no-op.

**How to avoid:**
After any structural DOM change in a component that uses `useScrollReveal`, verify the ref is attached and the selector string matches the child elements. Add a `console.warn` inside `useScrollReveal` in development that fires when `gsap.utils.toArray(selector, ref.current).length === 0` — this surfaces the problem immediately during development.

**Warning signs:**
- Cards render but no entrance animation on filter-filtered content
- GSAP DevTools shows no triggers registered for the new component structure
- Removing the selector and using the whole container as the target reveals the animation was working all along

**Phase to address:** Phase 1 (filter fix) and Phase 3 (form redesign)

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Generate ICS client-side with Blob | No new API route needed | CSP violations in production; no shareable URL; breaks if JS fails | Only acceptable in dev; use API route in production |
| Store calendar link params in component state without memoization | Simple to implement | Re-renders modal on every parent state change, recalculating calendar URLs on every accordion toggle | Never — memoize with useMemo |
| Use `router.refresh()` on every popstate | Fixes blank page bug immediately | Full server re-render on every back-press; kills ISR performance; re-fetches all Notion data | Only as last resort; prefer targeted fix |
| Copy-paste existing form component for redesign | Fast starting point | Honeypot/timing fields easily dropped; diverging state logic across forms | Only if you diff against the original to verify protection fields are preserved |
| Hardcode UTC offset in calendar URLs | Simple to implement | Breaks for DST transitions; affects users in affected timezones after clock change | Never — use floating time (no Z suffix) instead |
| Inline SVG illustration as a large string in JSX | Simple to author | Bloats JS bundle; parsed by JS engine not HTML parser; no browser caching | Only for very small SVGs (< 500 bytes) |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Google Calendar URL | Use `new Date(dateStr).toISOString()` for the dates param — this converts to UTC, causing day-shift for non-UTC dates | Pass the date/time string directly as `YYYYMMDDTHHMMSS` without conversion if the source has no timezone |
| Outlook Calendar URL | Use `outlook.live.com/calendar/0/deeplink/compose` (outdated format with `/0/`) | Use `outlook.live.com/calendar/deeplink/compose` — the `/0/` segment was removed and breaks silently on some Outlook accounts |
| Apple Calendar / ICS | Generate ICS in a `useEffect` or event handler with `document` access | Never generate ICS during SSR (server render has no `document`); guard with `typeof window !== 'undefined'` or use an API route |
| Notion date fields | Treat `date.start` as a wall-clock date string without timezone | Notion `date.start` for date-only properties returns `YYYY-MM-DD` in UTC midnight; for datetime it returns ISO 8601 with timezone offset — handle both formats |
| `withValidation` middleware | Add new optional fields to the Zod schema as `.optional()` only | Also check whether the Notion write handler maps the new field to the correct property key; schema-valid data that is not mapped to Notion is silently lost |
| CSP nonces in Next.js | Add `blob:` to CSP via a static string in next.config | The existing project uses nonces (confirmed in codebase); CSP modifications must go through the same nonce/header mechanism to avoid invalidating the existing nonce system |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Recalculating all three calendar URLs (Google + Outlook + Apple) on every accordion open | Modal is instantaneous on first open; TTFB is fine; but profile shows wasted CPU on fast re-opens | `useMemo` the URL generation keyed on `event.id` | At scale this is negligible; but bad practice that causes confusion during debugging |
| Inline CSS animation on SVG illustration using `@keyframes` in JSX style tags | Works in development; layout may flash on first paint | Use a `<style>` tag inside the SVG element itself or a CSS module; avoid inline `style={{ animation: ... }}` which re-applies on every render | Every render |
| SVG with hundreds of path nodes as inline JSX | Slow parse; large HTML payload; noticeable on mobile | Keep 404 illustration under 2KB uncompressed; use SVGO to clean paths; do not import from Figma without cleanup | Illustrations above ~5KB path data |
| ScrollTrigger calling `refresh()` on every filter click | One extra `refresh()` call per filter is fine | If refresh is called in a `useEffect` with no dependencies (or wrong ones), it fires on every render cycle | Every render, cascading with React batching |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Removing or reordering the `_trap` honeypot field during form redesign | Bot protection bypassed; spam submissions reach Notion and trigger admin emails | Treat `_trap` and `_t` as sacred — do not touch them during redesign; add a lint rule or test assertion that verifies both fields appear in every POST |
| Adding `blob:` to CSP `default-src` globally instead of scoping it | Marginally expands attack surface | Scope to `object-src blob:` or use the API-route ICS approach instead |
| Exposing the `REVALIDATE_SECRET` in a client-side calendar URL or form field | Attacker can trigger arbitrary cache invalidation | The revalidation page already guards the secret client-side; ensure form redesign does not accidentally include env vars in hidden fields |
| Calendar links with unencoded user-controlled data (event name/description from Notion) | Malicious Notion content injects arbitrary URL parameters | `encodeURIComponent()` every calendar parameter value individually; do not construct calendar URLs by string concatenation without encoding |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Showing the "Add to Calendar" modal for events with no confirmed date | User adds a placeholder event with a wrong/empty date to their calendar | Gate the calendar button behind `event.status === 'Confirmed'` — already partially done in the existing code, but verify date is non-null before generating URLs |
| Rate limit feedback with only a technical message ("429 Too Many Requests") | User doesn't know when they can try again | Read the `Retry-After` header from the 429 response (already set by `withValidation`) and display "Please wait X more minutes" |
| Inline validation that fires on first keystroke (before user has finished typing) | Constant red error state while typing email address | Validate on blur, not on change; only re-validate on change after the first submit attempt (the existing `errors` state pattern supports this — only show errors after `handleSubmit` runs) |
| Form dropdown select using `<select>` with default browser styling | Visually inconsistent with the site's design system | Use a custom `<button>` + `<ul>` dropdown with keyboard navigation, or a styled native `<select>` using CSS appearance: none — the existing `FormField` type="select" already uses native select; ensure it is styled to match the new design, not replaced with an unstyled raw element |
| Redesigned form that removes the existing `role` field (currently `type="select"`) without updating the Notion write handler | Role always written as empty string to Notion | Check each form's Notion write handler against the final field list after redesign |

---

## "Looks Done But Isn't" Checklist

- [ ] **Navigation fix:** Verify the blank-page bug is gone in Chrome, Firefox, and Safari — each handles bfcache differently; Safari is most aggressive about bfcache eligibility
- [ ] **Filter fix:** Confirm second filter selection works (the specific reported bug), AND that switching back to "All" reveals all items with animation
- [ ] **Calendar modal — Google:** Open the generated URL on mobile — Google Calendar mobile web has different URL handling than desktop; test the URL on both
- [ ] **Calendar modal — Outlook:** Test against both `outlook.live.com` (personal) and `outlook.office.com` (Microsoft 365 business) — some accounts only have one
- [ ] **Calendar modal — ICS download:** Verify the downloaded `.ics` file opens correctly in macOS Calendar, iOS Calendar, and Outlook for Windows — all parse the format slightly differently
- [ ] **Form redesign — honeypot:** After redesign, check that the `_trap` hidden input is present in the rendered DOM (inspect element) and that `_t` appears in the POST body in Network tab
- [ ] **Form redesign — Zod schema:** Submit the redesigned form and inspect the Notion page created — verify every new field appears with the expected value, not null
- [ ] **Rate limit feedback:** Trigger a 429 by submitting 6 times in 10 minutes; verify a human-readable message with retry time appears (not just the button disabling)
- [ ] **404 page — SVG:** Open the 404 page with JavaScript disabled — the existing SVG illustration in `not-found.tsx` is already inline, but verify it still renders and is accessible; the `aria-hidden="true"` on the wrapper is correct for decorative SVGs
- [ ] **Revalidation UI:** After clicking a revalidate button, navigate to the affected content page and verify the cache was actually busted — the UI showing "Revalidated: notion:blog" does not guarantee the cache cleared; test with a real Notion update

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Schema mismatch causing silent field loss (already in production) | MEDIUM | Audit Notion database for entries with missing fields; add the missing schema entries; re-test all forms; consider a server-side log that alerts when known fields are absent from parsed data |
| Honeypot removed during redesign (spam reaching Notion) | MEDIUM | Restore `_trap` and `_t` fields in the form; purge spam entries from Notion manually; rate limiting already provides a second layer of protection |
| Calendar URLs with wrong timezone (events showing on wrong day) | LOW | Update the URL generation function; no data is stored, so no migration needed; users who already added the event to their calendar will need to re-add |
| bfcache blank page persists after popstate fix | MEDIUM | Add `export const dynamic = 'force-dynamic'` to affected page files as a nuclear option — this forces server-side render on every navigation but eliminates the blank-page race condition; profile the performance cost before shipping |
| ICS blob URL blocked by CSP in production | LOW | Switch to API route pattern for ICS generation — 1 hour of work, fully backwards compatible |
| React Compiler breaks form timing protection | HIGH | Add `'use no memo'` directive to affected form component files temporarily; file issue against the compiler; restore manual `useRef` pattern as the primary defense |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Back/forward blank page (bfcache + popstate) | Phase 1: Navigation fix | Test back button in 3 browsers after fix; blank page no longer appears |
| GSAP ScrollTrigger stale after filter change | Phase 1: Filter fix | Second filter selection shows cards with animation; switching back to All restores full list |
| GSAP ref/selector mismatch from DOM changes | Phase 1 + Phase 3 | ScrollReveal fires on filtered results AND on redesigned form adjacent sections |
| React Compiler timing issue with honeypot | Phase 3: Form redesign | Immediate submission (< 3s) is silently accepted; POST body contains `_t` with correct timestamp |
| Zod schema / client mismatch | Phase 3: Form redesign | Every new field appears in Notion after test submission |
| Honeypot field survival through redesign | Phase 3: Form redesign | `_trap` and `_t` present in POST body (Network tab) after redesign |
| Calendar URL timezone / encoding | Phase 2: Event action buttons | Calendar events appear at correct local time in Google, Outlook, and Apple Calendar |
| ICS blob CSP violation | Phase 2: Event action buttons | ICS download works on Vercel production (not just localhost) |
| Outlook URL format (deprecated `/0/` path) | Phase 2: Event action buttons | Outlook URL opens a pre-filled new event form for both live.com and office.com accounts |
| Calendar links with unencoded Notion content | Phase 2: Event action buttons | Event names with special characters (`&`, `+`, `#`) produce valid URLs |

---

## Sources

- Next.js GitHub issue — bfcache ineligibility: https://github.com/vercel/next.js/issues/44477
- Next.js GitHub discussion — blank page on back navigation workaround: https://github.com/vercel/next.js/discussions/66925
- Next.js GitHub discussion — clearing client router cache: https://github.com/vercel/next.js/discussions/70786
- GSAP ScrollTrigger React state changes: https://gsap.com/community/forums/topic/39736-scrolltrigger-timeline-animation-and-react-state-changes/
- GSAP React advanced techniques (cleanup patterns): https://gsap.com/resources/react-advanced/
- Google Calendar URL parameter reference: https://interactiondesignfoundation.github.io/add-event-to-calendar-docs/services/google.html
- Outlook Live calendar URL format: https://interactiondesignfoundation.github.io/add-event-to-calendar-docs/services/outlook-web.html
- Google Calendar timezone requirements (IANA): https://www.codestudy.net/blog/list-of-acceptable-google-calendar-api-time-zones/
- Zod v4 breaking changes and migration: https://zod.dev/v4/changelog
- React Compiler purity assumptions and side effects: https://dev.to/usapopopooon/will-react-compiler-make-manual-memoization-obsolete-things-to-know-before-adopting-it-4ie9
- Codebase CONCERNS.md (existing fragile areas identified in audit): .planning/codebase/CONCERNS.md
- Codebase ARCHITECTURE.md (form submission flow, validation middleware): .planning/codebase/ARCHITECTURE.md

---

*Pitfalls research for: Next.js App Router v2.0 polish milestone — sagie.co*
*Researched: 2026-03-28*
