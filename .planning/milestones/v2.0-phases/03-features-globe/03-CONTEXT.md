# Phase 3: Features + Globe - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Editors can invalidate the cache on demand, applicants receive email confirmation, the admin team is alerted on every submission, search engines can index every page, and the globe shows real member data from Notion. Delivers FEAT-01, FEAT-02, FEAT-03, FEAT-04, GLOBE-01, GLOBE-02.

</domain>

<decisions>
## Implementation Decisions

### Email Service + Delivery
- Use **Resend** as the email provider
- From address: **hello@sagie.co** (requires verified domain in Resend)
- Admin alert destination: **hello@sagie.co** (single address)
- Fire-and-forget delivery — email sends async after Notion write, does not block API response
- All 7 form routes trigger both confirmation (to applicant) and alert (to admin) emails
- Email failures captured in **Sentry** with service/type tags (consistent with existing notionWrite error pattern)
- Skip email sending in non-production environments (NODE_ENV !== 'production') — log to console instead
- RESEND_API_KEY — Claude's discretion on whether required or optional in env schema
- User will set up Resend account and verify sagie.co domain independently

### Email Content + Branding
- **Styled HTML** emails using React Email for maintainable templates
- **Warm + professional** tone: "Thank you for applying! We've received your application and our team will review it shortly."
- Confirmation emails: **no submission summary** — just confirmation text
- Admin alert emails: **full submission details** included — admin can triage without opening Notion
- **One adaptive template** for all form types — dynamic subject line and body based on form type
- Subject line pattern: **"SAGIE — [Type] Received"** (e.g., "SAGIE — Membership Application Received", "SAGIE — Event Suggestion Received")
- Footer includes **social links** (consistent with site footer)
- **SAGIE logo** hosted in /public/images/ and referenced via full URL in emails
- Tagline in footer: **"Shape a Great Impact Everywhere"**
- Email color theme: Claude's discretion (dark matching site or light for email readability)

### Globe Data Pipeline
- **Build-time aggregation** from Notion — query Members DB at ISR time, group by city, count members
- Update Notion Members DB **Location field to city names** (Miami, Dallas, Tel Aviv, Singapore, Dubai, New York, etc.) — user handles Notion data updates
- **Static lat/lng lookup table** in code — Claude's discretion on approach (no geocoding API)
- **Separate Chapters database** in Notion for chapter data — user will create it with fields:
  - Name (title) — City name
  - Status (select) — Active / Coming Soon / Planned
  - Location (text) — City for coordinate lookup
  - Chapter Lead (text)
  - Contact (email/URL)
  - Description (rich text)
  - Founded (date)
  - Agreement (file/URL)
- New env var: **NOTION_CHAPTERS_DB_ID** for the Chapters database
- Globe queries both Members DB (city/member counts) and Chapters DB (which cities are chapters)
- **Keep chapter distinction** on globe: chapters get star markers + pulse rings, non-chapters are dots
- **Bundle GeoJSON** (ne_110m country polygons) in /public/data/ instead of fetching from GitHub (GLOBE-01)
- **Heat glow by member count** — cities with more members have larger/brighter glow effect
- Arc approach: Claude's discretion based on what looks best with real data
- Cache TTL: Claude's discretion (membership data is slow-moving)

### Revalidation
- **Tag-based** revalidation with REVALIDATE_SECRET authentication
- POST /api/revalidate accepts {secret, tags: ['notion:blog', ...]}
- **No tags = flush all** known cache tags (convenience shortcut)
- Existing cache tags: notion:blog, notion:events, notion:resources, notion:solutions (plus new globe/chapters tags)
- **Simple admin page** at /admin/revalidate with:
  - Password prompt (REVALIDATE_SECRET) before showing controls
  - Buttons for each content type + "Refresh All"
- Notion webhook integration deferred to v2 (NOTF-01)

### Claude's Discretion
- RESEND_API_KEY: required vs optional in env schema
- Email color theme (dark vs light)
- Arc behavior on globe (keep, remove, or hover-only)
- Globe data cache TTL
- Static coordinate lookup implementation details
- Sitemap implementation (mechanical — list all routes + dynamic slugs)
- Admin page styling

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `withValidation` (src/lib/validation.ts): API middleware pattern — revalidation endpoint can follow same structure
- `notionWrite` + Sentry error capture (src/lib/notion-monitor.ts): Pattern for email error monitoring
- `unstable_cache` wrappers (src/lib/blog.ts, events.ts, etc.): Globe data fetching should follow same caching pattern
- Cache tags already defined: notion:blog, notion:events, notion:resources, notion:solutions
- `REVALIDATE_SECRET` already in env schema (src/env/server.ts) — made optional in Phase 1
- Existing sitemap.ts (src/app/sitemap.ts) — only returns root URL, needs dynamic routes added
- GlobeNetwork.tsx — full component with MOCK_CITIES, MOCK_ARCS, city selection, hover, legend, info card

### Established Patterns
- Notion reads: `unstable_cache(async fn, [key], { revalidate: TTL, tags: [...] })`
- Notion writes: `notionWrite(() => notion.pages.create({...}))` with Sentry capture
- API routes: `export const POST = withValidation(Schema, handler)`
- Env validation: Zod schema in src/env/server.ts, server-only import
- Data-fetching libs: src/lib/blog.ts, events.ts, resources.ts, solutions.ts — each exports typed cached functions

### Integration Points
- Email: hooks into all 7 API routes (membership, chapter, ventures, solutions, event, blog post, resource) after successful Notion write
- Globe data: new src/lib/members.ts and src/lib/chapters.ts following existing lib pattern
- Revalidation: new src/app/api/revalidate/route.ts + src/app/admin/revalidate/page.tsx
- Sitemap: extend existing src/app/sitemap.ts with dynamic routes from blog, events, resources, solutions libs

</code_context>

<specifics>
## Specific Ideas

- Subject line pattern mirrors SAGIE's premium brand: "SAGIE — [Type] Received"
- Globe heat glow effect: larger cities like Miami (200+) and Dallas (200+) should visually dominate vs Dubai (1) or Singapore (2)
- Admin page should feel simple and functional — it's a tool, not a marketing page
- Chapters DB schema designed for future use beyond globe (lead, contact, agreement fields)

</specifics>

<deferred>
## Deferred Ideas

- Notion webhook for auto-revalidation on content edit (NOTF-01) — v2 requirement, endpoint built now is webhook-ready
- Per-form custom email templates — one adaptive template for now, can be split later if needed

</deferred>

---

*Phase: 03-features-globe*
*Context gathered: 2026-03-28*
