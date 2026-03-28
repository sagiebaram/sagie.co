# Architecture Research

**Domain:** Next.js 15 App Router community/marketing site — v2.0 Polish & Interactivity milestone
**Researched:** 2026-03-28
**Confidence:** HIGH — based on direct codebase analysis, no training-data speculation

---

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                     Presentation Layer (Client)                   │
│  BlogFilter    SolutionsFilter    EventsPageClient    Forms       │
│  ResourceFilter                  CalendarModal (NEW)              │
│  useState (local)                useSearchParams (NEW)            │
└────────────────────────┬─────────────────────────────────────────┘
                         │ hydration / RSC props
┌────────────────────────▼─────────────────────────────────────────┐
│                      Page Layer (Server Components)               │
│  blog/page.tsx    events/page.tsx    solutions/page.tsx           │
│  resources/page.tsx                 admin/revalidate/page.tsx     │
│  not-found.tsx (MODIFY)                                           │
└────────────────────────┬─────────────────────────────────────────┘
                         │ async data loaders
┌────────────────────────▼─────────────────────────────────────────┐
│                    Service Layer (src/lib/)                        │
│  blog.ts    events.ts    resources.ts    solutions.ts             │
│  validation.ts    schemas.ts    email.ts                          │
└────────────────────────┬─────────────────────────────────────────┘
                         │ Notion SDK
┌────────────────────────▼─────────────────────────────────────────┐
│                    Data Layer (Notion)                            │
│  Events DB    Blog DB    Resources DB    Solutions DB             │
│  Members DB   Chapters DB   Applications DBs                      │
└──────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Type |
|-----------|---------------|------|
| `blog/page.tsx` | Fetch all posts from Notion, pass to BlogFilter | Server |
| `BlogFilter` | Hold category + author state, render filtered list | Client |
| `events/page.tsx` | Fetch upcoming + past events, pass to EventsPageClient | Server |
| `EventsPageClient` | Hold openId accordion state, render event rows | Client |
| `ActionLink` | Current stub: plain `<a href="#">` buttons in event rows | Client |
| `CalendarModal` (NEW) | Modal overlay with 4 calendar options + .ics | Client |
| `FormField` | Input wrapper with inline error display | Client |
| `MembershipForm` + siblings | Hold field state, validate, POST to API | Client |
| `admin/revalidate/page.tsx` | Hold secret + loading state, call /api/revalidate | Client |
| `not-found.tsx` | Static 404 page, already has SVG illustration | Server |

---

## Integration Analysis: Each Feature

### 1. Filter State Bug (Blog, Solutions, Resources)

**Root cause diagnosis:**
All four filter components (`BlogFilter`, `SolutionsFilter`, `ResourceFilter`, `EventFilter`) store active filter in local React `useState`. The bug — "second filter selection wipes rendered components until refresh" — is a GSAP ScrollTrigger conflict. `useScrollReveal` uses `gsap.context()` scoped to a `ref`, and it runs on mount. When filter state changes and items re-render, the previously-registered ScrollTrigger context pins stale DOM nodes. The `gridRef` attached to `useScrollReveal` does not re-run on filter change, so GSAP tries to animate already-detached elements, causing the visible wipeout.

**Where state lives today:** Local `useState` in each filter client component. This is correct — filter state does not need to be in the URL for a marketing listing page. No change needed here.

**Fix approach — do NOT move to URL params:** URL searchParams are appropriate when the filter state must be bookmarkable or shareable (e.g., a search results page). These listing pages have no such requirement and the parent pages are server components that pass data down once. Moving to `useSearchParams` would force a server roundtrip on every filter click with no benefit.

**Correct fix:** Call `ScrollTrigger.refresh()` or kill and re-create the GSAP context after each filter state change. The `useScrollReveal` hook should accept a dependency array (like `useEffect`) so it re-runs when filtered items change. Alternatively, wrap filtered item rendering in a key prop that resets GSAP context on change.

**New code location:** Modify `src/hooks/useScrollReveal.ts` — add optional `deps` parameter to re-run the GSAP ScrollTrigger setup. No new files needed.

**Integration point:** `BlogFilter.tsx` lines 18–19 (gridRef), `SolutionsFilter.tsx` line 11, `ResourceFilter.tsx` (same pattern). Each filter component passes `deps: [filtered.length, activeCategory, activeAuthor]` (or equivalent) to `useScrollReveal`.

---

### 2. Navigation Rendering Bug (Back/Forward)

