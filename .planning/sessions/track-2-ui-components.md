# Track 2: UI Components Polish

**Branch:** `fix/ui-components`
**Priority:** High | **Effort:** M (3-5hr)
**Sprint:** 04-05-2026 (04-06 → 04-07)

---

## Goal

Fix navbar quality issues, shrink the footer, fix the Who's it for card layout, and improve section navigation dots.

## Notion Tracker Items

| Task | Page ID | Priority |
|------|---------|----------|
| Track 2: UI Components Polish | 33a5efbd-09e3-81c7-880e-cc7ee3f5cbe0 | High |

**On start:** set status to "In Development"
**On PR:** set status to "In Review" + add PR URL
**On merge:** set status to "Done"

## Files to Create/Modify

- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/sections/WhoItsFor.tsx`
- `src/constants/personas.ts`
- `src/components/ui/SectionNav.tsx`

## Acceptance Criteria

- [ ] Navbar logo and "Apply to Join" button are visually consistent, crisp, and aligned
- [ ] Footer is noticeably more compact — reduced padding, tighter layout
- [ ] Footer newsletter email form is REMOVED entirely (not hidden — removed from DOM)
- [ ] Who's it for cards: the small square icon in the top-right corner is positioned identically on every card
- [ ] Who's it for cards: the outline/border wraps fully and consistently around each card in all states (default, hover, flipped)
- [ ] Section nav dots are minimum 20×20px hit target
- [ ] Section nav inactive labels have opacity ≥ 0.65
- [ ] Section nav labels appear at full opacity on hover AND keyboard focus
- [ ] Responsive: all changes look correct on Desktop, Tablet, Mobile
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes

## Technical Context

- **Navbar:** `src/components/layout/Navbar.tsx` — check current logo implementation (SVG? Image? CSS?). The "Apply to Join" button should use the site's Button component with consistent sizing.
- **Footer:** `src/components/layout/Footer.tsx` — currently contains a newsletter email collection form. Remove the entire newsletter section. Keep the pillar columns, legal links, and copyright.
- **WhoItsFor:** Uses persona data from `src/constants/personas.ts`. Cards have a flip interaction with GSAP. The issue is the small square icon in the top-right and the outline border around the card.
- **SectionNav:** `src/components/ui/SectionNav.tsx` — sticky side navigation with dots. Currently 5×5px dots at 0.35 opacity.

## Implementation Details

1. **Navbar:**
   - Audit the logo rendering — is it SVG inline, an `<img>`, or a component? Ensure it renders at crisp resolution on all screens
   - The "Apply to Join" CTA should match the rest of the site's button styling (consistent padding, font-size, border-radius)
   - Check alignment: logo left, nav links center or right, CTA right — ensure vertical centering

2. **Footer:**
   - Delete the newsletter form section entirely from the Footer component
   - Remove any associated state, imports, or API calls related to newsletter subscription in the footer
   - Reduce vertical padding/margins throughout the footer
   - Tighten the column layout — less whitespace between sections
   - Verify the footer still contains: pillar links (ECO, Solutions, Ventures), legal links (Privacy, Terms), and copyright

3. **WhoItsFor cards:**
   - Inspect the card component for the top-right icon element — it should use `position: absolute; top: [value]; right: [value]` with identical values on every card
   - The outline/border: ensure `border` or `outline` property wraps the full card including rounded corners. Check for `overflow: hidden` clipping issues.
   - Test in both default and flipped states — the outline should persist through the flip animation

4. **SectionNav dots:**
   - Increase the dot `<button>` element size to minimum `width: 20px; height: 20px`
   - Add padding or a larger click area if the visual dot should remain small: `padding: 8px` around a 6px dot
   - Raise `opacity` of inactive labels from 0.35 to 0.65
   - Add `:hover` and `:focus-visible` state that sets label opacity to 1.0
   - Ensure tooltip/label appears on keyboard focus, not just mouse hover
