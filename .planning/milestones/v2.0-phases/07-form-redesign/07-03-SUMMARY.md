---
phase: 07-form-redesign
plan: 03
subsystem: forms
tags: [custom-dropdown, FormField, keyboard-nav, dark-theme, error-styling, allowOther, playwright, E2E]
dependency_graph:
  requires: [07-02]
  provides: [FormField-custom-dropdown, MembershipForm-other-role, E2E-dropdown-tests]
  affects: [MembershipForm, VenturesForm, SolutionsForm, SubmitPostForm]
tech_stack:
  added: []
  patterns: [custom dropdown with useRef/useEffect click-outside, onValueChange/setValue/watch RHF integration, allowOther free-text pattern]
key_files:
  created: []
  modified:
    - src/components/ui/FormField.tsx
    - src/components/forms/MembershipForm.tsx
    - src/components/forms/VenturesForm.tsx
    - src/components/forms/SolutionsForm.tsx
    - src/components/forms/SubmitPostForm.tsx
    - src/lib/schemas.ts
    - src/lib/__tests__/schemas.test.ts
    - tests/forms.spec.ts
decisions:
  - "FormField custom dropdown uses hidden input for [name] selector compatibility — E2E assertions using [name='role'] etc. still work"
  - "allOptions[index] in keydown handler guarded via undefined check — TypeScript strict array indexing requires explicit undefined handling"
  - "MembershipSchema role changed to z.string().min(1) — allows any non-empty string including custom Other free-text values"
  - "VenturesForm sector/stage use explicit enum type casts for setValue — TypeScript requires the exact enum union type, not string"
metrics:
  duration_minutes: 18
  completed_date: "2026-03-28"
  tasks_completed: 2
  files_modified: 8
---

# Phase 7 Plan 03: Custom Dropdown and Error Styling Summary

**One-liner:** Replaced all 5 native `<select>` elements with a custom dark-theme dropdown in FormField featuring keyboard nav, click-outside, allowOther free-text, and updated E2E tests.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Custom dropdown in FormField, fix error borders, wire 4 forms, update schema | 0f3e55f | FormField.tsx, MembershipForm.tsx, VenturesForm.tsx, SolutionsForm.tsx, SubmitPostForm.tsx, schemas.ts, schemas.test.ts |
| 2 | Update E2E tests for custom dropdowns | 032102f | tests/forms.spec.ts |

## Decisions Made

- **Hidden input for selector compatibility:** The custom dropdown renders `<input type="hidden" name={name} value={...} />` so existing `[name="role"]` attribute selectors in assertions and form data serialization continue to work without changes.
- **allOptions[index] undefined guard:** TypeScript strict mode treats array index access as returning `T | undefined`. Guarded via `const highlighted = index >= 0 ? allOptions[index] : undefined` before calling `handleSelect`.
- **z.string().min(1) for MembershipSchema role:** Changed from `z.enum([...])` to allow the "Other" free-text value. All predefined role values still pass (they're valid non-empty strings). Schema tests updated to reflect this.
- **Type casts for enum setValue:** VenturesForm and SolutionsForm use `setValue('sector', v as 'Fintech' | ...)` because RHF's `setValue` is typed to the schema output type which is the enum union, not `string`.

## Verification Results

- `npm run build`: passes, TypeScript check clean
- `npm test`: 127 tests passed (10 test files)
- `npx playwright test tests/forms.spec.ts`: 10/10 tests passed

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] TypeScript strict array indexing in keyboard handler**
- **Found during:** Task 1 (npm run build TypeScript check)
- **Issue:** `allOptions[highlightedIndex]` typed as `string | undefined` under strict mode — not assignable to `handleSelect(option: string)` parameter.
- **Fix:** Extracted to `const highlighted = highlightedIndex >= 0 ? allOptions[highlightedIndex] : undefined` with guard before call.
- **Files modified:** src/components/ui/FormField.tsx
- **Commit:** 0f3e55f

**2. [Rule 1 - Bug] Blur validation tests missing .blur() after fill**
- **Found during:** Task 2 (E2E test run)
- **Issue:** Chapter, solutions, ventures, and suggest-event blur tests did `fill()` then immediately asserted error gone — but `reValidateMode: 'onChange'` requires a blur event to trigger revalidation in `mode: 'onBlur'` forms.
- **Fix:** Added `await page.locator(...).blur()` after each fill in the 4 failing blur tests. Same pattern was already applied to membership test in a prior commit.
- **Files modified:** tests/forms.spec.ts
- **Commit:** 032102f

**3. [Rule 1 - Bug] suggest-event description selector matched meta tag**
- **Found during:** Task 2 (E2E test run)
- **Issue:** `page.fill('[name="description"]')` resolved to 2 elements — first was the `<meta name="description">` page tag, not the textarea. Action timed out.
- **Fix:** Changed to `page.locator('textarea[name="description"]').fill(...)` to target only the form textarea.
- **Files modified:** tests/forms.spec.ts
- **Commit:** 032102f

## Self-Check: PASSED

- src/components/ui/FormField.tsx: FOUND
- src/components/forms/MembershipForm.tsx: FOUND
- src/components/forms/VenturesForm.tsx: FOUND
- src/components/forms/SolutionsForm.tsx: FOUND
- src/components/forms/SubmitPostForm.tsx: FOUND
- src/lib/schemas.ts: FOUND
- src/lib/__tests__/schemas.test.ts: FOUND
- tests/forms.spec.ts: FOUND
- Commit 0f3e55f: FOUND
- Commit 032102f: FOUND
