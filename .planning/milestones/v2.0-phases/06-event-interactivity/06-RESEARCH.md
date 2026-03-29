# Phase 6: Event Interactivity - Research

**Researched:** 2026-03-28
**Domain:** Next.js API routes, ICS file generation, inline UI dropdowns, data-driven conditional rendering, Next.js Link vs anchor tags
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Add to Calendar: inline dropdown (not a modal overlay, no backdrop) — consistent with EventAccordion pattern
- Four calendar options: Google Calendar, Outlook, Apple Calendar, Download .ics
- .ics generated via server API route `/api/events/[id]/ics` — NOT client-side Blob
- Calendar entry includes: event name, date/time, venue (as location), description, registration link in notes if available
- Strict data-driven button visibility — buttons only render when their Notion URL field is populated:
  - Register: only if `registrationLink` exists
  - More Info: only if `moreInfoLink` exists
  - Read Recap: only if `recapLink` exists
  - Add to Calendar: only for Confirmed-status events that have a date
- "Notify me when confirmed" button removed entirely (EVT-06 deferred)
- Unified `registrationLink` field replaces split between `webinarLink` (webinars) and missing field (SAGIE Events)
- Event images: wire `eventImage` data, `object-fit: cover`, 200px x 4:3 slot, keep "No image" placeholder when null
- External links (Register, More Info): `target="_blank"` + `rel="noopener noreferrer"`
- Read Recap: use Next.js `Link` for client-side navigation (internal blog posts)
- External-link icon (small diagonal arrow) next to new-tab buttons; keep existing `->` arrow suffix on labels

### Claude's Discretion
- Inline dropdown animation/transition style
- External link icon choice (SVG or Unicode)
- ICS API route implementation details (ical library vs manual string)
- How to handle events with a date but no time (all-day event in calendar)
- Image loading/error states (blur placeholder, skeleton, etc.)
- Exact Notion property names for new fields (registrationLink, moreInfoLink, recapLink)

### Deferred Ideas (OUT OF SCOPE)
- "Notify me when confirmed" (EVT-06) — requires email capture without user accounts
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| EVT-01 | Register button opens external registration URL from Notion | `registrationLink` field added to SAGIEEvent interface + mapEvent; ActionLink upgraded to new-tab anchor |
| EVT-02 | Add to Calendar offers Google Calendar, Outlook, Apple Calendar links and .ics download | Inline dropdown component + Google/Outlook URL construction + ICS API route `/api/events/[id]/ics` |
| EVT-03 | More Info button links to event's detail/info URL from Notion | `moreInfoLink` field added; ExternalActionLink pattern |
| EVT-04 | Read Recap button links to event's recap URL from Notion | `recapLink` field added; Next.js Link for internal blog navigation |
| EVT-05 | Event action buttons show/hide based on data availability (no dead buttons) | Pure conditional rendering — button only rendered when field is non-null |
</phase_requirements>

---

## Summary

Phase 6 delivers five tightly scoped changes to the events page: add three new URL fields to the data model, upgrade action buttons to live links with proper new-tab and internal navigation behavior, build an inline Add to Calendar dropdown with four calendar options, create a server API route for .ics file generation, and wire the existing image slot to real Notion data.

All five requirements land in a small, coherent file surface: `src/lib/events.ts` (data model), `src/app/(marketing)/events/EventsPageClient.tsx` (UI rendering), and a new `src/app/api/events/[id]/ics/route.ts` (ICS endpoint). Tests for the data-mapping changes live in the existing `src/lib/__tests__/events.test.ts`.

The architectural decisions are already locked by CONTEXT.md. Research confirms all patterns are directly supported by the existing stack with no new dependencies required — calendar URL construction is string interpolation, ICS generation is a plain-text format that can be hand-built or served via a minimal library.

**Primary recommendation:** Use manual ICS string construction in the API route (no new npm package needed). Google Calendar and Outlook calendar links are well-documented URL patterns. Implement Add to Calendar dropdown with the same `AnimatePresence + motion.div` pattern already used by EventAccordion.

---

## Standard Stack

### Core (already installed — no new packages needed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion/react (framer-motion) | ^12.38.0 | Inline dropdown animation | Already used by EventAccordion; consistent pattern |
| next/link | (Next.js ^16.2.1) | Internal Read Recap navigation | Correct pattern for same-site links in Next.js |
| Next.js Route Handler | (Next.js ^16.2.1) | ICS file API route | Standard pattern for binary/text file downloads |

