# Phase 1: Stabilize - Research

**Researched:** 2026-03-28 (re-verified from source files)
**Domain:** Bug fixes and dead-code cleanup in a Next.js 15 / Notion / TypeScript codebase
**Confidence:** HIGH — all findings derived directly from reading actual source files; no assumptions from training data

## Summary

Phase 1 is a pure stabilization pass over a codebase that already works. There are no framework upgrades, no new dependencies, and no architectural changes. Every task involves reading a specific file, finding a specific mismatch or dead artifact, and making a targeted edit.

The six requirements break into three distinct work categories. BUG-01 is a form-to-API field name mismatch that is more severe than "data loss" — the MembershipForm submission fails completely with a 422 because `tier` is required in the schema but never sent by the form. Additionally both forms send field names the schema does not recognize, so valid user data is silently stripped. BUG-02 is a missing cleanup flag in a recursive `setTimeout` polling loop in `GlobeNetwork.tsx`. BUG-03 is two env vars marked `z.string().min(1)` when they serve features not yet built and should be `.optional()`.

CLN-01 through CLN-03 are mechanical deletions: four MOCK_* array constants (all confirmed to have zero import consumers), two unused npm packages, and one duplicate interface from each of two constants files. The duplicate interfaces in the constants files are only used by the MOCK arrays being deleted — once CLN-01 deletes the arrays, CLN-03 removes the now-orphaned interfaces.

**Primary recommendation:** Execute BUG-03 first (unblocks local dev), then BUG-01 (stops live submission failure and data loss), then BUG-02 (stops memory leak), then CLN-01/02/03 together as a single cleanup commit.

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
| --- | --- | --- |
| BUG-01 | Form field names in ChapterForm and MembershipForm match their Zod schemas so no submitted data is dropped | Full mismatch table in Architecture Patterns; MembershipForm additionally causes 422 failures due to missing required `tier` field |
| BUG-02 | Globe initGlobe setTimeout loop has cleanup flag and max retry limit | Exact fix pattern documented with line references; `cancelledRef` + retry counter pattern |
| BUG-03 | NOTION_DEAL_PIPELINE_DB_ID and REVALIDATE_SECRET are optional in env schema until their features are built | One-line Zod change per field in `src/env/server.ts` |
| CLN-01 | Remove orphaned MOCK_POSTS, MOCK_EVENTS, MOCK_RESOURCES, MOCK_PROVIDERS constants | All four arrays confirmed to have zero external import consumers |
| CLN-02 | Uninstall @typeform/embed-react and dotenv unused dependencies | Both confirmed in package.json; no source imports of either found |
| CLN-03 | Remove duplicate SolutionProvider and BlogPost type definitions, keep only lib versions | Both duplicate interfaces only used by MOCK arrays (deleted in CLN-01); all real consumers import from lib |

</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
| --- | --- | --- | --- |
| zod | ^4.3.6 | Runtime schema validation | Already in use; `.optional()` modifier is the only change needed |
| next | ^16.2.1 | App Router framework | Already in use; no changes |
| react | ^19.2.4 | UI rendering | Already in use; cleanup only |
| typescript | ^6.0.2 | Type safety | Already in use; type deletions only |

### Supporting

| Library | Version | Purpose | When to Use |
| --- | --- | --- | --- |
| npm (built-in) | — | Remove package + lockfile entries | CLN-02 only |

### Alternatives Considered

None. This phase makes no library choices — it removes dead ones and fixes field names.

**Commands:**

```bash
# CLN-02 only — removal, not installation
npm uninstall @typeform/embed-react dotenv
```

## Architecture Patterns

### BUG-01: Complete Field Mismatch Map

The root cause is that React form components were written with different field names than the Zod schemas. `withValidation` in `src/lib/validation.ts` calls `schema.safeParse(raw)` — any field the schema does not declare is stripped from `result.data` before it reaches the handler. Fields absent from the raw body that are required by the schema cause a 422 response, returning nothing to Notion.

#### ChapterForm.tsx sends vs ChapterSchema expects

| Form field (sent) | Schema field (expected) | Status |
| --- | --- | --- |
| `fullName` | `fullName` | OK |
| `email` | `email` | OK |
| `city` | `city` | OK |
| `whyCity` | `whyLead` (min:10, max:2000) | MISMATCH — `whyLead` receives `undefined`; route writes empty string to Notion |
| `background` | _(not in schema)_ | DROPPED — Zod strips unknown keys |
| `chapterVision` | _(not in schema)_ | DROPPED — Zod strips unknown keys |
| `linkedIn` | `linkedIn` (optional) | OK |
| _(not sent)_ | `communitySize` (optional) | Missing but optional — OK |

**Chapter route writes:** `body.whyLead` (undefined from current form) → Notion `'Why Lead'` property is always empty. `body.city` maps only into a `Notes` concatenation string, not a dedicated Notion property. `background` and `chapterVision` user text is lost entirely.

ChapterForm fix strategy:

- Rename form state key `whyCity` → `whyLead` (aligns with schema and Notion property)
- Either add `background` and `chapterVision` to the schema + route handler (preferred — preserves user data), or remove those fields from the form UI
- Recommended: add both as optional fields to `ChapterSchema` and write them to Notion as separate `rich_text` properties

#### MembershipForm.tsx sends vs MembershipSchema expects

| Form field (sent) | Schema field (expected) | Status |
| --- | --- | --- |
| `fullName` | `fullName` | OK |
| `email` | `email` | OK |
| `city` | `location` (min:1) | MISMATCH — `location` is missing → **422 failure** |
| `role` | `role` | OK (but schema has no `role` field — see below) |
| `building` | `whatTheyNeed` (optional) | DROPPED — field not in schema |
| `whySagie` | `howTheyKnowSagie` (optional) | DROPPED |
| `linkedIn` | `linkedIn` (optional) | OK |
| `referral` | _(not in schema)_ | DROPPED |
| _(not sent)_ | `location` (min:1, required) | MISSING REQUIRED FIELD → 422 |
| _(not sent)_ | `tier` (required enum) | MISSING REQUIRED FIELD → 422 |
| _(not sent)_ | `company` (optional) | OK |
| _(not sent)_ | `category` (optional array) | OK |

**Critical:** `MembershipSchema` has two required fields with no defaults — `location` and `tier`. The current form sends neither. Every membership submission returns 422 with `fieldErrors: { location: [...], tier: [...] }`. Zero submissions are reaching Notion.

Note: The schema also has `role` listed but `MembershipSchema` as written does not actually have a `role` field (it was removed when `category` was added). The route uses `body.role` in a ROLE_MAP lookup — this still works if `role` is added back as optional.

MembershipForm fix strategy:

- Rename form state key `city` → `location` (fixes required field)
- Make `tier` optional in the schema with `.default('Explorer')` OR add a tier select UI (recommend default — admin assigns tier during review per the architecture)
- Rename `building` → `whatTheyNeed`
- Rename `whySagie` → `howTheyKnowSagie`
- Either add `referral` to schema as optional OR drop it from the form

### BUG-02: Globe setTimeout Cleanup Pattern

Current broken code (`src/components/GlobeNetwork.tsx` lines 114–118):

```typescript
const initGlobe = () => {
  if (!globeRef.current) {
    setTimeout(initGlobe, 100)  // no cleanup, no retry limit
    return
  }
  // ... rest of init
}
```

The `initGlobe` function is passed as `onGlobeReady` prop to the Globe component (line 183: `onGlobeReady={initGlobe}`). In normal operation `onGlobeReady` fires after the globe is ready so `globeRef.current` should already be set — but the recursive path has no guard against the component unmounting before the globe initializes.

Fix pattern — cancellation ref + max retry counter:

```typescript
// Add at component top level (alongside existing refs)
const cancelledRef = useRef(false)

// Add a cleanup-only useEffect
useEffect(() => {
  cancelledRef.current = false
  return () => {
    cancelledRef.current = true
  }
}, [])

// Replace initGlobe definition
const initGlobe = (retries = 0) => {
  if (cancelledRef.current) return
  if (!globeRef.current) {
    if (retries >= 50) return  // max 5 seconds (50 x 100ms)
    setTimeout(() => initGlobe(retries + 1), 100)
    return
  }
  // ... existing control/camera setup code unchanged
}
```

`cancelledRef` defaults to `false` at declaration, which is correct regardless of effect execution order.

### BUG-03: Optional Env Vars

Current code (`src/env/server.ts` lines 10, 14):

```typescript
NOTION_DEAL_PIPELINE_DB_ID: z.string().min(1),  // nothing reads this
REVALIDATE_SECRET: z.string().min(1),            // no route exists yet
```

Fix:

```typescript
NOTION_DEAL_PIPELINE_DB_ID: z.string().min(1).optional(),
REVALIDATE_SECRET: z.string().min(1).optional(),
```

No downstream changes needed — confirmed by grep that nothing reads either value from `env`.

### CLN-01: MOCK Data Deletion Map

All four MOCK arrays confirmed to have zero external import consumers:

| Constant | File | External imports? | Safe to delete? |
| --- | --- | --- | --- |
| `MOCK_POSTS` | `src/constants/blog.ts` | None — `BlogFilter` imports only `BLOG_CATEGORIES`/`BLOG_AUTHORS` | Yes — delete array only |
| `MOCK_EVENTS` | `src/constants/events.ts` | None — zero files import from `@/constants/events` | Yes — delete entire file |
| `MOCK_RESOURCES` | `src/constants/resources.ts` | None — zero files import from `@/constants/resources` | Yes — delete entire file |
| `MOCK_PROVIDERS` | `src/constants/solutions.ts` | None — importers use only `SERVICE_CATEGORIES`/`FILTER_OPTIONS` | Yes — delete array only |

For `src/constants/events.ts`: `SagieEvent` interface is only referenced within the same file (`MOCK_EVENTS: SagieEvent[]`). Confirmed zero external imports via grep. The entire file can be deleted.

For `src/constants/resources.ts`: Same situation — `Resource` interface only used by `MOCK_RESOURCES` within the file. Zero external imports. Entire file can be deleted.

For `src/constants/blog.ts`: Keep the file — `BLOG_CATEGORIES` and `BLOG_AUTHORS` are imported by `src/components/ui/BlogFilter.tsx`. Delete only: (a) the `BlogPost` interface declaration (CLN-03), and (b) the `MOCK_POSTS` array.

For `src/constants/solutions.ts`: Keep the file — `SERVICE_CATEGORIES`, `FILTER_OPTIONS`, and `SolutionCategory` type are imported by `solutions/page.tsx` and `SolutionsFilter.tsx`. Delete only: (a) the `SolutionProvider` interface declaration (CLN-03), and (b) the `MOCK_PROVIDERS` array.

### CLN-02: Package Removal

Both packages confirmed present in `package.json` dependencies and confirmed to have no remaining source imports:

```bash
npm uninstall @typeform/embed-react dotenv
```

- `@typeform/embed-react ^5.0.0` — `TypeformEmbed.tsx` was deleted (confirmed in git status `D src/components/ui/TypeformEmbed.tsx`). No other file imports it.
- `dotenv ^17.3.1` — Next.js 15 loads `.env` files natively. No source file imports dotenv.

After uninstall, verify both are absent from `package.json` dependencies and `package-lock.json`.

### CLN-03: Duplicate Type Deletion Map

`SolutionProvider` interface — two declarations:

- `src/constants/solutions.ts` lines 1–10: shape includes `contactEmail`, `initials`, `memberTier`; no `servicesOffered`, `featured`
- `src/lib/solutions.ts` lines 5–15: correct shape matching Notion data; includes `servicesOffered`, `featured`

All consumers (`solutions/page.tsx`, `SolutionsFilter.tsx`) import from `@/lib/solutions`. The constants version is only used by `MOCK_PROVIDERS` (deleted in CLN-01). After CLN-01 deletes `MOCK_PROVIDERS`, the interface in constants has zero referencing code. Delete lines 1–10 from `src/constants/solutions.ts`.

`BlogPost` interface — two declarations:

- `src/constants/blog.ts` lines 1–14: includes required `content` and `publishDate: string`
- `src/lib/blog.ts` lines 8–20: omits `content`, `publishDate` is `string | null`

All consumers (`blog/page.tsx`, `BlogFilter.tsx`) import from `@/lib/blog`. The constants version is only used by `MOCK_POSTS` (deleted in CLN-01). Delete lines 1–14 from `src/constants/blog.ts`.