**Root cause diagnosis:** The browser back/forward cache (bfcache) combined with GSAP ScrollTrigger creates a stale-animation state. When the browser restores a page from bfcache, React component state is restored but GSAP's global ScrollTrigger instances are not re-registered. The `GSAPCleanup` component in `src/app/layout.tsx` handles cleanup on unmount, but bfcache bypasses unmount entirely.

**Fix approach:** Add a `pageshow` event listener (fires on bfcache restore, `event.persisted === true`) in the root layout or `GSAPCleanup.tsx` that calls `ScrollTrigger.refresh()` and optionally `ScrollTrigger.getAll().forEach(t => t.kill())` followed by re-initialization. Alternatively, opt the affected pages out of bfcache with `Cache-Control: no-store` — but that is a heavier fix.

**New code location:** Modify `src/components/ui/GSAPCleanup.tsx` — add `window.addEventListener('pageshow', handler)` with bfcache detection.

---

### 3. Calendar Modal Component (Server/Client Split)

**Where it lives:** Inside `EventsPageClient.tsx` which is already `'use client'`. The modal is pure UI state (open/closed + which event) — it belongs entirely in the client component tree. No server component changes needed.

**New component:** `src/components/ui/CalendarModal.tsx` — client component.

**Props interface:**
```typescript
interface CalendarModalProps {
  event: SAGIEEvent
  isOpen: boolean
  onClose: () => void
}
```

**State in `EventsPageClient`:**
```typescript
const [calendarEvent, setCalendarEvent] = useState<SAGIEEvent | null>(null)
```
`calendarEvent !== null` means modal is open. No additional state variable needed.

**Data flow:**
1. User clicks `+ Add to Calendar` in `EventsPageClient`
2. `setCalendarEvent(event)` opens the modal
3. `CalendarModal` receives the `SAGIEEvent` and renders 4 links + a download button
4. `onClose` calls `setCalendarEvent(null)`

**Calendar link construction** (pure functions, no API call needed):

| Option | URL pattern |
|--------|------------|
| Google Calendar | `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=...&details=...&location=...` |
| Outlook Web | `https://outlook.live.com/calendar/0/deeplink/compose?subject=...&startdt=...&enddt=...&body=...&location=...` |
| Apple Calendar | `.ics` file download (Apple Calendar opens `.ics` files natively) |
| Download .ics | Dynamic `.ics` file generated client-side as a Blob URL |

**ICS generation:** Pure client-side string construction, no new API route needed. Use `Blob` + `URL.createObjectURL` for the download. The ICS format is simple enough to generate inline.

**No CSP issues:** The calendar URLs are external navigations, not injected scripts. The existing CSP nonce pattern in `middleware.ts` / `proxy.ts` only applies to `<script>` tags.

**Integration point:** `EventsPageClient.tsx` — replace the `ActionLink label="+ Add to Calendar"` stub with a `<button onClick={() => setCalendarEvent(event)}>`, add `CalendarModal` render at the bottom of the component tree.

**SAGIEEvent interface needs:** The existing `SAGIEEvent` has `date`, `time`, `name`, `description`, `venue`. That is sufficient for all four calendar formats. No change to `src/lib/events.ts` needed.

---

### 4. Event Action Buttons (Register, More Info, Read Recap)

**Current state:** All action buttons are `ActionLink` stubs with `href="#"` except `webinarLink` which is already wired. The `SAGIEEvent` interface already has `webinarLink`, `recordingLink`, `photoGallery` properties populated from Notion.

**Register button:**
- For `type === 'SAGIE Event'` + `status === 'Confirmed'`: needs a `registrationLink` field from Notion that does not currently exist in `SAGIEEvent`.
- **Action:** Add `registrationLink: string | null` to `SAGIEEvent` interface and map it in `mapEvent()` in `src/lib/events.ts`.
- Then wire `<ActionLink label="Register →" href={event.registrationLink ?? '#'} />`.

**More Info button:**
- For `type === 'Local Event'`: needs a `moreInfoLink` field from Notion. Same pattern as above.
- **Action:** Add `moreInfoLink: string | null` to `SAGIEEvent` and `mapEvent()`.

**Read Recap button:**
- For `status === 'Complete'`: needs a `recapLink` field from Notion.
- **Action:** Add `recapLink: string | null` to `SAGIEEvent` and `mapEvent()`.