### No New Packages Required
All calendar URL construction, ICS format generation, and dropdown behavior can be achieved with existing tools. Confirmed:
- Google Calendar URL: string interpolation (no library)
- Outlook Calendar URL: string interpolation (no library)
- Apple Calendar: identical `.ics` file — same `/api/events/[id]/ics` endpoint
- ICS format: plain text RFC 5545 — no library needed for single-event files

**Installation:** None required.

---

## Architecture Patterns

### Recommended File Structure Changes
```
src/
├── lib/
│   └── events.ts                          # Add registrationLink, moreInfoLink, recapLink fields
├── app/
│   ├── (marketing)/events/
│   │   └── EventsPageClient.tsx           # Rewire action row, add AddToCalendarDropdown
│   └── api/events/[id]/ics/
│       └── route.ts                       # NEW: ICS file download endpoint
└── lib/__tests__/
    └── events.test.ts                     # Update fixtures + assertions for new fields
```

### Pattern 1: Data Model Extension (events.ts)

**What:** Add three optional URL fields to `SAGIEEvent` interface and map from Notion properties.
**When to use:** Any time new Notion URL properties need to surface in the UI.

```typescript
// Source: existing mapEvent pattern in src/lib/events.ts
export interface SAGIEEvent {
  // ... existing fields ...
  registrationLink: string | null   // replaces webinarLink for registration
  moreInfoLink: string | null       // new: detail/info URL
  recapLink: string | null          // new: internal blog recap URL
}

// In mapEvent:
registrationLink: p['Registration Link']?.url ?? null,
moreInfoLink: p['More Info Link']?.url ?? null,
recapLink: p['Recap Link']?.url ?? null,
```

**Note on Notion property names:** CONTEXT.md lists these as Claude's discretion. Safe naming conventions matching existing Notion schema style (Title Case with spaces) are `Registration Link`, `More Info Link`, `Recap Link`. The existing `webinarLink` maps from `'Webinar Link'` — follow the same pattern.

### Pattern 2: Data-Driven Button Rendering (EventsPageClient.tsx)

**What:** Replace status/type-gated conditionals with pure field-existence checks.
**When to use:** Any UI element whose visibility depends entirely on a data field being populated.

```typescript
// Source: EventsPageClient.tsx action row — replace current gating logic
<div className="flex flex-wrap items-center gap-4 mt-2">
  {event.registrationLink && (
    <ExternalActionLink label="Register" href={event.registrationLink} />
  )}
  {event.moreInfoLink && (
    <ExternalActionLink label="More Info" href={event.moreInfoLink} />
  )}
  {event.recapLink && (
    <InternalActionLink label="Read Recap" href={event.recapLink} />
  )}
  {event.status === 'Confirmed' && event.date && (
    <AddToCalendarDropdown event={event} />
  )}
</div>
```

### Pattern 3: ExternalActionLink Component

**What:** Upgrade `ActionLink` (currently a plain `<a>`) to open external URLs in new tab with security attributes and a subtle external link icon.
**When to use:** Any button linking to an external URL from event data.

```typescript
// Replaces ActionLink for external URLs
function ExternalActionLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-body uppercase text-label tracking-label text-foreground-muted hover:text-silver hover:-translate-y-px transition-all duration-150 border-b border-border-subtle pb-px inline-flex items-center gap-1"
    >
      {label} →
      <svg /* diagonal arrow icon */ />
    </a>
  )
}
```

**External link icon:** A 10–12px SVG `arrow-up-right` or Unicode `↗` (U+2197) both work. SVG preferred for styling control — a simple `<svg viewBox="0 0 10 10"><path d="M2 8L8 2M3 2h5v5"/></svg>` with `stroke-current` is idiomatic.

### Pattern 4: InternalActionLink Component (Read Recap)

**What:** Use Next.js `Link` for recap URLs (internal `/blog/...` paths). Matches pattern already used in BlogFilter.tsx.
**When to use:** Any action linking to an internal sagie.co page.

```typescript
import Link from 'next/link'

function InternalActionLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="font-body uppercase text-label tracking-label text-foreground-muted hover:text-silver hover:-translate-y-px transition-all duration-150 border-b border-border-subtle pb-px"
    >
      {label} →
    </Link>
  )
}
```

