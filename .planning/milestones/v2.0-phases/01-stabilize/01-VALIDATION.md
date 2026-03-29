---
phase: 1
slug: stabilize
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (not yet installed — Phase 4 installs it) |
| **Config file** | none — no unit test framework in Phase 1 |
| **Quick run command** | `npx next lint && npx tsc --noEmit` |
| **Full suite command** | `npx next lint && npx tsc --noEmit && npx next build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx next lint && npx tsc --noEmit`
- **After every plan wave:** Run `npx next lint && npx tsc --noEmit && npx next build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | BUG-01 | build + lint | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 1-01-02 | 01 | 1 | BUG-02 | build + lint | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 1-01-03 | 01 | 1 | BUG-03 | build + lint | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 1-02-01 | 02 | 1 | CLN-01 | build + grep | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 1-02-02 | 02 | 1 | CLN-02 | build + grep | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 1-02-03 | 02 | 1 | CLN-03 | build + grep | `npx tsc --noEmit` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. Phase 1 is bug fixes and cleanup — lint and type-check are sufficient verification.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| ChapterForm fields reach Notion | BUG-01 | Requires Notion API credentials | Submit form, check Notion database for all fields |
| MembershipForm fields reach Notion | BUG-01 | Requires Notion API credentials | Submit form, check Notion database for all fields |
| Globe mounts/unmounts cleanly | BUG-02 | Requires browser interaction | Navigate to/from social proof section, check no console errors |
| App starts without optional env vars | BUG-03 | Requires env var manipulation | Remove NOTION_DEAL_PIPELINE_DB_ID and REVALIDATE_SECRET, run `next dev` |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
