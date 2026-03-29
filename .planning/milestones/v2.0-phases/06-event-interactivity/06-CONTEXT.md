# Phase 6: Event Interactivity - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire event action buttons (Register, More Info, Read Recap, Add to Calendar) to real data from Notion, build an inline Add to Calendar dropdown with .ics download, render event images, and ensure no dead buttons appear when Notion fields are empty. Delivers EVT-01, EVT-02, EVT-03, EVT-04, EVT-05.

</domain>

<decisions>
## Implementation Decisions

### Add to Calendar dropdown
- Inline dropdown below the "Add to Calendar" button — no modal overlay, no backdrop
- Consistent with the accordion expand pattern already used on the events page
- Four calendar options: Google Calendar, Outlook, Apple Calendar, and Download .ics
- .ics file generated via a server API route (`/api/events/[id]/ics`) — NOT client-side Blob (user chose this despite REQUIREMENTS.md listing server-side ICS as out-of-scope; decision overrides that exclusion)
- Calendar entry includes: event name, date/time, venue (as location), description, and registration link in notes if available

### Action button visibility
- Strict data-driven: buttons only render when their corresponding Notion URL field is populated
- Register: only shows if `registrationLink` exists — no status/type gating
- More Info: only shows if `moreInfoLink` exists
- Read Recap: only shows if `recapLink` exists
- Add to Calendar: shows for Confirmed-status events that have a date
- "Notify me when confirmed" removed entirely — EVT-06 is deferred, no dead button
- Unified registration: single `registrationLink` field replaces the current split between `webinarLink` (for webinars) and missing field (for SAGIE Events)

### Event images
- Wire the existing image slot to actual `eventImage` data from Notion
- Image fills the 200px x 4:3 slot with `object-fit: cover` — crops to fit, consistent sizing
- Keep "No image" placeholder when `eventImage` is null

### Link behavior
- All external action links (Register, More Info) open in new tab: `target="_blank"` + `rel="noopener noreferrer"`
- Read Recap links to internal blog posts — use Next.js `Link` for client-side navigation (not `<a>` tag)
- Add a small external-link icon (arrow-up-right / diagonal arrow) next to buttons that open new tabs
- Keep existing `->` arrow suffix on button labels

### Claude's Discretion
- Inline dropdown animation/transition style
- External link icon choice (SVG or Unicode)
- ICS API route implementation details (ical library vs manual string)
- How to handle events with a date but no time (all-day event in calendar)
- Image loading/error states (blur placeholder, skeleton, etc.)
- Exact Notion property names for new fields (registrationLink, moreInfoLink, recapLink)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `EventsPageClient` (src/app/(marketing)/events/EventsPageClient.tsx): Main events page — action buttons already rendered, need rewiring
- `ActionLink` component (same file): Simple `<a>` tag for action buttons — needs modification for new-tab behavior and external link icon; Read Recap needs Next.js Link variant
- `EventAccordion` component (same file): Accordion expand/collapse with AnimatePresence — Add to Calendar dropdown can follow same animation pattern
- `SAGIEEvent` interface (src/lib/events.ts): Data model — needs `registrationLink`, `moreInfoLink`, `recapLink` fields added
- `mapEvent` function (src/lib/events.ts): Notion property mapping — needs new field mappings

### Established Patterns
- AnimatePresence + motion.div for expand/collapse animations (used by EventAccordion)
- `unstable_cache` with tags for Notion data fetching (events.ts)
- Badge component for status/format labels — inline, lightweight
- useScrollReveal for GSAP scroll animations on event items

### Integration Points
- `SAGIEEvent` interface: add registrationLink, moreInfoLink, recapLink fields
- `mapEvent`: add Notion property mappings for new URL fields
- `EventsPageClient` action row: rewire button rendering logic to data-driven approach
- New API route: `/api/events/[id]/ics` for .ics file generation
- `webinarLink` field: can be deprecated once registrationLink is unified

</code_context>

<specifics>
## Specific Ideas

- Read Recap should use Next.js Link for internal blog navigation — recaps live on sagie.co, not external
- External link icon should be subtle (small diagonal arrow) — complements the existing `->` arrow, doesn't replace it
- The inline dropdown for Add to Calendar should feel lightweight — no heavy modal for 4 simple links

</specifics>

<deferred>
## Deferred Ideas

- "Notify me when confirmed" (EVT-06) — requires email capture without user accounts, explicitly deferred
- Server-side ICS was listed as out-of-scope in REQUIREMENTS.md but user chose it here — update REQUIREMENTS.md to remove from out-of-scope

</deferred>

---

*Phase: 06-event-interactivity*
*Context gathered: 2026-03-28*
