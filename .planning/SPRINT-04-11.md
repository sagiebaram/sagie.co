# Sprint 04-11 — Membership Wizard + Contribute Page

**Year:** 2026
**Dates:** 04-11-2026 → 04-18-2026 (1 week)
**Theme:** Ship the two biggest form/page surfaces in Phase 2 — the multi-step membership wizard (ADR v2) and the `/contribute` route with its own form and data store.
**Status:** Planning

---

## Sprint Goal

Land two bodies of work in parallel:

1. **Membership Wizard** — replace `MembershipForm.tsx` with a 6-step wizard per `ADR-MEMBERSHIP-WIZARD.md`. Rewrites `schemas.ts`, the membership API route, the E2E flow, and adds 12 new Notion Members properties via a Claude Code migration script. Matchmaking foundation (identity + need tags) ships here.
2. **Contribute Page + Form** — build `/contribute` from `CONTENT-CONTRIBUTE-PAGE.md` and the two approved mockups. New marketing route, new `ContributeForm` component, new `/api/contributions` route, new Notion **Contributions** database (created via migration script). Reusable `Ticker` component lands here (also closes out carryover B-2).

Nothing else. No known-concerns sweep, no carryover polish, no stretch items. One week means one focus.

---

## REVISION — 04-11 post-v1 review

Track 2's v1 shipped mid-sprint (hero, ticker, 6-card grid, pillars, CTA banner, ContributeForm, API, Notion Contributions DB). Sagie reviewed live and pivoted:

1. **Fix v1 bugs** on `/contribute` — hero max-width/eyebrow, ticker true-infinite-loop + snappier timing, Ways section H2/desc + richer card bodies, How It Works render bug, delete Pillars section and CTA banner.
2. **Defer all form/API/Notion work** — `ContributeForm.tsx`, `/api/applications/contribution/route.ts`, `src/lib/contributions.ts`, `scripts/notion-create-contributions-db.ts`, Notion Contributions DB, `tests/contribute.spec.ts`, and `FormType` union additions are **removed from the branch** this session. Rolled into a forms consolidation sprint after Track 3 merges.
3. **Build `/contribute-v2`** — new unlinked route with a fresh visual pass and Sagie's 5-category copy (Expertise / Connections / Opportunities / Resources / Feedback) pasted 04-11. For A/B comparison against `/contribute` v1.

**Impact on Definition of Done (this section):**
- ~~Live site shows `/contribute` rendering the full page + embedded form~~ → Live site shows `/contribute` (revised v1, no form) AND `/contribute-v2` (comparison page, no form)
- ~~Contribute form writes to new Notion Contributions DB on submit~~ → DEFERRED
- ~~`tests/contribute.spec.ts` covers the contribute form happy path~~ → DEFERRED

**Impact on capacity:** Track 2 effort drops from XL (3 pts) to M–L (~1.5 pts). Net sprint utilization ≈ 70% instead of 85%. Room absorbed by the v2 visual pass.

**Impact on carryover:** B-2 Marquee ticker now closes via the ticker *fix* (true CSS infinite loop) instead of the original v1 build.

The revised session prompt lives in `.planning/SPRINT-04-11-SESSIONS.md` Track 2. This doc is kept as the historical record of what was planned 04-11 morning.

---

## Locked Decisions (from scoping conversation 04-11)

| Decision | Choice |
|----------|--------|
| Sprint length | 1 week (04-11 → 04-18) |
| Notion Members schema | Created by Claude Code at the start of the wizard API track via Notion API |
| Contribute data store | New Notion **Contributions** database, created by Claude Code at start of contribute track |
| Known concerns this sprint | **None** — deferred to follow-up sprint |
| Scope | Wizard + Contribute only — no stretch |

---

## Carryover from Sprint 04-07

