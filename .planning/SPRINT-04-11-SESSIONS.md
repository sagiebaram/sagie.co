# Sprint 04-11 — Claude Code Session Prompts

**Sprint:** 04-11 (2026)
**Tracks:** 4 (2 Wave 1, 2 Wave 2)
**Copy-paste each track's prompt into a Claude Code session running in its own git worktree.**

Worktree setup (run once per track from the main repo root):
```bash
./scripts/worktree-setup.sh feature/wizard-foundation   # Track 1
./scripts/worktree-setup.sh feature/contribute-page     # Track 2
# After Wave 1 merges:
./scripts/worktree-setup.sh feature/membership-wizard   # Track 3
./scripts/worktree-setup.sh feature/wizard-api          # Track 4
```

---

## TRACK 1: WIZARD FOUNDATION
Branch: `feature/wizard-foundation`
Priority: Critical
Effort: L (1-2 days)
Wave: 1 (parallel with Track 2)

### Goal
Rewrite `src/lib/schemas.ts` for the new 6-step membership wizard and build the three reusable wizard UI primitives (`ProgressBar`, `WizardNav`, `StepEditModal`) plus the fade CSS utility. No wizard container yet — that's Track 3. This track establishes the types and UI building blocks the wizard build will consume.

### Notion Tracker Items
| Task | Priority |
|------|----------|
| Wizard: Rewrite schemas.ts | Critical |
| Wizard: ProgressBar component | Critical |
| Wizard: WizardNav component | Critical |
| Wizard: StepEditModal component | Critical |

Database ID: `cd0d162c-6114-41a2-af28-3cba08086f63` — Co-work updates these. Do not attempt Notion updates from Claude Code.

### Files to Create/Modify
- `src/lib/schemas.ts` — major rewrite (membership section only; leave other schemas untouched)
- `src/components/ui/ProgressBar.tsx` — NEW
- `src/components/ui/WizardNav.tsx` — NEW
- `src/components/ui/StepEditModal.tsx` — NEW
- `src/app/globals.css` — add the `.wizard-step-enter` / `.wizard-step-active` transition classes (see ADR §1)
- `src/lib/__tests__/schemas.test.ts` — add tests for new schemas

### Acceptance Criteria
- [ ] `schemas.ts` exports `MembershipSchema`, `StepAboutYouSchema`, `StepLocationSchema`, `StepProfessionalIdentitySchema`, `StepRoleAndNeedsSchema`, `StepTellUsMoreSchema`, plus the `workStyleOptions`, `identityTagOptions`, `needTagOptions`, `referralSourceOptions` const arrays exactly as specified in ADR §2
- [ ] `locationSuperRefine` is exported from `schemas.ts` (ADR §2 Step 2 note)
- [ ] Old membership fields removed: `role`, `category`, `company`, `whatTheyOffer`, `referral`
- [ ] New membership fields added per ADR §5: `workStyle`, `companyName`, `organizationName`, `freelancerDescription`, `identityTags`, `needTags`, `serviceProviderDetail`, `whatTheyNeed`, `communityExpectation`, `communityMeaning`, `howTheyKnowSagie`, `referralSource`, `referralName`, `newsletterConsent`, `tier: 'Explorer'`
- [ ] `ProgressBar.tsx` implements the props contract from ADR §4 (`steps`, `currentStep`, `completedSteps`, `onStepClick`), renders 6 circles + connectors, mobile variant shows circles-only + "Step N of 6" text
- [ ] `WizardNav.tsx` exports a component with Back / Next / Submit buttons, disabled states based on current step position
- [ ] `StepEditModal.tsx` implements focus trap, Escape to close, returns focus to opener, `role="dialog"` + `aria-modal="true"` per ADR §7
- [ ] `globals.css` contains the fade transition classes exactly as specified in ADR §1
- [ ] Schema unit tests cover valid + invalid cases for each per-step schema, including dynamic sub-field refinements (Step 3 workStyle, Step 4 serviceProviderDetail, Step 5 referralName)
- [ ] `npm run lint`, `npm run typecheck`, `npm test` all pass
- [ ] PR description references ADR-MEMBERSHIP-WIZARD.md §1, §2, §4, §7

### Technical Context
- Stack reminders from `instructions.md`: TypeScript strict, `readonly` modifiers on data types, Zod with inferred types, import order (third-party → type imports → `@/` internal)
- Tailwind v4 — use utility classes + `cn()` helper for conditional composition
- Components: functional arrow, named exports for reusable UI (these three are reusable)
- `src/lib/schemas.ts` is the single source of truth for form validation (client + server)
- `spamCheckedText` already exists in schemas.ts — reuse for Step 5 textareas
- `PrivacyConsent.tsx` component is separate from react-hook-form state; do NOT try to integrate it into the Zod schema (ADR §2 Step 6 note: "privacyConsent managed outside react-hook-form (existing pattern)")
- Per ADR §1: fade transition = CSS only, NOT GSAP. No `GSAPCleanup` needed here.
- Per instructions.md §Known concerns: new checkbox/radio groups must expose proper ARIA attributes (affects `ProgressBar` step list and, in Track 3, the workStyle/identityTags checkboxes)

### Implementation Details
1. **schemas.ts rewrite (membership section only):**
   - Copy the full schema definitions from `ADR-MEMBERSHIP-WIZARD.md` §2 verbatim — const arrays, per-step schemas, and the final `MembershipSchema` composed of all fields
   - Export `locationSuperRefine` if it's currently inline (ADR §2 Step 2 note)
   - Define and export `IdentityTag`, `NeedTag`, `ReferralSource` types as `z.infer` of the const arrays
   - Do NOT modify other schemas in the file (chapter, solutions, ventures, etc.)
2. **ProgressBar.tsx:**
   - Renders `<nav aria-label="Application progress"><ol>` with six `<li aria-current>` items (ADR §7)
   - Visual states: completed (filled silver + checkmark), current (outlined silver + number), upcoming (dim + number)
   - Clickable for completed steps, disabled for upcoming
   - Mobile breakpoint `< 640px`: circles-only + step counter label
3. **WizardNav.tsx:**
   - Props: `currentStep`, `totalSteps`, `onBack`, `onNext`, `onSubmit`, `isSubmitting`
   - Back hidden on step 1; Submit replaces Next on step 6
   - Use existing `Button` component from `src/components/ui/Button.tsx`
