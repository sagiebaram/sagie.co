# ADR: Membership Wizard — v3 DRAFT (Step 4 + Step 5 Redesign)

**Date:** 2026-04-12
**Status:** DRAFT — all 12 schema questions decided, UX/UI polish pass pending
**Supersedes:** ADR-MEMBERSHIP-WIZARD.md v2 §2 Step 4 + §2 Step 5 (only those sections; rest of v2 remains locked)
**Context:** After reviewing the working wizard, Sagie identified that Step 4 needs significantly more depth to power matchmaking, and Step 5 needs a checkbox alternative for the community expectations question.

---

## Co-work Instructions

> **Co-work:** Walk Sagie through each open question below in sequence. For each one:
> 1. Read the proposed option(s) aloud
> 2. Ask Sagie to confirm, modify, or reject
> 3. Record the decision inline (replace the `❓` with `✅ DECIDED:`)
> 4. Once all questions are resolved, change the status to "Approved" and ping Claude Code to implement
>
> **Ground rules for this review:**
> - Every sub-field needs a clear answer on: required vs optional, max length, stored in Notion as what property type
> - If a sub-field adds a select/dropdown, the exact options list must be locked before implementation
> - File uploads (CSV) require infrastructure decisions — flag for deferral if not ready
> - The step name change affects URL params (`?step=role-and-needs` → new slug) — confirm acceptable
>
> **Additional scope — UX/UI polish pass:**
> After resolving the schema questions, walk Sagie through a UX/UI review of the entire wizard. The goal is to make every step more readable, visually polished, and feel alive. Cover:
> - **Readability:** field spacing, font sizes, label hierarchy, section breathing room — each step should feel clean, not cramped
> - **Animations:** step transitions, field reveals (dynamic sub-fields), validation state changes, progress bar updates, section expand/collapse in Review — identify where motion adds clarity vs. where it adds noise
> - **Visual consistency:** ensure the wizard matches the rest of the site's design language (dark palette, silver accents, DM Sans / Bebas Neue typography, subtle borders)
> - **Mobile:** review each step at mobile widths — tag checkbox groups, textarea heights, progress bar, Review accordion
> - Record each UX decision as a numbered item in a new "§6. UX/UI Polish" section at the bottom of this ADR, so Claude Code can implement them in a single pass

---

## 1. Step 4 Rename

**Current:** "Your Role & What You're Looking For"
**URL param:** `?step=role-and-needs`
**Progress bar label:** "Role"

### ✅ Q1: DECIDED — "Matchmaking" (param: `matchmaking`, label: "Match")

Proposed options:
- **A.** "Who You Are & What You Need" (param: `who-and-what`, label: "Match")
- **B.** "Your Profile" (param: `profile`, label: "Profile")
- **C.** "Matchmaking" (param: `matchmaking`, label: "Match")
- **D.** Something else — Sagie to specify

> **Co-work:** Ask Sagie which resonates. The name appears in the progress bar and as a fieldset legend for screen readers.

---

## 2. Step 4 "I am a..." — Expanded Sub-fields

**Current behavior:** Each identity tag is a checkbox. Only "Service Provider" has a sub-field ("What do you offer?").

**Proposed:** More identity tags get conditional sub-fields when selected. The tag itself is still a checkbox; the sub-field appears below it.

### Founder sub-fields

| Sub-field | Type | Required? | Stored as |
|-----------|------|-----------|-----------|
| What are you building? | text (200 chars) | ❓ | `founderBuilding` (rich_text) |
| Category / Sector | select | ❓ | `founderSector` (select) |
| Stage | select | ❓ | `founderStage` (select) |

### ✅ Q2: DECIDED — Expanded sector list, all sub-fields optional

Sectors (categorized):
- **Tech:** `AI / ML`, `SaaS`, `Fintech`, `Health Tech`, `EdTech`, `Deep Tech`, `Cybersecurity`, `Dev Tools`, `Web3 / Blockchain`
- **Industry:** `Real Estate`, `Media / Entertainment`, `Consumer / CPG`, `E-commerce / Marketplace`, `Climate / Clean Tech`
- **Impact:** `Impact / Social`, `Nonprofit / NGO`
- **Catch-all:** `Other` (with free-text follow-up: "What sector?")

