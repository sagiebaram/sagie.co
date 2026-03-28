# Phase 1: Stabilize - Research

**Researched:** 2026-03-28
**Domain:** Bug fixes and dead-code cleanup in a Next.js 15 / Notion / TypeScript codebase
**Confidence:** HIGH — all findings are derived directly from reading the actual source files; no assumptions from training data required

## Summary

Phase 1 is a pure stabilization pass over a codebase that already works. There are no framework upgrades, no new dependencies, and no architectural changes. Every task involves reading a specific file, finding a specific mismatch or dead artifact, and making a targeted edit.

The six requirements break into three distinct work categories. BUG-01 is a form-to-API field name mismatch: the React forms send keys like `city`, `whyCity`, `background`, and `chapterVision`, but the Zod schemas and API route handlers expect `city`, `whyLead`, and `communitySize`. Similarly, `MembershipForm` sends `building`, `whySagie`, and `referral`, while `MembershipSchema` expects `whatTheyNeed`, `whatTheyOffer`, `howTheyKnowSagie`, and the route writes `location` but the form sends `city`. BUG-02 is a missing cleanup flag in a recursive `setTimeout` polling loop in `GlobeNetwork.tsx` — the fix is a two-line ref pattern. BUG-03 is two env vars (both already identified) marked `z.string().min(1)` when they should be `.optional()`.

CLN-01 through CLN-03 are mechanical deletions: remove four MOCK_* array constants from three constants files, uninstall two packages, and delete one duplicate interface from each of two constants files — updating two import sites in the process.

**Primary recommendation:** Execute requirements in this order — BUG-03 first (unblocks local dev for anyone without those env vars), then BUG-01 (stops live data loss), then BUG-02 (stops memory leak), then CLN-01/02/03 together (pure cleanup, no runtime risk).

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| BUG-01 | Form field names in ChapterForm and MembershipForm match their Zod schemas so no submitted data is dropped | Full mismatch table documented below in Architecture Patterns |
| BUG-02 | Globe initGlobe setTimeout loop has cleanup flag and max retry limit | Exact fix pattern documented below with line references |
| BUG-03 | NOTION_DEAL_PIPELINE_DB_ID and REVALIDATE_SECRET are optional in env schema until their features are built | One-line Zod change documented below |
| CLN-01 | Remove orphaned MOCK_POSTS, MOCK_EVENTS, MOCK_RESOURCES, MOCK_PROVIDERS constants | All four arrays located and verified to have zero import consumers |
| CLN-02 | Uninstall @typeform/embed-react and dotenv unused dependencies | Both confirmed present in package.json, no source imports found |
| CLN-03 | Remove duplicate SolutionProvider and BlogPost type definitions, keep only lib versions | Duplicate interfaces located; all import sites confirmed to already use lib versions |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| zod | ^4.3.6 | Runtime schema validation | Already in use; `.optional()` modifier is the only change needed |
| next | ^16.2.1 | App Router framework | Already in use; no changes |
| react | ^19.2.4 | UI rendering | Already in use; cleanup only |
| typescript | ^6.0.2 | Type safety | Already in use; type deletions only |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| npm uninstall | built-in | Remove package + lockfile entries | CLN-02 only |

### Alternatives Considered
None. This phase makes no library choices — it removes dead ones and fixes field names.

**Installation:**
```bash
# CLN-02 only — removal, not installation
npm uninstall @typeform/embed-react dotenv
```

## Architecture Patterns

### BUG-01: Form Field Mismatch Map

The root cause is that the React form components were written with different field names than the Zod schemas. The API route handlers read from the validated Zod body, so any field the schema does not know about is silently dropped before the Notion write.

**ChapterForm.tsx sends → ChapterSchema expects**

| Form field (sent) | Schema field (expected) | Status |
|-------------------|------------------------|--------|
| `fullName` | `fullName` | OK |
| `email` | `email` | OK |
| `city` | `city` | OK |
| `whyCity` | `whyLead` | MISMATCH — data dropped |
| `background` | _(not in schema)_ | MISMATCH — data dropped |
| `chapterVision` | _(not in schema)_ | MISMATCH — data dropped |
| `linkedIn` | `linkedIn` | OK |
| _(not sent)_ | `communitySize` | schema-only optional, OK |

The ChapterForm collects `whyCity`, `background`, and `chapterVision` but the schema validates `whyLead` and `communitySize`. The API route writes `body.whyLead` to Notion — which will always be `undefined` from the current form submission.

