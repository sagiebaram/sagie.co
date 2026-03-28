# Stack Research

**Domain:** Next.js 16 community/marketing site — v2.0 Polish milestone
**Researched:** 2026-03-28
**Confidence:** HIGH (verified against live Next.js 16.2.1 docs, GitHub issues, npm registry)

---

## Summary of New Additions

This is a brownfield site with a mature stack. The v2.0 milestone adds five capability areas. For four of them, **no new npm packages are required** — solutions are architectural. One area (ICS file generation) benefits from a tiny zero-dependency utility, and one (form redesign) benefits from react-hook-form for controlled inline validation ergonomics.

---

## Recommended Stack

### New Packages

| Package | Version | Purpose | Why |
|---------|---------|---------|-----|
| `react-hook-form` | `^7.72.0` | Form state + inline validation | Eliminates manual `useState` per-field + `setErrors` pattern. Uncontrolled-by-default = better perf. `register` API requires zero changes to existing `FormField` wrapper. React 19 compatible. |
| `@hookform/resolvers` | `^5.2.2` | Zod v4 resolver for RHF | Bridges existing Zod v4 schemas to RHF validation. Officially supports `zod/v4` as of v5.1.0. |

> **No other new packages are needed.** The remaining four feature areas are solved architecturally with existing stack capabilities.

### Existing Capabilities Used (No New Packages)

| Capability | Mechanism | Notes |
|------------|-----------|-------|
| Filter state bug fix | Remove `useScrollReveal` from filtered containers; apply `AnimatePresence` + `motion.div` (already installed) | Root cause is GSAP context revert racing with re-render |
| Back/forward nav fix | `router.refresh()` on `popstate` via `useEffect` listening to `usePathname` | Uses `useRouter` + `usePathname` from `next/navigation` — already available |
| Calendar link generation | Pure string construction in a utility function | Google/Outlook/Office365 use URL parameters; Apple/ICS use a browser Blob download |
| .ics file download | Browser `Blob` + `URL.createObjectURL` in a client component | iCalendar format is a plain-text spec; no library required for single-event generation |
| Add to Calendar modal | `useState` + `AnimatePresence` (`motion` already installed) | Modal open/close state; no dialog library needed |
| Rate limit feedback | Detect HTTP 429 in existing `handleSubmit` try/catch; set error state | Pattern already exists for other errors |
| Revalidation UI feedback | `useState` for loading/success/error; color-coded result text already partially implemented | The admin page already has basic result display; needs per-button status |
| Custom 404 illustration | Inline SVG in `not-found.tsx` | File already exists with a placeholder SVG; replace with branded illustration |
| Inline form validation | RHF `formState.errors` + `trigger()` on blur | Replaces manual `validate()` + `setErrors()` |

---

## Installation

```bash
# New runtime dependencies only
npm install react-hook-form @hookform/resolvers
```

---

## Architecture Notes per Feature Area

### 1. Filter State Bug (Blog, Solutions, Resources)

**Root cause confirmed:** All three filter components (`BlogFilter`, `SolutionsFilter`, `ResourceFilter`) use `useScrollReveal` with a `selector` targeting child card elements (`.post-card`, `.dir-card`). When filter state changes via `useState`, React re-renders, keeping the container DOM node stable. GSAP's `ctx.revert()` cleanup from `useLayoutEffect` fires, resetting card opacity to `0`. The new children have no animation applied until the next scroll event triggers the `ScrollTrigger` — which may never fire if the user is already scrolled past the threshold.

**Fix — no new packages:**
- Remove the `gridRef` / `useScrollReveal` from the filtered list container entirely for filter components. Filtered lists do not need scroll-reveal (user is already on-page when filter is applied).
- Replace entrance animation for initial page load with a one-time `useEffect` that runs only on mount (empty dep array), using `gsap.fromTo` without a `ScrollTrigger`.
- For filter transitions, use `AnimatePresence` + `motion.div` wrapping each card with a short `opacity` fade — `motion` is already installed.

**Back/forward nav bug:**
- This is the App Router's client-side router cache serving stale RSC payloads on history pop.
- Fix: In `layout.tsx` or a shared `NavigationRefresh` client component, call `router.refresh()` inside a `useEffect` that watches `usePathname`. On every path change (which includes popstate), this busts the client cache for the current route.
- Source: Next.js 16.2.1 docs confirm `router.refresh()` "makes a new request to the server... The client will merge the updated RSC payload without losing unaffected client-side React state."
- Caveat: Adds a round-trip on every navigation. Scope to affected routes only if performance matters.

