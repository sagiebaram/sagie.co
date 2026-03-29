---
phase: 7
slug: form-redesign
status: active
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-28
updated: 2026-03-28
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 (unit) + Playwright 1.58.2 (E2E) |
| **Config file** | `vitest.config.ts` (root) |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm test && npx playwright test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test`
- **After every plan wave:** Run `npm test && npx playwright test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | FORM-03 | unit | `npm test -- schemas.test.ts` | yes | done |
| 07-01-02 | 01 | 1 | FORM-01 | unit | `npm test` | yes | done |
| 07-01-03 | 01 | 1 | FORM-02 | unit | `npm test -- schemas.test.ts` | yes | done |
| 07-02-01 | 02 | 1 | FORM-01, FORM-02, FORM-03 | E2E | `npx playwright test tests/forms.spec.ts` | yes | done |
| 07-02-02 | 02 | 1 | FORM-01, FORM-02, FORM-03 | E2E | `npx playwright test tests/forms.spec.ts` | yes | done |
| 07-03-01 | 03 | 2 | FORM-02, FORM-03 | build+unit | `npm run build 2>&1 \| tail -20 && npm test 2>&1 \| tail -10` | yes | pending |
| 07-03-02 | 03 | 2 | FORM-01, FORM-02 | E2E | `npx playwright test tests/forms.spec.ts` | yes | pending |

*Status: pending / done / red / flaky*

**Sequencing note:** 07-03-01 replaces native `<select>` with custom dropdown, which breaks E2E tests that use `page.selectOption()`. Task 07-03-02 fixes the E2E tests immediately after. These two tasks MUST execute sequentially within the same plan — no E2E test run between them. Only `npm run build` and `npm test` (unit tests) are run after Task 1; the full E2E suite runs after Task 2.

---

## Wave 0 Requirements

- [x] `tests/forms.spec.ts` — field selectors updated in 07-02 (founderName, providerName, sector, stage)
- [x] `src/lib/__tests__/schemas.test.ts` — MembershipSchema role enum tests created in 07-01
- [ ] `src/lib/__tests__/schemas.test.ts` — role field tests need update when 07-03-01 changes role from enum to string

*Existing infrastructure covers all phase requirements with updates — no new test files required.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Custom dropdown styling matches dark theme | FORM-02 | Visual consistency check | Open any form with a dropdown — verify background, border, text colors match site tokens |
| Custom checkbox styling matches dark theme | FORM-02 | Visual consistency check | Inspect checkbox group on Membership form — borders, checked state, colors match site tokens |
| Section headers appear on long forms | FORM-02 | Visual layout verification | Open Membership and Ventures forms — verify section grouping with subtle headers |
| Error message tone is conversational | FORM-01 | Subjective content quality | Trigger errors on each form — messages should read naturally, not like system errors |
| "Other" free-text input appears smoothly | FORM-02 | Visual/interaction quality | Select "Other" in role dropdown — free-text input should appear inline without jarring layout shift |
| Keyboard navigation works on dropdowns | FORM-02 | Interaction quality | Focus dropdown trigger, use arrow keys, Enter, Escape — verify expected behavior |
| Click-outside closes dropdown | FORM-02 | Interaction quality | Open a dropdown, click elsewhere on the page — dropdown should close |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved
