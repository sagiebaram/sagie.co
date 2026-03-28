# Requirements: sagie.co

**Defined:** 2026-03-28
**Core Value:** Community members and prospective members can discover SAGIE's value, consume content, and apply to join — with every submission reliably reaching the team and every piece of content appearing promptly.

## v1 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Bug Fixes

- [x] **BUG-01**: Form field names in ChapterForm and MembershipForm match their Zod schemas so no submitted data is dropped
- [x] **BUG-02**: Globe initGlobe setTimeout loop has cleanup flag and max retry limit
- [x] **BUG-03**: NOTION_DEAL_PIPELINE_DB_ID and REVALIDATE_SECRET are optional in env schema until their features are built

### Cleanup

- [x] **CLN-01**: Remove orphaned MOCK_POSTS, MOCK_EVENTS, MOCK_RESOURCES, MOCK_PROVIDERS constants
- [x] **CLN-02**: Uninstall @typeform/embed-react and dotenv unused dependencies
- [x] **CLN-03**: Remove duplicate SolutionProvider and BlogPost type definitions, keep only lib versions

### Security

- [x] **SEC-01**: API routes enforce IP-based rate limiting (target: 5 submissions per IP per 10 min)
- [x] **SEC-02**: API routes check Origin header against allowedOrigins
- [x] **SEC-03**: CSP script-src uses per-request nonces instead of unsafe-inline
- [x] **SEC-04**: Sentry tracesSampleRate lowered to 0.1-0.2 in production

### Features

- [x] **FEAT-01**: /api/revalidate endpoint accepts secret and invalidates cache tags on demand
- [x] **FEAT-02**: Email confirmation sent to applicant after form submission
- [x] **FEAT-03**: Email alert sent to admin after form submission
- [x] **FEAT-04**: Sitemap includes all routes and dynamic blog/content pages
- [x] **FEAT-05**: error.tsx and loading.tsx boundaries exist for all route segments

### Globe

- [x] **GLOBE-01**: GeoJSON served from /public/ instead of fetched from GitHub at runtime
- [x] **GLOBE-02**: Globe cities and member counts sourced from Notion data

### Testing

- [x] **TEST-01**: Vitest installed and configured, CI unit test step passes
- [x] **TEST-02**: Unit tests for blog.ts, events.ts, resources.ts, solutions.ts data mapping
- [x] **TEST-03**: Unit tests for all Zod schemas and withValidation middleware
- [x] **TEST-04**: E2E tests for form submissions and content page rendering

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Analytics

- **ANLY-01**: Privacy-friendly analytics tracking (e.g. Plausible or Vercel Analytics)

### Moderation

- **MODR-01**: Admin moderation workflow for community submissions
- **MODR-02**: Content approval queue visible outside Notion

### Notifications

- **NOTF-01**: Webhook from Notion to trigger revalidation automatically on content changes

## Out of Scope

| Feature | Reason |
|---------|--------|
| User authentication / accounts | Marketing site, not a logged-in product |
| Real-time chat | High complexity, not core to community value |
| Mobile app | Web-first approach |
| CMS admin panel | Notion serves this role |
| Payment processing | Not part of current model |
| Video hosting | Storage/bandwidth costs, external platforms handle this |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| BUG-01 | Phase 1 | Complete |
| BUG-02 | Phase 1 | Complete |
| BUG-03 | Phase 1 | Complete |
| CLN-01 | Phase 1 | Complete |
| CLN-02 | Phase 1 | Complete |
| CLN-03 | Phase 1 | Complete |
| SEC-01 | Phase 2 | Complete |
| SEC-02 | Phase 2 | Complete |
| SEC-03 | Phase 2 | Complete |
| SEC-04 | Phase 2 | Complete |
| FEAT-01 | Phase 3 | Complete |
| FEAT-02 | Phase 3 | Complete |
| FEAT-03 | Phase 3 | Complete |
| FEAT-04 | Phase 3 | Complete |
| FEAT-05 | Phase 2 | Complete |
| GLOBE-01 | Phase 3 | Complete |
| GLOBE-02 | Phase 3 | Complete |
| TEST-01 | Phase 4 | Complete |
| TEST-02 | Phase 4 | Complete |
| TEST-03 | Phase 4 | Complete |
| TEST-04 | Phase 4 | Complete |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0

---
*Requirements defined: 2026-03-28*
*Last updated: 2026-03-28 after roadmap creation*
