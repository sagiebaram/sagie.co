# Requirements: sagie.co

**Defined:** 2026-03-28
**Core Value:** Community members and prospective members can discover SAGIE's value, consume content, and apply to join — with every submission reliably reaching the team and every piece of content appearing promptly.

## v2.0 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Bug Fixes

- [x] **FIX-01**: Filter state stored in URL params (nuqs) so Blog/Solutions/Resources filters persist and are shareable
- [x] **FIX-02**: GSAP ScrollTrigger refreshes when filter state changes so filtered components render correctly
- [x] **FIX-03**: Browser back/forward navigation renders pages without requiring a manual refresh
- [x] **FIX-04**: User sees a clear error message when form submission is rate-limited (429)

### Events

- [x] **EVT-01**: Register button opens the event's external registration URL from Notion
- [x] **EVT-02**: Add to Calendar modal offers Google Calendar, Outlook, Apple Calendar links and .ics download
- [x] **EVT-03**: More Info button links to event's detail/info URL from Notion
- [x] **EVT-04**: Read Recap button links to event's recap URL from Notion
- [ ] **EVT-05**: Event action buttons show/hide based on data availability (no dead buttons)

### Forms

- [ ] **FORM-01**: All form fields validated inline on blur with per-field error messages via react-hook-form
- [ ] **FORM-02**: Fixed-choice fields use dropdown selects and checkbox groups instead of free-text inputs
- [ ] **FORM-03**: All form submissions verified to land every field in Notion (schema/field audit)

### Polish

- [ ] **POL-01**: Revalidation admin page shows per-button loading state and success/failure indication
- [ ] **POL-02**: Revalidation 401 response correctly resets to access prompt instead of broken redirect
- [ ] **POL-03**: Custom 404 page with branded SVG/CSS illustration matching site aesthetic

## v1.0 Requirements (Validated)

All requirements from v1.0 milestone — shipped and verified.

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

## Future Requirements

Deferred to future release. Tracked but not in current roadmap.

### Analytics

- **ANLY-01**: Privacy-friendly analytics tracking (e.g. Plausible or Vercel Analytics)

### Moderation

- **MODR-01**: Admin moderation workflow for community submissions
- **MODR-02**: Content approval queue visible outside Notion

### Notifications

- **NOTF-01**: Webhook from Notion to trigger revalidation automatically on content changes

### Events (Deferred)

- **EVT-06**: "Notify me when confirmed" captures email and stores in Notion for later notification

### Forms (Deferred)

- **FORM-04**: Multi-step form wizard for membership/ventures applications

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| User authentication / accounts | Marketing site, not a logged-in product |
| Real-time chat | High complexity, not core to community value |
| Mobile app | Web-first approach |
| CMS admin panel | Notion serves this role |
| Payment processing | Not part of current model |
| Video hosting | Storage/bandwidth costs, external platforms handle this |
| Server-side ICS API route | Client-side Blob covers current need; revisit if CSP blocks it |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FIX-01 | Phase 5 | Complete |
| FIX-02 | Phase 5 | Complete |
| FIX-03 | Phase 5 | Complete |
| FIX-04 | Phase 5 | Complete |
| EVT-01 | Phase 6 | Complete |
| EVT-02 | Phase 6 | Complete |
| EVT-03 | Phase 6 | Complete |
| EVT-04 | Phase 6 | Complete |
| EVT-05 | Phase 6 | Pending |
| FORM-01 | Phase 7 | Pending |
| FORM-02 | Phase 7 | Pending |
| FORM-03 | Phase 7 | Pending |
| POL-01 | Phase 8 | Pending |
| POL-02 | Phase 8 | Pending |
| POL-03 | Phase 8 | Pending |

**Coverage:**

- v2.0 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0

---

*Requirements defined: 2026-03-28*
*Last updated: 2026-03-28 — traceability complete for v2.0 roadmap*