### 2. Calendar Integration

**Google Calendar URL (HIGH confidence — documented):**
```
https://www.google.com/calendar/render?action=TEMPLATE
  &text={title}
  &dates={YYYYMMDDTHHMMSSZ}/{YYYYMMDDTHHMMSSZ}
  &details={description}
  &location={location}
```

**Outlook Live URL (HIGH confidence — verified via IDF docs):**
```
https://outlook.live.com/calendar/deeplink/compose
  ?path=/calendar/action/compose
  &rru=addevent
  &subject={title}
  &startdt={YYYY-MM-DDTHH:mm:SSZ}
  &enddt={YYYY-MM-DDTHH:mm:SSZ}
  &body={description}
  &location={location}
```

**Office 365 URL:** Same parameters, base URL is `https://outlook.office.com/calendar/deeplink/compose`.

**Apple Calendar + Generic ICS download:**
Apple Calendar does not support a web URL for adding individual events. The correct approach is a `.ics` file download using the browser Blob API. This also serves Outlook desktop, Yahoo, and any other standards-compliant calendar client.

```typescript
// Pure client-side, no library needed
function downloadICS(event: { title: string; start: Date; end: Date; description?: string; location?: string }) {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SAGIE//EN',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(event.start)}`,
    `DTEND:${fmt(event.end)}`,
    `SUMMARY:${event.title}`,
    event.description ? `DESCRIPTION:${event.description}` : '',
    event.location ? `LOCATION:${event.location}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'event.ics'
  a.click()
  URL.revokeObjectURL(a.href)
}
```

**Modal:** Use `useState(false)` + `AnimatePresence` with `motion.div` for the overlay. Four buttons: Google, Outlook, Apple/ICS, Office 365. No new component library needed.

### 3. Form Redesign (Dropdowns, Checkboxes, Inline Validation)

**Problem with current approach:** Manual `validate()` function runs only on submit. `setErrors` state is a plain `Record<string, string>`. Adding 10+ fields per form means 10+ `useState` entries and a verbose validate function.

**Recommended approach: react-hook-form + existing Zod schemas**

- `react-hook-form` v7.72.0 (React 19 compatible, 7 days ago on npm as of research date)
- `@hookform/resolvers` v5.2.2 with `zodResolver` — bridges existing Zod v4 schemas
- The existing `FormField` component is a thin wrapper; `register` replaces `onChange`/`value` props with a spread
- Inline validation via `trigger(fieldName)` on `onBlur` — fires per-field, not on submit
- Checkboxes: native `<input type="checkbox">` with `register` — no library needed for single-select checkboxes
- Custom dropdowns (styled select): the existing `<select>` approach in `FormField` continues to work; RHF handles controlled selects natively

**Zod v4 + RHF compatibility note (MEDIUM confidence):** Open GitHub issues (March 2025) show TypeScript type errors with `zod/v4` imports + `zodResolver`. The workaround is importing from `zod` (the v4 shim) rather than `zod/v4`. Since the project already imports from `zod` in all schemas, this is not a practical concern.

**Rate limit feedback (429):** In the RHF `handleSubmit(onSubmit)` pattern, catch the 429 response in the submit handler and call `setError('root', { message: 'Too many requests. Please wait a moment.' })`. Display `formState.errors.root?.message` prominently above the submit button.

### 4. Custom 404 Illustration

No new packages. The `not-found.tsx` already has an inline SVG. The task is to replace the placeholder crosshair SVG with a more elaborate branded illustration using inline SVG and Tailwind CSS classes. The existing file uses `className` and CSS custom properties (`var(--silver)`, `var(--border-subtle)`) — these continue to work.

Recommended approach: single `<svg>` with circuit-board-style paths matching the site's `CircuitBackground` visual language, animated with CSS `@keyframes` in `globals.css` or a `<style>` tag (no JS animation needed for a 404 page).

### 5. Revalidation UI Feedback

