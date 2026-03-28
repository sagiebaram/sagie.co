---
phase: 07-form-redesign
plan: 02
subsystem: forms
tags: [react-hook-form, zod, MembershipForm, VenturesForm, validation, checkbox-group, dropdown]
dependency_graph:
  requires: [07-01]
  provides: [MembershipForm-rhf, VenturesForm-rhf, section-headers]
  affects: []
tech_stack:
  added: []
  patterns: [z.input<typeof Schema> for exactOptionalPropertyTypes, SectionHeader local component, useForm zodResolver onBlur mode]
key_files:
  created: []
  modified:
    - src/components/forms/MembershipForm.tsx
    - src/components/forms/VenturesForm.tsx
decisions:
  - "Used z.input<typeof Schema> (not z.infer) for useForm generic — MembershipSchema has tier field with .default('Explorer') which makes infer type non-optional, incompatible with resolver under exactOptionalPropertyTypes"
  - "SectionHeader as local function component — used only within the two form files, no need to extract to shared ui/"
metrics:
  duration_minutes: 9
  completed_date: "2026-03-28"
  tasks_completed: 2
  files_modified: 2
---

# Phase 7 Plan 02: MembershipForm and VenturesForm Migration Summary

**One-liner:** Migrated MembershipForm and VenturesForm from useState + manual validation to react-hook-form with zodResolver, adding all missing schema fields, dropdowns, checkbox group, section headers, and fixing field name data-loss bugs.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Migrate MembershipForm to react-hook-form with all missing fields | 5c68f5d | src/components/forms/MembershipForm.tsx |
| 2 | Migrate VenturesForm to react-hook-form with all missing fields | b0de54e | src/components/forms/VenturesForm.tsx |

## Decisions Made

- **z.input vs z.infer:** MembershipSchema's `tier` field has `.default('Explorer')`, which makes `z.infer<>` produce `tier: "Explorer" | "Builder" | "Shaper"` (non-optional after transform). With `exactOptionalPropertyTypes: true` in tsconfig, this is incompatible with the resolver's ResolverOptions which expects the input type. Using `z.input<typeof MembershipSchema>` (the pre-transform input type where `tier` is optional) resolves the mismatch. Same pattern applied to VenturesSchema for consistency.
- **SectionHeader as local component:** Added inline `SectionHeader` function in each form file. Not extracted to shared `ui/` since it's only used within these two files and serves as a visual divider specific to multi-section forms.

## New Fields Added

### MembershipForm (previously missing)
- `company` — optional text, maps to Notion "Company" property
- `whatTheyOffer` — optional textarea, maps to Notion "What They Offer" property
- `category` — checkbox-group with 7 options matching schema enum: Founder, Investor, Tech Pro, Ecosystem Builder, Sponsor, Partner, Advisor

### VenturesForm (field name fixes + new fields)
- `founderName` — renamed from `fullName` state key (data-loss bug fixed)
- `oneLineDescription` — renamed from `building` state key (data-loss bug fixed)
- `whySAGIE` — renamed from `whySagie` state key (case fix — API route reads `body.whySAGIE`)
- `linkedIn` — new optional URL field
- `pitchDeckUrl` — new optional URL field
- `sector` — new dropdown with 8 schema-matching options
- `raiseAmount` — new optional text field
- `stage` — options fixed: removed 'Idea', fixed 'Pre-seed' -> 'Pre-Seed', added 'Revenue-Stage'

## Verification Results

- `npm run build`: passes, TypeScript check clean, all routes generated

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] z.infer incompatible with zodResolver under exactOptionalPropertyTypes**
- **Found during:** Task 1 verification (npm run build TypeScript check)
- **Issue:** `useForm<z.infer<typeof MembershipSchema>>` failed with: `Resolver<...tier: "Explorer" | "Builder" | "Shaper"...>` not assignable due to `exactOptionalPropertyTypes: true` — `tier` is non-optional in output type but optional in input type.
- **Fix:** Changed `import type { z }` to `import { z }` and used `z.input<typeof MembershipSchema>` and `z.input<typeof VenturesSchema>` respectively.
- **Files modified:** MembershipForm.tsx, VenturesForm.tsx
- **Commit:** Fix included in 5c68f5d and b0de54e

## Self-Check: PASSED

- src/components/forms/MembershipForm.tsx: FOUND
- src/components/forms/VenturesForm.tsx: FOUND
- Commit 5c68f5d: FOUND
- Commit b0de54e: FOUND
