import { vi, describe, test, expect, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('@/env/server', () => ({
  env: {
    ALLOWED_ORIGINS: 'http://localhost:3000',
    NOTION_TOKEN: 'mock-token',
    NOTION_BLOG_DB_ID: 'mock-blog-db',
    NOTION_RESOURCES_DB_ID: 'mock-resources-db',
    NOTION_SOLUTIONS_DB_ID: 'mock-solutions-db',
    NOTION_EVENT_DB_ID: 'mock-events-db',
    NOTION_MEMBER_DB_ID: 'mock-member-db',
    NOTION_VENTURES_INTAKE_DB_ID: 'mock-ventures-db',
    NODE_ENV: 'test',
  },
  allowedOrigins: new Set(['http://localhost:3000']),
}))

import { withValidation } from '@/lib/validation'
import { MembershipSchema } from '@/lib/schemas'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeRequest(body: unknown, extraHeaders?: Record<string, string>): Request {
  return new Request('http://localhost/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    body: JSON.stringify(body),
  })
}

const VALID_MEMBERSHIP_BODY = {
  fullName: 'Test User',
  email: 'test@example.com',
  role: 'Founder',
  location: 'Tel Aviv',
}

// ---------------------------------------------------------------------------
// Core validation tests (single shared handler instance)
// ---------------------------------------------------------------------------
describe('withValidation', () => {
  const mockHandler = vi.fn().mockResolvedValue(Response.json({ success: true }))
  const handler = withValidation(MembershipSchema, mockHandler)

  // Use a fixed timestamp for deterministic timing tests
  const FIXED_NOW = 1_700_000_000_000
  let dateSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    mockHandler.mockClear()
    dateSpy = vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW)
  })

  afterEach(() => {
    dateSpy.mockRestore()
  })

  test('honeypot field filled -> returns 200 silently, handler NOT called', async () => {
    const req = makeRequest({ _trap: 'bot', _t: FIXED_NOW - 5000, ...VALID_MEMBERSHIP_BODY })
    const res = await handler(req)
    expect(res.status).toBe(200)
    expect(mockHandler).not.toHaveBeenCalled()
  })

  test('timing too fast (< 3000ms elapsed) -> returns 200 silently, handler NOT called', async () => {
    const req = makeRequest({ _t: FIXED_NOW - 100, ...VALID_MEMBERSHIP_BODY })
    const res = await handler(req)
    expect(res.status).toBe(200)
    expect(mockHandler).not.toHaveBeenCalled()
  })

  test('invalid JSON body -> 400', async () => {
    const req = new Request('http://localhost/api/test', {
      method: 'POST',
      body: 'not-json',
    })
    const res = await handler(req)
    expect(res.status).toBe(400)
  })

  test('Zod validation failure (missing required fields) -> 422 with fieldErrors', async () => {
    // Valid timing but missing required membership fields
    const req = makeRequest({ _t: FIXED_NOW - 5000 })
    const res = await handler(req)
    const data = await res.json() as { fieldErrors: Record<string, string[]> }
    expect(res.status).toBe(422)
    expect(data.fieldErrors).toBeDefined()
  })

  test('valid body with sufficient elapsed time -> calls handler once, returns handler response', async () => {
    const req = makeRequest({ _t: FIXED_NOW - 5000, ...VALID_MEMBERSHIP_BODY })
    const res = await handler(req)
    expect(mockHandler).toHaveBeenCalledOnce()
    const data = await res.json() as { success: boolean }
    expect(data.success).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Rate limiter tests — isolated handler with unique IP to avoid state bleed
// ---------------------------------------------------------------------------
describe('withValidation - rate limiting', () => {
  // Fresh handler instance to isolate rate limit state per describe block.
  // Each call below uses a unique IP header so it does not accumulate against
  // the IP used in the core tests above.
  const RATE_TEST_IP = '10.0.99.1'
  const rateMockHandler = vi.fn().mockResolvedValue(Response.json({ success: true }))
  const rateHandler = withValidation(MembershipSchema, rateMockHandler)

  const FIXED_NOW = 1_700_000_000_000
  let dateSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    rateMockHandler.mockClear()
    dateSpy = vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW)
  })

  afterEach(() => {
    dateSpy.mockRestore()
  })

  function makeRateRequest(): Request {
    return new Request('http://localhost/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': RATE_TEST_IP,
      },
      body: JSON.stringify({ _t: FIXED_NOW - 5000, ...VALID_MEMBERSHIP_BODY }),
    })
  }

  test('first 5 requests from same IP succeed (status != 429)', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await rateHandler(makeRateRequest())
      expect(res.status).not.toBe(429)
    }
  })

  test('6th request from same IP within window -> 429 with Retry-After header', async () => {
    // Send 5 more requests on top of any accumulated state from the previous test.
    // Since rateStore is module-level and not reset, we need to account for
    // the 5 requests already sent above. The 6th total triggers rate limiting.
    // This test runs AFTER the previous one — the rateStore already has 5 hits.
    const res = await rateHandler(makeRateRequest())
    expect(res.status).toBe(429)
    const retryAfter = res.headers.get('Retry-After')
    expect(retryAfter).not.toBeNull()
    expect(Number(retryAfter)).toBeGreaterThan(0)
  })
})
