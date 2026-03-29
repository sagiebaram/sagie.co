# Phase 03: Features + Globe - Research

**Researched:** 2026-03-28
**Domain:** Resend/React Email, Next.js on-demand revalidation, sitemap generation, react-globe.gl real data
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Email Service + Delivery**
- Use Resend as the email provider
- From address: hello@sagie.co (requires verified domain in Resend)
- Admin alert destination: hello@sagie.co (single address)
- Fire-and-forget delivery — email sends async after Notion write, does not block API response
- All 7 form routes trigger both confirmation (to applicant) and alert (to admin) emails
- Email failures captured in Sentry with service/type tags (consistent with existing notionWrite error pattern)
- Skip email sending in non-production environments (NODE_ENV !== 'production') — log to console instead
- User will set up Resend account and verify sagie.co domain independently

**Email Content + Branding**
- Styled HTML emails using React Email for maintainable templates
- Warm + professional tone: "Thank you for applying! We've received your application and our team will review it shortly."
- Confirmation emails: no submission summary — just confirmation text
- Admin alert emails: full submission details included — admin can triage without opening Notion
- One adaptive template for all form types — dynamic subject line and body based on form type
- Subject line pattern: "SAGIE — [Type] Received" (e.g., "SAGIE — Membership Application Received")
- Footer includes social links (consistent with site footer)
- SAGIE logo hosted in /public/images/ and referenced via full URL in emails
- Tagline in footer: "Shape a Great Impact Everywhere"

**Globe Data Pipeline**
- Build-time aggregation from Notion — query Members DB at ISR time, group by city, count members
- Update Notion Members DB Location field to city names (user handles Notion data updates)
- Static lat/lng lookup table in code — no geocoding API
- Separate Chapters database in Notion (NOTION_CHAPTERS_DB_ID env var)
- Globe queries both Members DB (city/member counts) and Chapters DB (which cities are chapters)
- Keep chapter distinction: chapters get star markers + pulse rings, non-chapters are dots
- Bundle GeoJSON (ne_110m country polygons) in /public/data/ instead of fetching from GitHub (GLOBE-01)
- Heat glow by member count — cities with more members have larger/brighter glow effect
- Cache TTL: Claude's discretion (membership data is slow-moving)

**Revalidation**
- Tag-based revalidation with REVALIDATE_SECRET authentication
- POST /api/revalidate accepts {secret, tags: ['notion:blog', ...]}
- No tags = flush all known cache tags (convenience shortcut)
- Existing cache tags: notion:blog, notion:events, notion:resources, notion:solutions (plus new globe/chapters tags)
- Simple admin page at /admin/revalidate with password prompt + per-type buttons
- Notion webhook integration deferred to v2 (NOTF-01)

### Claude's Discretion
- RESEND_API_KEY: required vs optional in env schema
- Email color theme (dark vs light)
- Arc behavior on globe (keep, remove, or hover-only)
- Globe data cache TTL
- Static coordinate lookup implementation details
- Sitemap implementation (mechanical — list all routes + dynamic slugs)
- Admin page styling

### Deferred Ideas (OUT OF SCOPE)
- Notion webhook for auto-revalidation on content edit (NOTF-01) — v2 requirement
- Per-form custom email templates — one adaptive template for now
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FEAT-01 | /api/revalidate endpoint accepts secret and invalidates cache tags on demand | revalidateTag(tag, 'max') in route handler; POST body {secret, tags}; no-tags = flush all known |
| FEAT-02 | Email confirmation sent to applicant after form submission | Resend SDK + React Email template; fire-and-forget via void; all 7 API routes |
| FEAT-03 | Email alert sent to admin after form submission | Same Resend send call; admin email with full submission details |
| FEAT-04 | Sitemap includes all routes and dynamic blog/content pages | Async sitemap() in sitemap.ts; call getAllPosts/getUpcomingEvents/etc. for slugs |
| GLOBE-01 | GeoJSON served from /public/ instead of fetched from GitHub at runtime | Download ne_110m geojson to /public/data/; update fetch() call to /data/ path |
| GLOBE-02 | Globe cities and member counts sourced from Notion data | New src/lib/members.ts + src/lib/chapters.ts; replace MOCK_CITIES with real data props |
</phase_requirements>

---

## Summary