No import path updates needed for either — all real consumers already use the lib versions.

### Anti-Patterns to Avoid

- **Deleting entire constants files without checking all exports:** `blog.ts` and `solutions.ts` export UI-support constants that are still in use. Only delete the specific MOCK arrays and duplicate interface declarations — leave `BLOG_CATEGORIES`, `BLOG_AUTHORS`, `SERVICE_CATEGORIES`, `FILTER_OPTIONS`, `SolutionCategory` type intact.
- **Fixing BUG-01 partially:** There are five separate mismatches in MembershipForm and three in ChapterForm. Using the mismatch table as a checklist is required — partial fixes leave hidden failures.
- **Adding `tier` as a user-visible select without product review:** Making tier optional with `.default('Explorer')` is the safe choice; it matches the manual review flow described in the architecture.
- **Running `npm uninstall` and not verifying the lockfile:** Always check both `package.json` and the lock file after uninstall.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
| --- | --- | --- | --- |
| Making env vars optional | Custom runtime guard logic | Zod `.optional()` | Already in the schema; one-character change |
| Cancelling async callbacks on unmount | Boolean global or `window` listener | `useRef` cleanup flag | Standard React pattern, no extra dependency |
| Detecting dead imports before deletion | Manual grep by hand | IDE search or `grep -r` | Exhaustive and takes seconds |
| Handling missing `tier` in form submission | Complex server-side default logic | Zod `.default('Explorer')` | Schema-level default; clean, typed |

## Common Pitfalls

### Pitfall 1: Partial BUG-01 Fix — Missing `tier` Causes Continued 422

**What goes wrong:** Developer renames `city` → `location` but doesn't fix `tier`. Submissions still return 422 because `tier` is required and absent.

**Why it happens:** Multiple required fields are missing from the form — easy to miss one.

**How to avoid:** Make `tier` optional with `.default('Explorer')` in `MembershipSchema`. After the fix, verify a submission succeeds (watch for 422 in browser network tab).

**Warning signs:** 422 response with `fieldErrors: { tier: ['Invalid enum value'] }` or `{ tier: ['Required'] }`.

### Pitfall 2: ChapterForm `background`/`chapterVision` Data Permanently Lost

**What goes wrong:** Developer only renames `whyCity` → `whyLead` but doesn't add `background` and `chapterVision` to the schema. Those fields continue to be stripped by Zod.

**Why it happens:** The field rename fixes the visible problem (`whyLead` being undefined) but two other fields the user fills are still dropped.

**How to avoid:** Add `background` and `chapterVision` as optional fields to `ChapterSchema` and write them to Notion in the route handler.

**Warning signs:** Chapter application in Notion has `Why Lead` populated but no `Background` or `Chapter Vision` properties.

### Pitfall 3: Hesitating to Delete the events.ts and resources.ts Constants Files

**What goes wrong:** Developer sees `SagieEvent` referenced internally and hesitates to delete the whole file, leaving `MOCK_EVENTS` behind.

**Why it happens:** Unfamiliarity with the codebase — the concern is valid but confirmed resolved.

**How to avoid:** `SagieEvent` is only referenced within `constants/events.ts` itself (confirmed by grep: zero external imports). The entire file can be safely deleted. Same for `constants/resources.ts`.

**Warning signs:** N/A — this pitfall is caution-induced inaction, not a breakage risk.

### Pitfall 4: `npm uninstall` Not Cleaning the Lockfile

**What goes wrong:** Lockfile retains the package entries; a fresh `npm ci` in CI still installs the removed packages.

**Why it happens:** Rare environment issues or interrupted installs.

**How to avoid:** After `npm uninstall`, run `npm install` to regenerate the lockfile, then verify the diff shows both packages removed.

### Pitfall 5: Globe `cancelledRef` Initialization Ordering

**What goes wrong:** Developer adds the cleanup effect but `onGlobeReady` fires before the effect runs, leaving `cancelledRef.current` at its initial value.

**Why it happens:** React effects run after paint; `onGlobeReady` may fire at any time relative to effects.

**How to avoid:** Initialize `cancelledRef` to `false` at declaration (`useRef(false)`) — this is the default value regardless of effect order, so there is no race condition.