**Integration:** All changes are in `src/lib/events.ts` (interface + mapEvent) and `EventsPageClient.tsx` (wire href props). No API routes involved. No schema changes.

---

### 5. Form Redesign — Zod Schemas and withValidation

**Current pattern:** Each form component holds field state in `useState`, runs a bespoke `validate()` function client-side, then POSTs raw JSON. The server uses `withValidation(Schema, handler)` which runs Zod validation and returns 422 with `fieldErrors` on failure. The client currently ignores 422 responses — it only handles network errors in the catch block.

**Form redesign integration points:**

**Adding new field types (dropdowns, checkboxes):**
- `FormField.tsx` already supports `type: 'select'`. Add `type: 'checkbox-group'` for multi-select fields.
- For schema: `z.array(z.enum([...]))` already exists in `MembershipSchema` (`category` field) but is not rendered in `MembershipForm.tsx`. The schema is ahead of the UI.
- **No schema changes needed** for existing fields. Adding new fields requires adding to the Zod schema in `src/lib/schemas.ts` AND to the Notion write handler in the corresponding API route.

**Inline validation (field-level, on blur):**
- The `FormField` component already displays `error` prop. The gap is that client-side validation only runs on submit.
- Add `onBlur` handler to `FormField` that calls a single-field validate function.
- The field-level validate can reuse the Zod schema: `Schema.pick({ fieldName: true }).safeParse({ fieldName: value })`.
- **No changes to `withValidation` or `schemas.ts`** — the server validation stays identical.

**Rate limit feedback (429 response):**
- Current: `MembershipForm.handleSubmit` only catches network errors. HTTP 4xx responses fall through without error display because `fetch` does not throw on non-2xx.
- Fix: Check `res.ok` and `res.status` after the fetch call. If `status === 429`, read the `Retry-After` header (already set by `withValidation`) and display a user-facing message.
- **No changes to `withValidation`** — it already returns 429 with `Retry-After` header and a message in the body.
- **Change location:** Every form component (`MembershipForm`, `ChapterForm`, `VenturesForm`, `SolutionsForm`, `SuggestEventForm`, `SubmitPostForm`, `SubmitResourceForm`) needs the same `res.status === 429` check added to `handleSubmit`. Extract a shared `handleApiError(res)` helper in `src/lib/utils.ts` to avoid duplication.

**Integration boundary — what stays the same:**
- `withValidation` signature and behavior: unchanged
- Zod schemas in `src/lib/schemas.ts`: additive changes only (new fields)
- API routes: additive changes only (map new fields to Notion writes)
- `FormSuccess` component: unchanged

---

### 6. Revalidation UI Feedback (Admin Page)

**Current state:** `admin/revalidate/page.tsx` is a self-contained `'use client'` component. It already has:
- `loading` state toggling button disabled state and "Refreshing..." label
- `result` state showing green/red text based on `result.startsWith('Error')`
- `setResult(null)` on each new call to clear previous result

**What's missing for success/failure indication:**
- Per-button loading state — currently all buttons disable together (`disabled={loading}` is global)
- Distinct visual states for pending / success / failure per revalidation action
- The current `result` display is plain text — no icon, no structured feedback

**Key rotation redirect fix:**
The `/api/revalidate` route returns 401 when the secret is wrong. The admin page currently handles this via the generic `!res.ok` path, displaying `Error: Unauthorized`. The "fix key rotation redirect behavior" requirement suggests that when 401 is returned, the UI should automatically reset back to the secret-entry screen (set `secretEntered(false)` + clear `secret`). Currently it does not do this.

**Fix approach:**
```typescript
if (res.status === 401) {
  setSecretEntered(false)
  setSecret('')
  setResult('Secret incorrect or expired. Please re-enter.')
  return
}
```

**New state needed:**
```typescript
// Replace single result string with per-action state
const [actionStates, setActionStates] = useState<
  Record<string, 'idle' | 'loading' | 'success' | 'error'>
>({})
```

**Integration:** Self-contained change to `src/app/admin/revalidate/page.tsx`. No new files, no API changes. The `/api/revalidate/route.ts` response shape (`{ revalidated, tags, now }`) is already sufficient — the UI just needs to use it correctly.

---

### 7. Custom 404 Illustration

**Current state:** `src/app/not-found.tsx` already has:
- A `NotFoundIllustration` function returning a basic geometric SVG (concentric circles with cross lines, 80×80px)
- `GridBackground` decorative background
- Proper heading, body copy, and two `Button` components

