# Next Sprint Kickoff Prompt

> Paste this into a new Co-work chat to start the next sprint planning session.

---

## Prompt

I'm starting a new sprint for sagie.co. Read `instructions.md` and `CLAUDE.md` first.

**Sprint 04-11 just closed.** Retro is at `.planning/RETRO-SPRINT-04-11.md`. Here's what carries forward:

### Priority 1 — ADR v3 Implementation (Step 4 + Step 5 Redesign)
All 12 schema questions are decided. ADR is at `.planning/ADR-MEMBERSHIP-WIZARD-V3-DRAFT.md`.

What needs to happen:
- Rename Step 4 to "Matchmaking" (param: `matchmaking`, label: "Match")
- Add conditional sub-fields for Founder (building, sector, stage), Investor (type, sectors, thesis), Mentor (expertise checkboxes, mentee description), Job Seeker (role text)
- Add "I'm looking for..." sub-fields: LinkedIn URL for job seekers, hiring description textarea
- Replace Step 5's required textarea with checkbox group (8 options, ≥1 required) + optional "Anything else?" textarea
- ~10-15 new Zod fields in schemas.ts + superRefine conditional logic
- ~10-15 new Notion Members DB properties (migration script)
- API route mapping for all new fields
- E2E test updates

### Priority 2 — UX/UI Polish Pass (Entire Wizard)
The ADR v3 co-work instructions include a UX/UI review that was never completed. Before or alongside implementation, we need to walk through:
- Readability: field spacing, font sizes, label hierarchy, breathing room
- Animations: step transitions, field reveals (dynamic sub-fields), validation states, progress bar
- Visual consistency: dark palette, silver accents, DM Sans / Bebas Neue, subtle borders
- Mobile: checkbox groups, textarea heights, progress bar, Review accordion
- Decisions get recorded as §6 in the ADR, then Claude Code implements in one pass

### Priority 3 — Contribute Page Brainstorm
PR #41 was closed without merge. Both versions rejected. Open questions:
- Should `/contribute` be a standalone page or folded into the SAGIE ECO page?
- Does it need a full redesign or should we drop it entirely?
- If we keep it, what's the right visual direction?
This is a Co-work brainstorm only — no implementation this sprint unless direction is locked.

### Carryover Items (capacity fill)
From Sprint 04-07:
- B-2 Marquee ticker (still open — Track 2 cancelled before merge)
- B-5 Circuit trace
- B-6 Horizontal gallery
- B-7 Editorial layout
- B-8 Scene reveal

### Context
- Stack: Next.js 16, TypeScript strict, Tailwind CSS v4, Vercel
- Workflow: Co-work plans → Claude Code executes via dmux + worktrees
- `.planning/` is UNTRACKED — must rsync to worktrees before each session
- All Claude Code sessions run with `--dangerously-skip-permissions`
- Notion Dev Tracker DB: `cd0d162c-6114-41a2-af28-3cba08086f63`
- Notion Members DB: `ec753df1-ca8d-46d7-8c74-9b6f64cea2d5` (12 wizard properties already migrated)

Use the `dev-sprint` skill to scope and plan.