## Code Examples

Verified patterns from actual source files:

### Zod Optional Field (BUG-03)

```typescript
// src/env/server.ts — before
NOTION_DEAL_PIPELINE_DB_ID: z.string().min(1),
REVALIDATE_SECRET: z.string().min(1),

// after
NOTION_DEAL_PIPELINE_DB_ID: z.string().min(1).optional(),
REVALIDATE_SECRET: z.string().min(1).optional(),
```

### Zod Default Value (BUG-01 — tier fix)

```typescript
// src/lib/schemas.ts — MembershipSchema before
tier: z.enum(['Explorer', 'Builder', 'Shaper']),

// after
tier: z.enum(['Explorer', 'Builder', 'Shaper']).default('Explorer'),
```

### Globe Cleanup Ref Pattern (BUG-02)

```typescript
// Add at component top level
const cancelledRef = useRef(false)

// Add cleanup effect
useEffect(() => {
  cancelledRef.current = false
  return () => {
    cancelledRef.current = true
  }
}, [])

// Replace initGlobe
const initGlobe = (retries = 0) => {
  if (cancelledRef.current) return
  if (!globeRef.current) {
    if (retries >= 50) return  // 5 second max
    setTimeout(() => initGlobe(retries + 1), 100)
    return
  }
  // ... existing controls/camera setup unchanged
}
```

### Form Field Rename (BUG-01 — MembershipForm pattern)

```typescript
// Before
const [fields, setFields] = useState({
  fullName: '', email: '', city: '', role: '',
  building: '', whySagie: '', linkedIn: '', referral: '',
})

// After — aligned to MembershipSchema
const [fields, setFields] = useState({
  fullName: '', email: '', location: '', role: '',
  whatTheyNeed: '', howTheyKnowSagie: '', linkedIn: '',
  // tier not needed as form field — schema uses .default('Explorer')
})
```

### Form Field Rename (BUG-01 — ChapterForm pattern)

```typescript
// Before
const [fields, setFields] = useState({
  fullName: '', email: '', city: '',
  whyCity: '', background: '', chapterVision: '', linkedIn: '',
})

// After — whyCity renamed, background/chapterVision added to schema
const [fields, setFields] = useState({
  fullName: '', email: '', city: '',
  whyLead: '', background: '', chapterVision: '', linkedIn: '',
})
```

## Validation Architecture

### Test Framework

| Property | Value |
| --- | --- |
| Framework | Playwright (`@playwright/test ^1.58.2`, installed) |
| Config file | `playwright.config.ts` (exists) |
| Quick run command | `npx playwright test tests/smoke.spec.ts` |
| Full suite command | `npx playwright test` |

Note: Vitest is not yet installed — that is Phase 4 (TEST-01). Phase 1 validation is TypeScript build checks + manual form submission verification + the existing Playwright smoke test.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
| --- | --- | --- | --- | --- |
| BUG-01 | Chapter form submits and Notion entry has whyLead, background, chapterVision populated | manual | — (no form e2e yet) | Wave 0 gap |
| BUG-01 | Membership form submits (no 422) and Notion entry has location, whatTheyNeed, howTheyKnowSagie | manual | — | Wave 0 gap |
| BUG-02 | Globe component unmounts without runaway setTimeout | manual/visual | — | Wave 0 gap |
| BUG-03 | App starts without NOTION_DEAL_PIPELINE_DB_ID set | smoke | `npx playwright test tests/smoke.spec.ts` | exists |
| CLN-01 | No MOCK_* constants remain | build verification | `npx tsc --noEmit` | exists |
| CLN-02 | @typeform/embed-react absent from package.json | shell check | `node -e "const p=require('./package.json'); if(p.dependencies['@typeform/embed-react']) process.exit(1)"` | exists |
| CLN-03 | No duplicate SolutionProvider/BlogPost interfaces | build verification | `npx tsc --noEmit` | exists |

### Sampling Rate

- **Per task commit:** `npx tsc --noEmit` — catches import errors from type deletions and form field renames
- **Per wave merge:** `npx playwright test tests/smoke.spec.ts` — smoke: homepage loads without crash
- **Phase gate:** TypeScript build passes + manual form submission verified before `/gsd:verify-work`