**Fix decision:** The schema fields (`whyLead`, `communitySize`) reflect the Notion property names in the route handler. Rename the form fields to match the schema, OR add the missing fields to the schema and update the route. Given the Notion DB property is called `'Why Lead'`, renaming form fields to `whyLead` and adding `communitySize` is the correct direction. The `background` and `chapterVision` fields need to be evaluated: either map them to `whyLead` (combine) or add `background`/`chapterVision` to the schema and route.

**Most conservative fix:** Rename form state keys to `whyLead` (merging `whyCity`/`background`/`chapterVision` into one field matching the schema) OR add the missing fields to both schema and Notion write. The planner must decide — the schema currently only has `whyLead` and `communitySize` for the "why" content. The form has three separate fields. The API route only writes `whyLead`.

**Recommended resolution:** Update ChapterForm to use `whyLead` (renaming the most semantically equivalent field, `whyCity`) and either drop `background`/`chapterVision` from the form or add them to the schema + route. The simplest correct fix that preserves all user input: add `background` and `chapterVision` to `ChapterSchema` as optional strings and write them to Notion as rich_text properties (or concatenate into `whyLead`).

**MembershipForm.tsx sends → MembershipSchema expects**

| Form field (sent) | Schema field (expected) | Status |
|-------------------|------------------------|--------|
| `fullName` | `fullName` | OK |
| `email` | `email` | OK |
| `city` | `location` | MISMATCH — form sends `city`, schema expects `location` |
| `role` | `role` | OK |
| `building` | `whatTheyNeed` / `whatTheyOffer` | MISMATCH — data dropped |
| `whySagie` | `howTheyKnowSagie` | MISMATCH — data dropped |
| `linkedIn` | `linkedIn` | OK |
| `referral` | _(not in schema)_ | MISMATCH — data dropped |
| _(not sent)_ | `location` | Expected but not sent (form sends `city`) |
| _(not sent)_ | `tier` | Required enum — always fails validation or defaults |
| _(not sent)_ | `company` | Optional, OK |

The route writes `body.location` to the Notion `Location` select — but the form sends `city`. The route also writes `body.whatTheyNeed`, `body.whatTheyOffer`, and `body.howTheyKnowSagie` — none of which the current form sends. The form sends `building`, `whySagie`, and `referral` which are not in the schema and therefore stripped by `withValidation`.

Additionally, `MembershipSchema` requires `tier` (an enum) but the form never sends it — this will cause every membership submission to fail Zod validation with a missing required field error, returning 422 with no data written.

**Fix decision:** Align the form fields to the schema. Map `city` → `location`, `building` → `whatTheyNeed`, `whySagie` → `howTheyKnowSagie`, `referral` → either add to schema or drop. Add `tier` as a select input to the form, or make it optional in the schema (`.optional()` or `.default('Explorer')`).

### BUG-02: Globe setTimeout Cleanup Pattern

**Current broken code** (`src/components/GlobeNetwork.tsx` lines 114–118):
```typescript
const initGlobe = () => {
  if (!globeRef.current) {
    setTimeout(initGlobe, 100)  // no cleanup, no retry limit
    return
  }
  // ...
}
```

**Fix pattern** — add a cancellation ref and max retry counter:
```typescript
// Inside the component, add a ref:
const cancelledRef = useRef(false)

// In useEffect cleanup:
useEffect(() => {
  cancelledRef.current = false
  return () => { cancelledRef.current = true }
}, [])

// Inside initGlobe, add a retries counter via closure:
const initGlobe = (retries = 0) => {
  if (cancelledRef.current) return
  if (!globeRef.current) {
    if (retries >= 50) return  // max 5 seconds (50 × 100ms)
    setTimeout(() => initGlobe(retries + 1), 100)
    return
  }
  // ... existing control setup
}
```

The `onGlobeReady={initGlobe}` prop already exists and triggers `initGlobe` once the globe is ready — but the recursive `setTimeout` path has no guard. The fix needs to handle the case where the component unmounts before the globe is ready.

Note: the `initGlobe` function is passed as `onGlobeReady` callback. Since `onGlobeReady` fires after the globe is ready, in practice the `!globeRef.current` branch may rarely trigger. But the safety guard is still required per BUG-02.

### BUG-03: Optional Env Vars Pattern

**Current code** (`src/env/server.ts` lines 10, 14):
```typescript
NOTION_DEAL_PIPELINE_DB_ID: z.string().min(1),  // line 10 — nothing uses this
REVALIDATE_SECRET: z.string().min(1),             // line 14 — no route uses this yet
```

