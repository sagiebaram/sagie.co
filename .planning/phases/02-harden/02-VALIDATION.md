---
phase: 2
slug: harden
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None installed yet (TEST-01 is Phase 4) |
| **Config file** | none — Wave 0 not applicable |
| **Quick run command** | n/a — no test runner configured |
| **Full suite command** | n/a |
| **Estimated runtime** | n/a |

---

## Sampling Rate

- **After every task commit:** Manual curl/browser check of the specific change
- **After every plan wave:** Full manual checklist per success criteria
- **Before `/gsd:verify-work`:** All 5 success criteria must be TRUE
- **Max feedback latency:** ~30 seconds (manual verification)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| TBD | TBD | TBD | SEC-01 | manual-only | `curl -X POST localhost:3000/api/applications/membership` (6x) → 6th returns 429 | ❌ | ⬜ pending |
| TBD | TBD | TBD | SEC-02 | manual-only | `curl -H "Origin: https://evil.com" localhost:3000/api/applications/membership` → 403 | ❌ | ⬜ pending |
| TBD | TBD | TBD | SEC-03 | manual-only | Browser DevTools → Network → CSP header has nonce, no unsafe-inline | ❌ | ⬜ pending |
| TBD | TBD | TBD | SEC-04 | code-review | `grep tracesSampleRate sentry.*.config.ts` → 0.1 in production | ❌ | ⬜ pending |
| TBD | TBD | TBD | FEAT-05 | manual-only | Throw error in each route segment → error.tsx renders; throttle network → loading.tsx renders | ❌ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements — no test framework setup needed for this phase. Manual verification is appropriate since automated testing infrastructure (Vitest) is deferred to Phase 4.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Rate limiting returns 429 | SEC-01 | No test framework yet (Phase 4) | `curl -X POST` same endpoint 6 times rapidly → 6th returns 429 with Retry-After header |
| Origin rejection returns 403 | SEC-02 | No test framework yet | `curl -H "Origin: https://evil.com"` → 403; omit Origin → allowed |
| CSP nonce in headers | SEC-03 | Requires browser/curl inspection | Check response headers: CSP script-src has `nonce-*`, no `unsafe-inline` |
| Sentry sample rate | SEC-04 | Static config check | grep `tracesSampleRate` in sentry configs → 0.1 when NODE_ENV=production |
| Error/loading boundaries | FEAT-05 | Requires runtime error injection | Throw in each route segment → error.tsx renders with retry/home/contact; throttle → loading.tsx shows shimmer skeleton |

---

## Validation Sign-Off

- [ ] All tasks have manual verify instructions documented
- [ ] Sampling continuity: manual check after each task commit
- [ ] Wave 0 not needed (no test framework this phase)
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s (manual checks)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
