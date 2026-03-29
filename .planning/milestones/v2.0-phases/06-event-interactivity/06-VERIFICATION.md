---
phase: 06-event-interactivity
verified: 2026-03-28T19:33:30Z
status: passed
score: 13/13 must-haves verified
re_verification: false
gaps: []
human_verification:
  - test: "Open /events page, expand a Confirmed event with a date, click '+ Add to Calendar'"
    expected: "Inline animated dropdown appears with Google Calendar, Outlook, and Apple Calendar (.ics) options; each link opens the correct destination or triggers a file download"
    why_human: "Framer-motion animation, live Notion data presence, and actual file download behavior cannot be verified programmatically"
  - test: "Open /events page, expand an event whose Notion record has an eventImage URL set"
    expected: "Image renders with object-cover cropping inside the 4:3 image slot; no layout overflow"
    why_human: "Visual rendering of external Notion image URLs requires a running browser"
  - test: "Open /events page and confirm no event card shows a 'Notify me when confirmed' button"
    expected: "Button is absent from every event in the list"
    why_human: "Absence of a UI element across live data requires visual inspection"
---

# Phase 6: Event Interactivity Verification Report

**Phase Goal:** Users can take action on events directly from the events page — register, get details, read recap, or add to their calendar
**Verified:** 2026-03-28T19:33:30Z
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | mapEvent extracts registrationLink, moreInfoLink, and recapLink from Notion URL properties | VERIFIED | `src/lib/events.ts` lines 64-66; 30 passing tests including explicit per-field assertions |
| 2 | mapEvent extracts time (HH:mm) from Notion date.start when datetime is present | VERIFIED | `src/lib/events.ts` lines 43-44; test "extracts time HH:mm from datetime Event Date" passes |
| 3 | GET /api/events/[id]/ics returns a valid .ics file with correct Content-Type and Content-Disposition headers | VERIFIED | `src/app/api/events/[id]/ics/route.ts` lines 21-27; headers hardcoded correctly |
| 4 | ICS content includes event name, date/time, location, description, and registration link | VERIFIED | `src/lib/calendar.ts` buildIcsContent; 8 ICS tests pass including SUMMARY, LOCATION, DESCRIPTION, VALUE=DATE assertions |
| 5 | All-day events use VALUE=DATE format in ICS and date-only format in Google Calendar URLs | VERIFIED | `src/lib/calendar.ts` lines 133-144 (ICS) and 38-44 (Google); tests confirm both formats |
| 6 | Register button opens external registration URL in a new tab when registrationLink is populated | VERIFIED | EventsPageClient.tsx line 250-252; ExternalActionLink has `target="_blank" rel="noopener noreferrer"` |
| 7 | More Info button opens external info URL in a new tab when moreInfoLink is populated | VERIFIED | EventsPageClient.tsx line 253-255; ExternalActionLink with noopener |
| 8 | Read Recap button navigates internally via Next.js Link when recapLink is populated | VERIFIED | EventsPageClient.tsx line 256-258; uses `InternalActionLink` which wraps Next.js `Link` |
| 9 | Add to Calendar button shows inline dropdown with Google Calendar, Outlook, Apple Calendar options when event is Confirmed with a date | VERIFIED | EventsPageClient.tsx lines 80-133; AddToCalendarDropdown with AnimatePresence, 3 calendar links |
| 10 | No action buttons render when their corresponding data fields are null | VERIFIED | Action row is pure field-existence gating (`event.registrationLink &&`, `event.moreInfoLink &&`, etc.); no href="#" found in file |
| 11 | Event images render with object-fit cover when eventImage is populated | VERIFIED | EventsPageClient.tsx lines 193-206; `img` with `className="w-full h-full object-cover"`, fallback to "No image" span |
| 12 | External link buttons show a diagonal arrow icon | VERIFIED | ExternalActionLink renders inline SVG path `d="M2 8L8 2M3 2h5v5"` (arrow-up-right) at lines 60-68 |
| 13 | "Notify me when confirmed" button is completely removed | VERIFIED | Grep of EventsPageClient.tsx returns zero matches for "Notify me"; no href="#" dead links anywhere in the action row |

