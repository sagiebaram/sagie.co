# Feature Landscape

**Domain:** Community/marketing site — filter UI, calendar integrations, form UX, admin feedback, error pages
**Researched:** 2026-03-28
**Project:** sagie.co v2.0 Polish & Interactivity

---

## Feature Area 1: Filter State Management (Blog, Solutions, Resources)

### Context

Current implementation uses `useState` in `BlogFilter` (and equivalent components) for `activeCategory` and `activeAuthor`. The bug: selecting a second filter wipes rendered components until refresh. Root cause is almost certainly a stale-render or hydration issue caused by local React state not surviving navigation events — `useState` resets on unmount/remount but can also cause partial re-render races when two state updates fire close together.

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Filters survive page refresh | Users share filtered URLs; team expects this behavior | Low | URL params only |
| Selecting one filter does not reset another | Core UX correctness | Low | The bug to fix |
| Filters reset to "All" on nav away | Clean state when visiting fresh | Low | Automatic with URL params |
| Active filter visually distinguished | Accessibility and clarity | Low | Already implemented |
| Zero-result state message | Users need feedback | Low | Already implemented |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Shareable filtered URL | User can send "Blog, Community category" link | Low | Free with URL params |
| Browser back/forward preserves filter state | Native navigation feels right | Low | Free with URL params |
| Debounced URL writes | No URL thrash on rapid clicks | Low | nuqs provides this out of box |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Global state manager (Zustand/Redux) for filters | 10x the complexity for a two-filter UI | URL params via nuqs |
| Server-side filtering (re-fetch on filter change) | Adds latency, Notion API rate limits | Client filter over prefetched data (current approach is correct) |
| Animated filter transitions | Nice-to-have, distracts from bug fix | Defer; current scroll-reveal is sufficient |

### Recommended Approach

Replace `useState` with `nuqs` `useQueryState`. The library is type-safe, mirrors `useState` API exactly, and solves the root bug: two independent `useQueryState` hooks update independently without triggering each other's re-renders. URL becomes the single source of truth, which also fixes back/forward navigation.

```
Installation: npm install nuqs
Wrap layout.tsx or the root layout with <NuqsAdapter> (Next.js App Router adapter built-in)
Replace: const [activeCategory, setActiveCategory] = useState('All')
With:    const [activeCategory, setActiveCategory] = useQueryState('category', { defaultValue: 'All', shallow: true })
```

Key nuqs behavior to understand:
- `shallow: true` — updates URL without triggering server re-fetch (correct for client-filtered lists)
- `history: 'push'` vs `'replace'` — use `'replace'` for filters so back button goes to the previous page, not a previous filter state
- Both filters update independently; nuqs batches URL writes internally

**Confidence: HIGH** — nuqs is used in production by Sentry, Supabase, Vercel, Clerk. Official docs at nuqs.dev.

### Dependencies on Existing Code

- `BlogFilter.tsx`, `SolutionsFilter` (equivalent), `ResourcesFilter` (equivalent) — all need `useState` replaced
- `layout.tsx` — needs `<NuqsAdapter>` wrapper once (one-time setup)
- No backend changes required

---

## Feature Area 2: Event Action Buttons (Register, Add to Calendar, More Info, Read Recap)

### Context

Events currently expand in an accordion. The expanded panel has no action buttons. The Notion data model for events likely includes: registration URL, event link, recap URL, date/time, location, description. The "Add to Calendar" button needs a modal with four options: Google Calendar link, Outlook (Live) link, Apple Calendar link (ICS download), and generic ICS download.

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Register button opens registration URL in new tab | Core event CTA | Low | Simple anchor with `target="_blank"` |
| Add to Calendar modal with Google option | Most common calendar for tech audience | Low | URL link, no backend needed |
| Add to Calendar with Outlook option | Enterprise/corporate users | Low | URL link, no backend needed |
| Add to Calendar with Apple/ICS download | iOS/macOS users | Medium | Requires ICS file generation |
| More Info button links to event detail URL | Users want full context | Low | Simple anchor |
| Read Recap button visible only for past/Complete events | Content discovery | Low | Conditional render based on event status |
| Buttons hidden/disabled when URLs not present in Notion | Graceful degradation | Low | Conditional render |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| ICS generated server-side as API route | Works for Apple Calendar deep-link | Medium | One `/api/events/[id]/ics` route |
| Timezone-aware calendar links | Events have global audience | Low | Include `ctz` param in Google link |
| Copy event link button in modal | Power-user convenience | Low | Clipboard API |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Third-party AddToCalendar.com embed/widget | External dependency, tracking, styling mismatch | Build the four links manually — it's ~20 lines of URL construction |
| "Add to Yahoo Calendar" option | Negligible audience, clutters UI | Stick to Google, Outlook, Apple + ICS |
| Reminder email signup in modal | Requires email capture without auth — out of scope | Link to Register or suggest-event form instead |

