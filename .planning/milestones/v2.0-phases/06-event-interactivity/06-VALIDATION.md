---
phase: 6
slug: event-interactivity
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^4.1.2 |
| **Config file** | `vitest.config.ts` (project root) |
| **Quick run command** | `npx vitest run src/lib/__tests__/events.test.ts` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/lib/__tests__/events.test.ts`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | EVT-01 | unit | `npx vitest run src/lib/__tests__/events.test.ts` | ✅ needs update | ⬜ pending |
| 06-01-02 | 01 | 1 | EVT-03 | unit | `npx vitest run src/lib/__tests__/events.test.ts` | ✅ needs update | ⬜ pending |
| 06-01-03 | 01 | 1 | EVT-04 | unit | `npx vitest run src/lib/__tests__/events.test.ts` | ✅ needs update | ⬜ pending |
| 06-02-01 | 02 | 2 | EVT-02 | unit | `npx vitest run src/lib/__tests__/events.test.ts` | ❌ W0 | ⬜ pending |
| 06-02-02 | 02 | 2 | EVT-05 | manual/E2E | Visual check in dev | manual only | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/__tests__/events.test.ts` — update `FULL_EVENT_FIXTURE` with `Registration Link`, `More Info Link`, `Recap Link` properties and add assertions for new fields
- [ ] Add unit tests for ICS string builder (`buildIcsContent`) and Google Calendar URL builder — pure functions, easily testable
- [ ] Verify/create Notion DB properties: `Registration Link`, `More Info Link`, `Recap Link` (URL type) — prerequisite for live data

*Existing infrastructure covers framework setup — only test content gaps need filling.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Action buttons only render when Notion field populated | EVT-05 | Conditional rendering depends on Notion data state | 1. Open events page in dev 2. Verify events with links show buttons 3. Verify events without links hide buttons |
| Add to Calendar dropdown opens with 4 options | EVT-02 | Interactive dropdown behavior | 1. Click "+ Add to Calendar" on confirmed event 2. Verify Google/Outlook/Apple/.ics options appear 3. Click each link and verify it opens correct target |
| External links open in new tab | EVT-01, EVT-03 | Browser tab behavior | 1. Click Register on event with registrationLink 2. Verify new tab opens 3. Repeat for More Info |
| Read Recap uses client-side navigation | EVT-04 | Next.js Link behavior | 1. Click Read Recap 2. Verify no full page reload (client-side nav) |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