**Score:** 13/13 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/lib/events.ts` | Extended SAGIEEvent interface with registrationLink, moreInfoLink, recapLink; exported mapEvent | VERIFIED | Interface lives in `src/types/events.ts` (re-exported from events.ts); mapEvent is exported at line 41; all 3 fields present |
| `src/types/events.ts` | SAGIEEvent interface definition | VERIFIED | 23-line interface with registrationLink, moreInfoLink, recapLink at lines 20-22 |
| `src/lib/calendar.ts` | buildGoogleCalendarUrl, buildOutlookCalendarUrl, buildIcsContent, escapeIcsText | VERIFIED | 172-line file, all 4 functions exported; file created as undocumented deviation to fix server-only import conflict |
| `src/app/api/events/[id]/ics/route.ts` | ICS file download endpoint with GET export | VERIFIED | 31-line file; GET handler uses Next.js 16 async params pattern; returns text/calendar response |
| `src/lib/__tests__/events.test.ts` | 30 tests covering new fields, calendar URL builders, ICS generation | VERIFIED | 30 tests pass (vitest run confirmed) |
| `src/app/(marketing)/events/EventsPageClient.tsx` | Data-driven action buttons, AddToCalendarDropdown, ExternalActionLink, InternalActionLink | VERIFIED | All 4 components present and wired; 429-line file with full implementation |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/app/api/events/[id]/ics/route.ts` | `src/lib/events.ts` | `import { mapEvent }` | VERIFIED | Line 2: `import { mapEvent } from '@/lib/events'` |
| `src/app/api/events/[id]/ics/route.ts` | `src/lib/calendar.ts` | `import { buildIcsContent }` | VERIFIED | Line 3: `import { buildIcsContent } from '@/lib/calendar'` (deviation from plan's events.ts — documented) |
| `src/lib/__tests__/events.test.ts` | `src/lib/events.ts` | tests mapEvent new fields | VERIFIED | Lines 23-26 import getUpcomingEvents/getPastEvents; lines 164-192 assert new fields |
| `src/lib/__tests__/events.test.ts` | `src/lib/calendar.ts` | imports calendar URL builders | VERIFIED | Lines 28-33: imports buildGoogleCalendarUrl, buildOutlookCalendarUrl, buildIcsContent, escapeIcsText from @/lib/calendar |
| `src/app/(marketing)/events/EventsPageClient.tsx` | `src/lib/calendar.ts` | `import { buildGoogleCalendarUrl, buildOutlookCalendarUrl }` | VERIFIED | Line 16 — plan specified @/lib/events but helpers were extracted to calendar.ts; import correctly points to calendar.ts |
| `src/app/(marketing)/events/EventsPageClient.tsx` | `/api/events/[id]/ics` | icsUrl used in AddToCalendarDropdown | VERIFIED | Line 84: `` const icsUrl = `/api/events/${event.id}/ics` `` used in Apple Calendar link with `download` attribute |

**Key deviation noted:** The 06-02 PLAN specified `pattern: "import.*buildGoogleCalendarUrl.*from.*@/lib/events"` but the actual import is from `@/lib/calendar`. This was a documented, blocking-priority fix in 06-02-SUMMARY (server-only import conflict). The wiring is functionally correct — the import resolves to the right functions.

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| EVT-01 | 06-01, 06-02 | Register button opens external registration URL from Notion | SATISFIED | ExternalActionLink with `href={event.registrationLink}`, `target="_blank"`; registrationLink mapped from Notion |
| EVT-02 | 06-01, 06-02 | Add to Calendar modal offers Google Calendar, Outlook, Apple Calendar links and .ics download | SATISFIED | AddToCalendarDropdown with Google, Outlook, Apple Calendar (.ics) links; ICS route at /api/events/[id]/ics |
| EVT-03 | 06-01, 06-02 | More Info button links to event's detail/info URL from Notion | SATISFIED | ExternalActionLink with `href={event.moreInfoLink}`; moreInfoLink mapped from Notion |
| EVT-04 | 06-01, 06-02 | Read Recap button links to event's recap URL from Notion | SATISFIED | InternalActionLink (Next.js Link) with `href={event.recapLink}`; recapLink mapped from Notion |
| EVT-05 | 06-02 | Event action buttons show/hide based on data availability (no dead buttons) | SATISFIED | All action buttons guarded by field-existence checks; no `href="#"` in file; "Notify me when confirmed" removed |

**All 5 EVT requirements satisfied.** No orphaned requirements — every EVT-01 through EVT-05 is claimed by plans 06-01 or 06-02 and has implementation evidence.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/app/(marketing)/events/EventsPageClient.tsx` | 194 | `eslint-disable-next-line @next/next/no-img-element` | INFO | Intentional: Notion image URLs are external; next/image would require remotePatterns config. Documented decision in 06-02-SUMMARY. No functional impact. |

No blockers. No stub implementations. No TODO/FIXME/placeholder comments in phase files.

---

### Human Verification Required

The following items pass automated checks but require a running browser to fully confirm:

#### 1. Add to Calendar Dropdown — Live Interaction

**Test:** Run `npm run dev`, visit http://localhost:3000/events, expand a Confirmed event with a date, click "+ Add to Calendar"
**Expected:** Animated dropdown appears with three options (Google Calendar, Outlook, Apple Calendar (.ics)); Google Calendar link opens Google Calendar with prefilled event details; Apple Calendar link triggers .ics file download
**Why human:** Framer-motion animation, live Notion data, and browser download behavior cannot be verified programmatically

#### 2. Event Image Rendering

**Test:** With dev server running, expand any event that has an eventImage URL in Notion
**Expected:** Image fills the 4:3 image slot with object-cover cropping; container has overflow-hidden so no bleed
**Why human:** Visual rendering of external Notion URLs requires a live browser

#### 3. Absence of Dead Buttons

**Test:** Browse the full events list in the browser
**Expected:** No "Notify me when confirmed" button appears on any event; no broken or visually orphaned links
**Why human:** Comprehensive absence checks across live data require visual scanning

---

## Deviations from Plan (Documented, Non-Blocking)

1. **calendar.ts extraction:** Plan 06-01 specified calendar helpers exported from `events.ts`; they were extracted to `src/lib/calendar.ts` in Plan 06-02 to resolve a server-only import conflict. All imports in route.ts and EventsPageClient.tsx correctly reference `@/lib/calendar`. Tests import from `@/lib/calendar`. The wiring is correct end-to-end.

2. **Plan 06-02 key-link pattern mismatch:** Plan 06-02 specifies `pattern: "import.*buildGoogleCalendarUrl.*from.*@/lib/events"` but the actual import is from `@/lib/calendar`. This is a stale plan pattern, not a wiring failure — the deviation was necessary and documented.

3. **"Download .ics" option removed:** Plan 06-02 specified 4 calendar options (Google, Outlook, Apple Calendar, Download .ics). Implemented with 3 options — "Apple Calendar (.ics)" covers both; user confirmed this during human verification checkpoint (06-02-SUMMARY). No functional gap.

---

## Summary

Phase 06 goal is fully achieved. All data layer work (06-01) is substantive and tested: `mapEvent` extracts the three new URL fields and event time, four calendar helpers are exported and tested with 30 passing tests, and the ICS API route is wired correctly with Next.js 16 async params. All UI work (06-02) is substantive and wired: action buttons are field-existence gated, `ExternalActionLink` opens new tabs with noopener and an external arrow icon, `InternalActionLink` uses Next.js `Link`, `AddToCalendarDropdown` builds and renders all calendar options, and the "Notify me" button is gone. TypeScript reports zero errors. Three visual/interactive behaviors are flagged for human confirmation.

---

_Verified: 2026-03-28T19:33:30Z_
_Verifier: Claude (gsd-verifier)_
