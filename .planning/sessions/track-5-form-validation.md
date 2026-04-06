# Track 5: Form Validation UX

**Branch:** `feature/form-validation-ux`
**Priority:** Medium | **Effort:** M (3-5hr)
**Sprint:** 04-05-2026 (04-06 → 04-07)

> **⚠️ DEPENDS ON TRACK 1 MERGE — do not start until Track 1 (`fix/accessibility-visual-tokens`) is merged to main**

---

## Goal

Enhance form validation UX with visual valid/invalid states, animated feedback, and cascading field locks.

## Notion Tracker Items

| Task | Page ID | Priority |
|------|---------|----------|
| Track 5: Form Validation UX | 33a5efbd-09e3-81a6-b01e-c0fd04f8cf09 | Medium |

**On start:** set status to "In Development"
**On PR:** set status to "In Review" + add PR URL
**On merge:** set status to "Done"

## Files to Create/Modify

- `src/components/forms/MembershipForm.tsx`
- `src/components/forms/ChapterForm.tsx`
- `src/components/forms/SolutionsForm.tsx`
- `src/components/forms/VenturesForm.tsx`
- `src/components/forms/ContactForm.tsx`
- `src/components/forms/SuggestEventForm.tsx`
- `src/components/ui/FormField.tsx`
- `src/components/ui/LocationFields.tsx`
- `src/app/globals.css` (validation state classes)

## Acceptance Criteria

- [ ] Invalid fields show red border + red error text on blur (after first interaction)
- [ ] Valid fields show green border + green checkmark icon on blur
- [ ] Validation state transitions are animated (smooth border color change, error text slides in)
- [ ] Error text is minimum 14px, high contrast against background
- [ ] Country → State → City fields: State is disabled/locked until Country is selected; City is disabled until State/Country is selected
- [ ] Locked fields have a visual "disabled" state (dimmed, with a lock icon or tooltip)
- [ ] All existing form submission functionality still works
- [ ] All existing tests pass

## Technical Context

- **Forms use:** `react-hook-form` (7.72.0) + `@hookform/resolvers` (5.2.2) with Zod schemas from `src/lib/schemas.ts`
- **FormField:** `src/components/ui/FormField.tsx` — reusable form field wrapper component. This is likely where validation state styling should be centralized.
- **LocationFields:** `src/components/ui/LocationFields.tsx` — handles Country/State/City fields. Uses `country-state-city` package.
- **Styling:** Tailwind CSS utilities + `cn()` helper for conditional classes.
- **Animation:** For validation animations, use CSS transitions (not GSAP) — these are simple state changes that don't need a full animation library.

## Implementation Details

1. **Validation state styles** (globals.css + FormField):
   - Define CSS classes: `.field-valid`, `.field-invalid`, `.field-locked`
   - `.field-valid`: green border (`border-green-500`), green checkmark icon
   - `.field-invalid`: red border (`border-red-500`), red error text
   - `.field-locked`: dimmed opacity (0.5), `pointer-events: none`, subtle lock indicator
   - Add `transition: border-color 0.2s ease, opacity 0.2s ease` for smooth state changes

2. **FormField component enhancement:**
   - Accept validation state from react-hook-form (`formState.errors`, `formState.touchedFields`, `formState.dirtyFields`)
   - Show invalid state: when field is touched AND has an error
   - Show valid state: when field is touched AND has no error AND has a value
   - Show neutral state: when field is untouched
   - Error text: animate in with `max-height` + `opacity` transition

3. **Field locking cascade:**
   - In LocationFields.tsx: use `watch()` from react-hook-form to observe Country and State values
   - State field: `disabled` until Country has a value
   - City field: `disabled` until State has a value (or Country if no states)
   - When a parent field changes, reset child fields (e.g., changing Country clears State and City)
   - Apply `.field-locked` styling to disabled fields
