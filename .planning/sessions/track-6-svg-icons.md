# Track 6: SVG Icons Integration

**Branch:** `feature/svg-icons`
**Priority:** Medium | **Effort:** S-M (2-3hr)
**Sprint:** 04-05-2026 (04-06 → 04-07)

> **⚠️ DEPENDS ON: Sagie pushing SVG files to `public/icons/` before starting**

---

## Goal

Add Sagie's custom SVG icons as static elements in relevant website sections.

## Notion Tracker Items

| Task | Page ID | Priority |
|------|---------|----------|
| Track 6: SVG Icons Integration (static) | 33a5efbd-09e3-8151-9b96-ff77a8f7c207 | Medium |

**On start:** set status to "In Development"
**On PR:** set status to "In Review" + add PR URL
**On merge:** set status to "Done"

## Files to Create/Modify

- `public/icons/` — SVG files (added by Sagie)
- Section components where icons will be placed (specific files TBD based on icon set)
- Potentially `src/components/ui/Icon.tsx` — reusable icon component

## Acceptance Criteria

- [ ] All SVG icons are placed in their designated sections
- [ ] Icons render at correct size and inherit appropriate colors
- [ ] Icons have proper `alt` text or `aria-label` for accessibility
- [ ] Icons are responsive — scale appropriately across breakpoints
- [ ] Icons are added as static elements (animation comes in a future sprint)
- [ ] No console errors from SVG rendering

## Technical Context

- **SVG approach:** Import SVGs as React components (Next.js supports this) or reference from `public/` directory via `<img>` or inline SVG.
- **Recommended:** If icons need to inherit text color, use inline SVG with `fill="currentColor"`. If they're decorative images, `<img>` with empty `alt=""` is fine.
- **Animation prep:** Since these will be animated in a future sprint, structure the SVG elements cleanly with `id` attributes on animatable paths/groups.

## Implementation Details

1. **Wait for Sagie** to push SVG files to the repo
2. **Audit the icon set** — determine what each icon represents and which section it belongs to
3. **Create an Icon component** if multiple icons share the same sizing/color pattern:
   ```tsx
   export const Icon = ({ name, size = 24, className }: IconProps) => (...)
   ```
4. **Place icons** in their sections — specific placement TBD based on the icon set
5. **Ensure accessibility** — decorative icons get `aria-hidden="true"`, meaningful icons get `aria-label`