4. **StepEditModal.tsx:**
   - Props: `isOpen`, `onClose`, `stepId`, `stepLabel`, `children`
   - Focus trap implementation — on open, focus first input; Tab cycles within modal only
   - Escape key listener closes modal
   - Backdrop click closes modal
   - Return focus to the element that opened it (store `document.activeElement` on open)
   - `role="dialog"`, `aria-modal="true"`, `aria-label={`Edit ${stepLabel}`}`
5. **globals.css:**
   - Add `.wizard-step-enter { opacity: 0; transform: translateY(8px); }` and `.wizard-step-active { opacity: 1; transform: translateY(0); transition: opacity 150ms ease, transform 150ms ease; }`
6. **Tests:**
   - For each step schema, test: valid full payload, each required field missing, each conditional sub-field scenario (e.g. workStyle=['Company'] without companyName → fails)
   - Follow existing fixture naming from `src/lib/__tests__/schemas.test.ts` if already present

### Content
No approved copy in this track — all copy lives in Track 3's step components and Track 2's contribute page. Helper text strings for tag labels come from ADR §2 Step 4 (verbatim) — those belong in Track 3.

### Notion Status Updates (Co-work handles)
- On branch create → Co-work sets items to "In Development"
- On PR push → Co-work sets items to "In Review" + PR URL
- If blocked → Co-work sets items to "Blocked"
- On merge → Co-work sets items to "Done"
- Claude Code does NOT touch Notion — all updates via Co-work

### End-of-session
After PR is pushed and all 5 CI checks pass, output a macOS notification:
```bash
osascript -e 'display notification "Track 1 (wizard foundation) ready for review" with title "Claude Code"'
```

---

## TRACK 2 (REVISED 04-11 post-v1 review): CONTRIBUTE v1 FIXES + /contribute-v2 BUILD
Branch: `feature/contribute-page` (continue existing branch)
Priority: Critical
Effort: M–L (1 day)
Wave: 1 revision — scope changed mid-sprint after Sagie reviewed v1

### Background
v1 of `/contribute` already landed on the branch from the first Track 2 session (hero, ticker, 6-card grid, How It Works, Pillars, CTA banner, ContributeForm, API, Notion DB). Sagie reviewed it on 04-11 and called out several issues. This revised session does three things: (a) fixes the v1 bugs, (b) **deletes the form/API/Notion work entirely** (deferred to a post-Track 3 sprint where all forms get consolidated), and (c) builds a brand-new `/contribute-v2` comparison page with Sagie's 5-category copy and a fresh visual pass. Sagie will review both live and pick the winner.

### Revised Goal
1. Fix v1 bugs on `/contribute` (hero alignment, ticker infinite loop, Ways section H2/desc + richer card bodies, How It Works render bug, delete Pillars + CTA banner).
2. Delete all form/API/Notion DB code added in the first Track 2 session — defer to a future sprint.
3. Build `/contribute-v2` from scratch with a fresh visual pass and Sagie's new 5-category copy.

### Notion Tracker Items (REVISED)
| Task | Priority | Note |
|------|----------|------|
| Contribute: Marketing page + copy | Critical | Scope expanded: v1 fixes + /contribute-v2 build |
| Contribute: Ticker reusable component (B-2) | High | Add infinite-loop fix + snappier timing |
| Contribute: ContributeForm + API + Notion DB | — | **BLOCKED / deferred** to post-Track 3 sprint |

Database ID: `cd0d162c-6114-41a2-af28-3cba08086f63` — Co-work updates these.

### Files to Create / Modify / Delete