### Calendar Link Formats

**Google Calendar**
```
https://calendar.google.com/calendar/render?action=TEMPLATE
  &text={title}
  &dates={YYYYMMDDTHHmmssZ}/{YYYYMMDDTHHmmssZ}
  &details={description}
  &location={location}
  &ctz={timezone}
```
All-day events: use `YYYYMMDD/YYYYMMDD` (end = day after last day). No library needed.

**Outlook Live**
```
https://outlook.live.com/calendar/deeplink/compose
  ?path=/calendar/action/compose
  &rru=addevent
  &startdt={ISO8601}
  &enddt={ISO8601}
  &subject={title}
  &body={description}
  &location={location}
```
For Office 365 accounts: replace `outlook.live.com` with `outlook.office.com`. Provide both or default to Live.

**Apple Calendar / Generic ICS**
Apple Calendar has no URL scheme for web-triggered events (unlike Google/Outlook). The universal solution is to download an ICS file — Apple Calendar opens it automatically. ICS can also be imported by Outlook, Google, Thunderbird — it is the universal fallback.

Minimum valid ICS VEVENT (RFC 5545):
```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//sagie.co//Events//EN
BEGIN:VEVENT
UID:{unique-id}@sagie.co
DTSTAMP:{YYYYMMDDTHHmmssZ}
DTSTART:{YYYYMMDDTHHmmssZ}
DTEND:{YYYYMMDDTHHmmssZ}
SUMMARY:{title}
DESCRIPTION:{description}
LOCATION:{location}
URL:{event-url}
END:VEVENT
END:VCALENDAR
```
ICS can be served as a Next.js Route Handler (`/api/events/[id]/ics`) with `Content-Type: text/calendar` and `Content-Disposition: attachment; filename="event.ics"`.

**Confidence: HIGH** — URL formats verified against official IDF calendar docs and Microsoft Q&A. RFC 5545 is a stable standard.

### Dependencies on Existing Code

- `EventsPageClient.tsx` accordion expanded panel — add action button row
- Notion `SAGIEEvent` type — verify it includes `registrationUrl`, `eventUrl`, `recapUrl`, `startTime`, `endTime`, `timezone`, `location` fields; add if missing
- New API route: `/api/events/[id]/ics` for ICS generation
- Modal component: can be built with `dialog` element or minimal custom overlay; no new UI library needed

---

## Feature Area 3: Form Redesign (Fields + UX Overhaul)

### Context

Seven forms exist, all functional end-to-end. Some silently drop fields due to schema mismatches. The redesign covers: (1) auditing and fixing field-to-Notion-schema alignment, (2) replacing all-`<input>` layouts with appropriate dropdowns and checkbox groups where choices are fixed, (3) adding inline validation with correct timing.

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Required fields clearly marked | WCAG 2.1 AA, basic UX | Low | Asterisk + aria-required |
| Error messages attached to their field | Screen readers, sighted users | Low | aria-describedby pattern |
| Validation fires on blur (not on keypress) | Avoids premature errors | Low | React Hook Form `mode: 'onBlur'` |
| Errors cleared immediately when fixed | Avoids lingering red on correct input | Low | React Hook Form handles this |
| Dropdown for fixed-choice fields | Reduces error rate vs free text | Low | `<select>` or headless combobox |
| Checkbox groups with fieldset/legend | WCAG 2.1, screen reader grouping | Low | Native HTML elements |
| No silent field drops — schema aligned | Current data loss bug | Medium | Audit each form's Zod schema vs Notion properties |
| Rate limit (429) shown as form-level message | User knows to wait, not to retry | Low | Covered by separate rate-limit feature |
| Submission success state | User knows it worked | Low | Already exists; verify all forms have it |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Real-time validation for email format only | Quick feedback for high-error field | Low | `mode: 'onBlur'` with `reValidateMode: 'onChange'` after first blur |
| Password-strength or URL format indicators | Only for URL fields; prevents invalid Notion entries | Low | Custom validator in Zod + visual indicator |
| Multi-step form for longer applications (membership/ventures) | Reduces cognitive load | High | Defer — high risk, in-scope only as redesign |
| Autosave to localStorage | Prevents data loss on accidental navigation | High | Defer — high complexity, not table stakes for low-traffic intake |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Validate every keystroke from field focus | Premature errors frustrate users; UX research is conclusive | Validate on blur |
| Validate required fields as empty before user touches them | Shows errors on untouched fields | Only validate required fields on submit attempt |
| Custom select component replacing native `<select>` | Accessibility regressions, high complexity | Use native `<select>` styled with Tailwind; only use headless-ui combobox if searchable list needed |
| Collect more fields than Notion schema can store | Wastes user time, silently drops data | Audit schema first, only ask what you store |