**What "custom 404 SVG/CSS illustration" means:** Replace or augment the existing basic SVG with a more branded, thematically richer illustration. The architecture for the 404 page is already correct.

**Integration:** Modify `not-found.tsx` in-place. The `NotFoundIllustration` function is already extracted as a named function at the top of the file — replace its SVG contents. No new component files needed unless the illustration is complex enough to warrant `src/components/ui/NotFoundIllustration.tsx` as a separate file.

**Design constraints from codebase:**
- Color palette: `var(--silver)` (#C0C0C0), `var(--border-default)`, `var(--text-muted)`, `var(--text-dim)` — already used in the existing SVG strokes
- CSS animations: Use Tailwind `animate-*` classes or inline `<style>` keyframes. GSAP is available but overkill for a 404 illustration; CSS animation is sufficient and has no JS dependency
- The existing SVG uses `stroke` not `fill` — consistent with the monochrome circuit aesthetic

---

## Recommended Project Structure — New Files

```
src/
├── app/
│   ├── not-found.tsx               # MODIFY — richer illustration SVG/CSS
│   ├── admin/revalidate/page.tsx   # MODIFY — per-action states, 401 redirect
│   └── (marketing)/events/
│       └── EventsPageClient.tsx    # MODIFY — wire action buttons, add CalendarModal state
│
├── components/
│   └── ui/
│       └── CalendarModal.tsx       # NEW — calendar picker modal (client)
│
├── hooks/
│   └── useScrollReveal.ts          # MODIFY — add deps parameter for re-runs
│
├── lib/
│   ├── events.ts                   # MODIFY — add registrationLink, moreInfoLink, recapLink fields
│   ├── utils.ts                    # MODIFY — add handleApiError() helper
│   └── schemas.ts                  # MODIFY — additive: new form fields only
│
└── components/forms/
    ├── MembershipForm.tsx           # MODIFY — rate limit display, inline validation
    ├── ChapterForm.tsx              # MODIFY — same
    ├── VenturesForm.tsx             # MODIFY — same
    ├── SolutionsForm.tsx            # MODIFY — same
    ├── SuggestEventForm.tsx         # MODIFY — same
    ├── SubmitPostForm.tsx           # MODIFY — same
    └── SubmitResourceForm.tsx       # MODIFY — same
```

**Summary: 1 new file, 12 modified files.**

---

## Architectural Patterns

### Pattern 1: Server Fetches Once, Client Filters Locally

**What:** Server component fetches the full dataset from Notion, passes it as props to a `'use client'` component that does all filtering in-memory.

**When to use:** All listing pages (blog, events, solutions, resources). Dataset is small enough to fit in a single Notion query result. No server roundtrip on filter change.

**Trade-offs:** All items loaded upfront (fast UX, slight over-fetch). Scales to ~100 items before pagination becomes necessary.

**Example (current pattern — preserve it):**
```typescript
// page.tsx — server component
export default async function BlogPage() {
  const posts = await getAllPosts()
  return <BlogFilter posts={posts} />  // all posts passed once
}

// BlogFilter.tsx — 'use client'
const [activeCategory, setActiveCategory] = useState('All')
const filtered = posts.filter(p => activeCategory === 'All' || p.category === activeCategory)
```

### Pattern 2: withValidation HOF for API Routes

**What:** `withValidation(ZodSchema, handler)` wraps every API route with rate limiting, honeypot check, JSON parsing, and schema validation before calling the handler with typed data.

**When to use:** All form submission API routes. Do not bypass for any reason.

**Trade-offs:** Centralizes all security checks. Adding new form types requires no changes to the middleware itself.

**Example (preserve this pattern for any new form fields):**
```typescript
export const POST = withValidation(MembershipSchema, async (_req, body) => {
  // body is fully typed as z.infer<typeof MembershipSchema>
  await notionWrite(...)
  return Response.json({ ok: true })
})
```

### Pattern 3: Client-Side Calendar Link Construction

**What:** Google/Outlook calendar links and ICS files are constructed entirely in the browser from event data already available in the component. No API route needed.

**When to use:** The CalendarModal — all data (title, date, time, venue) is in the `SAGIEEvent` prop.

**Trade-offs:** Zero server cost. ICS generation via Blob is well-supported in modern browsers. No CSP complications.

**Example:**
```typescript
function buildGoogleCalendarUrl(event: SAGIEEvent): string {
  const start = formatDateForCalendar(event.date, event.time)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.name,
    dates: `${start}/${start}`,
    details: event.description ?? '',
    location: event.venue ?? '',
  })
  return `https://calendar.google.com/calendar/render?${params}`
}
```

---

## Data Flow

### Filter Interaction Flow (Fixed)

```
User clicks filter button
    ↓
useState update (setActiveCategory / setActive)
    ↓
React re-renders filtered list (new DOM nodes)
    ↓
useScrollReveal re-runs (deps changed) — GSAP registers new nodes
    ↓
Smooth animation plays correctly
```

### Calendar Modal Flow

```
User clicks "+ Add to Calendar" button (in EventsPageClient)
    ↓
setCalendarEvent(event) — opens modal
    ↓
CalendarModal renders with 4 options:
  Google → external link (new tab)
  Outlook → external link (new tab)
  Apple → .ics Blob download
  Download .ics → .ics Blob download
    ↓
User selects option → navigates externally or downloads
    ↓
onClose() → setCalendarEvent(null) — closes modal
```

### Form Submission Flow (Enhanced with Rate Limit Feedback)

```
User submits form
    ↓
Client validate() — immediate field errors if invalid
    ↓
POST /api/applications/{type}
    ↓
withValidation middleware:
  429? → res.status check in form → display retry message with countdown
  422? → res.json().fieldErrors → display per-field server errors
  200? → setSuccess(true) → FormSuccess component
  500? → generic error message
```

### Revalidation Admin Flow (Fixed)

```
Admin enters secret
    ↓
Clicks content type button
    ↓
POST /api/revalidate with { secret, tags }
    ↓
401? → reset to secret entry screen with message
429? → show error (not currently possible, no rate limit on this route)
200? → per-button success indicator, timestamp
network error? → per-button error indicator
```

---

## Integration Points

### New vs. Modified — Explicit List

**NEW files:**
| File | What it is |
|------|-----------|
| `src/components/ui/CalendarModal.tsx` | Calendar picker modal, client component |

**MODIFIED files:**
| File | What changes |
|------|-------------|
| `src/hooks/useScrollReveal.ts` | Add `deps` parameter to re-run ScrollTrigger on filter change |
| `src/lib/events.ts` | Add `registrationLink`, `moreInfoLink`, `recapLink` to `SAGIEEvent` interface and `mapEvent()` |
| `src/lib/utils.ts` | Add `handleApiError(res: Response)` shared helper |
| `src/app/(marketing)/events/EventsPageClient.tsx` | Wire action button hrefs, add CalendarModal state + render |
| `src/app/admin/revalidate/page.tsx` | Per-action states, 401 auto-redirect, clearer success/error indicators |
| `src/app/not-found.tsx` | Replace basic SVG with richer branded illustration |
| `src/components/forms/MembershipForm.tsx` | Add `res.ok` check, 429 display, inline field validation on blur |
| `src/components/forms/ChapterForm.tsx` | Same as above |
| `src/components/forms/VenturesForm.tsx` | Same as above |
| `src/components/forms/SolutionsForm.tsx` | Same as above |
| `src/components/forms/SuggestEventForm.tsx` | Same as above |
| `src/components/forms/SubmitPostForm.tsx` | Same as above |
| `src/components/forms/SubmitResourceForm.tsx` | Same as above |

**NOT touched:**
- `src/lib/validation.ts` — already correct, returns 429 with all needed headers
- `src/lib/schemas.ts` — only additive changes if new form fields are added
- `src/app/api/revalidate/route.ts` — already correct
- All API route handlers — unchanged unless new form fields are added

---

## Suggested Build Order

Dependencies determine ordering. Bug fixes before features. Foundational changes before dependent changes.

```
Phase 1: Foundation fixes (no dependencies on other phases)
  1a. Fix useScrollReveal deps parameter              → unblocks filter bug fix
  1b. Fix GSAPCleanup bfcache pageshow listener       → navigation rendering bug
  1c. Add handleApiError() to utils.ts               → unblocks all form changes

Phase 2: Bug fixes using Phase 1 foundation
  2a. Wire useScrollReveal deps in BlogFilter,
      SolutionsFilter, ResourceFilter, EventFilter   → uses 1a
  2b. Apply handleApiError + 429 feedback to
      all 7 form components                          → uses 1c

