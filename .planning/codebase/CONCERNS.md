# Concerns

## Critical Bugs

### Form/Schema Field Mismatch
**Files:** `src/components/forms/ChapterForm.tsx` vs `src/lib/schemas.ts`
- `ChapterForm` sends fields `whyCity`, `background`, `chapterVision` but `ChapterSchema` expects `whyLead`, `communitySize`
- Result: Zod validation silently strips unknown fields — submitted data is lost before reaching Notion
- Same pattern likely affects `MembershipForm` (sends fields not in `MembershipSchema`)
- **Impact:** User-submitted application data is being dropped

## Security Concerns

### No Rate Limiting
- All 7 API routes have zero rate limiting
- Only protection is honeypot (`_trap`) + 3-second timing check — easily bypassed by targeted bots
- **Risk:** Notion API abuse, spam submissions

### CORS Not Enforced
- `allowedOrigins` set is defined in `src/env/server.ts` but never checked in any API route
- Any origin can POST to the API endpoints
- **Files:** `src/env/server.ts`, all `src/app/api/*/route.ts`

### CSP Allows Unsafe Inline
- `script-src 'self' 'unsafe-inline'` in `next.config.ts`
- Weakens XSS protection significantly
- Required by some GSAP/animation patterns but should be narrowed

## Technical Debt

### Mock Data Residue
- `src/constants/events.ts`, `resources.ts`, `solutions.ts` contain `MOCK_EVENTS`, `MOCK_RESOURCES`, `MOCK_PROVIDERS` arrays
- These were used before Notion integration and are now dead code
- Notion data fetching has replaced them but constants remain

### Dead Dependency
- `@typeform/embed-react` still in `package.json` but `TypeformEmbed.tsx` component was deleted
- Adds unnecessary bundle weight

### Untyped Notion Responses
- All 4 lib modules (`blog.ts`, `events.ts`, `resources.ts`, `solutions.ts`) use `any` cast for Notion page responses
- Deep optional chaining (`p['Title']?.title?.[0]?.plain_text ?? 'Untitled'`) with fallback defaults
- No type safety on Notion property names — typos would silently return defaults

### Unused `REVALIDATE_SECRET`
- Required in `src/env/server.ts` env schema
- No revalidation API route exists to use it — app will crash if not set despite being unused

## Performance

### No Notion Pagination
- All query functions in `src/lib/` use single `notion.databases.query()` with no pagination
- Notion returns max 100 results per query
- **Impact:** Content will silently stop appearing once any database exceeds 100 published items

### Runtime GeoJSON Fetch
- `GlobeNetwork.tsx` fetches GeoJSON from GitHub raw URL at runtime
- Should be bundled in `public/` for reliability and performance

### Markdown Conversion on Every Request
- `getPostBySlug()` calls `n2m.pageToMarkdown()` + `n2m.toMarkdownString()` on each request
- Only the post index is cached, not the markdown content
- Blog post detail pages hit Notion API on every visit (after cache expires)

## Fragile Areas

### Deep Optional Chaining in Data Mappers
- Notion property access uses 4-5 levels of optional chaining
- Any Notion schema change (renamed property) silently returns fallback values
- No validation or alerting when expected properties are missing

### Form-API Contract
- Forms use `fields` state object, APIs use Zod schemas — no shared type between them
- Divergence (as seen in ChapterForm) causes silent data loss
- Client-side validation checks different fields than server-side Zod validation

### Stateful Globe Component
- `GlobeNetwork.tsx` manages complex state: globe instance, points, arcs, labels, auto-rotation
- Multiple `useEffect` hooks with cleanup logic
- Lazy-loaded via `GlobeShell.tsx` with dynamic import

## Missing Capabilities

- No analytics (no GA, Plausible, or similar)
- No email notifications on form submissions
- No admin/moderation workflow for submissions
- No backup or recovery for Notion data
- No health check endpoint