| Item | Status this sprint | Why |
|------|-------------------|-----|
| B-2 Marquee ticker | **In scope** — folded into Track 2 | The contribute page mockup uses a ticker. Building it here as a reusable `Ticker` component satisfies both the contribute page and the B-2 carryover. |
| B-5 Circuit trace | Deferred | Out of scope this sprint — wizard + contribute only. Re-review next sprint. |
| B-6 Horizontal gallery | Deferred | Same. |
| B-7 Editorial layout | Deferred | Same. |
| B-8 Scene reveal | Deferred | Same. |

---

## Known Concerns — Status Check (from instructions.md §Known concerns)

Every known concern listed below. Per scoping decision, all are acknowledged and deferred.

| Concern | Severity | Status |
|---------|----------|--------|
| Missing Notion property handling | MEDIUM | Acknowledged — deferred. Wizard API route will add property-existence logging for its own fields as it goes; broader fix deferred. |
| In-memory rate limiter | LOW | Acknowledged — deferred. Scale not a concern yet. |
| Globe memory leak | MEDIUM | Acknowledged — deferred. Scoped to homepage; unrelated to sprint work. |
| Role field single-select | MEDIUM | **Resolved** — wizard redesign replaces role with `identityTags` / `needTags` multi-selects. |
| Referral source free text | LOW | **Resolved** — wizard Step 5 uses a dropdown per ADR §2. |
| Generic error messages | MEDIUM | Acknowledged — deferred. Wizard step-level errors use ADR-specified messaging; broader sweep deferred. |
| Resource submission form rework | MEDIUM | Acknowledged — deferred. |
| Honeypot timing too strict | LOW | Acknowledged — deferred. |
| HTML sanitization in email templates | MEDIUM | Acknowledged — deferred. Flag: both new API routes will write Notion + email with unsanitized user input, same as existing routes. Fix follow-up sprint. |
| Admin email hardcoded | LOW | Acknowledged — deferred. |
| HTML injection in Notion content | MEDIUM | Acknowledged — deferred. |
| CircuitBackground high-DPI scaling | LOW-MEDIUM | Acknowledged — deferred. |
| Globe type safety | LOW | Acknowledged — deferred. |
| EventsPageClient error retry | MEDIUM | Acknowledged — deferred. |
| Checkbox accessibility | MEDIUM | **Partially resolved** — wizard introduces new checkbox groups which must follow ARIA patterns in ADR §7. Broader audit deferred. |
| Notion sync monitoring | MEDIUM | Acknowledged — deferred. |
| No analytics | LOW | Acknowledged — deferred. |
| API error paths untested | MEDIUM | **Partially addressed** — wizard API route rewrite includes E2E coverage for success + validation + rate-limit paths. |
| No E2E for critical flows | MEDIUM | **Partially addressed** — new `apply.spec.ts` wizard E2E covers the full 6-step happy path + invalid advance. |
| Ventures founder/investor E2E | MEDIUM | Acknowledged — deferred. |
| Phone/Country Notion verification | MEDIUM | Acknowledged — deferred. |
| Validation edge cases | LOW | Acknowledged — deferred. |

---

## Scope Breakdown

### Body of Work 1 — Membership Wizard

Source: `.planning/ADR-MEMBERSHIP-WIZARD.md` (v2, approved 04-08)

Per §10 of the ADR, this requires:
- 1 file deletion (`MembershipForm.tsx`)
- 1 major rewrite (`schemas.ts`)
- 10 new files (1 wizard container + 6 step components + 3 UI primitives)
- 1 API route rewrite
- 1 apply/page.tsx swap
- 12 new Notion Members properties
- E2E test rewrite

### Body of Work 2 — Contribute Page + Form

Source: `.planning/CONTENT-CONTRIBUTE-PAGE.md`, `.planning/mockups/contribute-page.html`, `.planning/mockups/contribution-form.html`