### Validation Timing Pattern (Recommended)

```
1. User focuses field     → no validation
2. User types             → no validation (except real-time for email/URL if already blurred once)
3. User blurs field       → validate; show error if invalid
4. Error shown            → clear error as user corrects (re-validate on change)
5. User clicks submit     → validate all fields including untouched required fields
6. Submit success         → clear all errors, show success state
```

This matches the React Hook Form `mode: 'onBlur'`, `reValidateMode: 'onChange'` configuration. No additional library needed beyond what Zod + React Hook Form provide.

**Confidence: HIGH** — Baymard UX research, Smashing Magazine inline validation studies, and NN/g checkbox guidelines all converge on this pattern.

### Dependencies on Existing Code

- All form components in `/src/components/forms/` — audit Zod schemas against Notion property names
- Existing Zod validation on API routes is correct; client-side needs alignment
- `react-hook-form` — check if already installed; if not, install it. Alternative: existing forms may use controlled `useState` — RHF is a drop-in improvement
- No backend changes for UX changes; backend changes only for schema alignment fixes

---

## Feature Area 4: Admin Dashboard Feedback (Revalidation UI)

### Context

The revalidation page (`/admin/revalidate`) already has success/error text feedback via a `result` state string. The two issues: (1) no visual distinction between loading/success/error states beyond text color, (2) key rotation redirect behavior is broken (when secret is wrong/rotated, the page doesn't guide the admin back to re-enter the key cleanly).

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Success state clearly distinguished from error | Admin needs confidence the action worked | Low | Color + icon sufficient; no toast library needed |
| Loading state with spinner or disabled buttons | Prevents double-submit | Low | Already partially implemented with `disabled={loading}` |
| Error state shows actionable message | "Wrong secret" vs "Network error" should differ | Low | Branch on HTTP status code |
| Key rotation: 401 → prompt re-enter secret | Current bug — page stays in "entered" state with wrong key | Low | On 401 response, reset `secretEntered` to false |
| "Refreshing..." label during load | Already exists; keep it | None | — |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Per-button success indicator (brief checkmark) | Admin sees which tag was just revalidated | Low | 2-second timeout, local state per button |
| Toast notification for success | Feels polished, auto-dismisses | Low | Can use `sonner` (3kb) or build a simple custom toast |
| Timestamp of last revalidation per content type | Operational awareness | Medium | Requires localStorage or server-side tracking |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Full toast library (React-Toastify) for an admin page used by 1-2 people | 90kb+ bundle for minimal benefit | Inline success/error state (already 80% there) or sonner (3kb) |
| Redirect to login page on 401 | No auth system exists | Reset to secret-entry screen within the page |
| Complex audit log | Overkill for Notion-based CMS | Track in Notion manually or localStorage timestamp |

### Recommended Approach

1. Fix 401 handling: add `if (res.status === 401) { setSecretEntered(false); setSecret(''); setResult('Invalid secret — please re-enter.'); return; }` in the catch block.
2. Upgrade result display: replace plain text with a styled status panel (icon + message + timestamp).
3. Optional: add per-button "last refreshed" state in component state (not persisted — admin session is short).
4. Optional: install `sonner` for toast if the team wants auto-dismissing feedback. It's 3kb, works in Next.js App Router without a client wrapper, and has zero config.

**Confidence: HIGH** for approach. The existing code is close; these are targeted fixes.

### Dependencies on Existing Code

- `/src/app/admin/revalidate/page.tsx` — targeted edits only
- `/src/app/api/revalidate/route.ts` — verify it returns 401 on wrong secret (review needed)
- No new dependencies required unless adding sonner

---

## Feature Area 5: Custom 404 SVG/CSS Illustration

### Context

Next.js App Router uses `not-found.tsx` at the app root for 404 responses. The file already exists at `/src/app/not-found.tsx`. The task is to replace it with a branded, illustrated 404 page that fits the SAGIE aesthetic (dark theme, circuit/grid motifs, display font, silver/muted color palette).

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Branded visual (not stock Next.js 404) | Consistency, professionalism | Low | SVG inline in JSX |
| Clear "404" or "Page not found" heading | Users need to understand what happened | Low | — |
| Link back to homepage | Exit path | Low | Next.js `<Link>` |
| Matches site color palette and typography | Coherence | Low | Use existing CSS variables |
| No broken layout (Navbar/Footer optional) | Should not look like an orphan page | Low | Can omit Navbar for simplicity on error page |
| Static export compatible | `not-found.tsx` must remain server-renderable | Low | No client hooks in root not-found |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| CSS animation on SVG (floating, pulse, or glitch) | Memorable, reinforces brand character | Low-Medium | CSS keyframes only; no GSAP needed |
| Inline SVG so it inherits CSS variables (dark mode) | No hard-coded colors | Low | Import as React component via SVGR or author inline |
| Circuit-board or globe motif matching homepage | Brand reinforcement | Low | Reuse existing CircuitBackground pattern or draw a standalone SVG |
| Humor in copy ("You've ventured off the map") | Brand voice | Low | Copywriting only |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Lottie animation | 500kb+ dependency for a 404 page | CSS keyframes achieve equivalent effect |
| Canvas-based illustration | Requires client component, breaks static render | Inline SVG + CSS |
| Heavy parallax scroll effect | 404 is a dead end, not a feature page | Subtle fade-in or float animation only |
| Adding Navbar and Footer to 404 | Adds complexity; 404 is a simple recovery page | Homepage link in body is sufficient |

### Next.js Implementation Note

In App Router, `not-found.tsx` at `app/` root is a Server Component by default and must stay that way. SVG animations must use CSS (`@keyframes` in globals.css or a `<style>` tag) — no `useEffect` or `useState` allowed unless a `'use client'` child component is used. The simplest approach: inline SVG + CSS `animation` property. This is fully static and works with Vercel edge rendering.

**Confidence: HIGH** — Next.js `not-found.tsx` API is stable and documented. SVG + CSS animation is a well-understood, dependency-free pattern.

### Dependencies on Existing Code

- `/src/app/not-found.tsx` — full rewrite
- `/src/app/globals.css` — add `@keyframes` for animation
- No new dependencies required

---

## Feature Dependencies Map

```
nuqs (npm install)
  ├── BlogFilter.tsx URL state fix
  ├── SolutionsFilter URL state fix
  └── ResourcesFilter URL state fix

Notion SAGIEEvent type audit
  ├── Event action buttons (need startTime, endTime, timezone, registrationUrl)
  └── ICS API route (/api/events/[id]/ics)

Form schema audit (no new deps)
  ├── Fix silent field drops
  └── Add dropdowns/checkboxes for fixed-choice fields

Admin revalidate targeted fix (no new deps)
  └── 401 redirect reset

SVG creation (no new deps)
  └── not-found.tsx rewrite
```

---

## MVP Recommendation

**Prioritize in this order:**

1. **Filter bug fix** — Blocking: real users hitting broken filters now. Single `npm install nuqs` + swap `useState` for `useQueryState` in three components. Lowest risk, highest impact.

2. **Form schema alignment** — Silent data loss. Audit seven Zod schemas against Notion property names, fix mismatches. No UX change yet; pure correctness.

3. **Rate limit feedback** — Forms return 429 with no user message. Add form-level error display for 429 status. One-line conditional per form.

4. **Event action buttons** — Register + More Info are trivial anchors. Add to Calendar modal + ICS route is the main work. Build all four in one pass.

5. **Form UX redesign** — After schema is correct, add dropdowns/checkboxes and inline validation. Lower urgency than data integrity fixes.

6. **Admin revalidation UI** — Internal tool; targeted fix for 401 reset is 5 lines. Status panel polish can follow.

7. **Custom 404** — No user impact until someone hits a broken link. Last in sequence, but simple to build.

**Defer:**
- Multi-step forms — High complexity, not data-critical
- Timestamp audit log in admin — Nice-to-have
- "Notify me when confirmed" event feature — Explicitly out of scope (requires email capture without auth)

---

## Sources

- nuqs documentation and GitHub: https://nuqs.dev, https://github.com/47ng/nuqs
- nuqs 2.5 debounce/schema features: https://www.infoq.com/news/2025/09/nuqs-debounce-schema/
- Next.js search params official docs: https://nextjs.org/docs/app/api-reference/functions/use-search-params
- Google Calendar URL parameters (IDF docs): https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs/blob/main/services/google.md
- Outlook Live calendar URL format: https://interactiondesignfoundation.github.io/add-event-to-calendar-docs/services/outlook-web.html
- ICS / RFC 5545 VEVENT spec: https://icalendar.org/iCalendar-RFC-5545/3-6-1-event-component.html
- Inline validation timing (Smashing Magazine): https://www.smashingmagazine.com/2022/09/inline-validation-web-forms-ux/
- Baymard inline validation research: https://baymard.com/blog/inline-form-validation
- NN/g checkbox design guidelines: https://www.nngroup.com/articles/checkboxes-design-guidelines/
- sonner toast library: https://sonner.emilkowal.ski/ (lightweight, App Router compatible)
- Next.js custom 404 App Router: https://nextjs.org/docs/app/api-reference/file-conventions/not-found