This phase delivers six independent but cohesive features. Each feature maps cleanly onto the established project patterns: new `src/lib/` data files, new API routes following `withValidation`, env var additions to `server.ts`, and React component updates for the globe.

The email work (FEAT-02, FEAT-03) is the largest surface area — integrating `resend` + `@react-email/components` into all 7 existing API routes. The pattern is fire-and-forget: after `notionWrite` succeeds, call a shared `sendEmails(formType, body)` helper that wraps Resend calls in a Sentry-captured try/catch (same pattern as `notionWrite`). Production-only gating via `env.NODE_ENV === 'production'`.

The globe work (GLOBE-01, GLOBE-02) replaces the mock data approach: download GeoJSON to `/public/data/`, create `src/lib/members.ts` and `src/lib/chapters.ts` following the `unstable_cache` pattern, pass real city data as props to `GlobeNetwork`, remove `MOCK_CITIES`/`MOCK_ARCS` constants. Heat glow is achieved via scaled `pointAltitude` and `pointRadius` based on member count.

Revalidation (FEAT-01) and sitemap (FEAT-04) are both small mechanical tasks: one new route handler, one async function extension.

**Primary recommendation:** Implement in order — Globe data libs first (no dependencies), then email helper + route hookup, then revalidation endpoint + admin page, then sitemap expansion.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| resend | latest | Email delivery API | Official SDK, express.emails.send() returns {data, error} |
| @react-email/components | latest | Email template components | Html, Body, Container, Heading, Text, Link, Img, Hr, Section, Row, Column, Button |
| next (revalidateTag) | 16.2.1 (already installed) | On-demand cache invalidation | Built-in Next.js function, no extra install |
| react-globe.gl | 2.37.0 (already installed) | Globe rendering | Already integrated; real data replaces MOCK_CITIES |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @react-email/render | latest | Render React email to HTML string | When not using resend.emails.send() react param directly |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| React Email | mjml or handlebars | React Email integrates natively with Resend; component-based is maintainable |
| revalidateTag | revalidatePath | revalidateTag is more surgical; multiple pages can share one tag |

**Installation:**
```bash
npm install resend @react-email/components
```

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── lib/
│   ├── email.ts           # sendEmails() helper — wraps Resend, Sentry capture, NODE_ENV gate
│   ├── members.ts         # unstable_cache Notion Members DB query → CityData[]
│   └── chapters.ts        # unstable_cache Notion Chapters DB query → Chapter[]
├── emails/
│   ├── ConfirmationEmail.tsx   # React Email component — applicant template
│   └── AdminAlertEmail.tsx     # React Email component — admin template
├── app/
│   ├── api/
│   │   └── revalidate/
│   │       └── route.ts   # POST handler — secret check + revalidateTag calls
│   └── admin/
│       └── revalidate/
│           └── page.tsx   # Client page — password prompt + revalidation buttons
public/
└── data/
    └── ne_110m_admin_0_countries.geojson   # Bundled; served at /data/...
```

### Pattern 1: Email Helper (fire-and-forget with Sentry)
**What:** Shared `sendEmails()` wraps both Resend calls; errors captured to Sentry; skips send outside production.
**When to use:** Called at end of each API route handler after successful `notionWrite`.
**Example:**
```typescript
// src/lib/email.ts
import * as Sentry from '@sentry/nextjs'
import { Resend } from 'resend'
import { env } from '@/env/server'
import { ConfirmationEmail } from '@/emails/ConfirmationEmail'
import { AdminAlertEmail } from '@/emails/AdminAlertEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export type FormType =
  | 'Membership Application'
  | 'Chapter Lead Application'
  | 'Ventures Intake'
  | 'Solutions Provider'
  | 'Event Suggestion'
  | 'Blog Post Submission'
  | 'Resource Submission'

export async function sendEmails(
  formType: FormType,
  applicantEmail: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submissionData: Record<string, any>
): Promise<void> {
  if (env.NODE_ENV !== 'production') {
    console.log(`[email] skip (non-production): ${formType} to ${applicantEmail}`)
    return
  }

  const subject = `SAGIE \u2014 ${formType} Received`

  await Promise.allSettled([
    resend.emails.send({
      from: 'SAGIE <hello@sagie.co>',
      to: applicantEmail,
      subject,
      react: ConfirmationEmail({ formType }),
    }).catch(err => Sentry.captureException(err, { tags: { service: 'resend', type: 'confirmation' } })),

    resend.emails.send({
      from: 'SAGIE <hello@sagie.co>',
      to: 'hello@sagie.co',
      subject: `[ADMIN] ${subject}`,
      react: AdminAlertEmail({ formType, data: submissionData }),
    }).catch(err => Sentry.captureException(err, { tags: { service: 'resend', type: 'admin_alert' } })),
  ])
}
```

### Pattern 2: React Email Templates
**What:** TSX components using `@react-email/components`. Resend accepts the `react` param directly — no manual `render()` call needed.
**When to use:** Template authoring. Resend handles HTML serialization.
**Example:**
```typescript
// src/emails/ConfirmationEmail.tsx
import { Html, Body, Container, Heading, Text, Img, Hr, Link, Section } from '@react-email/components'

interface Props {
  formType: string
}

export function ConfirmationEmail({ formType }: Props) {
  return (
    <Html>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'sans-serif' }}>
        <Container>
          <Img
            src="https://sagie.co/logo-white.png"
            alt="SAGIE"
            width="120"
          />
          <Heading>Thank you for your {formType}!</Heading>
          <Text>
            We&apos;ve received your application and our team will review it shortly.
          </Text>
          <Hr />
          <Text style={{ fontSize: '12px', color: '#666' }}>
            Shape a Great Impact Everywhere
          </Text>
          <Section>
            <Link href="https://www.linkedin.com/company/sagie-co">LinkedIn</Link>
            {' | '}
            <Link href="https://www.instagram.com/sagie.co/">Instagram</Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
```

### Pattern 3: revalidateTag in Route Handler
**What:** POST /api/revalidate — checks REVALIDATE_SECRET, calls `revalidateTag(tag, 'max')` for each requested tag.
**When to use:** Editor-triggered cache flush or "flush all" shortcut.

**IMPORTANT:** `revalidateTag(tag)` single-argument form is DEPRECATED in Next.js 16. Use `revalidateTag(tag, 'max')` (stale-while-revalidate) or `revalidateTag(tag, { expire: 0 })` for immediate expiry.

**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/revalidateTag
import type { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
import { env } from '@/env/server'

const ALL_TAGS = [
  'notion:blog', 'notion:events', 'notion:resources',
  'notion:solutions', 'notion:members', 'notion:chapters',
]

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (body.secret !== env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tags: string[] = body.tags?.length ? body.tags : ALL_TAGS

  for (const tag of tags) {
    revalidateTag(tag, 'max')
  }

  return Response.json({ revalidated: true, tags, now: Date.now() })
}
```

### Pattern 4: Globe Real Data Props
**What:** `GlobeNetwork` receives `cities` as a prop instead of using `MOCK_CITIES`. Data is fetched at build/ISR time in the parent Server Component and passed down.
**When to use:** GLOBE-02 implementation.
**Example:**
```typescript
// src/lib/members.ts
import { unstable_cache } from 'next/cache'
import { notion } from './notion'
import { env } from '@/env/server'

export interface CityData {
  id: string
  name: string
  lat: number
  lng: number
  members: number
  isChapter: boolean
}

// Static lat/lng lookup — no geocoding API
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'Miami':     { lat: 25.7617, lng: -80.1918 },
  'New York':  { lat: 40.7128, lng: -74.006 },
  'Dallas':    { lat: 32.7767, lng: -96.797 },
  'Tel Aviv':  { lat: 32.0853, lng: 34.7818 },
  'Singapore': { lat: 1.3521,  lng: 103.8198 },
  'Dubai':     { lat: 25.2048, lng: 55.2708 },
  'London':    { lat: 51.5074, lng: -0.1278 },
}

export const getMemberCities = unstable_cache(
  async (): Promise<CityData[]> => {
    // query Members DB, group by Location, count
    // cross-reference with chapters query
  },
  ['notion:members:cities'],
  { revalidate: 3600, tags: ['notion:members'] }
)
```

### Pattern 5: Async Sitemap with Dynamic Routes
**What:** `sitemap()` made async; calls existing `getAllPosts()`, `getUpcomingEvents()`, `getPastEvents()`, `getSolutionProviders()`, `getResources()` to get slugs.
**When to use:** FEAT-04.
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
import type { MetadataRoute } from 'next'
import { SITE } from '@/constants/copy'
import { getAllPosts } from '@/lib/blog'
import { getUpcomingEvents } from '@/lib/events'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const postUrls = posts.map(p => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: p.publishDate ? new Date(p.publishDate) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    { url: SITE.url, lastModified: new Date(), priority: 1 },
    // ... static routes
    ...postUrls,
    // ... events, resources, solutions
  ]
}
```

### Anti-Patterns to Avoid
- **Single-argument revalidateTag:** `revalidateTag(tag)` without second arg is deprecated in Next.js 16. Always use `revalidateTag(tag, 'max')`.
- **Blocking API response on email:** Do not await email sends in the response chain — use fire-and-forget (`void sendEmails(...)` or `Promise.allSettled` without awaiting at route level).
- **Geocoding API at runtime:** All city coordinates are a static lookup table in code. No external geocoding calls.
- **Fetching GeoJSON from GitHub at runtime:** The current `fetch('https://raw.githubusercontent.com/...')` must be replaced with `fetch('/data/ne_110m_admin_0_countries.geojson')` pointing to the bundled file.
- **Calling email libs from client components:** Resend must only be initialized and called in server context (API routes, Server Actions). Never import `resend` in `'use client'` files.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email delivery | Custom SMTP/nodemailer | Resend SDK | Domain verification, deliverability, analytics, error handling built-in |
| Email HTML | Raw HTML strings | React Email components | Inline styles, cross-client compatibility, type-safe props |
| Geocoding | Notion Location → coordinates API | Static CITY_COORDS lookup table | No API key, no latency, membership cities are finite and slow-changing |
| Cache invalidation logic | Custom cache store | Next.js revalidateTag | Built into Next.js ISR infrastructure; works with unstable_cache tags |
| Sitemap serialization | XML string builder | Next.js MetadataRoute.Sitemap | Next.js serializes and serves /sitemap.xml automatically |

**Key insight:** Every problem in this phase has a first-class solution in the existing stack. Zero custom infrastructure needed.

---

## Common Pitfalls

### Pitfall 1: RESEND_API_KEY not in env schema
**What goes wrong:** `resend = new Resend(process.env.RESEND_API_KEY)` — if Zod schema doesn't include it, TypeScript won't enforce it but undefined key causes silent Resend errors.
**Why it happens:** New env var added outside Zod schema.
**How to avoid:** Add `RESEND_API_KEY: z.string().min(1).optional()` to `server.ts` EnvSchema. Optional is correct — non-production environments skip sending entirely, so undefined is valid in dev/test.
**Warning signs:** Resend SDK logs "Missing API key" error in production but test env passes.

### Pitfall 2: revalidateTag deprecation
**What goes wrong:** Calling `revalidateTag(tag)` with single argument — TypeScript suppressed; behavior may break in future Next.js version.
**Why it happens:** Old documentation / training data shows single-argument form.
**How to avoid:** Always use `revalidateTag(tag, 'max')`. For webhook use cases requiring immediate expiry, use `revalidateTag(tag, { expire: 0 })`.
**Warning signs:** TypeScript error (if not suppressed) or Next.js deprecation warning in logs.

### Pitfall 3: GeoJSON fetch fails at runtime
**What goes wrong:** Globe shows no country polygons because GitHub CDN request blocked by CSP or network.
**Why it happens:** Current code fetches from `raw.githubusercontent.com` — violates `connect-src` CSP directives and adds runtime latency.
**How to avoid:** Download GeoJSON to `/public/data/ne_110m_admin_0_countries.geojson` in Wave 0. Update `fetch()` call to `/data/ne_110m_admin_0_countries.geojson`. File is ~450KB, served from same origin.
**Warning signs:** Globe renders atmosphere and dots but no country outlines; console network error.

### Pitfall 4: Email blocked by CORP/COOP headers
**What goes wrong:** Email images (SAGIE logo) do not render in email clients — the image URL must be publicly accessible.
**Why it happens:** Logo in `/public/images/` is fine, but the URL must be absolute (full domain, not relative path) in React Email `<Img>` components.
**How to avoid:** Always reference images as `https://sagie.co/logo-white.png` (absolute URL) in email templates — never `/logo-white.png`.
**Warning signs:** Email renders without logo; image shows broken image icon in email client.

### Pitfall 5: Members DB Location field mismatch
**What goes wrong:** `getMemberCities()` groups by Location but city names don't match CITY_COORDS keys — all member counts go to "unknown" bucket.
**Why it happens:** User sets Location values in Notion; exact string matching against lookup table.
**How to avoid:** CITY_COORDS keys must exactly match the Location values user enters in Notion (case-sensitive). Document the canonical city name list. Consider case-insensitive matching or normalization in the groupBy logic.
**Warning signs:** Globe loads but all cities show 0 members, or known cities don't appear.

### Pitfall 6: Admin revalidate page accesses REVALIDATE_SECRET client-side
**What goes wrong:** Admin page sends secret to API route — secret must NOT be bundled into client JS.
**Why it happens:** Reading from `env` object in a client component.
**How to avoid:** Admin page uses a password input field where user types the secret at runtime — it is never read from `process.env` on the client. The typed value is posted to `/api/revalidate` which checks it server-side.
**Warning signs:** `server-only` import fails; `env` import in client component causes build error.

---

## Code Examples

### Resend send call (verified pattern)
```typescript
// Source: https://resend.com/docs/send-with-nextjs
const resend = new Resend(process.env.RESEND_API_KEY)

const { data, error } = await resend.emails.send({
  from: 'SAGIE <hello@sagie.co>',
  to: applicantEmail,
  subject: 'SAGIE \u2014 Membership Application Received',
  react: ConfirmationEmail({ formType: 'Membership Application' }),
})
// Resend converts `react` prop to HTML automatically — no render() call needed
```

### Hooking email into existing API route
```typescript
// After successful notionWrite in any route:
void sendEmails('Membership Application', body.email, body)
// void = fire-and-forget; API response returns immediately
return NextResponse.json({ success: true })
```

### Globe heat glow via scaled radius/altitude
```typescript
// react-globe.gl pointRadius and pointAltitude accept accessor functions
pointRadius={(d: CityData) => {
  const base = d.isChapter ? 0.6 : 0.3
  const scale = Math.log10(Math.max(d.members, 1) + 1) * 0.4
  return base + scale
}}
pointAltitude={(d: CityData) => {
  return 0.02 + (d.members / 200) * 0.04  // max ~0.06 for 200+ members
}}
// Additional glow: use custom rings with maxR scaled by members
```

