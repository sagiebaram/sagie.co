---
phase: 4
slug: testing
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (unit) + Playwright (E2E) |
| **Config file** | vitest.config.ts (Wave 0 creates) + playwright.config.ts (exists) |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run && npx playwright test` |
| **Estimated runtime** | ~15 seconds (unit) + ~30 seconds (E2E) |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx vitest run && npx playwright test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 45 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| TBD | 01 | 1 | TEST-01 | infra | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | TEST-02 | unit | `npx vitest run src/lib/__tests__/` | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | TEST-03 | unit | `npx vitest run src/lib/__tests__/` | ❌ W0 | ⬜ pending |
| TBD | 02 | 2 | TEST-04 | e2e | `npx playwright test` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — Vitest configuration with @/ path alias
- [ ] `npm install -D vitest` — Install Vitest framework
- [ ] `src/lib/__tests__/` — Test directory structure

*Existing infrastructure: Playwright already installed and configured.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| CI pipeline green | TEST-01 | Requires GitHub Actions run | Push to branch, verify CI unit job passes |

*All other phase behaviors have automated verification.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 45s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