### Wave 0 Gaps

None — no new test files are required for Phase 1. Existing `smoke.spec.ts` covers BUG-03 (app starts), TypeScript build covers CLN-01/CLN-03, form submission verification is manual (E2E form tests are Phase 4 scope).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
| --- | --- | --- | --- |
| `setTimeout` polling loops without cleanup | `useRef` cleanup flag + max retries | Standard React pattern since hooks (2018) | Prevents memory leaks on unmount |
| Required env vars that crash on missing | Zod `.optional()` for future-use vars | Ongoing best practice | Dev experience, no deploy friction |
| Mock data constants alongside live fetchers | Delete mocks once live data is wired | Routine cleanup | Prevents accidental mock usage |
| Zod required enum without form input | `.default('Explorer')` for auto-assigned values | Always correct | Prevents 422 on fields not shown in UI |

Deprecated/outdated:

- `@typeform/embed-react`: The `TypeformEmbed.tsx` consumer was deleted; the package was never cleaned up.
- `dotenv`: Next.js 15 loads `.env` files natively. This was likely added before the project switched to Next.js.

## Open Questions

1. **ChapterForm: should `background` and `chapterVision` be preserved as separate fields or merged into `whyLead`?**
   - What we know: The form currently shows three "why" fields; the schema has only `whyLead` (min:10). The route only writes `whyLead`.
   - Recommendation: Add `background` (optional, max:2000) and `chapterVision` (optional, max:2000) to `ChapterSchema` and write them to Notion. This preserves all user-entered data without changing the UI.

2. **MembershipForm: drop `referral` field or add to schema?**
   - What we know: The form collects `referral` ("How did you hear about us?"), the schema doesn't have it, and the route doesn't write it to Notion.
   - Recommendation: Add `referral` as an optional field to `MembershipSchema` and write it to Notion. It is low-value data to lose silently.

## Sources

### Primary (HIGH confidence)

- Direct file reads — `src/components/forms/ChapterForm.tsx`: actual form field names sent
- Direct file reads — `src/components/forms/MembershipForm.tsx`: actual form field names sent
- Direct file reads — `src/lib/schemas.ts`: actual Zod schema field names and constraints
- Direct file reads — `src/app/api/applications/chapter/route.ts`: actual Notion property mappings
- Direct file reads — `src/app/api/applications/membership/route.ts`: actual Notion property mappings
- Direct file reads — `src/lib/validation.ts`: confirmed `schema.safeParse(raw)` strips unknown fields; missing required fields return 422
- Direct file reads — `src/components/GlobeNetwork.tsx`: actual setTimeout pattern (lines 114–118)
- Direct file reads — `src/env/server.ts`: actual required env var declarations
- Direct file reads — `src/constants/blog.ts`, `events.ts`, `resources.ts`, `solutions.ts`: actual MOCK arrays
- Direct file reads — `package.json`: actual dependency list
- Grep searches — confirmed zero external import consumers for all MOCK constants
- Grep searches — confirmed `SagieEvent` only referenced within `constants/events.ts`
- Grep searches — confirmed all `SolutionProvider`/`BlogPost` consumers import from lib versions

### Secondary (MEDIUM confidence)

None needed — all findings derived from source code.

### Tertiary (LOW confidence)

None.

## Metadata

Confidence breakdown:

- BUG-01 field mismatch analysis: HIGH — read both form files and schema file; every mismatch verified from actual source; `tier` missing issue confirmed by reading `withValidation` flow
- BUG-02 glob fix pattern: HIGH — read the actual component; standard React cleanup pattern
- BUG-03 Zod optional fix: HIGH — read env file; standard Zod API
- CLN-01 dead constant verification: HIGH — grep confirmed zero external consumers; `SagieEvent` interface scope confirmed
- CLN-02 dead package verification: HIGH — `package.json` read directly; `TypeformEmbed.tsx` deletion confirmed in git status
- CLN-03 duplicate type scope: HIGH — grep confirmed all consumers use lib versions; constants versions only used by MOCK arrays being deleted

**Research date:** 2026-03-28

**Valid until:** 2026-04-28 (stable codebase, no fast-moving dependencies in scope)
