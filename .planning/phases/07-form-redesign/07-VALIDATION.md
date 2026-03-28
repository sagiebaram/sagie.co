---
phase: 7
slug: form-redesign
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
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
| 07-01-01 | 01 | 1 | FORM-03 | unit | `npm test -- schemas.test.ts` | ✅ (needs updates) | ⬜ pending |
| 07-01-02 | 01 | 1 | FORM-01 | unit | `npm test` | ❌ W0 | ⬜ pending |
| 07-02-01 | 02 | 1 | FORM-01 | E2E | `npx playwright test tests/forms.spec.ts` | ✅ (needs updates) | ⬜ pending |
| 07-02-02 | 02 | 1 | FORM-02 | E2E | `npx playwright test tests/forms.spec.ts` | ✅ (needs updates) | ⬜ pending |
| 07-02-03 | 02 | 1 | FORM-03 | E2E | `npx playwright test tests/forms.spec.ts` | ✅ (needs updates) | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/forms.spec.ts` — update field selectors (founderName, providerName), add blur-validation assertions, add new field selectors (sector, rateRange, category checkboxes), fix stage option casing (`Pre-Seed` not `Pre-seed`)
- [ ] `src/lib/__tests__/schemas.test.ts` — update MembershipSchema role field from string to enum, update fixtures for new enum values

*Existing infrastructure covers all phase requirements with updates — no new test files required.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Custom checkbox styling matches dark theme | FORM-02 | Visual consistency check | Inspect checkbox group on Membership form — borders, checked state, colors match site tokens |
| Section headers appear on long forms | FORM-02 | Visual layout verification | Open Membership and Ventures forms — verify section grouping with subtle headers |
| Error message tone is conversational | FORM-01 | Subjective content quality | Trigger errors on each form — messages should read naturally, not like system errors |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