**Confidence:** HIGH — BlogFilter.tsx already uses this exact pattern with `import Link from 'next/link'`.

### Pattern 5: AddToCalendarDropdown Component

**What:** Inline expand/collapse dropdown, styled like EventAccordion, with four calendar option links.
**Animation:** Same `AnimatePresence + motion.div` pattern as EventAccordion expanded panel.

```typescript
// Source: EventAccordion animation pattern in EventsPageClient.tsx
function AddToCalendarDropdown({ event }: { event: SAGIEEvent }) {
  const [open, setOpen] = useState(false)

  const googleUrl = buildGoogleCalendarUrl(event)
  const outlookUrl = buildOutlookCalendarUrl(event)
  const icsUrl = `/api/events/${event.id}/ics`

  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)} /* same styling as ActionLink */>
        + Add to Calendar
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            {/* Google Calendar */}
            <a href={googleUrl} target="_blank" rel="noopener noreferrer">Google Calendar</a>
            {/* Outlook */}
            <a href={outlookUrl} target="_blank" rel="noopener noreferrer">Outlook</a>
            {/* Apple Calendar — same .ics download */}
            <a href={icsUrl} download>Apple Calendar</a>
            {/* Download .ics */}
            <a href={icsUrl} download>Download .ics</a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

### Pattern 6: Calendar URL Construction

**What:** Build Google and Outlook deep-link URLs from event data fields.
**Confidence:** HIGH — these URL formats are stable, well-documented, widely used.

#### Google Calendar URL
```
https://calendar.google.com/calendar/render?action=TEMPLATE
  &text={encodeURIComponent(event.name)}
  &dates={startDatetime}/{endDatetime}   // format: YYYYMMDDTHHmmssZ
  &details={encodeURIComponent(description + registrationLink)}
  &location={encodeURIComponent(event.venue ?? '')}
```

**All-day event (no time):** Use date-only format `YYYYMMDD/YYYYMMDD` (same date for both start/end, or next day for end).

#### Outlook Web Calendar URL
```
https://outlook.live.com/calendar/0/deeplink/compose?rru=addevent
  &subject={encodeURIComponent(event.name)}
  &startdt={ISO8601 datetime or date}
  &enddt={ISO8601 datetime or date}
  &body={encodeURIComponent(details)}
  &location={encodeURIComponent(venue)}
```

**Apple Calendar:** Uses the same `.ics` file download as the Download .ics option — `href="/api/events/{id}/ics" download`. No separate URL needed.

### Pattern 7: ICS API Route

**What:** `GET /api/events/[id]/ics` fetches the event from Notion by ID and returns a `.ics` file response.
**Confidence:** HIGH — follows existing Next.js Route Handler patterns in the codebase.

```typescript
// src/app/api/events/[id]/ics/route.ts
import { notion } from '@/lib/notion'
import { env } from '@/env/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params  // Next.js 16: params is a Promise

  // Fetch event page from Notion
  const page = await notion.pages.retrieve({ page_id: id })

  // Build ICS content
  const icsContent = buildIcsContent(event)

  return new Response(icsContent, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${slugifiedName}.ics"`,
    },
  })
}
```

**ICS format (RFC 5545) — manual string construction:**
```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SAGIE//Events//EN
BEGIN:VEVENT
UID:{event.id}@sagie.co
DTSTAMP:{now in YYYYMMDDTHHmmssZ}
DTSTART:{date or datetime}
DTEND:{date or datetime + 1 hour default if no duration}
SUMMARY:{event.name}
DESCRIPTION:{description}\\n{registrationLink if present}
LOCATION:{event.venue}
END:VEVENT
END:VCALENDAR
```

**All-day event (no time):** Use `DTSTART;VALUE=DATE:YYYYMMDD` / `DTEND;VALUE=DATE:YYYYMMDD` (DTEND = next day per RFC 5545).

**CRITICAL — Next.js 16 route params:** In Next.js 16, route segment params are a `Promise`. Use `await params` before accessing `params.id`. This matches the pattern used in blog slug pages.

### Pattern 8: Event Image Wiring

**What:** Replace the placeholder `<span>` in the image slot with an actual `<img>` tag using `object-fit: cover`.
**Confidence:** HIGH — `eventImage` already exists in `SAGIEEvent` interface and is populated in `mapEvent`.

```tsx
{/* Image slot — already at 200px width, 4:3 aspect ratio */}
<div
  className="hidden md:flex items-start justify-center rounded overflow-hidden bg-background-card border border-border-subtle"
  style={{ aspectRatio: '4/3' }}
>
  {event.eventImage ? (
    <img
      src={event.eventImage}
      alt={event.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="font-body text-foreground-ghost text-label m-auto">
      No image
    </span>
  )}
</div>
```

**Note:** No `next/image` needed here — external Notion image URLs would require adding notion.so to `next.config.ts` remotePatterns. Plain `<img>` with CSS is appropriate for this slot.

### Anti-Patterns to Avoid

- **Status + type gating for Register button:** The old code had `event.status === 'Confirmed' && event.type === 'SAGIE Event'` and separate `event.type === 'Webinar'` checks. Replace entirely with `event.registrationLink && <ExternalActionLink>`.
- **`<a href="#">`:** The current `ActionLink` defaults to `href="#"`. All live action links must have real URLs or not render at all.
- **`target="_blank"` without `rel="noopener noreferrer"`:** Security vulnerability. Always pair them.
- **Using `<a>` for internal recap links:** Internal blog links must use `next/link` for client-side navigation and prefetching.
- **Client-side ICS Blob:** User explicitly chose server-side ICS. Do not use `URL.createObjectURL` approach.
- **Leaving "Notify me when confirmed" button:** Must be completely removed — EVT-06 is deferred.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Calendar deep links | Custom URL builder library | Inline string interpolation | Google/Outlook URL formats are simple, stable, 3 parameters |
| ICS file parsing | ICS parser | N/A — we only generate, not parse | No parsing needed |
| ICS file generation | npm ical/ics library | Manual RFC 5545 string | Single-event ICS is ~15 lines of text; no recurrence/alarms needed |
| Dropdown animation | Custom CSS animation | `AnimatePresence + motion.div` | Already used by EventAccordion; consistent look |
| External link detection | URL parsing logic | Explicit component split (ExternalActionLink vs InternalActionLink) | Explicit is clearer than heuristic |

**Key insight:** ICS format for a single event is so simple (15–20 lines, no recurrence, no alarms) that a library adds zero value and one dependency. Manual string construction is the correct call here.

---

## Common Pitfalls

### Pitfall 1: Next.js 16 Dynamic Route Params are a Promise
**What goes wrong:** `params.id` returns `undefined` — the event is not found.
**Why it happens:** In Next.js 15+, dynamic route segment params became async (`Promise<{ id: string }>`). Using `params.id` directly (without `await params`) silently returns undefined.
**How to avoid:** Always `const { id } = await params` in route handlers. Confirmed by project history: `[Phase 03-features-globe]` notes this pattern.
**Warning signs:** `notion.pages.retrieve` throws "Invalid UUID" or 404 for a valid event ID.

### Pitfall 2: Notion Image URLs Expiring
**What goes wrong:** Event images display initially but break after ~1 hour.
**Why it happens:** Notion file URLs are signed with a short-lived token. They expire.
**How to avoid:** For Phase 6, this is acceptable — the events page already revalidates every 300 seconds, and the image URL is re-fetched on each cache miss. Do NOT cache image URLs separately from event data. Document as known limitation.
**Warning signs:** Images 404 in production but work after revalidation.

### Pitfall 3: ICS Special Character Escaping
**What goes wrong:** Calendar apps reject the `.ics` file or show garbled text.
**Why it happens:** RFC 5545 requires escaping commas (`\,`), semicolons (`\;`), backslashes (`\\`), and newlines (`\n`) in text fields. Description and location must be escaped.
**How to avoid:** Run all text fields through an escape helper before embedding in ICS string.
**Warning signs:** Calendar apps show only partial description or refuse to import.

### Pitfall 4: Dead Buttons if Notion Fields Not Yet Populated
**What goes wrong:** Buttons appear for events but go nowhere.
**Why it happens:** Mixing old status/type gating with new field-existence checks, or rendering a button with `href=""`.
**How to avoid:** Every action button renders ONLY inside `{event.fieldName && <Component href={event.fieldName} />}`. No fallback `href="#"` or `href=""`.
**Warning signs:** Clicking Register on a new event shows a broken tab or navigates to `#`.

### Pitfall 5: Test Fixtures Not Updated for New Fields
**What goes wrong:** Existing `events.test.ts` tests fail because `FULL_EVENT_FIXTURE` now maps fields that tests assert `toBeNull()` or that the fixture doesn't include.
**Why it happens:** Adding new fields to `SAGIEEvent` and `mapEvent` without updating test fixtures.
**How to avoid:** Update `FULL_EVENT_FIXTURE` to include `Registration Link`, `More Info Link`, `Recap Link` properties. Update assertions in the full-mapping test. The minimal fixture will auto-cover null fallbacks.
**Warning signs:** Tests start failing with "Expected null, received undefined" on new fields.

### Pitfall 6: Google Calendar URL Datetime Format
**What goes wrong:** Google Calendar opens but shows wrong date/time.
**Why it happens:** Google Calendar `dates` param requires `YYYYMMDDTHHmmssZ` (UTC, compact, no dashes/colons). ISO 8601 strings with dashes fail silently.
**How to avoid:** Strip dashes and colons from the datetime string. For date-only events, use `YYYYMMDD/YYYYMMDD`.
**Warning signs:** Google Calendar event shows "January 1, 1970" or a date offset by hours.

---

## Code Examples

### Google Calendar URL Builder
```typescript
// No source URL — this is the stable Google Calendar URL format
function buildGoogleCalendarUrl(event: SAGIEEvent): string {
  const startDate = event.date!.replace(/-/g, '')  // YYYYMMDD
  const endDate = startDate  // same-day event; or next day for all-day
  const dates = event.time
    ? `${startDate}T${event.time.replace(/:/g, '')}00/${endDate}T${addOneHour(event.time)}`
    : `${startDate}/${endDate}`

  const description = [
    event.description,
    event.registrationLink ? `Register: ${event.registrationLink}` : null,
  ]
    .filter(Boolean)
    .join('\\n')

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.name,
    dates,
    details: description,
    location: event.venue ?? '',
  })
  return `https://calendar.google.com/calendar/render?${params}`
}
```

### ICS String Builder
```typescript
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

