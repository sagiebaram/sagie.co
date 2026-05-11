# ADR Session: Membership Portal — Multi-Step Wizard (v2)

**Type:** Architecture Decision Record (not a build session)
**Output:** `.planning/ADR-MEMBERSHIP-WIZARD.md` (overwrite existing)
**Status:** Re-run — Sagie reviewed v1 and provided detailed feedback

---

## Context

Read these files first:
- `instructions.md` — full stack context, patterns, rules
- `.planning/ARCHITECTURE-FORMS.md` — high-level decisions (locked)
- `.planning/ADR-MEMBERSHIP-WIZARD.md` — v1 ADR (use as starting point, apply changes below)
- `src/components/forms/MembershipForm.tsx` — current membership form
- `src/components/ui/FormField.tsx` — current form field component
- `src/components/ui/LocationFields.tsx` — country/state/city fields
- `src/lib/schemas.ts` — Zod validation schemas
- `src/app/(marketing)/apply/page.tsx` — current apply page
- `src/app/api/applications/membership/route.ts` — current form submission API
- `package.json` — check if `nuqs` is already installed

## Decisions Already Made (locked)

- **Auth:** Supabase (future sprint — NOT part of this ADR)
- **Wizard pattern:** Option C — hybrid with `nuqs` URL params for step tracking
- **First form:** Membership (most complex)
- **Tier:** Defaulted to Explorer. User learns about tiers post-signup via email + portal. NOT shown in wizard.
- **Review step editing:** Inline edit modal (not URL navigation)
- **Step transitions:** Fade animation (CSS, not GSAP)
- **Draft restoration:** Silent restore from sessionStorage (no prompt)

---

## CHANGES FROM V1 — Apply All of These

### Step 1: About You — NO CHANGES
Keep as-is from v1.

### Step 2: Location — NO CHANGES
Keep as-is from v1.

### Step 3: Your Professional Identity — MAJOR REWORK

**Remove:** "I am a..." label, the old `role` select, and `category` checkboxes.

**Replace with:**

**Field: "How do you work?"** — Multi-select checkboxes. Can pick multiple. ALL REQUIRED (at least one selection).
Options:
- Company (selecting opens: "Company/Organization name" text field)
- Organization (selecting opens: "Organization name" text field)  
- Freelancer (selecting opens: "What do you do?" text field)

Each selection dynamically reveals its sub-field. If someone selects Company + Freelancer, they see both sub-fields.

**Field: "Interests"** — rename to something clearer or remove. Sagie flagged he doesn't know what it means in the current form. If this maps to the old `category` field (Founder, Investor, Tech Pro, etc.), it's being replaced by the new Step 3B taxonomy below. Remove the old `category`/`interests` field entirely.

### NEW Step 3B: Your Role & What You're Looking For — MATCHMAKING FOUNDATION

This is a NEW step inserted between the old Step 3 and Step 4. The wizard now has 6 steps total.

**Field: "I am a..." (identity tags)** — Multi-select checkboxes. At least one required.
V1 tags:
- Founder (building a startup)
- Investor (angel, VC, LP)
- Service Provider → selecting opens text field: "What do you offer?"
- Job Seeker (looking for a role)
- Corporate Executive (works at an established company)
- Ecosystem Builder (community leaders, accelerator operators, gov/econ dev)
- Advisor / Mentor (experienced, wants to give back)
- Student / Early Career (learning, exploring)

**Field: "I'm looking for..." (need tags)** — Multi-select checkboxes. At least one required.
V1 tags:
- Co-founder (looking for a partner to build with)
- Funding (seeking investment)
- Deal flow (looking for startups to invest in)
- Talent / Hiring (building a team)
- Clients / Customers (looking for business)
- Mentorship (wants guidance)
- Service providers (needs specific help — legal, design, etc.)
- Community / Network (connect with like-minded people)
- Partnership opportunities (strategic alliances, distribution)
- A job (actively seeking employment)

