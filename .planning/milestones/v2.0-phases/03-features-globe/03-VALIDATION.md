---
phase: 3
slug: features-globe
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 |
| **Config file** | vitest.config.ts (project root) |
| **Quick run command** | `npx vitest run src/lib/__tests__/` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/lib/__tests__/`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | FEAT-01 | unit | `npx vitest run src/lib/__tests__/revalidate.test.ts -x` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | FEAT-01 | unit | `npx vitest run src/lib/__tests__/revalidate.test.ts -x` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 1 | FEAT-02 | unit | `npx vitest run src/lib/__tests__/email.test.ts -x` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 1 | FEAT-02 | unit | `npx vitest run src/lib/__tests__/email.test.ts -x` | ❌ W0 | ⬜ pending |
| 03-02-03 | 02 | 1 | FEAT-03 | unit | `npx vitest run src/lib/__tests__/email.test.ts -x` | ❌ W0 | ⬜ pending |
| 03-03-01 | 03 | 1 | FEAT-04 | unit | `npx vitest run src/lib/__tests__/sitemap.test.ts -x` | ❌ W0 | ⬜ pending |
| 03-03-02 | 03 | 1 | FEAT-04 | unit | `npx vitest run src/lib/__tests__/sitemap.test.ts -x` | ❌ W0 | ⬜ pending |
| 03-04-01 | 04 | 2 | GLOBE-01 | manual | manual code review | N/A | ⬜ pending |
| 03-04-02 | 04 | 2 | GLOBE-02 | unit | `npx vitest run src/lib/__tests__/members.test.ts -x` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/__tests__/revalidate.test.ts` — stubs for FEAT-01 (mock revalidateTag)
- [ ] `src/lib/__tests__/email.test.ts` — stubs for FEAT-02, FEAT-03 (mock Resend SDK)
- [ ] `src/lib/__tests__/sitemap.test.ts` — stubs for FEAT-04 (mock lib functions)
- [ ] `src/lib/__tests__/members.test.ts` — stubs for GLOBE-02 (mock Notion client)

*Note: Existing `src/lib/__tests__/validation.test.ts` mock pattern for `@/env/server` will need updating to include `RESEND_API_KEY` and `NOTION_CHAPTERS_DB_ID`.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| GeoJSON fetch uses /data/ path not GitHub URL | GLOBE-01 | Simple URL change, code review sufficient | Verify GlobeNetwork.tsx fetch() points to /data/ne_110m_admin_0_countries.geojson |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