Requires:
- New route `src/app/(marketing)/contribute/page.tsx`
- New copy constants `src/constants/contribute.ts`
- New section components for hero, ticker, contribution grid, how-it-works, pillar alignment, CTA banner
- New reusable `Ticker.tsx` UI component (also closes B-2)
- New `ContributeForm.tsx` with chip multi-select, availability dropdown, consent
- New API route `src/app/api/contributions/route.ts` (withValidation HOF, honeypot, Zod)
- New Notion **Contributions** database — created via Claude Code script at track start
- New `src/lib/contributions.ts` (Notion write operations)
- Navbar link to `/contribute` (minor touch to `Navbar.tsx`)

---

## Items — Priority + Effort + Track Assignment

| # | Item | Priority | Effort | Track |
|---|------|----------|--------|-------|
| 1 | Wizard foundation: schemas.ts rewrite, ProgressBar, WizardNav, StepEditModal, fade CSS primitive | Critical | L (1-2 days) | Track 1 |
| 2 | Contribute page + form + API + Notion Contributions DB + Ticker component | Critical | XL (2-3 days) | Track 2 |
| 3 | Wizard build: container + 6 step components + apply/page.tsx swap + sessionStorage + nuqs wiring + delete MembershipForm | Critical | XL (2-3 days) | Track 3 (Wave 2) |
| 4 | Wizard API rewrite + Notion Members schema migration script + E2E rewrite | Critical | M (1 day) | Track 4 (Wave 2) |

---

## Capacity Math

| | |
|---|---|
| Track 1 — L | 1.5 pts |
| Track 2 — XL | 3 pts |
| Track 3 — XL | 3 pts |
| Track 4 — M | 1 pt |
| **Total planned** | **8.5 pts** |
| Weekly capacity (4 parallel worktrees × ~2.5 pts) | 10 pts |
| **Utilization** | **85%** |

**Flag:** 85% is the top of the recommended band. One week is tight for two bodies of work this size. If anything slips:
- Track 4's Notion migration script is the first cut — can be run manually from Sagie's laptop instead.
- Wizard E2E rewrite is the second cut — can roll to next sprint as a carryover item.

---

## Track Layout + Wave Ordering

```
Wave 1 (04-11 → 04-13) — parallel
  ├─ Track 1: Wizard Foundation
  │     branch: feature/wizard-foundation
  │     depends on: nothing
  │
  └─ Track 2: Contribute Page + Form
        branch: feature/contribute-page
        depends on: nothing

Wave 2 (04-14 → 04-17) — parallel, after Track 1 merges
  ├─ Track 3: Wizard Build
  │     branch: feature/membership-wizard
  │     depends on: Track 1 (schemas, UI primitives)
  │
  └─ Track 4: Wizard API + Migration
        branch: feature/wizard-api
        depends on: Track 1 (schemas only — payload shape)

04-18 — buffer, final merges, sprint close.
```

---

## File Conflict Map

| File | Track 1 | Track 2 | Track 3 | Track 4 |
|------|---------|---------|---------|---------|
| `src/lib/schemas.ts` | **rewrite** | — | reads only | reads only |
| `src/lib/validation.ts` | — | — | — | — |
| `src/components/ui/ProgressBar.tsx` | **new** | — | imports | — |
| `src/components/ui/WizardNav.tsx` | **new** | — | imports | — |
| `src/components/ui/StepEditModal.tsx` | **new** | — | imports | — |
| `src/components/ui/Ticker.tsx` | — | **new** | — | — |
| `src/app/(marketing)/contribute/page.tsx` | — | **new** | — | — |
| `src/components/sections/Contribute*.tsx` | — | **new** | — | — |
| `src/components/forms/ContributeForm.tsx` | — | **new** | — | — |
| `src/app/api/contributions/route.ts` | — | **new** | — | — |
| `src/lib/contributions.ts` | — | **new** | — | — |
| `src/constants/contribute.ts` | — | **new** | — | — |
| `src/components/layout/Navbar.tsx` | — | **minor edit** | — | — |
| `src/components/forms/MembershipForm.tsx` | — | — | **delete** | — |
| `src/components/forms/MembershipWizard.tsx` | — | — | **new** | — |
| `src/components/forms/steps/Step*.tsx` | — | — | **new** (6 files) | — |
| `src/app/(marketing)/apply/page.tsx` | — | — | **edit** | — |
| `src/app/api/applications/membership/route.ts` | — | — | — | **rewrite** |
| `tests/apply.spec.ts` | — | — | — | **rewrite** |
| `scripts/notion-migrate-members.ts` | — | — | — | **new** |

