# Contribution Page — Design Brief + Prompts
**Sprint:** 04-05 | **Date:** 04-06-2026
**Status:** Design phase — use these prompts in Claude.ai to generate page design

---

## Page Purpose

A new page at `/contribution` (or `/contribute`) where community members and external supporters can offer their time, skillset, expertise, connections, or business to the SAGIE ecosystem — without necessarily being a full member or going through the application process.

**Think of it as:** The membership form says "Join us." The contribution page says "Help us — in whatever way makes sense for you."

---

## Information Architecture (Recommended)

```
/contribute
├── Hero: "Every Contribution Builds the Ecosystem"
├── Why Contribute (value prop for the contributor)
├── Ways to Contribute (category grid)
│   ├── Time — mentorship hours, event support, community moderation
│   ├── Skills — design, engineering, legal, finance, marketing
│   ├── Expertise — speaking, workshops, advisory, curriculum
│   ├── Connections — intros, partnerships, deal flow
│   └── Business — tools, services, spaces, sponsorship
├── How It Works (3-step process)
├── Contribution Form (multi-select categories + description)
└── CTA: "Your Contribution. Your Terms."
```

---

## Claude.ai Design Prompts

### Prompt 1: Page Copy + Voice
```
You are writing copy for a new page on sagie.co called "Contribute." The SAGIE brand voice is: direct, declarative, anti-corporate, trust-first, give-first philosophy. Think manifesto meets startup — rhythmic short sentences, no fluff, no buzzwords. Examples of the voice: "Give First. Everything Follows." / "Trust Creates Deal Flow." / "The Expertise Is in the Room." / "Tiers are earned, not purchased."

Write complete page copy for a Contribution page where people can offer their time, skills, expertise, connections, or business to the SAGIE ecosystem. This is NOT a membership application — it's lighter, more open, for people who want to help without the full commitment of joining.

Include:
- Hero headline + subtitle (Bebas Neue display, DM Sans body style)
- "Why Contribute" section — 2-3 short paragraphs on why giving to the ecosystem matters
- "Ways to Contribute" — 5 categories (Time, Skills, Expertise, Connections, Business) with a 1-sentence description each
- "How It Works" — 3 simple steps
- A closing CTA line

Voice rules:
- No "we believe" / "we strive" / "our mission is"
- No "leverage" / "synergy" / "ecosystem" used generically
- OK to use "ecosystem" when referring to SAGIE ECO specifically
- Short paragraphs (1-3 sentences)
- Punchy, declarative, earned confidence
```

### Prompt 2: Page Layout + Visual Direction
```
Design a page layout for sagie.co/contribute. The site uses:
- Dark theme: background rgb(12,12,12), text in silver/white
- Typography: Bebas Neue for display headings, DM Sans for body
- Color system: ECO sage green #7A9E7E, Solutions steel blue #6B9EC0, Ventures gray #8A8A8A
- Visual elements: circuit-board grid lines as background texture, subtle gradient overlays
- Component patterns: full-width sections with centered content, eyebrow labels above headings, card grids for categories

Layout the Contribution page as a wireframe or structured description:
1. Hero section — full viewport, headline + subtitle + subtle background grid
2. Why Contribute — text section, left-aligned, 2-column on desktop
3. Ways to Contribute — 5-card grid (think pillar cards from homepage). Each card: icon area, category name in Bebas Neue, description in DM Sans, hover state
4. How It Works — 3-step horizontal flow with numbered circles
5. Contribution form — embedded or link to a form page
6. Closing CTA — full-width, single line, large type

Consider: should the contribution categories use a unique accent color (maybe a warm amber/gold to differentiate from the three pillar colors), or reuse the existing palette?
```

### Prompt 3: Form Design
```
Design a contribution form for sagie.co/contribute. This form should be lighter than the membership application — fewer fields, lower commitment feel.

Fields:
- Name (required)
- Email (required)
- How would you like to contribute? (multi-select: Time, Skills, Expertise, Connections, Business)
- Tell us more (textarea — what specifically they can offer)
- Availability (optional — dropdown: "A few hours/month", "Regular commitment", "One-time", "Open to discuss")
- Privacy consent checkbox

The form should:
- Match the dark theme of the site
- Use the validation UX being implemented: green valid states, red invalid states, animated transitions
- Feel inviting, not gatekeeping — this is a give-first page
- Be a single page (no multi-step needed — it's short)

Write the form layout, field labels, placeholder text, and the submit button copy.
```

---

## Technical Notes for Implementation (Future Sprint)

- Route: `src/app/(marketing)/contribute/page.tsx`
- Form component: `src/components/forms/ContributeForm.tsx`
- API route: `src/app/api/contributions/route.ts`
- Notion DB: Create new "Contributions" database or reuse existing
- Schema: Add to `src/lib/schemas.ts`
- Uses: `withValidation` HOF, `react-hook-form` + Zod, `sendEmails()`
- Metadata: `title: "Contribute to SAGIE | SAGIE"`
