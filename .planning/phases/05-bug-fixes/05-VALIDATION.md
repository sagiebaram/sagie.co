---
phase: 5
slug: bug-fixes
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^4.1.2 (unit) + Playwright ^1.58.2 (E2E) |
| **Config file** | `vitest.config.ts` (unit), `playwright.config.ts` (E2E) |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx playwright test` |
| **Estimated runtime** | ~15 seconds (unit), ~60 seconds (E2E) |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx playwright test tests/filters.spec.ts tests/navigation.spec.ts tests/forms.spec.ts`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds (unit), 60 seconds (E2E)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| TBD | 01 | 1 | FIX-01 | E2E | `npx playwright test tests/filters.spec.ts` | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | FIX-01 | E2E | `npx playwright test tests/filters.spec.ts` | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | FIX-02 | manual | manual-only (animation timing) | n/a | ⬜ pending |
| TBD | 02 | 1 | FIX-03 | E2E | `npx playwright test tests/navigation.spec.ts` | ❌ W0 | ⬜ pending |
| TBD | 02 | 1 | FIX-04 | E2E | `npx playwright test tests/forms.spec.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/filters.spec.ts` — FIX-01: URL param sync, clean URL on "All", back/forward restores filter
- [ ] `tests/navigation.spec.ts` — FIX-03: page content visible after browser back navigation
- [ ] New test case in `tests/forms.spec.ts` — FIX-04: mock 429 response, assert warning message displayed and button disabled

*Note: FIX-02 animation correctness is manual-only (visual inspection of 200ms CSS fade vs stagger replay)*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Filter-change fade animation (~200ms) vs page-load stagger | FIX-02 | Animation timing and visual quality require visual inspection | 1. Navigate to /blog 2. Wait for initial stagger animation 3. Click a category filter 4. Verify: old items disappear instantly, new items fade in smoothly (~200ms) 5. Verify: no stagger/slide animation on filter change |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