function buildIcsContent(event: SAGIEEvent): string {
  const now = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z'
  const isAllDay = !event.time

  const dtstart = isAllDay
    ? `DTSTART;VALUE=DATE:${event.date!.replace(/-/g, '')}`
    : `DTSTART:${event.date!.replace(/-/g, '')}T${event.time!.replace(/:/g, '')}00Z`

  // For DTEND: same date +1 day (all-day) or +1 hour (timed)
  const dtend = /* computed similarly */

  const descriptionParts = [
    event.description ?? '',
    event.registrationLink ? `Register: ${event.registrationLink}` : '',
  ].filter(Boolean).join('\\n')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SAGIE//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@sagie.co`,
    `DTSTAMP:${now}`,
    dtstart,
    dtend,
    `SUMMARY:${escapeIcsText(event.name)}`,
    descriptionParts ? `DESCRIPTION:${escapeIcsText(descriptionParts)}` : '',
    event.venue ? `LOCATION:${escapeIcsText(event.venue)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')
}
```

### ICS Route Handler
```typescript
// src/app/api/events/[id]/ics/route.ts
import { notion } from '@/lib/notion'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params  // CRITICAL: Next.js 16 async params

  try {
    const page = await notion.pages.retrieve({ page_id: id })
    const event = mapEventPage(page)  // reuse mapEvent logic
    const icsContent = buildIcsContent(event)

    const filename = event.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    return new Response(icsContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}.ics"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return new Response('Event not found', { status: 404 })
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Status/type gating for Register button | Field-existence gating (`registrationLink`) | Simpler logic, eliminates dead buttons |
| `webinarLink` for webinars only | `registrationLink` unified across all event types | Single field to populate in Notion for all registrations |
| `<ActionLink href="#">` placeholder | Strict null-check — no link without URL | No dead buttons |
| Image slot shows "Image" text when URL exists | `<img>` with `object-fit: cover` | Actual event images render |

**Deprecated/outdated:**
- `webinarLink` in `SAGIEEvent`: replaced by `registrationLink`. Field can be deprecated (kept in interface for backwards compatibility with existing tests, removed in a follow-up).
- Status/type conditional gating for Register: replaced entirely by field-existence check.
- `"Notify me when confirmed"` button: removed, EVT-06 deferred.

---

## Open Questions

1. **Notion property names for new fields**
   - What we know: Properties `Registration Link`, `More Info Link`, `Recap Link` are reasonable naming choices following existing `Webinar Link` convention
   - What's unclear: Whether these properties already exist in the Notion events database or need to be created (flagged in STATE.md pending todos)
   - Recommendation: Check Notion DB schema before implementation. If they don't exist, they must be added as URL-type properties in Notion before any data will appear. The planner should include a Wave 0 task to verify/create these Notion properties.

2. **Time zone handling for calendar links**
   - What we know: `event.date` is a date string from Notion (`2024-09-20`), `event.time` is always `null` (hardcoded in current `mapEvent`)
   - What's unclear: Whether the Notion events DB has a time property that should be mapped (possibly within `Event Date` date object which supports time)
   - Recommendation: Treat all events as all-day initially. Notion `date.start` can include time (`2024-09-20T18:00:00.000+03:00`) — mapEvent should check for it. ICS and calendar URL builders should handle both.

3. **recapLink points to internal blog slug or full URL?**
   - What we know: CONTEXT.md says "recaps live on sagie.co, not external" and directs use of Next.js `Link`
   - What's unclear: Whether the Notion field stores full URL (`https://sagie.co/blog/summit-recap`) or just slug (`/blog/summit-recap`)
   - Recommendation: Store full URL in Notion for consistency with other link fields. Extract pathname for Next.js `Link` href, or use `href` with full URL (Next.js Link supports full same-origin URLs).

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest ^4.1.2 |
| Config file | `vitest.config.ts` (project root) |
| Quick run command | `npx vitest run src/lib/__tests__/events.test.ts` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| EVT-01 | `mapEvent` maps `registrationLink` from Notion property | unit | `npx vitest run src/lib/__tests__/events.test.ts` | ✅ needs update |
| EVT-02 | ICS URL format and calendar URL construction | unit | `npx vitest run src/lib/__tests__/events.test.ts` | ❌ Wave 0 |
| EVT-03 | `mapEvent` maps `moreInfoLink` from Notion property | unit | `npx vitest run src/lib/__tests__/events.test.ts` | ✅ needs update |
| EVT-04 | `mapEvent` maps `recapLink` from Notion property | unit | `npx vitest run src/lib/__tests__/events.test.ts` | ✅ needs update |
| EVT-05 | Conditional rendering (data-driven) | manual/E2E | Visual check in dev | manual only |

### Sampling Rate
- **Per task commit:** `npx vitest run src/lib/__tests__/events.test.ts`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/lib/__tests__/events.test.ts` — update `FULL_EVENT_FIXTURE` with `Registration Link`, `More Info Link`, `Recap Link` properties and add assertions for new fields
- [ ] Add unit tests for ICS string builder (`buildIcsContent`) and Google Calendar URL builder — these are pure functions, easily testable
- [ ] Verify/create Notion DB properties: `Registration Link`, `More Info Link`, `Recap Link` (URL type) — prerequisite for any live data

---

## Sources

### Primary (HIGH confidence)
- Codebase — `src/lib/events.ts`, `src/app/(marketing)/events/EventsPageClient.tsx`, `src/lib/__tests__/events.test.ts` (direct read, current state confirmed)
- Codebase — `src/components/ui/BlogFilter.tsx` (Next.js Link usage pattern confirmed)
- Codebase — `vitest.config.ts` (test framework confirmed)
- Next.js docs — Route Handler dynamic params are `Promise` in Next.js 15+ (confirmed by project history decision `[Phase 03-features-globe]`)

### Secondary (MEDIUM confidence)
- Google Calendar URL format: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=...` — widely documented, stable format used across many integrations
- Outlook Calendar URL format: `https://outlook.live.com/calendar/0/deeplink/compose?rru=addevent&...` — documented in Microsoft support articles
- RFC 5545 ICS format: stable IETF standard (single-event, no alarms/recurrence — trivially simple subset)

### Tertiary (LOW confidence)
- None — all findings confirmed from codebase or authoritative sources

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all tooling already installed, confirmed in package.json
- Architecture: HIGH — follows exact existing patterns from codebase (EventAccordion, BlogFilter Link usage)
- Pitfalls: HIGH for async params (project history), MEDIUM for ICS escaping (RFC 5545 standard), MEDIUM for Google Calendar URL format (stable, widely documented)

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable domain — Next.js 16 API, ICS format, Google Calendar URLs are not fast-moving)