**v1 fixes (edit existing on branch):**
- `src/app/(marketing)/contribute/page.tsx` — EDIT: remove Pillars + CTA banner section imports/renders
- `src/components/sections/ContributeHero.tsx` — EDIT: fix max-width and eyebrow alignment to match `/solutions`, `/eco`, `/ventures`
- `src/components/sections/ContributeGrid.tsx` — EDIT: rewrite section H2/desc + expand each card body (copy below)
- `src/components/sections/ContributeHowItWorks.tsx` — EDIT: diagnose and fix the render bug (the section currently does not render at all — check if it's imported, rendered, conditionally returned `null`, hidden by CSS, or broken at the server boundary)
- `src/components/ui/Ticker.tsx` — EDIT: replace the append-at-threshold logic with a true CSS-only infinite loop (duplicate the items array once and translate -50%); snappier animation timing; clip to its section max-width so it does not overflow horizontally
- `src/constants/contribute.ts` — EDIT: update "Ways" section copy + per-card bodies; remove Pillars and CTA banner strings

**v1 deletions (remove from branch):**
- `src/components/sections/ContributePillars.tsx` — DELETE
- `src/components/sections/ContributeCTA.tsx` — DELETE
- `src/components/forms/ContributeForm.tsx` — DELETE (form deferred)
- `src/app/api/applications/contribution/route.ts` — DELETE (API deferred)
- `src/app/api/contributions/route.ts` — DELETE if it exists (wrong path from earlier session)
- `src/lib/contributions.ts` — DELETE (Notion write layer deferred)
- `src/emails/ContributionConfirmationEmail.tsx` — DELETE if created
- `src/emails/ContributionAdminAlertEmail.tsx` — DELETE if created
- `scripts/notion-create-contributions-db.ts` — DELETE (DB deferred)
- `tests/contribute.spec.ts` — DELETE (no form to test)

**v1 revert edits:**
- `src/lib/schemas.ts` — REVERT any `ContributeSchema` append added by the earlier session
- `src/lib/email.ts` — REVERT any `'Contribution Submission'` addition to the `FormType` union
- `src/env/server.ts` — REVERT any `NOTION_CONTRIBUTIONS_DB_ID` addition
- `.env.example` — REVERT any `NOTION_CONTRIBUTIONS_DB_ID` addition

**v2 new (fresh files):**
- `src/app/(marketing)/contribute-v2/page.tsx` — NEW (unlinked route; no nav entry)
- `src/app/(marketing)/contribute-v2/loading.tsx` — NEW
- `src/components/sections/ContributeV2Hero.tsx` — NEW
- `src/components/sections/ContributeV2Why.tsx` — NEW (manifesto block)
- `src/components/sections/ContributeV2Categories.tsx` — NEW (5 categories)
- `src/components/sections/ContributeV2HowItWorks.tsx` — NEW (3 steps)
- `src/components/sections/ContributeV2ClosingCTA.tsx` — NEW
- `src/constants/contribute-v2.ts` — NEW (verbatim copy below)

**Files NOT touched in this revision:**
- `src/components/layout/Navbar.tsx` — nav link for `/contribute` was added in v1 round; keep it pointing at `/contribute` (v1). `/contribute-v2` is unlinked on purpose.
- `src/lib/notion.ts`, `src/lib/notion-monitor.ts` — no Notion writes in this session
- Any membership or wizard files — that's Track 1/3/4

### Source of truth (revised)

**Two pages, two copy sources:**
1. `/contribute` (v1) uses the **existing structure** from `.planning/mockups/contribute-page.html` with the **revised copy** in this document (new section H2/desc + richer per-card bodies).
2. `/contribute-v2` uses **Sagie's 04-11 paste** embedded verbatim in this document. No mockup exists for v2 — Claude Code is free to design the layout within the design system, as long as it's **visually distinct** from v1 so the A/B comparison is meaningful.

### Acceptance Criteria

**v1 fixes on `/contribute`:**
- [ ] Hero max-width and eyebrow alignment match `/solutions`, `/eco`, `/ventures` — use the exact same wrapper + eyebrow component pattern
- [ ] Hero eyebrow uses the standard site eyebrow treatment (no bespoke color/size on this page)
- [ ] `Ticker` is a true CSS-only infinite loop: duplicate the `items` array once, translate the track by `-50%` over the loop duration, clip overflow at the section container so it never pushes horizontal scroll
- [ ] Ticker animation duration is snappier than v1 (target ~25–35s for one full cycle instead of v1's slower timing); pausable on hover; respects `prefers-reduced-motion`
- [ ] "Ways to Contribute" section H2 replaced with a stronger headline (see Content below — "Find Your Way In." / "Five forms of contribution. Infinite combinations.") and the description rewritten (see Content below)
- [ ] All 6 cards remain (Time, Capital, Network, Skills, Sponsorship, Space) but each body expands to 2–3 sentences with more specificity (see Content below for verbatim card copy)
- [ ] "How It Works" section renders on the live page — diagnose the current render bug first (check imports, conditional returns, server/client boundary, CSS `display:none`, hydration mismatch) and document the root cause in the PR description
- [ ] `ContributePillars.tsx` section ("Where It Goes" / Three Pillars) is DELETED from the page + component tree
- [ ] `ContributeCTA.tsx` section ("Ready to Plug In?" banner) is DELETED from the page + component tree
- [ ] Constants file `src/constants/contribute.ts` has the Pillars and CTA banner strings removed
- [ ] Three Playwright-free screenshots (hero, ways grid, how-it-works) attached to the PR description showing the fixes

**v2 build (`/contribute-v2`):**
- [ ] New route `src/app/(marketing)/contribute-v2/page.tsx` reachable at `/contribute-v2` (no nav entry, no sitemap update — unlisted comparison page)
- [ ] Hero renders: eyebrow "Shape a Great Impact Everywhere" / headline "The Ecosystem Runs on What You Bring." / subtitle "Membership is the starting point. Contribution is what moves the ecosystem — and what moves you through it."
- [ ] "Why Contribute" manifesto section renders the full paragraph block verbatim from Content below under the heading "Contribution Is the Core Model"
- [ ] Five contribution categories render in order with full paragraph bodies: Expertise → Connections → Opportunities → Resources → Feedback (copy verbatim below)
- [ ] "How It Works" section renders 3 steps verbatim: "Choose your contribution type" / "Submit through the form" / "Watch it circulate"
- [ ] Closing CTA section renders headline "Movement Between Tiers Is Earned. Contribution Is How." + body paragraph + single button "Contribute to the Ecosystem →" linking to `/apply`
- [ ] `/contribute-v2` is **visually distinct** from `/contribute` — different section rhythm, different hero treatment, different category card/list pattern — enough that a side-by-side A/B comparison reads as two different design directions (not the same page with different copy)
- [ ] `/contribute-v2` uses the approved palette (ECO `#7A9E7E`, Solutions `#6B9EC0`, Ventures `#8A8A8A`, gold `#C9A84C`) and Bebas Neue / DM Sans typography — no new fonts or colors
- [ ] `/contribute-v2` renders with **no form, no API call, no Notion writes** — closing CTA links out to `/apply`, nothing else
- [ ] Copy constants for v2 live in `src/constants/contribute-v2.ts`

**Deferred (must be removed from branch this session):**
- [ ] `ContributeForm.tsx`, `/api/applications/contribution/route.ts` (and any other contribution API path), `src/lib/contributions.ts`, `scripts/notion-create-contributions-db.ts`, `tests/contribute.spec.ts`, and any contribution email templates are all deleted
- [ ] `src/lib/schemas.ts` no longer contains `ContributeSchema`
- [ ] `src/lib/email.ts` `FormType` union no longer contains `'Contribution Submission'`
- [ ] `src/env/server.ts` and `.env.example` no longer contain `NOTION_CONTRIBUTIONS_DB_ID`
- [ ] No references to the deleted files anywhere in the tree (`grep -r ContributeForm src` returns nothing)

**Technical + CI:**
- [ ] `npm run lint` clean
- [ ] `npm run typecheck` clean
- [ ] `npm test` (unit) passes
- [ ] Playwright existing specs pass via `npx playwright test` (no new contribute spec this session)
- [ ] No new API routes added; no `withValidation` usage touched; no Notion client imports in any new file
- [ ] PR description documents: (a) v1 bugs fixed, (b) files deleted + reason (form work deferred), (c) v2 route URL for review, (d) root cause of the How It Works render bug, (e) screenshots of v1 fixes and v2 hero

### Technical Context
- Stack: Next.js 16 App Router, React 19, Tailwind v4 — this session is **page/component work only**, no data layer
- **No form, no API, no Notion** this session. The first Track 2 round wired all of that up; it is being ripped out and deferred to a consolidated forms sprint after Track 3.
- Existing page structure pattern: `src/app/(marketing)/{eco,solutions,ventures}/page.tsx` — mirror the section composition style (hero → content sections → closing CTA, all server components pulling copy from `src/constants/*.ts`)
- Existing hero pattern to copy for the v1 fix: `src/components/sections/SolutionsHero.tsx` (or whichever of the three pillar pages has the eyebrow alignment Sagie approved) — use the same wrapper, same eyebrow component, same max-width class
- `Ticker` reference implementations: search for `marquee` / `animate-[scroll` in existing components. The true-infinite-loop pattern is: render `items.concat(items)` inside an absolutely positioned track, animate `translateX(0) → translateX(-50%)` on a CSS `@keyframes` at `linear` easing. Do not use JS append-on-threshold — that's what v1 did and why it broke.
- How It Works render bug — start diagnosis by: (1) confirm the section is imported in `contribute/page.tsx`, (2) confirm it returns JSX unconditionally, (3) check browser devtools for the section in the DOM, (4) check for `display:none` or `hidden` class, (5) check for a hydration boundary error in the console. Fix and document root cause in the PR.
- Typography: Bebas Neue for display, DM Sans for body — already loaded site-wide via `src/app/layout.tsx`
- Palette: ECO `#7A9E7E`, Solutions `#6B9EC0`, Ventures `#8A8A8A`, gold `#C9A84C` — Tailwind config already has these as theme colors; prefer `text-eco` / `bg-solutions` over hex strings
- `/contribute-v2` visual differentiation — pick a distinct hero layout (asymmetric split vs v1's centered stack), a distinct category treatment (tall vertical list with numbered markers vs v1's 3-col grid), and a distinct CTA treatment (full-bleed band vs v1's inline CTA). The goal is Sagie opening both tabs and immediately seeing "these are two different designs" at a glance.
- No GSAP in the ticker. No browser storage APIs. No client-side data fetching. Server components only where possible.

### Content

Two pages. Two sets of copy. Do not mix them.

---

#### `/contribute` (v1) — REVISED copy (in `src/constants/contribute.ts`)

**Hero** — KEEP v1 (no copy change, only max-width + eyebrow alignment fix):
```
label:    "sagie.co / contribute"
headline: "BUILD WITH US"
subtitle: "SAGIE runs on people — their time, capital, networks, and expertise. Every contribution shapes a stronger ecosystem. Pick your entry point."
cta_primary: { label: "See All Ways to Contribute", href: "#ways" }
cta_ghost:   { label: "Become a Member First",     href: "/apply" }
```

**Ticker** — KEEP items; only the animation implementation changes:
```
items: ["Time", "Capital", "Network", "Skills", "Space", "Sponsorship", "Mentorship", "Research", "Ideas"]
```

**Ways to Contribute section** — REWRITE header:
```
eyebrow: "Ways to Contribute"
title:   "Find Your Way In."
desc:    "Five forms of contribution. Infinite combinations. Pick the one that fits where you are right now — you can always add more later."
```

**6 cards — REVISED BODIES** (2–3 sentences each, more specific than v1):

1. **Time** — "Volunteer Your Time"
   "Lead a workshop. Help run an event. Moderate a session. Your hours become momentum — and the fastest way to get known inside the community."
   link: "Apply to volunteer"

2. **Capital** — "Invest in the Ecosystem"
   "Support SAGIE ECO through donations that fund youth programs and chapter development. Or co-invest alongside SAGIE Ventures in the founders building what's next."
   link: "Explore investment paths"

3. **Network** — "Open Your Network"
   "Make a warm intro. Connect a founder to a funder. Bridge two people who should know each other. The highest-leverage contribution almost always costs you one email."
   link: "Submit an introduction"

4. **Skills** — "Share Your Expertise"
   "Mentor a builder. Run an AMA. Contribute a template, a playbook, or a hard-won lesson to the SAGIE knowledge base. Teach what you wish someone had taught you earlier."
   link: "Offer your skills"

5. **Sponsorship** — "Sponsor an Event or Program"
   "Put your brand inside SAGIE activations. Align with community-first events across Miami and beyond — the kind of programming that earns goodwill, not impressions."
   link: "View sponsor packages"

6. **Space** — "Host a SAGIE Activation"
   "Have a venue, an office, or a rooftop? Open it for the community. You provide the room — we handle the programming, the outreach, and the turnout."
   link: "Offer your space"

All card CTAs route to `/apply` for this sprint (form deferred — no anchor to embedded form anymore).

**How It Works section** — KEEP v1 copy, only fix the render bug:
```
eyebrow: "Process"
title:   "How It Works"
desc:    "Four steps from intent to impact."
```
Steps (verbatim from v1):
1. "Choose Your Form" — "Pick the contribution type that matches where you are. All forms are welcome."
2. "Submit Intent" — "Short intake — no lengthy forms. We ask only what we need to route you correctly."
3. "Get Connected" — "Sagie or a chapter lead follows up within 72 hours to align on fit and scope."
4. "Create Impact" — "You're in. Your contribution activates inside the ecosystem in real time."

**DELETED sections:**
- Where It Goes / Three Pillars — REMOVE (component deleted)
- Ready to Plug In CTA banner — REMOVE (component deleted)

---

#### `/contribute-v2` — VERBATIM from Sagie's 04-11 paste (in `src/constants/contribute-v2.ts`)

> Paste these strings exactly as written. Do not paraphrase. Do not change punctuation. `<em>` tags are intentional where shown.

**Hero:**
```
eyebrow:  "Shape a Great Impact Everywhere"
headline: "The Ecosystem Runs on What You Bring."
subtitle: "Membership is the starting point. Contribution is what moves the ecosystem — and what moves you through it."
```

**Why Contribute — manifesto section:**
```
eyebrow: "Why Contribute"
title:   "Contribution Is the Core Model"
```
Body paragraphs (render as prose, in order):
> SAGIE doesn't run on subscriptions. It runs on contribution.
>
> Every member has something to bring — expertise, connections, opportunities, resources, or feedback. When those flow between the right people, the whole ecosystem gets stronger. That's the model. That's the entire thing.
>
> There's no minimum. There's no gatekeeping. There's no "right" form of contribution. The only thing we ask is that you show up and offer something real — and we'll handle the rest.

**Five Contribution Categories:**
```
eyebrow: "Five Ways to Create Value"
title:   "Five Contribution Types. Infinite Impact."
desc:    "Every contribution flows into the ecosystem and routes where it's needed most."
```

Categories (render in this exact order, one full paragraph each):

1. **Expertise**
   "The skills you've spent years building — product, sales, operations, design, fundraising, legal, engineering, whatever your craft — are the fastest way to move the ecosystem forward. Mentor a founder. Review a pitch. Run an AMA. Sit on a panel. When you teach what you know, you compound every hour you've already spent learning it."

2. **Connections**
   "Your network is a superpower. A single warm introduction can unlock a hire, a customer, a check, or a co-founder. If you know someone who should know someone else in SAGIE, make the bridge. The highest-leverage contribution almost always costs you one email — and creates value that lasts for years."

3. **Opportunities**
   "Job openings. Speaking slots. Deal flow. Partnership leads. Grant programs. Pilot budgets. If you see a door opening somewhere and you know a SAGIE member who should walk through it, pass it along. Opportunities shared inside the ecosystem compound faster than opportunities hoarded outside of it."

4. **Resources**
   "Templates, playbooks, legal docs, design files, research reports, tools, discount codes, spare server credits, extra event tickets — the stuff that sits in your Google Drive collecting dust. Contribute it to the SAGIE knowledge base and it becomes leverage for every member who needs it next."

5. **Feedback**
   "The hardest and most valuable contribution. Tell us what's working and what isn't. Push back when we're wrong. Point out what we're missing. Feedback is how SAGIE stays honest — and how the people inside it stay sharp. This one costs nothing and changes everything."

**How It Works:**
```
eyebrow: "How It Works"
title:   "The Process Is Simple. The Impact Compounds."
```
Steps (3 — not 4):
1. "Choose your contribution type" — "Pick whichever of the five fits where you are right now. You can always come back and offer more."
2. "Submit through the form" — "A short intake — just enough for us to route you correctly. No lengthy forms. No gatekeeping."
3. "Watch it circulate" — "Your contribution enters the ecosystem and finds the member who needs it most. You'll see the results in the network — and in yourself."

**Closing CTA:**
```
eyebrow:  "Movement Is Earned"
title:    "Movement Between Tiers Is Earned. Contribution Is How."
```
Body paragraph:
> Show up. Offer something real. Keep showing up. The ecosystem notices — and so do the people inside it. That's how you move through SAGIE. That's how SAGIE moves through the world.

Single button:
```
cta: { label: "Contribute to the Ecosystem →", href: "/apply" }
```

> Note: the CTA links to `/apply` because the contribution form itself is deferred. When the dedicated contribution form ships in the future sprint, this link will be swapped to `/contribute-v2#form` or similar. For now, `/apply` is the single funnel.

### Implementation Details

Execute in this exact order. Each numbered step should be one or more commits so the diff is reviewable.

1. **Pull the branch clean and sync mockups + planning files.**
   ```bash
   cd ~/SAGIE-HQ/sagie-feature-contribute-page
   git fetch origin
   git pull origin feature/contribute-page
   rsync -a ~/SAGIE-HQ/sagie.co/.planning/ ./.planning/
   ```
   (The parent repo's `.planning/` is untracked, so the worktree needs an rsync to see the revised sessions file.)

2. **Re-read Track 2 in `.planning/SPRINT-04-11-SESSIONS.md`** — confirm you're following this revised scope, not the original one. If the file at `.planning/SPRINT-04-11-SESSIONS.md` still shows the old Track 2 content, the rsync didn't land. Re-run step 1.

3. **Delete deferred files** (one commit, message: `chore(contribute): remove deferred form/API/Notion work`):
   - `src/components/forms/ContributeForm.tsx`
   - `src/app/api/applications/contribution/route.ts`
   - `src/app/api/contributions/` (delete directory if it exists — wrong path from earlier session)
   - `src/lib/contributions.ts`
   - `scripts/notion-create-contributions-db.ts`
   - `tests/contribute.spec.ts`
   - Any email templates created for contributions (e.g., `src/emails/Contribution*.tsx`)
   - Delete `ContributePillars.tsx` and `ContributeCTA.tsx` section components

4. **Revert supporting edits** (same commit as step 3):
   - `src/lib/schemas.ts` — remove the `ContributeSchema` block
   - `src/lib/email.ts` — remove `'Contribution Submission'` from the `FormType` union
   - `src/env/server.ts` — remove `NOTION_CONTRIBUTIONS_DB_ID`
   - `.env.example` — remove the same entry
   - Verify: `grep -r "ContributeForm\|ContributeSchema\|NOTION_CONTRIBUTIONS_DB_ID\|Contribution Submission" src scripts tests` must return zero hits before committing

5. **Fix v1 hero** (commit: `fix(contribute): hero max-width + eyebrow alignment`)
   - Open `src/components/sections/ContributeHero.tsx`
   - Match the wrapper + eyebrow component used in `src/components/sections/SolutionsHero.tsx` (or whichever pillar hero has the look Sagie approved — spot-check `/eco`, `/solutions`, `/ventures` live to confirm)
   - Keep the copy; change only the layout primitives

6. **Fix the ticker** (commit: `fix(contribute): true infinite-loop ticker`)
   - Open `src/components/ui/Ticker.tsx`
   - Replace the append-on-threshold logic with a CSS-only infinite loop: render `[...items, ...items]` inside an absolutely-positioned flex track, animate `translateX(0) → translateX(-50%)` on a linear keyframe, overflow hidden on the parent
   - Duration: `25s` baseline, configurable via prop; tune on-screen to feel snappy
   - Pausable on `:hover` via `animation-play-state: paused`
   - `@media (prefers-reduced-motion: reduce)` → static (no animation)

7. **Fix the Ways section copy + card bodies** (commit: `feat(contribute): revised ways section copy`)
   - Update `src/constants/contribute.ts` with the new section H2/desc and per-card bodies from the Content block above
   - `src/components/sections/ContributeGrid.tsx` — verify it renders the new longer bodies cleanly at all breakpoints (2–3 sentences may wrap differently than v1's 1-sentence)

8. **Diagnose and fix How It Works render bug** (commit: `fix(contribute): how-it-works renders`)
   - Start by running the page locally (`npm run dev`) and inspecting the DOM for the section wrapper
   - If the section is absent from the DOM: check imports in `src/app/(marketing)/contribute/page.tsx`, check for conditional returns in `ContributeHowItWorks.tsx`, check for a server/client boundary issue
   - If the section is in the DOM but invisible: check for `display:none`, `visibility:hidden`, `opacity:0`, or `overflow:hidden` on an ancestor
   - Document the root cause in the commit message and the PR description

9. **Delete Pillars + CTA banner from the page** (commit: `refactor(contribute): remove pillars + cta banner sections`)
   - Open `src/app/(marketing)/contribute/page.tsx`
   - Remove the imports and renders for `ContributePillars` and `ContributeCTA`
   - Remove the Pillars and CTA banner copy from `src/constants/contribute.ts`
   - The component files themselves were already deleted in step 3

10. **Screenshot the v1 fixes** — take three screenshots (hero, ways grid, how-it-works) from `npm run dev`, save them locally, attach to the PR description.

11. **Build `/contribute-v2`** (commit: `feat(contribute): v2 comparison page`)
    - Create `src/constants/contribute-v2.ts` with the full verbatim copy from the Content block above
    - Create the new route: `src/app/(marketing)/contribute-v2/page.tsx` + `loading.tsx`
    - Create the 5 section components: `ContributeV2Hero.tsx`, `ContributeV2Why.tsx`, `ContributeV2Categories.tsx`, `ContributeV2HowItWorks.tsx`, `ContributeV2ClosingCTA.tsx`
    - Compose them in `page.tsx` in order: Hero → Why → Categories → HowItWorks → ClosingCTA
    - Visual distinction vs v1 (this is critical — see Technical Context):
      - Hero: asymmetric 2-column split (eyebrow + headline left, subtitle + decorative element right) instead of v1's centered stack
      - Categories: vertical numbered list (01, 02, 03, 04, 05 with generous whitespace between) instead of v1's 3-col grid
      - Closing CTA: full-bleed band with a single oversized button, no ghost CTA, no two-column layout
    - Use approved palette + existing typography; no new design tokens
    - Pass lint + typecheck; do not add any new dependencies

12. **Verify the full matrix:**
    - `npm run lint` clean
    - `npm run typecheck` clean
    - `npm test` passes
    - `npx playwright test` passes (existing specs only — no new contribute spec)
    - `grep -r "ContributeForm\|/api/applications/contribution\|NOTION_CONTRIBUTIONS_DB_ID" src scripts tests` returns zero hits
    - `/contribute` loads cleanly in dev and shows: Hero → Ticker → Ways (6 new cards) → How It Works (rendered) → nothing else
    - `/contribute-v2` loads cleanly in dev and shows: Hero → Why → 5 Categories → How It Works → Closing CTA

13. **Push + PR:**
    ```bash
    git push -u origin feature/contribute-page
    ```
    PR description must include:
    - Summary of v1 fixes (hero, ticker, ways copy, how-it-works bug root cause, pillars/CTA removal)
    - List of deleted files and the reason ("form work deferred to post-Track 3 forms consolidation sprint per Sprint 04-11 revision")
    - Link to `/contribute-v2` preview URL
    - Three v1 screenshots (hero, ways, how-it-works)
    - One v2 screenshot (hero + first category)
    - Confirmation that all 5 CI checks pass

### Notion Status Updates (Co-work handles)
Same pattern as Track 1 — Co-work handles all Notion tracker updates.

### End-of-session
```bash
osascript -e 'display notification "Track 2 revision (v1 fixes + /contribute-v2) ready for review" with title "Claude Code"'
```

---

## TRACK 3: MEMBERSHIP WIZARD BUILD
Branch: `feature/membership-wizard`
Priority: Critical
Effort: XL (2-3 days)
Wave: 2 — START ONLY AFTER `feature/wizard-foundation` IS MERGED TO MAIN

### Goal
Build the 6-step wizard UI on top of Track 1's foundation. Create `MembershipWizard` container + 6 step components, wire up nuqs URL state + sessionStorage + fade transitions + review/edit modal, swap `apply/page.tsx` to render the wizard, and delete the old `MembershipForm.tsx`.

### Pre-flight
Before starting:
```bash
git pull origin main                    # get Track 1's merged schemas + UI primitives
# Confirm the following exist before you proceed:
ls src/components/ui/ProgressBar.tsx
ls src/components/ui/WizardNav.tsx
ls src/components/ui/StepEditModal.tsx
grep -l "MembershipSchema" src/lib/schemas.ts
grep -l "identityTagOptions" src/lib/schemas.ts
# If any are missing, STOP. Track 1 has not merged yet.
```

### Notion Tracker Items
| Task | Priority |
|------|----------|
| Wizard: MembershipWizard container | Critical |
| Wizard: 6 step components | Critical |
| Wizard: apply/page.tsx swap + delete old form | Critical |

### Files to Create/Modify
- `src/components/forms/MembershipWizard.tsx` — NEW (container)
- `src/components/forms/steps/StepAboutYou.tsx` — NEW
- `src/components/forms/steps/StepLocation.tsx` — NEW
- `src/components/forms/steps/StepProfessionalIdentity.tsx` — NEW
- `src/components/forms/steps/StepRoleAndNeeds.tsx` — NEW
- `src/components/forms/steps/StepTellUsMore.tsx` — NEW
- `src/components/forms/steps/StepReview.tsx` — NEW
- `src/components/forms/MembershipForm.tsx` — DELETE
- `src/app/(marketing)/apply/page.tsx` — import `MembershipWizard` instead of `MembershipForm`; ensure `NuqsAdapter` is present in the layout chain

### Acceptance Criteria
- [ ] `/apply?step=about-you` renders Step 1 (fullName, email, phone, linkedIn)
- [ ] `/apply?step=location` renders Step 2 (LocationFields)
- [ ] `/apply?step=professional-identity` renders Step 3 (workStyle checkbox group + dynamic sub-fields)
- [ ] `/apply?step=role-and-needs` renders Step 4 (identityTags + needTags + serviceProviderDetail sub-field)
- [ ] `/apply?step=tell-us-more` renders Step 5 (4 required textareas + referralSource dropdown + conditional referralName)
- [ ] `/apply?step=review` renders Step 6 (read-only summary + 2 consent checkboxes + edit buttons that open `StepEditModal`)
- [ ] Single `useForm()` instance in `MembershipWizard`; steps consume via `useFormContext()` — ADR §1
- [ ] `handleNext()` calls `trigger(STEP_FIELDS[currentStep])` and blocks advance if invalid — ADR §3
- [ ] `shouldFocusError: true` focuses first errored field on invalid advance — ADR §3
- [ ] sessionStorage draft save is debounced 500ms, silent restore on mount, 24hr expiry, cleared on successful submit — ADR §8
- [ ] CSS fade transition (150ms) between steps — ADR §1
- [ ] Focus moves to first input of new step via `requestAnimationFrame` — ADR §7
- [ ] `aria-live="polite"` announcements on step change and dynamic sub-field reveal — ADR §7
- [ ] Clicking a section header in Step 6 opens `StepEditModal` with that step's fields; saving closes modal and updates form state
- [ ] Newsletter consent checkbox on Step 6 is required alongside privacy consent
- [ ] Manual URL edit to `?step=review` with empty required fields still blocks submission via full-schema Zod validation
- [ ] `/apply?step=bogus` falls back to `about-you` via `parseAsStringLiteral`
- [ ] `MembershipForm.tsx` is deleted
- [ ] `apply/page.tsx` renders `<MembershipWizard />`
- [ ] `NuqsAdapter` is present (check `src/app/(marketing)/layout.tsx` or add if missing)
- [ ] `npm run lint`, `npm run typecheck`, `npm test` all pass
- [ ] Build succeeds locally: `npm run build`
- [ ] PR description references ADR §1, §2, §3, §5, §6, §7, §8

### Technical Context
- **Single form instance rule:** `useForm()` is called once in `MembershipWizard`. Each step component uses `useFormContext()` to read/write. Do not create per-step `useForm()` instances.
- **Reused as-is:** `FormField`, `LocationFields`, `PhoneField`, `PrivacyConsent` — do not modify.
- **nuqs pattern:** `useQueryState('step', parseAsStringLiteral(STEPS).withDefault('about-you').withOptions({ history: 'push', shallow: true }))`
- **STEP_FIELDS map** verbatim from ADR §3 — use for per-step validation
- **Dynamic sub-fields:** Steps 3, 4, 5 use `watch()` on parent fields + conditional render. Wrap revealed fields in `<div aria-live="polite">` per ADR §7.
- **Fade transition classes** `.wizard-step-enter` / `.wizard-step-active` already in `globals.css` (Track 1). Apply on mount via `requestAnimationFrame`.
- **No GSAP** — transitions are pure CSS
- **API payload shape:** Do not call the API directly — Track 4 rewrites the `/api/applications/membership` route. For now, the submission handler POSTs the full `MembershipSchema`-shaped payload to the existing route. If Track 4 has not merged by the time this PR is ready, mark the test as `test.skip` with a comment pointing to Track 4.
- **Per instructions.md:** `withValidation` HOF is for new API routes — Track 4 handles that. Track 3 does NOT touch API routes.
- **Per instructions.md:** ARIA audit on new checkbox groups (resolving partial concern — see SPRINT-04-11.md §Known Concerns)

### Content — VERBATIM from ADR-MEMBERSHIP-WIZARD.md
- **Identity tag labels + helper text** from ADR §2 Step 4 table — use EXACTLY those strings
- **Need tag labels + helper text** from ADR §2 Step 4 table
- **Referral source options** from ADR §2 Step 5 — exact list
- **Step 5 textarea labels:** "What are you building or working on?", "What are you looking for in a community?", "What does a community mean to you?", "Why SAGIE?"
- **Newsletter consent label:** "Subscribe to The SAGIE Letter — weekly insights on ecosystem building, startups, and community."
- **Review section headers** — use the step labels from ADR §4: "About", "Location", "Identity", "Role", "More", "Review"

### Implementation Details
1. **`MembershipWizard.tsx` container:**
   - Single `useForm<MembershipFormData>({ resolver: zodResolver(MembershipSchema), mode: 'onBlur', reValidateMode: 'onChange', shouldFocusError: true })`
   - nuqs `useQueryState` for `step`
   - sessionStorage save (debounced 500ms via `watch().subscribe()`) + silent restore on mount
   - `<FormProvider {...methods}>` wraps step rendering
   - `handleNext()` triggers step-level validation; `handleBack()` allows unconditionally
   - Submit handler POSTs to `/api/applications/membership` with full form state + `privacyConsent` + `newsletterConsent` + `tier: 'Explorer'`
   - On success: clear sessionStorage, navigate to success state
   - CSS fade: outgoing step unmounts, incoming step mounts with `.wizard-step-enter` → swap to `.wizard-step-active` via `requestAnimationFrame`
2. **Step components** — each is a plain functional component consuming `useFormContext()`. No state management. Render fields using existing primitives.
   - Step 3 dynamic sub-fields: `const workStyle = watch('workStyle') ?? []; const showCompanyField = workStyle.includes('Company')` — per ADR §2
   - Step 4 sub-field: shown when `identityTags.includes('Service Provider')`
   - Step 5 sub-field: shown when `referralSource === 'Referral'`
   - Step 6: map form state to a read-only summary; each section header is a button that opens `StepEditModal` with that step's fields as children
3. **apply/page.tsx:**
   - Replace `<MembershipForm />` with `<MembershipWizard />`
   - Confirm `NuqsAdapter` wraps the marketing layout. If missing, add it to `src/app/(marketing)/layout.tsx`
4. **Delete `MembershipForm.tsx`** — in the same PR
5. **Focus management:** `useEffect` on `step` change → `requestAnimationFrame` → `formRef.current?.querySelector<HTMLElement>('input:not([type="hidden"]), select, textarea, [role="combobox"], [role="checkbox"]')?.focus()`

### Notion Status Updates (Co-work handles)

### End-of-session
```bash
osascript -e 'display notification "Track 3 (wizard build) ready for review" with title "Claude Code"'
```

---

## TRACK 4: WIZARD API + NOTION MIGRATION + E2E REWRITE
Branch: `feature/wizard-api`
Priority: Critical
Effort: M (1 day)
Wave: 2 — START ONLY AFTER `feature/wizard-foundation` IS MERGED TO MAIN

### Goal
Rewrite the `/api/applications/membership` route for the new wizard payload, create the 12 new Notion Members properties via a migration script, and rewrite `tests/apply.spec.ts` for the 6-step flow. This track can run in parallel with Track 3 — no file overlap.

### Pre-flight
```bash
git pull origin main
grep -l "MembershipSchema" src/lib/schemas.ts
grep -l "workStyle" src/lib/schemas.ts
# If missing, STOP — Track 1 hasn't merged.
```

### Notion Tracker Items
| Task | Priority |
|------|----------|
| Wizard: API route rewrite | Critical |
| Wizard: Notion Members migration + E2E rewrite | Critical |

### Files to Create/Modify
- `src/app/api/applications/membership/route.ts` — REWRITE
- `src/lib/notion.ts` — add helper for new property mapping (additive only, don't remove old helpers)
- `scripts/notion-migrate-members.ts` — NEW (idempotent schema migration)
- `tests/apply.spec.ts` — REWRITE for 6-step wizard flow
- `src/lib/__tests__/notion.test.ts` — add tests if the new mapping helper lives here

### Acceptance Criteria
- [ ] API route accepts the full new payload shape from ADR §5 (`workStyle`, `identityTags`, `needTags`, `serviceProviderDetail`, `whatTheyNeed`, `communityExpectation`, `communityMeaning`, `howTheyKnowSagie`, `referralSource`, `referralName`, `newsletterConsent`, `tier`)
- [ ] Old fields removed from the route: `role`, `category`, `company`, `whatTheyOffer`, `referral`, `ROLE_MAP`
- [ ] `withValidation(MembershipSchema, handler)` — unchanged HOF pattern
- [ ] Notion write maps new properties per ADR §5 "Updated Notion property mapping" — exact property names: `Work Style`, `Identity Tags`, `Need Tags`, `Service Provider Detail`, `Company Name`, `Organization Name`, `Freelancer Description`, `Community Expectation`, `Community Meaning`, `Referral Source`, `Referral Name`, `Newsletter Consent`
- [ ] Multi-selects use `{ multi_select: values.map(v => ({ name: v })) }`, rich_text uses `{ rich_text: [{ text: { content: value } }] }`, select uses `{ select: { name: value } }`, checkbox uses `{ checkbox: boolean }`
- [ ] Confirmation email + admin alert email updated to reflect the new field set
- [ ] `scripts/notion-migrate-members.ts`:
  - Reads `NOTION_TOKEN` + `NOTION_MEMBER_DB_ID` from env
  - Fetches existing DB schema
  - Diffs against the 12 required properties from ADR §9
  - For each missing property, calls Notion API to add it (using `databases.update`)
  - Is idempotent — running twice is safe (skip existing properties)
  - Supports `--dry-run` flag: logs planned changes, does not execute
  - Prints a summary: "Created: N | Skipped (exists): M"
- [ ] Script is runnable via `npx tsx scripts/notion-migrate-members.ts` or `npm run notion:migrate-members` (add script to `package.json`)
- [ ] Migration is run once against production `NOTION_MEMBER_DB_ID = ec753df1-ca8d-46d7-8c74-9b6f64cea2d5` before the wizard ships — flag in PR description, Sagie runs manually if script is the fallback
- [ ] `tests/apply.spec.ts` rewritten:
  - Happy path: fills all 6 steps, submits, verifies success state
  - Invalid advance: leaves Step 1 email blank, clicks Next, asserts error shown + still on Step 1
  - Conditional sub-field: selects "Company" in Step 3, asserts Company name field appears
  - Review edit modal: opens edit modal from Step 6, modifies a field, saves, asserts summary updates
  - Uses `x-vercel-protection-bypass` header for CI preview runs
- [ ] All 5 CI checks pass
- [ ] PR description references ADR §5, §9, §10 and includes the migration script run output

### Technical Context
- `withValidation` HOF from `src/lib/validation.ts` — do not modify, just use
- `sendEmails()` from `src/lib/email.ts` — may need new `FormType.Membership` branch signature update if the payload shape differs; verify and update minimally
- Notion client: `src/lib/notion.ts` — existing pattern `notion.pages.create({ parent, properties })`
- `notion-monitor.ts` already logs Notion write failures to Sentry — keep that in the error path
- Per instructions.md §Known concerns: "Missing Notion property handling" is a MEDIUM concern. This track's migration script resolves it for the wizard properties specifically. Broader fix deferred.
- Per ADR §5: "Old properties — leave in place for historical data, don't remove". Migration script only ADDS properties; never deletes.
- Playwright patterns: `tests/*.spec.ts` — follow existing selector + waitFor patterns
- CI: base URL from `PLAYWRIGHT_TEST_BASE_URL`, bypass header for Vercel preview

### Content
No user-facing copy in this track. Email template updates reuse existing subject lines from `src/lib/email.ts`; if subject lines reference `role` or deleted fields, update them to generic wording like "New SAGIE Membership Application".

### Implementation Details
1. **Migration script first** — build and test it against a staging or preview Notion DB ID if available, else dry-run against production, then execute. Script must handle multi-select option creation:
   ```ts
   'Identity Tags': {
     type: 'multi_select',
     multi_select: { options: identityTagOptions.map(name => ({ name })) }
   }
   ```
2. **API route rewrite** — start by copying the existing route, delete old field handling, add new field mapping per ADR §5, keep `withValidation`, keep `sendEmails()` call, keep Notion error path + Sentry capture.
3. **Email template** — update `ConfirmationEmail.tsx` and `AdminAlertEmail.tsx` to reflect new fields. If the templates currently hardcode field references (e.g., "Role: X"), either remove those lines or swap for the new fields (e.g., "Identity: {identityTags.join(', ')}").
4. **Tests rewrite** — delete existing `tests/apply.spec.ts` content, rewrite around the 6-step flow. Use stable selectors (labels, roles) — not class names.
5. **Coordination with Track 3:** Track 3 submits the form to this route. If Track 3 has not merged, verify the payload shape via the schema alone. Manual integration test after both merge.

### Notion Status Updates (Co-work handles)

### End-of-session
```bash
osascript -e 'display notification "Track 4 (wizard API) ready for review" with title "Claude Code"'
```

---

## Wave ordering summary

1. **Day 1 (04-11):** Create worktrees for Track 1 and Track 2. Start both Claude Code sessions in parallel.
2. **Day 2-3 (04-12 → 04-13):** Track 1 and Track 2 PRs land. CI passes. Sagie reviews Vercel previews. Merge.
3. **Day 3 (04-13 PM):** Create worktrees for Track 3 and Track 4 (from fresh main). Start both Claude Code sessions in parallel.
4. **Day 5-6 (04-15 → 04-17):** Track 3 and Track 4 PRs land. Run `scripts/notion-migrate-members.ts` in production. Merge both.
5. **Day 7 (04-18):** Smoke test live `/apply` wizard + live `/contribute` page. Sprint close.

## Sprint-close checklist (04-18)

- [ ] All 4 PRs merged
- [ ] `/apply` renders the 6-step wizard on production
- [ ] `/contribute` renders on production with working form submission
- [ ] Test submission verified in Notion Members DB (all 12 new properties populated)
- [ ] Test submission verified in Notion Contributions DB
- [ ] `MembershipForm.tsx` no longer in the codebase
- [ ] Co-work runs sprint retro → `.planning/SPRINT-04-11-RETRO.md`
- [ ] Co-work closes 12 tracker items
