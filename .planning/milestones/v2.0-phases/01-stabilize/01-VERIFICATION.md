---
phase: 01-stabilize
verified: 2026-03-28T00:00:00Z
status: gaps_found
score: 8/9 must-haves verified
re_verification: false
gaps:
  - truth: "MembershipForm submission returns 200, not 422"
    status: partial
    reason: "The original city/building/whySagie mismatch is fixed (BUG-01 core fix), but a new schema/form gap exists: `role` is required in MembershipSchema (min(1)) yet the form's validate() function does not check it and the select field renders with an empty-string default ('Select...'). A user who skips the role dropdown will receive a 422 from the API."
    artifacts:
      - path: "src/components/forms/MembershipForm.tsx"
        issue: "validate() checks fullName, email, location, whatTheyNeed, howTheyKnowSagie — but NOT role. Initial state has role: '' which fails schema min(1)."
      - path: "src/lib/schemas.ts"
        issue: "role: z.string().min(1).max(100).trim() — required, no default. Form can submit empty string."
    missing:
      - "Add role validation to MembershipForm.validate(): if (!fields.role) e.role = 'Required'"
      - "Add required prop to the role FormField, OR add role: z.string().max(100).trim().optional() to MembershipSchema if role is not actually required"
---

# Phase 1: Stabilize Verification Report

**Phase Goal:** The site runs cleanly — no silent data loss on forms, no startup crashes, no dead code confusing future work
**Verified:** 2026-03-28
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | MembershipForm submission returns 200, not 422 | PARTIAL | Original city/building/whySagie->schema mismatch fixed. New gap: `role` is required in MembershipSchema (min(1)) but form validate() does not check it and initial state is role: ''. Empty-role submit will 422. |
| 2 | All MembershipForm fields (location, whatTheyNeed, howTheyKnowSagie, referral) reach Notion | VERIFIED | MembershipForm state keys match schema exactly. Membership route (line 45–51) writes howTheyKnowSagie, whatTheyNeed, referral conditionally. location is written via mapLocation(body.location). |
| 3 | All ChapterForm fields (whyLead, background, chapterVision) reach Notion | VERIFIED | ChapterForm state: whyLead, background, chapterVision all present. Chapter route (lines 18–20) writes Background and Chapter Vision to Notion. |
| 4 | App starts without NOTION_DEAL_PIPELINE_DB_ID or REVALIDATE_SECRET set | VERIFIED | src/env/server.ts lines 10 and 14 both use .optional(). |
| 5 | Globe component unmounts without a runaway setTimeout loop | VERIFIED | cancelledRef declared at line 49, cleanup useEffect at lines 115–120 sets cancelledRef.current = true on unmount. initGlobe (line 122) guards with cancelledRef.current check and retries >= 50 cap. |
| 6 | No MOCK_POSTS, MOCK_EVENTS, MOCK_RESOURCES, or MOCK_PROVIDERS constants exist in codebase | VERIFIED | Grep across src/ returns zero matches. constants/events.ts and constants/resources.ts deleted. blog.ts and solutions.ts contain only legitimate exports. |
| 7 | @typeform/embed-react and dotenv are absent from package.json | VERIFIED | package.json dependencies and devDependencies contain neither package. |
| 8 | No duplicate SolutionProvider or BlogPost interfaces exist in constants files | VERIFIED | constants/blog.ts contains only BLOG_CATEGORIES and BLOG_AUTHORS. constants/solutions.ts contains only SolutionCategory type, SERVICE_CATEGORIES, FILTER_OPTIONS. No SolutionProvider or BlogPost in either. |
| 9 | constants/blog.ts BLOG_CATEGORIES and BLOG_AUTHORS still consumed by consumers | VERIFIED | BlogFilter.tsx imports from constants/blog.ts (grep confirmed). |