All founder sub-fields (building, sector, stage) are **optional**. Rationale: maximize sign-up completion, prompt for profile completion later in the member portal.

### ✅ Q3: DECIDED — Use as-is: `Idea`, `Pre-Seed`, `Seed`, `Series A`, `Series B+`, `Revenue-Stage`

Optional field (per Q2 decision). Covers full founder lifecycle from napkin to scale.

### Investor sub-fields

| Sub-field | Type | Required? | Stored as |
|-----------|------|-----------|-----------|
| What kind of investor? | select or checkbox-group | ❓ | `investorType` (multi_select or select) |
| What do you invest in? | text (500 chars) | ❓ | `investorFocus` (rich_text) |

### ✅ Q4: DECIDED — Multi-select: `Angel`, `VC`, `LP`, `Family Office`, `Corporate / CVC`, `Syndicate Lead`

Multi-select (stored as `investorType` multi_select in Notion). Investors commonly wear multiple hats. Optional field per Q2 decision.

### ✅ Q5: DECIDED — B. Sector checkboxes (reuse Q2 expanded list) + optional free text

Stored as `investorSectors` (multi_select) + `investorFocus` (rich_text). Reuses the same 18 sectors from Q2 as checkboxes for "What sectors do you invest in?" plus an optional "Describe your investment thesis" free text. Optional fields per Q2 decision.

### Advisor / Mentor sub-fields

| Sub-field | Type | Required? | Stored as |
|-----------|------|-----------|-----------|
| What kind of mentor are you? | text (300 chars) | ❓ | `mentorExpertise` (rich_text) |
| What mentees are you looking for? | text (300 chars) | ❓ | `mentorSeeks` (rich_text) |

### ✅ Q6: DECIDED — B. Expertise checkboxes + free text for mentee description

Expertise checkboxes (multi_select `mentorExpertise`): `Product`, `Fundraising`, `Sales`, `Engineering`, `Operations`, `Legal`, `Marketing`
Free text (rich_text `mentorSeeks`): "What mentees are you looking for?" (300 chars, optional)
All optional per Q2 decision.

### Tags with NO new sub-fields (confirm)

| Tag | Current sub-field | Proposed |
|-----|-------------------|----------|
| Service Provider | "What do you offer?" (text) | Keep as-is |
| Job Seeker | None | ✅ Q7: Add optional "What kind of role are you looking for?" text (200 chars, `jobSeekerRole` rich_text) |
| Corporate Executive | None | ✅ Q8: Skip — Step 3's "Company" work style already captures this |
| Ecosystem Builder | None | Keep as-is (too varied to structure) |
| Student / Early Career | None | Keep as-is |

---

## 3. Step 4 "I'm looking for..." — Expanded Sub-fields

**Current behavior:** Checkboxes only, no sub-fields except Service Provider detail.

**Proposed:** Key need tags get a conditional sub-field to capture specificity.

| Need Tag | Proposed Sub-field | Type | Required? | Stored as |
|----------|-------------------|------|-----------|-----------|
| Co-founder | What kind of co-founder? | text (300 chars) | ❓ | `cofounderNeeds` (rich_text) |
| Talent / Hiring | Job description | textarea (1000 chars) | ❓ | `hiringDescription` (rich_text) |
| A job | Resume / CV upload | file upload | ❓ | `resumeUrl` (url) |
| Funding | _(none — covered by Founder sub-fields above?)_ | — | — | — |
| Deal flow | _(none — covered by Investor sub-fields above?)_ | — | — | — |
| Others | No sub-field | — | — | — |

### ✅ Q9: DECIDED — LinkedIn URL field now, Vercel Blob file upload deferred to portal sprint