**Data model note:** These tags power future matchmaking. Design the schema so tags are arrays of string literals (not free text). The Notion DB should receive them as multi-select properties. Include a `serviceProviderDetail` text field for the "Service Provider" sub-field.

### Step 4: Tell Us More — REWORKED

**All fields are REQUIRED** (v1 had them all optional).

Fields:
1. "What are you building or working on?" — textarea
2. "What are you looking for in a community?" — textarea (NEW)
3. "What does a community mean to you?" — textarea (NEW)
4. "Why SAGIE?" — textarea (keep from v1)
5. "How did you hear about us?" — DROPDOWN with options:
   - Google Search
   - Social Media (LinkedIn, Twitter, etc.)
   - Friend or Colleague
   - Event
   - Podcast
   - Article / Blog
   - Referral → selecting opens text field: "Who referred you?" (name)
   
   Note: "Referral" replaces the old generic "Other" option. The dropdown should NOT have an "Other" — "Referral" is the catch-all.

**Removed from v1:** "What do you bring to the community?" (replaced by the new "What does a community mean to you?" + the matchmaking tags handle the "what do you bring" concept)

### Step 5: Review + Submit — UPDATED

Keep the read-only summary concept from v1 but:
- **Inline edit modal** — clicking a section opens a modal overlay to edit those fields without leaving the Review step. The modal contains only that step's fields. Save closes the modal, updates the summary.
- **Two consent checkboxes (both required):**
  1. Privacy consent (link to /privacy) — existing
  2. SAGIE Letter newsletter consent — NEW. Text: "Subscribe to The SAGIE Letter — weekly insights on ecosystem building, startups, and community." (or similar, can be refined)

### Step count is now 6:
1. About You
2. Location
3. Your Professional Identity (how you work)
4. Your Role & What You're Looking For (matchmaking)
5. Tell Us More
6. Review + Submit

Update the progress indicator, URL params, step field maps, and all references accordingly.

---

## What This ADR Must Cover

Same sections as v1, but updated for the new step structure:

### 1. Component Architecture
- Updated wizard container with 6 steps
- Dynamic sub-field pattern (multi-select reveals child fields)
- Inline edit modal component for Review step
- Fade transition implementation

### 2. Step Breakdown
- Exact fields per step with updated Zod schemas
- Per-step validation (which fields are required vs optional)
- Dynamic field reveal logic for Step 3 and Step 3B

### 3. Validation UX Per Step
- Same as v1 but note: Step 3, 3B, and 4 now have required fields
- Dropdown + conditional text field validation for "How did you hear about us?"

### 4. Progress Indicator
- Updated for 6 steps
- Mobile behavior with more steps

### 5. Data Flow
- Updated TypeScript interfaces with new fields
- New Notion DB properties needed (identity tags, need tags, service provider detail, newsletter consent, hear about us dropdown)
- Updated API route payload

### 6. URL State with nuqs
- Updated step IDs for 6 steps

### 7. Accessibility
- Modal accessibility (trap focus, escape to close, aria-modal)
- Dynamic sub-field announcements for screen readers

### 8. sessionStorage Backup
- Same as v1 but covers new fields

### 9. Matchmaking Data Model
- NEW SECTION. How identity tags and need tags are stored.
- Notion multi-select property design
- Future Supabase schema considerations (for portal matchmaking)
- How tags enable matching: supply (I am) ↔ demand (looking for)

### 10. Migration Path
- Updated file changes inventory for 6-step wizard
- New components needed (inline edit modal, dynamic sub-fields)

### 11. Open Questions
- Flag anything unclear from the changes above

## Output Format

Write the full ADR to `.planning/ADR-MEMBERSHIP-WIZARD.md` (overwrite v1). Clear sections, code examples (TypeScript interfaces, component signatures, nuqs setup), decision matrix for any remaining trade-offs.

Do NOT build anything. This is a planning session only.

After writing the ADR, run:
```bash
osascript -e 'display notification "ADR v2 complete — ready for review" with title "Claude Code"'
```