Phase 3: Events feature (depends on data model)
  3a. Add registrationLink, moreInfoLink, recapLink
      to SAGIEEvent + mapEvent()                     → data model change
  3b. Wire action button hrefs in
      EventsPageClient                               → uses 3a
  3c. Build CalendarModal component                  → standalone
  3d. Wire CalendarModal into EventsPageClient        → uses 3a + 3c

Phase 4: Form redesign (independent of Phases 2-3)
  4a. Extend FormField with checkbox-group type
  4b. Add inline validation (onBlur) to FormField
  4c. Redesign form layouts in each form component   → uses 4a + 4b
  4d. Update Zod schemas + API routes if new
      fields are added

Phase 5: Admin + 404 (fully independent, can be done any time)
  5a. Revalidation admin UI feedback + 401 redirect
  5b. 404 illustration redesign
```

**Rationale:**
- Phase 1 first because `useScrollReveal` fix is a dependency of filter bug fix, and `handleApiError` is shared by 7 components.
- Phase 2 immediately after Phase 1 to fix data loss bugs (forms silently ignoring rate limit responses).
- Phase 3 event actions are grouped because `SAGIEEvent` data model change (3a) must precede wiring (3b) and modal (3d).
- Phase 4 form redesign is independent — can be parallelized with Phase 3 if needed.
- Phase 5 admin and 404 are cosmetic/UX with zero dependencies — can slot in anywhere.

---

## Anti-Patterns

### Anti-Pattern 1: Moving Filter State to URL searchParams

**What people do:** Use `useSearchParams` + `router.push` for filter state, treating it like a search page.

**Why it's wrong:** Causes a server roundtrip on every filter click. These pages load all data once from Notion. URL params add latency with no user benefit (listing pages are not bookmarkable by filter state in this app).

**Do this instead:** Keep `useState` in the filter client component. Fix the GSAP animation re-run instead.

### Anti-Pattern 2: Building a New API Route for Calendar Links

**What people do:** Create `/api/calendar?eventId=...` that returns ICS content.

**Why it's wrong:** The `SAGIEEvent` data is already in the client component. A server roundtrip adds latency and unnecessary complexity. ICS format is a simple text standard.

**Do this instead:** Construct calendar URLs and ICS blobs entirely client-side in `CalendarModal.tsx`.

### Anti-Pattern 3: Adding a New Validation Middleware for Rate Limit Display

**What people do:** Modify `withValidation` to add custom error formats for different error types.

**Why it's wrong:** `withValidation` already returns the correct 429 response with `Retry-After` header and a user-facing message in the body. The gap is entirely on the client side — forms don't check `res.ok`.

**Do this instead:** Fix `handleSubmit` in each form to check `res.status === 429` and display the message from `res.json().error`.

### Anti-Pattern 4: Extracting EventsPageClient Sub-Components to Separate Files Prematurely

**What people do:** Split `EventAccordion`, `ActionLink`, `Badge`, `TypeDivider` into separate files before the feature is stable.

**Why it's wrong:** `EventsPageClient.tsx` is already a self-contained client module. The sub-components are private to this file (not exported, not used elsewhere). Premature extraction adds import overhead with no reuse benefit.

**Do this instead:** Keep sub-components co-located in `EventsPageClient.tsx`. Only extract `CalendarModal` because it is reusable UI (modal overlay pattern) and large enough to warrant its own file.

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current (~20 events, ~30 blog posts) | All patterns fine as-is |
| 200+ events | Add pagination to `getUpcomingEvents` — filter by date window before returning |
| 500+ blog posts | Add server-side category filter to `getAllPosts` Notion query instead of client-side |
| High admin usage | Add Redis-backed rate limiting (current in-memory store resets on deploy) |

---

## Sources

- Direct codebase analysis: `src/` files read 2026-03-28
- `src/lib/events.ts` — SAGIEEvent interface and mapEvent()
- `src/app/(marketing)/events/EventsPageClient.tsx` — current ActionLink stubs
- `src/components/ui/BlogFilter.tsx`, `SolutionsFilter.tsx`, `EventFilter.tsx` — filter state patterns
- `src/lib/validation.ts` — withValidation, 429 response shape
- `src/app/admin/revalidate/page.tsx` — current admin UI state
- `src/app/not-found.tsx` — existing illustration
- `src/components/forms/MembershipForm.tsx` — form submission pattern
- `.planning/codebase/ARCHITECTURE.md`, `STRUCTURE.md`, `CONCERNS.md` — codebase audit

---
*Architecture research for: sagie.co v2.0 Polish & Interactivity milestone*
*Researched: 2026-03-28*
