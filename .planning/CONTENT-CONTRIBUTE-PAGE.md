# Contribute Page — Final Copy (Sagie-approved 04-08-2026)

**Status:** Approved — ready for implementation
**Route:** `/contribute`
**Mockup:** `.planning/mockups/contribute-page.html`
**Form mockup:** `.planning/mockups/contribution-form.html`

---

## HERO

**Eyebrow:** Shape a Great Impact Everywhere
**Headline:** The Ecosystem Runs on What You Bring.
**Subtitle:** Membership is the starting point. Contribution is what moves the ecosystem — and what moves you through it.

---

## WHY CONTRIBUTE

**Section Header:** Contribution Is the Core Model

SAGIE is built on a single premise: the most durable returns come from helping others without calculating for return.

That principle is not a tagline. It is the operating model.

When members contribute — expertise, connections, resources, feedback — value circulates through the ecosystem and compounds. A warm introduction becomes a closed deal. A shared framework becomes a chapter program. A single resource, passed at the right moment, changes the trajectory of someone's company.

This only works when members bring something real. Not to perform generosity — because they understand that a high-trust network produces exponentially more than a large, diluted one.

The Contribute page is where that exchange begins.

---

## 5 CONTRIBUTION CATEGORIES

**Section Header:** Five Ways to Create Value

### Expertise
What you know took time to learn. The mistakes you made, the systems you built, the patterns you recognized — that knowledge has immediate value to someone in this network right now.

Contribute a session, a framework, a hard-won insight. The ecosystem routes it to the right person and ensures it stays in the system — not buried in a thread that disappears in 48 hours.

### Connections
A well-placed introduction can change everything. If you know someone who belongs in this ecosystem — a founder, an operator, an investor, a builder — bring them in.

The SAGIE network grows through trust, not volume. Every introduction you make carries your reputation. That weight is what makes it worth something.

### Opportunities
Job openings. Client leads. Collaboration requests. Speaking slots. Research partnerships.

Drop them here first. Members see opportunities before they go anywhere else — because they showed up first.

### Resources
Tools you actually use. Playbooks that held up under pressure. Articles that changed how you think.

The bar is simple: would you send this to someone you actually want to help? If yes, it belongs here.

### Feedback
The ecosystem improves when members tell the truth about what worked and what didn't — events, sessions, introductions, programs.

Direct, specific feedback is one of the rarest contributions in any network. It is also one of the most valuable.

---

## HOW IT WORKS

**Section Header:** The Process Is Simple. The Impact Compounds.

**Step 1 — Choose your contribution type**
Select what you are bringing: expertise, a connection, an opportunity, a resource, or feedback. Specificity matters — the more precise the contribution, the faster it reaches the person who needs it.

**Step 2 — Submit through the form**
A short form routes your contribution to the right place within the ecosystem. No gatekeeping, no committee — just direct routing to the members or programs that can activate it.

**Step 3 — Watch it circulate**
Value does not disappear in SAGIE. It moves. A resource you submit today will be referenced in a session next month. A connection you make today becomes a reference next quarter. This is how trust compounds over time.

---

## CLOSING CTA

**Section Header:** Movement Between Tiers Is Earned. Contribution Is How.

Every Builder started as an Explorer. Every Shaper started by showing up and giving something real.

The Contribute page is not a form. It is the on-ramp to the ecosystem's inner circle.

**[Contribute to the Ecosystem →]**

---

## Design Decisions (from mockup review)

### Color
- **Amber/gold `#C9A84C`** as contribution accent — approved
- Gold = action/input (what you're giving)
- Pillar colors = routing/output (where it lands)
- Gold already exists in nav logo — elevated, not new

### Layout (from approved mockup)
- Hero: Bebas Neue 120px, outlined `US` editorial tension, gold radial glow
- Ticker bar: contribution types scrolling (Time, Capital, Network, Skills, Space, Sponsorship, etc.)
- 6 contribution cards: 2-row grid (Time/Skills = gold, Capital/Host = ECO green, Network = Solutions blue, Sponsor = Ventures gray)
- 4-step process: flat bordered steps with gold dot connectors (circuit trace feel)
- Pillar alignment section: pillar colors show where contributions route
- CTA banner: gold-tinted conversion block, primary + ghost CTA

### Form Design Decisions
- `#0C0C0C` base + 48px circuit grid overlay
- Bebas Neue header / DM Sans body
- Top silver gradient accent bar on card
- Smooth card + field entrance animations (staggered)
- Chips instead of dropdown for contribution areas
- "Tell us more" visibly optional via inline note
- Availability options in Sagie's voice: "Active — I'm all in"
- Consent in plain English
- Success message: "You're in the circuit."
- Validation: `#39E87C` green / `#FF3D5A` red — live on blur, not keystroke
- Error on submit focuses first failing field
- Status icon (✓) animates in per field on valid state