For now: optional URL field "Your LinkedIn profile URL" (`linkedInUrl` url in Notion) when "A job" need tag is selected. File upload (PDF/DOCX via Vercel Blob) is a portal sprint feature — not in scope this round.

### ✅ Q10: DECIDED — A. Single textarea "Describe the role(s) you're hiring for"

Stored as `hiringDescription` (rich_text, 1000 chars). Optional. Captures enough for matchmaking without turning the wizard into a job posting form.

---

## 4. Step 5 Change: Community Expectations Checkbox Alternative

**Current:** "What are you looking for in a community?" is a required textarea (min 10 chars via `spamCheckedText`).

**Proposed:** Add a checkbox group as an alternative. If the user selects at least one checkbox, the textarea becomes optional.

### ✅ Q11: DECIDED — Use as-is: 8 community expectation checkboxes

Multi-select (stored as `communityExpectations` multi_select in Notion):
`Networking events`, `Mentorship matching`, `Deal flow access`, `Job board / hiring`, `Knowledge sharing`, `Co-working / IRL meetups`, `Accountability / peer groups`, `Discounts / perks`

### ✅ Q12: DECIDED — B. Checkboxes + optional "Anything else?" textarea

Checkboxes are the primary input (at least one required to proceed, replacing the old required textarea). Optional textarea "Anything else?" (stored as `communityExpectationDetail` rich_text, 500 chars) appears below the checkboxes for people who want to elaborate. The old `communityExpectation` required textarea is removed.

---

## 5. Impact Summary

### New schema fields (estimated)

If all proposals are accepted, ~10-15 new fields added to `MembershipSchema`. Each needs:
- Zod field definition in `schemas.ts`
- `superRefine` conditional logic
- UI in `StepRoleAndNeeds.tsx` (or renamed step)
- Notion property in Members DB
- API route mapping in Track 4

### URL param change

If Step 4 is renamed, the `?step=role-and-needs` param changes. This is a breaking change for:
- Any bookmarked/shared URLs (unlikely — the wizard just shipped)
- E2E tests (Track 4 rewrites these anyway)
- sessionStorage drafts (cleared on 24hr expiry, so self-healing)

### Matchmaking quality

The depth proposed here dramatically improves future Founder↔Investor, Mentor↔Mentee, and Employer↔Job Seeker matching. This is the highest-value change in the entire wizard redesign.

---

## Decision Log

| # | Question | Decision | Date |
|---|----------|----------|------|
| Q1 | Step name | ✅ "Matchmaking" (param: `matchmaking`, label: "Match") | 04-12 |
| Q2 | Founder sectors | ✅ Expanded 18-option categorized list, all optional, "Other" has free text | 04-12 |
| Q3 | Founder stages | ✅ Idea, Pre-Seed, Seed, Series A, Series B+, Revenue-Stage (optional) | 04-12 |
| Q4 | Investor types | ✅ Multi-select: Angel, VC, LP, Family Office, Corporate/CVC, Syndicate Lead (optional) | 04-12 |
| Q5 | Investor focus depth | ✅ Sector checkboxes (Q2 list) + optional free text thesis (optional) | 04-12 |
| Q6 | Mentor structured vs free | ✅ Expertise checkboxes (7 options) + free text mentee description (optional) | 04-12 |
| Q7 | Job Seeker sub-field | ✅ Add optional "What kind of role?" text field | 04-12 |
| Q8 | Corporate sub-field | ✅ Skip — Step 3 covers it | 04-12 |
| Q9 | File upload feasibility | ✅ LinkedIn URL now, Vercel Blob upload deferred to portal | 04-12 |
| Q10 | Hiring detail level | ✅ Single textarea "Describe the role(s)" (optional, 1000 chars) | 04-12 |
| Q11 | Community checkbox options | ✅ 8 options as proposed (multi-select, at least one required) | 04-12 |
| Q12 | Textarea + checkbox behavior | ✅ Checkboxes + optional "Anything else?" textarea | 04-12 |

**Once all 12 questions are decided, this draft becomes v3 of the ADR and the implementation can proceed.**