**Fix:**
```typescript
NOTION_DEAL_PIPELINE_DB_ID: z.string().min(1).optional(),
REVALIDATE_SECRET: z.string().min(1).optional(),
```

Any code that later reads `env.NOTION_DEAL_PIPELINE_DB_ID` must handle `string | undefined`. Since nothing reads these values today, there are no downstream changes needed.

### CLN-01: MOCK Data Deletion Map

All four MOCK arrays are confirmed to have zero import consumers:

| Constant | File | Confirmed no imports? |
|----------|------|-----------------------|
| `MOCK_POSTS` | `src/constants/blog.ts` | Yes — `BlogFilter` imports only `BLOG_CATEGORIES`/`BLOG_AUTHORS` |
| `MOCK_EVENTS` | `src/constants/events.ts` | Yes — no file imports from `@/constants/events` |
| `MOCK_RESOURCES` | `src/constants/resources.ts` | Yes — no file imports from `@/constants/resources` |
| `MOCK_PROVIDERS` | `src/constants/solutions.ts` | Yes — importers use only `SERVICE_CATEGORIES`/`FILTER_OPTIONS` |

Each constant can be deleted by removing only the array declaration. The interface definitions in the same files must be preserved for `MOCK_EVENTS` and `MOCK_RESOURCES` if they are still used by other code — verify before deleting.

Note: `src/constants/events.ts` exports `SagieEvent` interface — check whether any file imports it before deleting the entire file. The lib version (`src/lib/events.ts`) exports `SAGIEEvent` (different name). If any component imports `SagieEvent` from constants, that type must be migrated before deletion.

### CLN-02: Package Removal

Both packages are confirmed present in `package.json` dependencies and confirmed to have no remaining import in source:

```bash
npm uninstall @typeform/embed-react dotenv
```

After uninstall, verify `package.json` and `package-lock.json` no longer list either package.

### CLN-03: Duplicate Type Deletion Map

**`SolutionProvider` interface** exists in two files:
- `src/constants/solutions.ts` lines 1–10 — different shape (has `contactEmail`, `initials`, `memberTier`; no `servicesOffered`, `bio`, `featured`)
- `src/lib/solutions.ts` line 5 — correct shape matching Notion data

**All current consumers use `@/lib/solutions` version:**
- `src/app/(marketing)/solutions/page.tsx` imports from `@/lib/solutions`
- `src/components/ui/SolutionsFilter.tsx` imports from `@/lib/solutions`
- `src/constants/solutions.ts` uses its own version only for `MOCK_PROVIDERS` (being deleted in CLN-01)

Action: Delete lines 1–10 from `src/constants/solutions.ts` (the interface declaration). No import updates needed — no consumer imports `SolutionProvider` from constants.

**`BlogPost` interface** exists in two files:
- `src/constants/blog.ts` lines 1–14 — includes required `content` and `publishDate` fields
- `src/lib/blog.ts` line 8 — omits `content`, makes `publishDate` optional

**All current consumers use `@/lib/blog` version:**
- `src/app/(marketing)/blog/page.tsx` imports `BlogPost` from `@/lib/blog`
- `src/components/ui/BlogFilter.tsx` imports `BlogPost` from `@/lib/blog`
- `src/constants/blog.ts` uses its own version only for `MOCK_POSTS` (being deleted in CLN-01)

Action: Delete lines 1–14 from `src/constants/blog.ts` (the interface declaration). No import updates needed.

### Anti-Patterns to Avoid

- **Deleting entire constants files without checking all exports:** Each constants file exports multiple things (interfaces, category arrays, filter constants). Only delete the specific MOCK arrays and duplicate interface declarations — leave the UI-supporting exports intact.
- **Making REVALIDATE_SECRET optional and then accessing it without a guard:** If future code reads `env.REVALIDATE_SECRET`, TypeScript will catch the `undefined` case, but document this clearly.
- **Merging form field cleanup with behavior changes:** BUG-01 is about naming alignment only. Do not change what fields the form collects unless the scope explicitly permits it.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Making env vars optional | Custom runtime guard logic | Zod `.optional()` | Already in the schema, one-character change |
| Cancelling async callbacks on unmount | Boolean global or window listener | `useRef` cleanup flag | Standard React pattern, no extra dependency |
| Detecting dead imports before deleting | Manual search | `grep` / IDE search | Faster and exhaustive |

## Common Pitfalls