No new packages. The existing admin page already uses `useState` for `result` and `loading`. The fix is:
- Per-button loading state (currently a single global `loading` boolean)
- Success/error visual differentiation already exists (`text-green-400` / `text-red-400`)
- Key rotation redirect fix: on 401 response from `/api/revalidate`, redirect to the secret entry screen (`setSecretEntered(false)`) instead of showing a generic error

---

## Alternatives Considered

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| react-hook-form | Custom `useState` validation (current) | Current pattern doesn't scale past 6 fields; inline validation requires `onBlur` handlers on every field manually |
| react-hook-form | Formik | Larger bundle, slower than RHF, less idiomatic with React 19 concurrent features |
| Inline SVG ICS generation | `ical-generator` npm package | Package is 692KB unpacked; for single-event generation, 15 lines of string concatenation is sufficient and adds zero bundle weight |
| `ical-generator` npm package | `ics` npm package | Both are viable for server-side ICS generation if needed later; inline approach is preferred for client-side modal download |
| `AnimatePresence` (existing `motion`) | New animation library | `motion` already in package.json; no new dep needed |
| `router.refresh()` on pathname change | Disable client-side caching globally (`staleTimes: 0`) | Global cache disable impacts all routes; per-path refresh is more surgical |

---

## What NOT to Add

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `shadcn/ui` or `Radix UI` | Heavy for what's needed: a few dropdowns and checkboxes. Adds a component layer that conflicts with existing inline-style + Tailwind mixed approach | Native `<select>`, `<input type="checkbox">` with RHF `register` |
| `react-datepicker` | No date picker needed in forms; event dates come from Notion | Nothing |
| `@headlessui/react` | Only needed if building fully custom dropdown menus with keyboard nav; forms here use `<select>` | Native `<select>` |
| `date-fns` or `luxon` | Not needed for ICS generation; `Date.toISOString()` + string replace is sufficient for UTC timestamps | Native `Date` API |
| `react-modal` or `@radix-ui/dialog` | Add to Calendar modal is simple open/close with no focus-trap requirements for this use case | `useState` + `AnimatePresence` |
| `next-auth` | Out of scope; no auth in this milestone | — |

---

## Version Compatibility

| Package | Requires | Notes |
|---------|---------|-------|
| `react-hook-form@^7.72.0` | React 19+ | Verified compatible; React 19 discussion thread resolved |
| `@hookform/resolvers@^5.2.2` | `zod@^3.25.0` or `^4.0.0` | Project uses `zod@^4.3.6`; import from `zod` not `zod/v4` to avoid current TS edge cases |
| `motion@^12.38.0` (existing) | React 19 | Already installed; `AnimatePresence` works in client components |

---

## Sources

- [Next.js 16.2.1 useRouter docs](https://nextjs.org/docs/app/api-reference/functions/use-router) — `router.refresh()` behavior confirmed, version 16.2.1, updated 2026-03-25
- [IDF add-event-to-calendar-docs — Outlook Web](https://interactiondesignfoundation.github.io/add-event-to-calendar-docs/services/outlook-web.html) — Outlook Live URL format, parameters verified HIGH confidence
- [Vercel blog — Common App Router mistakes](https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them) — revalidation patterns
- [ziyili.dev — Fix Next.js caching bug](https://www.ziyili.dev/blog/fix-nextjs-caching-bug) — router.refresh() vs revalidatePath for nav bug, MEDIUM confidence
- [GSAP docs — React & GSAP](https://gsap.com/resources/React/) — context revert behavior with re-renders, HIGH confidence
- [react-hook-form GitHub releases](https://github.com/react-hook-form/react-hook-form/releases) — v7.72.0 confirmed current (2026-03-21)
- [@hookform/resolvers — Issue #799, #813](https://github.com/react-hook-form/resolvers/issues/799) — Zod v4 compatibility status, MEDIUM confidence
- [ical-generator npm](https://www.npmjs.com/package/ical-generator) — v8.1.1, 692KB unpacked, LOW complexity alternative
- [WebSearch: Google Calendar URL parameters](https://www.emailmavlers.com/blog/how-to-create-add-to-calendar-link-in-email/) — verified against multiple sources, MEDIUM confidence
- [react-hook-form/react-hook-form — React 19 discussion #11832](https://github.com/orgs/react-hook-form/discussions/11832) — React 19 compatibility confirmed

---

*Stack research for: sagie.co v2.0 Polish milestone*
*Researched: 2026-03-28*
