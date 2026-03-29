---
phase: 8
slug: admin-polish-404
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (configured in `vitest.config.ts`) |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/lib/__tests__/revalidate.test.ts` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/lib/__tests__/revalidate.test.ts`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 08-01-01 | 01 | 1 | POL-01 | manual-only | (React UI state — per-button spinner/success/failure) | N/A — UI behavior | ⬜ pending |
| 08-01-02 | 01 | 1 | POL-02 | manual-only | (React UI state — 401 detection and prompt reset) | N/A — UI behavior | ⬜ pending |
| 08-02-01 | 02 | 1 | POL-03 | manual-only | (SVG illustration + CSS animation — visual check at /nonexistent) | N/A — visual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new test files needed.

- Existing `src/lib/__tests__/revalidate.test.ts` already tests API 401 response
- POL-01/POL-03 are client-side UI concerns — Vitest config is `environment: 'node'` with `.ts` glob only
- Playwright e2e tests exist but do not cover admin or 404 pages

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Per-button loading spinner appears during revalidation | POL-01 | React UI state transition — not testable in node environment | 1. Navigate to /admin/revalidate 2. Enter secret 3. Click Blog button 4. Observe spinner replaces label 5. Observe green checkmark after ~1s 6. Observe auto-dismiss after 3s |
| Per-button success/failure indicator | POL-01 | Visual feedback — color and icon rendering | 1. Click any tag button 2. Verify green checkmark on success 3. Enter wrong secret, click button 4. Verify red X appears |
| 401 resets to access prompt | POL-02 | Client-side state reset — depends on full React lifecycle | 1. Enter wrong secret 2. Click any revalidation button 3. Verify red X flash on button 4. After ~2s, verify page resets to secret prompt 5. Verify hint text "Secret was invalid or has been rotated" appears |
| Parallel requests work independently | POL-01 | Multi-button async state — requires real browser interaction | 1. Click Blog then immediately click Events 2. Verify both show independent spinners 3. Verify both resolve independently |
| Circuit-board SVG illustration renders | POL-03 | Visual rendering check | 1. Navigate to /nonexistent-page 2. Verify circuit-board illustration with broken path node 3. Verify subtle CSS animation (pulse or trace effect) 4. Verify "This page doesn't exist, but there's plenty to explore" copy |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
