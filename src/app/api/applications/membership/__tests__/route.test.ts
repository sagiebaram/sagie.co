import { vi, describe, test, expect, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// Mocks — vi.hoisted ensures these are available inside vi.mock factories
// ---------------------------------------------------------------------------

const { mockNotionCreate, mockSendEmails, mockCaptureException } = vi.hoisted(() => ({
  mockNotionCreate: vi.fn().mockResolvedValue({ id: 'page-123' }),
  mockSendEmails: vi.fn(),
  mockCaptureException: vi.fn(),
}))

vi.mock('server-only', () => ({}))

vi.mock('@/env/server', () => ({
  env: {
    NOTION_TOKEN: 'mock-token',
    NOTION_BLOG_DB_ID: 'mock-blog-db',
    NOTION_RESOURCES_DB_ID: 'mock-resources-db',
    NOTION_SOLUTIONS_DB_ID: 'mock-solutions-db',
    NOTION_EVENT_DB_ID: 'mock-events-db',
    NOTION_MEMBER_DB_ID: 'mock-member-db',
    NOTION_VENTURES_INTAKE_DB_ID: 'mock-ventures-db',
    ALLOWED_ORIGINS: 'http://localhost:3000',
    NODE_ENV: 'test',
  },
  allowedOrigins: new Set(['http://localhost:3000']),
}))

vi.mock('@/lib/notion', () => ({
  notion: { pages: { create: mockNotionCreate } },
}))

vi.mock('@/lib/email', () => ({
  sendEmails: (...args: unknown[]) => mockSendEmails(...args),
}))

vi.mock('@sentry/nextjs', () => ({
  captureException: (...args: unknown[]) => mockCaptureException(...args),
}))

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------

import { POST } from '../route'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const LONG_TEXT = 'This is a real answer with enough words to pass the spam check.'

/** Minimal valid body that passes MembershipSchema + withValidation timing */
function validBody(overrides: Record<string, unknown> = {}) {
  return {
    _t: Date.now() - 5000, // pass timing check
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    phone: '+972501234567',
    country: 'IL',
    city: 'Tel Aviv',
    workStyle: ['Company'],
    companyName: 'Analytical Engine Co.',
    identityTags: ['Founder'],
    needTags: ['Funding'],
    whatTheyNeed: LONG_TEXT,
    communityExpectation: LONG_TEXT,
    communityMeaning: LONG_TEXT,
    howTheyKnowSagie: LONG_TEXT,
    referralSource: 'Google Search',
    ...overrides,
  }
}

let requestCounter = 0

function makeRequest(body: unknown): Request {
  requestCounter++
  return new Request('http://localhost/api/applications/membership', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': `10.0.${Math.floor(requestCounter / 256)}.${requestCounter % 256}`,
    },
    body: JSON.stringify(body),
  })
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('POST /api/applications/membership', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
    mockNotionCreate.mockReset().mockResolvedValue({ id: 'page-123' })
    mockSendEmails.mockReset()
    mockCaptureException.mockReset()
  })

  // ── Notion property mapping ─────────────────────────────────────────────

  describe('Notion property mapping', () => {
    test('maps all required fields to correct Notion property types', async () => {
      const body = validBody({
        _t: 1_700_000_000_000 - 5000,
        linkedIn: 'https://linkedin.com/in/ada',
        organizationName: 'ACM',
        freelancerDescription: 'Algorithms consultant',
        serviceProviderDetail: 'Legal consulting',
        referralSource: 'Referral',
        referralName: 'Charles Babbage',
        newsletterConsent: true,
        workStyle: ['Company', 'Organization', 'Freelancer'],
        identityTags: ['Founder', 'Service Provider'],
        needTags: ['Funding', 'Mentorship'],
      })

      const res = await POST(makeRequest(body))
      expect(res.status).toBe(200)
      expect(mockNotionCreate).toHaveBeenCalledOnce()

      const { properties } = mockNotionCreate.mock.calls[0][0]

      // Title
      expect(properties['Full Name']).toEqual({
        title: [{ text: { content: expect.any(String) } }],
      })

      // Email
      expect(properties['Email']).toEqual({ email: 'ada@example.com' })

      // Phone
      expect(properties['Phone']).toEqual({ phone_number: '+972501234567' })

      // Select fields
      expect(properties['Location']).toEqual({ select: { name: 'Israel' } })
      expect(properties['Country']).toEqual({ select: { name: 'IL' } })
      expect(properties['Tier']).toEqual({ select: { name: 'Explorer' } })
      expect(properties['Status']).toEqual({ select: { name: 'New' } })
      expect(properties['Application Status']).toEqual({ select: { name: 'Pending Review' } })
      expect(properties['Application Source']).toEqual({ select: { name: 'Website Form' } })
      expect(properties['Referral Source']).toEqual({ select: { name: 'Referral' } })

      // URL
      expect(properties['LinkedIn URL']).toEqual({ url: expect.stringContaining('linkedin.com') })

      // Multi-select fields
      expect(properties['Work Style']).toEqual({
        multi_select: [{ name: 'Company' }, { name: 'Organization' }, { name: 'Freelancer' }],
      })
      expect(properties['Identity Tags']).toEqual({
        multi_select: [{ name: 'Founder' }, { name: 'Service Provider' }],
      })
      expect(properties['Need Tags']).toEqual({
        multi_select: [{ name: 'Funding' }, { name: 'Mentorship' }],
      })

      // Rich text fields (required)
      for (const prop of ['What They Need', 'Community Expectation', 'Community Meaning', 'How They Know Sagie']) {
        expect(properties[prop]).toEqual({
          rich_text: [{ text: { content: expect.any(String) } }],
        })
      }

      // Rich text fields (conditional — all provided in this test)
      for (const prop of ['Company Name', 'Organization Name', 'Freelancer Description', 'Service Provider Detail', 'Referral Name']) {
        expect(properties[prop]).toEqual({
          rich_text: [{ text: { content: expect.any(String) } }],
        })
      }

      // Checkbox
      expect(properties['Newsletter Consent']).toEqual({ checkbox: true })
    })

    test('omits optional fields when not provided', async () => {
      const body = validBody({ _t: 1_700_000_000_000 - 5000 })

      await POST(makeRequest(body))
      const { properties } = mockNotionCreate.mock.calls[0][0]

      // These should NOT be present when the input doesn't include them
      expect(properties['LinkedIn URL']).toBeUndefined()
      expect(properties['Organization Name']).toBeUndefined()
      expect(properties['Freelancer Description']).toBeUndefined()
      expect(properties['Service Provider Detail']).toBeUndefined()
      expect(properties['Referral Name']).toBeUndefined()

      // Newsletter defaults to false
      expect(properties['Newsletter Consent']).toEqual({ checkbox: false })
    })

    test('mapLocation returns correct region for known cities', async () => {
      // Miami
      let res = await POST(makeRequest(validBody({ _t: 1_700_000_000_000 - 5000, city: 'Miami Beach' })))
      expect(res.status).toBe(200)
      expect(mockNotionCreate.mock.calls[0][0].properties['Location']).toEqual({
        select: { name: 'Miami' },
      })

      mockNotionCreate.mockClear()

      // US city
      res = await POST(makeRequest(validBody({ _t: 1_700_000_000_000 - 5000, city: 'New York', email: 'ny@example.com' })))
      expect(mockNotionCreate.mock.calls[0][0].properties['Location']).toEqual({
        select: { name: 'Other US' },
      })

      mockNotionCreate.mockClear()

      // International
      res = await POST(makeRequest(validBody({ _t: 1_700_000_000_000 - 5000, city: 'London', email: 'london@example.com' })))
      expect(mockNotionCreate.mock.calls[0][0].properties['Location']).toEqual({
        select: { name: 'International' },
      })
    })

    test('database_id uses env.NOTION_MEMBER_DB_ID', async () => {
      await POST(makeRequest(validBody({ _t: 1_700_000_000_000 - 5000 })))
      expect(mockNotionCreate.mock.calls[0][0].parent).toEqual({
        database_id: 'mock-member-db',
      })
    })
  })

  // ── Email dispatch ──────────────────────────────────────────────────────

  test('sends emails with correct form type and applicant email', async () => {
    await POST(makeRequest(validBody({ _t: 1_700_000_000_000 - 5000 })))
    expect(mockSendEmails).toHaveBeenCalledWith(
      'Membership Application',
      'ada@example.com',
      expect.objectContaining({ fullName: expect.any(String) }),
    )
  })

  // ── Error path: Notion failure ──────────────────────────────────────────

  describe('Notion write failure', () => {
    test('returns 500 when Notion write fails', async () => {
      mockNotionCreate.mockRejectedValueOnce(new Error('Notion API timeout'))

      const res = await POST(makeRequest(validBody({ _t: 1_700_000_000_000 - 5000 })))
      expect(res.status).toBe(500)

      const data = (await res.json()) as { error: string }
      expect(data.error).toBe('Failed to process application')
    })

    test('Sentry captures the Notion exception via notionWrite', async () => {
      const notionError = new Error('Notion API timeout')
      mockNotionCreate.mockRejectedValueOnce(notionError)

      await POST(makeRequest(validBody({ _t: 1_700_000_000_000 - 5000 })))

      expect(mockCaptureException).toHaveBeenCalledWith(
        notionError,
        expect.objectContaining({
          tags: { service: 'notion', type: 'write_failure' },
        }),
      )
    })

    test('does NOT send emails when Notion write fails', async () => {
      mockNotionCreate.mockRejectedValueOnce(new Error('Notion API timeout'))

      await POST(makeRequest(validBody({ _t: 1_700_000_000_000 - 5000 })))
      expect(mockSendEmails).not.toHaveBeenCalled()
    })
  })
})
