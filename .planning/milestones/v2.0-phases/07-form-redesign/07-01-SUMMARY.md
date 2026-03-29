---
phase: 07-form-redesign
plan: 01
subsystem: forms
tags: [react-hook-form, zod, FormField, schemas, validation]
dependency_graph:
  requires: []
  provides: [FormField-registration-prop, checkbox-group-type, schema-error-messages, role-enum]
  affects: [07-02, 07-03]
tech_stack:
  added: [react-hook-form@7.72.0, "@hookform/resolvers@5.2.2"]
  patterns: [UseFormRegisterReturn spread, Zod v4 error param for enums]
key_files:
  created: []
  modified:
    - src/components/ui/FormField.tsx
    - src/lib/schemas.ts
    - src/lib/__tests__/schemas.test.ts
    - package.json
    - package-lock.json
decisions:
  - "Used Zod v4 { error: string } param (not errorMap) for enum error messages — errorMap is Zod v3 API"
  - "Made value/onChange optional on FormField for backward compatibility during migration"
metrics:
  duration_minutes: 8
  completed_date: "2026-03-28"
  tasks_completed: 3
  files_modified: 5
---

# Phase 7 Plan 01: Foundation — React Hook Form + FormField + Schema Messages Summary

**One-liner:** Installed react-hook-form, updated FormField with registration prop and checkbox-group type, added conversational Zod error messages, and converted MembershipSchema role to a 6-value enum.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Install react-hook-form and update FormField | 4e01372 | package.json, package-lock.json, FormField.tsx |
| 2 | Add human-friendly error messages and role enum | f4f7c79, 8db5d49 | schemas.ts |
| 3 | Update schema tests for role enum | 19455cc | schemas.test.ts |

## Decisions Made

- **Zod v4 enum error API:** The plan specified `errorMap: () => ({ message: '...' })` which is the Zod v3 API. Zod v4 (in use at ^4.3.6) uses `{ error: string }` as the second argument to `z.enum()`. Auto-fixed immediately after build error.
- **value/onChange made optional:** FormField's `value` and `onChange` props were made optional to support both legacy (controlled value/onChange) and new (RHF registration) patterns during migration. New forms use `registration` only.
- **checkbox-group `.rhf-checkbox` CSS class:** Used a scoped `<style>` tag in the component for `:checked` pseudo-class styling since inline styles cannot handle pseudo-classes.

## Verification Results

- `npm test -- schemas.test.ts`: 40/40 tests pass
- `npx tsc --noEmit`: no TypeScript errors
- Build static generation fails on pre-existing `/admin/revalidate` bug (NotFoundIllustration undefined) — unrelated to this plan

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Zod v4 errorMap API mismatch**
- **Found during:** Task 2 verification (npm run build TypeScript check)
- **Issue:** Plan used `errorMap: () => ({ message: '...' })` (Zod v3 syntax), but the project uses Zod v4 where `errorMap` is not a known property on enum params. The correct Zod v4 API is `{ error: string }`.
- **Fix:** Changed all `errorMap: () => ({ message: '...' })` usages to `error: '...'` in MembershipSchema role, VenturesSchema sector/stage, and SolutionsSchema category.
- **Files modified:** src/lib/schemas.ts
- **Commit:** 8db5d49

## Self-Check: PASSED

- src/components/ui/FormField.tsx: FOUND
- src/lib/schemas.ts: FOUND
- src/lib/__tests__/schemas.test.ts: FOUND
- Commit 4e01372: FOUND
- Commit f4f7c79: FOUND
- Commit 19455cc: FOUND
- Commit 8db5d49: FOUND