### Members DB groupBy city
```typescript
// Pattern: Notion query → group by Location property → map to CityData
const response = await notion.databases.query({
  database_id: env.NOTION_MEMBER_DB_ID,
  filter: { property: 'Status', select: { equals: 'Active' } },
})
const counts: Record<string, number> = {}
for (const page of response.results) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const city = (page as any).properties['Location']?.select?.name ?? 'Unknown'
  counts[city] = (counts[city] ?? 0) + 1
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `revalidateTag(tag)` single arg | `revalidateTag(tag, 'max')` two args | Next.js 16 | Single-arg deprecated; must update |
| Fetch GeoJSON from GitHub CDN | Bundle in /public/data/ | This phase (GLOBE-01) | Removes runtime external dependency |
| MOCK_CITIES / MOCK_ARCS | Real Notion data via props | This phase (GLOBE-02) | Globe shows actual member locations |
| sitemap() sync, root URL only | Async sitemap() with dynamic slugs | This phase (FEAT-04) | Search engines index all content |

**Deprecated/outdated:**
- `revalidateTag(tag)` — single argument form deprecated; Next.js 16 emits deprecation warning, may be removed in a future release. Use `revalidateTag(tag, 'max')`.

---

## Open Questions

1. **RESEND_API_KEY: required or optional in schema?**
   - What we know: EMAIL sends are skipped in non-production; key will be undefined in dev/test
   - What's unclear: Whether to make it `.optional()` or `.min(1)` (required)
   - Recommendation: Make it `.optional()` — consistent with REVALIDATE_SECRET pattern already established in Phase 1. Production deployment will have it set; missing in dev is expected and safe.

2. **Email color theme: dark vs light**
   - What we know: Site is dark-themed; email clients vary widely in dark-mode support
   - What's unclear: React Email supports inline styles only; true dark-mode email requires media queries which have poor client support
   - Recommendation: Use **light theme** for emails (white background, dark text) — better deliverability, universal rendering across Gmail/Outlook/Apple Mail. Site brand elements (logo, SAGIE name) appear regardless.

3. **Globe arc behavior with real data**
   - What we know: Current MOCK_ARCS are hardcoded city pairs; real data has variable cities
   - What's unclear: How many cities will have real data; arcs between all cities may look noisy
   - Recommendation: Keep arcs as hover-only (already implemented pattern), auto-generate arc pairs from chapter cities only (not all member cities). If fewer than 2 chapters exist, hide arcs entirely.

4. **Globe cache TTL**
   - What we know: Membership data changes infrequently; admin can manually revalidate
   - Recommendation: `revalidate: 3600` (1 hour) for `getMemberCities` and `getChapters` — same as blog. Tags `notion:members` and `notion:chapters` allow manual flush via revalidation endpoint.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 |
| Config file | vitest.config.ts (project root) |
| Quick run command | `npx vitest run src/lib/__tests__/` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FEAT-01 | /api/revalidate rejects wrong secret, accepts correct secret, flushes tags | unit | `npx vitest run src/lib/__tests__/revalidate.test.ts -x` | Wave 0 |
| FEAT-01 | No tags in body flushes all known tags | unit | `npx vitest run src/lib/__tests__/revalidate.test.ts -x` | Wave 0 |
| FEAT-02 | sendEmails() skips Resend in non-production | unit | `npx vitest run src/lib/__tests__/email.test.ts -x` | Wave 0 |
| FEAT-02 | sendEmails() calls Resend with correct to/subject/react in production | unit | `npx vitest run src/lib/__tests__/email.test.ts -x` | Wave 0 |
| FEAT-03 | sendEmails() sends admin alert to hello@sagie.co with submission data | unit | `npx vitest run src/lib/__tests__/email.test.ts -x` | Wave 0 |
| FEAT-04 | sitemap() includes static routes | unit | `npx vitest run src/lib/__tests__/sitemap.test.ts -x` | Wave 0 |
| FEAT-04 | sitemap() includes dynamic blog/event slugs | unit | `npx vitest run src/lib/__tests__/sitemap.test.ts -x` | Wave 0 |
| GLOBE-01 | GeoJSON fetch uses /data/ path not GitHub URL | unit (grep) | manual code review | manual-only |
| GLOBE-02 | getMemberCities() groups by city and cross-refs chapters | unit | `npx vitest run src/lib/__tests__/members.test.ts -x` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run src/lib/__tests__/`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/lib/__tests__/email.test.ts` — covers FEAT-02, FEAT-03 (mock Resend SDK)
- [ ] `src/lib/__tests__/revalidate.test.ts` — covers FEAT-01 (mock revalidateTag)
- [ ] `src/lib/__tests__/members.test.ts` — covers GLOBE-02 (mock Notion client)
- [ ] `src/lib/__tests__/sitemap.test.ts` — covers FEAT-04 (mock lib functions)

Note: Existing `src/lib/__tests__/validation.test.ts` mock pattern for `@/env/server` will need updating to include `RESEND_API_KEY` and `NOTION_CHAPTERS_DB_ID`.

---

## Sources

### Primary (HIGH confidence)
- [Next.js revalidateTag API Reference](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) — confirmed deprecated single-arg form; `profile="max"` recommended; version 16.2.1
- [Next.js sitemap.xml file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — async sitemap() confirmed; MetadataRoute.Sitemap type; version 16.2.1
- [Resend Next.js integration](https://resend.com/docs/send-with-nextjs) — RESEND_API_KEY env var name confirmed; resend.emails.send() API; react param

### Secondary (MEDIUM confidence)
- [React Email + Resend integration](https://react.email/docs/integrations/resend) — react param passes component directly; no manual render() needed; React 19.2 + Next.js 16 compatible
- [react-globe.gl npm](https://www.npmjs.com/package/react-globe.gl) — v2.37.0 (already installed); pointRadius/pointAltitude accept accessor functions

### Tertiary (LOW confidence)
- Heat glow via scaled pointRadius/pointAltitude — derived from react-globe.gl accessor function pattern; specific visual tuning will require iteration

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Resend and React Email are the standard Next.js email stack; verified from official docs
- Architecture: HIGH — All patterns follow established project conventions; revalidateTag API confirmed from official Next.js docs
- Pitfalls: HIGH — Deprecation confirmed from official docs; other pitfalls from direct code inspection of existing GlobeNetwork.tsx
- Globe visual tuning: MEDIUM — heat glow scaling is custom; requires runtime iteration

**Research date:** 2026-03-28
**Valid until:** 2026-04-27 (30 days — stable APIs)
