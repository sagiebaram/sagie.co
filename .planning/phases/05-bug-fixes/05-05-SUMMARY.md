---
phase: 05-bug-fixes
plan: 05
subsystem: forms
tags: [bug-fix, schema, forms, validation, error-handling]
dependency_graph:
  requires: []
  provides: [empty-string-safe-optional-url-fields, visible-422-error-messages]
  affects: [MembershipForm, ChapterForm, VenturesForm, SolutionsForm, SubmitPostForm, SuggestEventForm]
tech_stack:
  added: []
  patterns: [z.string().optional().transform().pipe() for empty-string-safe URL validation, 422 fieldErrors parsing in form onSubmit]
key_files:
  created: []
  modified:
    - src/lib/schemas.ts
    - src/lib/__tests__/schemas.test.ts
    - src/components/forms/MembershipForm.tsx
    - src/components/forms/ChapterForm.tsx
    - src/components/forms/VenturesForm.tsx
    - src/components/forms/SolutionsForm.tsx
    - src/components/forms/SubmitPostForm.tsx
    - src/components/forms/SuggestEventForm.tsx
decisions:
  - "optionalUrl uses z.string().optional().transform().pipe() — z.preprocess produces unknown input type incompatible with zodResolver<z.input<Schema>>; z.string().transform().pipe() produces required string input type also incompatible; z.string().optional().transform().pipe() gives string | undefined input matching zodResolver output"
  - "Forms keep their existing z.infer<> or z.input<> generics — no form generic type changes needed after adopting optional-based transform"
  - "Error display font size raised from 11px to 13px with lineHeight 1.5 — 11px was nearly invisible on dark backgrounds"
metrics:
  duration_minutes: 14
  completed_date: "2026-03-28"
  tasks_completed: 2
  files_modified: 8
requirements: [FIX-03, FIX-04]
---

# Phase 05 Plan 05: Form Submission Bug Fixes Summary

**One-liner:** Empty-string-safe optional URL validation via `z.string().optional().transform().pipe()` and 422 fieldError parsing with 13px visible error messages across all 6 form components.

## What Was Built

Fixed two related form submission failures:

1. **Optional URL field rejection (FIX-03):** Zod's `.url().optional()` rejects empty strings (`''`) because `optional()` only allows `undefined`, not `''`. HTML form inputs always send empty strings for blank fields. Added an `optionalUrl` helper in `src/lib/schemas.ts` that transforms `''` to `undefined` before URL validation, applied to 8 fields across 5 schemas.

2. **Invisible 422 error messages (FIX-04):** When the server returns a 422 with `{ fieldErrors: { field: ['message'] } }` or `{ error: 'message' }`, the client silently ignored the response body (`if (!res.ok) { return }`). Updated all 6 form components to parse the response body, extract the first field error or general error message, and display it as readable 13px red text.

## Tasks Completed

| Task | Description | Commit |
|------|-------------|--------|
| Task 1 | Transform empty strings in optional URL schema fields (TDD) | e11843c, 258f9df |
| Task 2 | Add 422 fieldError parsing to all form components | fa3ee42 |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] z.preprocess produces unknown input type incompatible with zodResolver**
- **Found during:** Task 1 verification (next build)
- **Issue:** `z.preprocess((val) => val === '' ? undefined : val, z.string().url().optional())` produces `z.input<>` type of `unknown`. The `zodResolver(Schema)` then returns `Resolver<{field: unknown}, any, {field?: string}>` which is incompatible with `useForm<{field: unknown}>` because the resolver's `ResolverSuccess` output type `{field?: string}` is not assignable to `{field: unknown}` as a required property. TypeScript TS2719 "Two different types with this name exist" was triggered.
- **Fix:** Changed to `z.string().optional().transform().pipe()` which gives `z.input<>` type of `string | undefined` (matching the output type), keeping `Resolver<{field?: string}, any, {field?: string}>` fully compatible.
- **Files modified:** `src/lib/schemas.ts`
- **Commit:** 258f9df

## Self-Check: PASSED

- src/lib/schemas.ts — FOUND
- src/lib/__tests__/schemas.test.ts — FOUND
- All 6 form components — FOUND
- Commits e11843c, 258f9df, fa3ee42 — all present in git log