**Score:** 8/9 truths verified (1 partial — role validation gap)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/lib/schemas.ts` | Aligned Zod schemas; tier defaults to Explorer | VERIFIED | Line 9: `tier: z.enum(['Explorer', 'Builder', 'Shaper']).default('Explorer')`. referral, background, chapterVision all present. |
| `src/components/forms/MembershipForm.tsx` | Field names matching MembershipSchema | VERIFIED (with gap) | location, whatTheyNeed, howTheyKnowSagie, referral all present in state and JSX. role present but validate() does not enforce it despite schema requiring min(1). |
| `src/components/forms/ChapterForm.tsx` | Field names matching ChapterSchema | VERIFIED | whyLead, background, chapterVision all present in state, validate(), and JSX. |
| `src/app/api/applications/chapter/route.ts` | Notion writes for background and chapterVision | VERIFIED | Lines 19–20 write Background and Chapter Vision conditionally. |
| `src/env/server.ts` | Optional env vars for unbuilt features | VERIFIED | NOTION_DEAL_PIPELINE_DB_ID (line 10) and REVALIDATE_SECRET (line 14) both `.optional()`. |
| `src/components/GlobeNetwork.tsx` | Globe with cancelledRef cleanup and retry limit | VERIFIED | cancelledRef at line 49; cleanup useEffect lines 115–120; initGlobe guard at line 123; retry cap at line 125. |
| `src/constants/blog.ts` | Blog constants without MOCK_POSTS or BlogPost interface | VERIFIED | File contains only 2 lines: BLOG_CATEGORIES and BLOG_AUTHORS exports. |
| `src/constants/solutions.ts` | Solutions constants without MOCK_PROVIDERS or SolutionProvider interface | VERIFIED | File contains SolutionCategory type, SERVICE_CATEGORIES, FILTER_OPTIONS — nothing else. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| MembershipForm.tsx | schemas.ts MembershipSchema | state keys match schema field names | WIRED (partial) | location, whatTheyNeed, howTheyKnowSagie, referral all match. role mismatch: schema requires min(1), form does not validate or default it. |
| ChapterForm.tsx | schemas.ts ChapterSchema | state keys match schema field names | WIRED | whyLead, background, chapterVision all match. city matches ChapterSchema.city. |
| chapter/route.ts | schemas.ts ChapterSchema | withValidation(ChapterSchema, ...) | WIRED | Line 8 wraps handler in withValidation(ChapterSchema). body.background and body.chapterVision written at lines 19–20. |
| membership/route.ts | schemas.ts MembershipSchema | withValidation(MembershipSchema, ...) | WIRED | Line 28 wraps handler in withValidation(MembershipSchema). All declared body fields are written. |
| GlobeNetwork.tsx | cancelledRef | useRef cleanup in useEffect return | WIRED | cancelledRef.current = true in cleanup (line 118). initGlobe checks cancelledRef.current at line 123. |
| constants/blog.ts | components/ui/BlogFilter.tsx | BLOG_CATEGORIES and BLOG_AUTHORS exports still consumed | WIRED | BlogFilter.tsx imports BLOG_CATEGORIES and BLOG_AUTHORS — confirmed by grep. |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| BUG-01 | 01-01-PLAN.md | Form field names in ChapterForm and MembershipForm match Zod schemas | PARTIAL | ChapterForm: fully fixed. MembershipForm: city/building/whySagie renamed correctly, but `role` is required in schema and not validated in form — partial data-loss risk remains. |
| BUG-02 | 01-02-PLAN.md | Globe initGlobe setTimeout loop has cleanup flag and max retry limit | SATISFIED | cancelledRef pattern implemented. 50-retry cap at line 125. Cleanup useEffect at lines 115–120. |
| BUG-03 | 01-01-PLAN.md | NOTION_DEAL_PIPELINE_DB_ID and REVALIDATE_SECRET are optional in env schema | SATISFIED | Both marked .optional() in src/env/server.ts. |
| CLN-01 | 01-02-PLAN.md | Remove orphaned MOCK_POSTS, MOCK_EVENTS, MOCK_RESOURCES, MOCK_PROVIDERS constants | SATISFIED | Zero MOCK_* matches in src/. events.ts and resources.ts deleted. |
| CLN-02 | 01-02-PLAN.md | Uninstall @typeform/embed-react and dotenv unused dependencies | SATISFIED | Neither appears in package.json dependencies or devDependencies. |
| CLN-03 | 01-02-PLAN.md | Remove duplicate SolutionProvider and BlogPost type definitions | SATISFIED | Neither interface exists in constants/blog.ts or constants/solutions.ts. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/components/forms/MembershipForm.tsx` | 12, 27-34 | `role` initialized as empty string; not checked in validate(); schema requires min(1) | Blocker | User who skips role select will receive 422 from API — silent failure identical to the bugs this phase fixed |

### Human Verification Required

#### 1. MembershipForm Role Field Behavior

**Test:** Load /apply/membership. Without selecting a role ("I am a..."), fill all other required fields and submit.
**Expected:** Should either (a) reject client-side with a "Required" error on role, or (b) succeed if role is optional by product intent.
**Why human:** The schema declares role as required (min(1)), but the product intent is ambiguous — the select field has no `required` attribute and no validation. Need a human to confirm whether role is meant to be mandatory or optional before deciding whether to fix the schema or the form validate().

### Gaps Summary

Phase 01 closed all six targeted requirements (BUG-01, BUG-02, BUG-03, CLN-01, CLN-02, CLN-03) in their primary scope. The cleanup work (CLN-01 through CLN-03) is complete and clean. The env var fix (BUG-03) is complete. The Globe memory leak fix (BUG-02) is fully implemented with cancelledRef and a 50-retry cap.

One residual gap was found in BUG-01 scope: the `role` field in MembershipForm is required in MembershipSchema (`z.string().min(1)`) but the form's `validate()` function does not check it, and the select field renders with `value=""` (the "Select..." placeholder). A user who submits without choosing a role will get a 422 from the API — the same class of failure BUG-01 was meant to eliminate.

This gap was not introduced by the fix; it is a pre-existing schema/form inconsistency that survived because the plan's mismatch analysis focused on renamed fields (city/building/whySagie), not on fields that were always present but unvalidated client-side. The fix is small: either add `if (!fields.role) e.role = 'Required'` to `validate()`, or change the schema to make role optional.

---

_Verified: 2026-03-28_
_Verifier: Claude (gsd-verifier)_