### Pitfall 1: Partial BUG-01 Fix
**What goes wrong:** Developer renames `city` to `location` in MembershipForm but misses `building`/`whySagie`/`referral` mismatches. Form appears to work (no 422) but critical fields are still dropped.
**Why it happens:** There are five separate field mismatches in MembershipForm alone.
**How to avoid:** Use the mismatch table above as a checklist. After the fix, add a manual submission test and inspect what actually lands in Notion.
**Warning signs:** Notion entries have `Location` = "International" (the default fallback) but the user typed a US city; `What They Need` is blank.

### Pitfall 2: `tier` Missing from MembershipForm
**What goes wrong:** After fixing field names, submissions still fail with a 422 because `MembershipSchema` requires `tier: z.enum([...])` but the form never sends it.
**Why it happens:** `tier` was added to the schema but never surfaced as a form input.
**How to avoid:** Either add a tier select to the form UI, or change the schema to `.optional().default('Explorer')`. Check product intent — if tier selection is intentional, add the UI; if it should auto-assign, use the default.
**Warning signs:** Console shows `422 Validation failed` with `fieldErrors: { tier: ['Invalid enum value'] }`.

### Pitfall 3: Deleting SagieEvent Interface
**What goes wrong:** Developer deletes all of `src/constants/events.ts` (including the `SagieEvent` interface) assuming it is dead code, breaking any component that imports it.
**Why it happens:** The MOCK_EVENTS array is dead but the interface may still be referenced.
**How to avoid:** Grep for `SagieEvent` across `src/` before deleting. The lib version uses `SAGIEEvent` (different casing) — they are not interchangeable.
**Warning signs:** TypeScript build error `Module '@/constants/events' has no exported member 'SagieEvent'`.

### Pitfall 4: npm uninstall does not update package-lock.json
**What goes wrong:** Running `npm uninstall` in an environment where node_modules doesn't fully exist may not cleanly update the lockfile.
**Why it happens:** Rarely, but possible in CI-only environments.
**How to avoid:** Always run `npm install` after `npm uninstall` and verify the lockfile diff.

### Pitfall 5: Globe cancelledRef not initialized before onGlobeReady fires
**What goes wrong:** If the Globe component fires `onGlobeReady` synchronously before the cleanup effect runs, `cancelledRef.current` may be in an unexpected state.
**Why it happens:** React effects run after paint; `onGlobeReady` may fire at any time.
**How to avoid:** Initialize `cancelledRef` to `false` at declaration (the default for `useRef(false)`) — this is always correct regardless of effect order.

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

### Globe Cleanup Ref Pattern (BUG-02)
```typescript
// Add ref at component top level
const cancelledRef = useRef(false)

// Reset in effect
useEffect(() => {
  cancelledRef.current = false
  return () => {
    cancelledRef.current = true
  }
}, [])

// Guard inside initGlobe
const initGlobe = (retries = 0) => {
  if (cancelledRef.current) return
  if (!globeRef.current) {
    if (retries >= 50) return
    setTimeout(() => initGlobe(retries + 1), 100)
    return
  }
  // ... rest of existing init code unchanged
}
```

### Form Field Rename (BUG-01 pattern)
```typescript
// MembershipForm — before
const [fields, setFields] = useState({
  fullName: '', email: '', city: '', role: '',
  building: '', whySagie: '', linkedIn: '', referral: '',
})

// after — aligned to MembershipSchema
const [fields, setFields] = useState({
  fullName: '', email: '', location: '', role: '',
  whatTheyNeed: '', howTheyKnowSagie: '', linkedIn: '',
  tier: 'Explorer' as const,
})
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright (installed, `@playwright/test ^1.58.2`) |
| Config file | `playwright.config.ts` (exists) |
| Quick run command | `npx playwright test tests/smoke.spec.ts` |
| Full suite command | `npx playwright test` |

Note: Vitest is not yet installed (that is Phase 4 — TEST-01). Phase 1 has no unit test infrastructure. Validation for Phase 1 is manual verification + the existing smoke test.

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BUG-01 | Chapter form submits and Notion entry has whyLead populated | manual | — (no form submission e2e yet) | ❌ Wave 0 |
| BUG-01 | Membership form submits and Notion entry has location/whatTheyNeed populated | manual | — | ❌ Wave 0 |
| BUG-02 | Globe component unmounts without runaway setTimeout | manual/visual | — | ❌ Wave 0 |
| BUG-03 | App starts without NOTION_DEAL_PIPELINE_DB_ID set | smoke | `npx playwright test tests/smoke.spec.ts` | ✅ |
| CLN-01 | No MOCK_* constants remain | build verification | `npx tsc --noEmit` | ✅ (tsconfig exists) |
| CLN-02 | @typeform/embed-react absent from package.json | shell check | `node -e "const p=require('./package.json'); if(p.dependencies['@typeform/embed-react']) process.exit(1)"` | ✅ |
| CLN-03 | No duplicate SolutionProvider/BlogPost interfaces | build verification | `npx tsc --noEmit` | ✅ |

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit` (catches import errors from type deletions)
- **Per wave merge:** `npx playwright test tests/smoke.spec.ts` (smoke: homepage loads)
- **Phase gate:** TypeScript build passes + manual form submission verified before `/gsd:verify-work`