**No cross-track conflicts.** Track 3 and Track 4 both reference schemas.ts but only after Track 1 merges to main. Contribute track's Notion migration lives in Track 2's scope and uses a script separate from Track 4's.

---

## Notion Tracker Items

**New items to seed** (12 items, all Status: Backlog until Claude Code starts the track):

| Item | Track | Priority | Effort | Area | Branch |
|------|-------|----------|--------|------|--------|
| Wizard: Rewrite schemas.ts | 1 | Critical | M | Forms | feature/wizard-foundation |
| Wizard: ProgressBar component | 1 | Critical | S | UI | feature/wizard-foundation |
| Wizard: WizardNav component | 1 | Critical | S | UI | feature/wizard-foundation |
| Wizard: StepEditModal component | 1 | Critical | S | UI | feature/wizard-foundation |
| Contribute: Marketing page + copy | 2 | Critical | L | Marketing | feature/contribute-page |
| Contribute: Ticker reusable component (B-2) | 2 | High | S | UI | feature/contribute-page |
| Contribute: ContributeForm + API + Notion DB | 2 | Critical | L | Forms | feature/contribute-page |
| Wizard: MembershipWizard container | 3 | Critical | M | Forms | feature/membership-wizard |
| Wizard: 6 step components | 3 | Critical | L | Forms | feature/membership-wizard |
| Wizard: apply/page.tsx swap + delete old form | 3 | Critical | S | Forms | feature/membership-wizard |
| Wizard: API route rewrite | 4 | Critical | S | API | feature/wizard-api |
| Wizard: Notion Members migration + E2E rewrite | 4 | Critical | M | Data/Tests | feature/wizard-api |

Co-work will create these in the Notion Development Tracker after Sagie confirms the plan.

---

## Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Wave 1 tracks don't merge by 04-13 | Medium | Track 1 is relatively self-contained. Track 2 is the long pole; if it slips, Track 4 can still run (only depends on Track 1). |
| Wizard E2E rewrite reveals ADR gaps | Medium | ADR §11 marks all open questions resolved. If gaps surface, Track 4 flags them in Notion as Blocked and Co-work re-reviews. |
| Notion API creates the wrong schema | Low | Track 4's migration script runs `dry-run` first and logs all property creates before executing. |
| Contribute page needs copy revisions | Low | Copy is locked in CONTENT-CONTRIBUTE-PAGE.md and Sagie-approved 04-08. |
| Navbar link to `/contribute` breaks mobile layout | Low | Small change; Track 2 includes a quick mobile check. |

---

## Definition of Done

- All 4 tracks merged to main by 04-18
- Live site shows `/apply` rendering the 6-step wizard with working nuqs URL params
- Live site shows `/contribute` rendering the full page + embedded form
- Membership wizard writes 12 new Notion Members properties on submit
- Contribute form writes to new Notion Contributions DB on submit
- All 5 CI checks pass on every PR
- `tests/apply.spec.ts` passes end-to-end through all 6 wizard steps
- `tests/contribute.spec.ts` covers the contribute form happy path
- `MembershipForm.tsx` deleted from the codebase

---

## Out of Scope — Explicit

- Supabase auth setup (future sprint per ARCHITECTURE-FORMS.md §6)
- Member portal build
- Any known-concern work not listed above
- Carryover items B-5 through B-8
- Notion sync monitoring
- Resource submission form rework
- Analytics integration