### Wave 0 Gaps
- No new test files required for Phase 1 — existing `smoke.spec.ts` covers BUG-03 (app starts), TypeScript build covers CLN-01/CLN-03, and form submission verification is manual given no Vitest/e2e form test exists yet (Phase 4 scope).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `setTimeout` polling loops without cleanup | `useRef` cleanup flag + max retries | Standard React pattern since hooks (2018) | Prevents memory leaks on unmount |
| Required env vars that crash on missing | Zod `.optional()` for future-use vars | Ongoing best practice | Dev experience, no deploy friction |
| Mock data constants alongside live fetchers | Delete mocks when live data is wired | Routine cleanup | Reduces accidental mock usage |

**Deprecated/outdated:**
- `@typeform/embed-react`: The `TypeformEmbed.tsx` component that used it was deleted; the dependency was never cleaned up.
- `dotenv`: Next.js 15 loads `.env` files natively via its own built-in mechanism. Explicitly importing dotenv is unnecessary and was likely added before the project switched to Next.js.

## Open Questions

1. **ChapterForm: should `background` and `chapterVision` be preserved or merged?**
   - What we know: The form collects three "why" fields (`whyCity`, `background`, `chapterVision`) but the schema has only `whyLead` and `communitySize`.
   - What's unclear: Whether the product intent is to collect one combined answer or three separate ones.
   - Recommendation: Merge into `whyLead` for now (concatenate with labels), or drop `background`/`chapterVision` and rename `whyCity` to `whyLead`. The simplest approach that preserves intent: add `background` and `chapterVision` as optional schema fields and write them to Notion as separate properties.

2. **MembershipForm: should `tier` be a user-facing select or a server default?**
   - What we know: `MembershipSchema` requires `tier: z.enum(['Explorer', 'Builder', 'Shaper'])` but the current form UI has no tier select.
   - What's unclear: Whether users should choose their tier during application.
   - Recommendation: Make tier optional in the schema with `.default('Explorer')` — the admin can adjust tier in Notion after review. This matches the manual review flow described in the architecture.

3. **`SagieEvent` interface in `src/constants/events.ts`**
   - What we know: `MOCK_EVENTS` uses it; no other file currently imports from `@/constants/events`.
   - What's unclear: Whether the events page or any component previously used this interface.
   - Recommendation: Grep for `SagieEvent` before deletion. If unused, delete the whole file after removing `MOCK_EVENTS`. If used, keep the interface and only delete the array.

## Sources

### Primary (HIGH confidence)
- Direct file reads: `src/components/forms/ChapterForm.tsx`, `MembershipForm.tsx` — actual field names sent
- Direct file reads: `src/lib/schemas.ts` — actual schema field names
- Direct file reads: `src/app/api/applications/chapter/route.ts`, `membership/route.ts` — actual Notion property mappings
- Direct file reads: `src/components/GlobeNetwork.tsx` — actual setTimeout pattern
- Direct file reads: `src/env/server.ts` — actual required env vars
- Direct file reads: `src/constants/blog.ts`, `events.ts`, `resources.ts`, `solutions.ts` — actual MOCK arrays
- Direct file reads: `package.json` — actual dependency list
- Grep searches: confirmed zero import consumers for all MOCK constants and both dead packages

### Secondary (MEDIUM confidence)
- None needed — all findings derived from source code

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- BUG-01 field mismatch analysis: HIGH — read both form and schema files; every mismatch is documented from actual source
- BUG-02 glob fix pattern: HIGH — read the actual component; standard React cleanup pattern
- BUG-03 Zod optional fix: HIGH — read env file; standard Zod API
- CLN-01 dead constant verification: HIGH — grep confirmed zero consumers
- CLN-02 dead package verification: HIGH — package.json read directly; TypeformEmbed.tsx confirmed deleted in git status
- CLN-03 duplicate type scope: HIGH — grep confirmed all consumers use lib versions

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable codebase, no fast-moving dependencies)
