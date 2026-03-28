import { vi, describe, test, expect } from 'vitest'

vi.mock('server-only', () => ({}))

import {
  MembershipSchema,
  ChapterSchema,
  VenturesSchema,
  SolutionsSchema,
} from '@/lib/schemas'

// ---------------------------------------------------------------------------
// MembershipSchema
// ---------------------------------------------------------------------------
describe('MembershipSchema', () => {
  const validMembership = {
    fullName: 'Jane Doe',
    email: 'JANE@EXAMPLE.COM',
    role: 'Founder',
    location: 'Tel Aviv',
  }

  test('accepts a fully valid input', () => {
    const result = MembershipSchema.safeParse(validMembership)
    expect(result.success).toBe(true)
  })

  test('rejects missing email', () => {
    const { email: _email, ...rest } = validMembership
    const result = MembershipSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('rejects invalid email format', () => {
    const result = MembershipSchema.safeParse({ ...validMembership, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  test('rejects missing fullName', () => {
    const { fullName: _fn, ...rest } = validMembership
    const result = MembershipSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('rejects missing role', () => {
    const { role: _r, ...rest } = validMembership
    const result = MembershipSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('rejects missing location', () => {
    const { location: _l, ...rest } = validMembership
    const result = MembershipSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('rejects non-string email (number)', () => {
    const result = MembershipSchema.safeParse({ ...validMembership, email: 42 })
    expect(result.success).toBe(false)
  })

  test('trims whitespace from fullName', () => {
    const result = MembershipSchema.safeParse({ ...validMembership, fullName: '  Jane Doe  ' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.fullName).toBe('Jane Doe')
    }
  })

  test('lowercases email', () => {
    const result = MembershipSchema.safeParse({ ...validMembership, email: 'JANE@EXAMPLE.COM' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('jane@example.com')
    }
  })

  test('defaults tier to Explorer', () => {
    const result = MembershipSchema.safeParse(validMembership)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.tier).toBe('Explorer')
    }
  })
})

// ---------------------------------------------------------------------------
// ChapterSchema
// ---------------------------------------------------------------------------
describe('ChapterSchema', () => {
  const validChapter = {
    fullName: 'John Smith',
    email: 'john@example.com',
    city: 'London',
    whyLead: 'I have 10 years of community building experience.',
  }

  test('accepts a fully valid input', () => {
    const result = ChapterSchema.safeParse(validChapter)
    expect(result.success).toBe(true)
  })

  test('rejects missing fullName', () => {
    const { fullName: _fn, ...rest } = validChapter
    const result = ChapterSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('rejects missing email', () => {
    const { email: _e, ...rest } = validChapter
    const result = ChapterSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('rejects missing city', () => {
    const { city: _c, ...rest } = validChapter
    const result = ChapterSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('rejects missing whyLead', () => {
    const { whyLead: _w, ...rest } = validChapter
    const result = ChapterSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('rejects whyLead shorter than 10 chars', () => {
    const result = ChapterSchema.safeParse({ ...validChapter, whyLead: 'Too short' })
    expect(result.success).toBe(false)
  })

  test('rejects invalid email format', () => {
    const result = ChapterSchema.safeParse({ ...validChapter, email: 'bad-email' })
    expect(result.success).toBe(false)
  })

  test('trims whitespace from city', () => {
    const result = ChapterSchema.safeParse({ ...validChapter, city: '  London  ' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.city).toBe('London')
    }
  })

  test('lowercases email', () => {
    const result = ChapterSchema.safeParse({ ...validChapter, email: 'JOHN@EXAMPLE.COM' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('john@example.com')
    }
  })
})

// ---------------------------------------------------------------------------
// VenturesSchema
// ---------------------------------------------------------------------------
describe('VenturesSchema', () => {
  const validVenture = {
    companyName: 'TechCo',
    founderName: 'Alice Brown',
    email: 'alice@techco.com',
    oneLineDescription: 'AI-powered supply chain optimization.',
  }

  test('accepts a fully valid input', () => {
    const result = VenturesSchema.safeParse(validVenture)
    expect(result.success).toBe(true)
  })

  test('rejects missing companyName', () => {
    const { companyName: _c, ...rest } = validVenture
    const result = VenturesSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('rejects missing founderName', () => {
    const { founderName: _f, ...rest } = validVenture
    const result = VenturesSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('rejects missing email', () => {
    const { email: _e, ...rest } = validVenture
    const result = VenturesSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('rejects missing oneLineDescription', () => {
    const { oneLineDescription: _o, ...rest } = validVenture
    const result = VenturesSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('rejects invalid email format', () => {
    const result = VenturesSchema.safeParse({ ...validVenture, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  test('rejects non-string founderName (number)', () => {
    const result = VenturesSchema.safeParse({ ...validVenture, founderName: 123 })
    expect(result.success).toBe(false)
  })

  test('trims whitespace from companyName', () => {
    const result = VenturesSchema.safeParse({ ...validVenture, companyName: '  TechCo  ' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.companyName).toBe('TechCo')
    }
  })

  test('lowercases email', () => {
    const result = VenturesSchema.safeParse({ ...validVenture, email: 'ALICE@TECHCO.COM' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('alice@techco.com')
    }
  })
})

// ---------------------------------------------------------------------------
// SolutionsSchema
// ---------------------------------------------------------------------------
describe('SolutionsSchema', () => {
  const validSolution = {
    providerName: 'Bob Provider',
    email: 'bob@solutions.com',
    category: 'Technology & Product' as const,
    bio: 'Expert product consultant with 15 years of experience.',
    servicesOffered: 'Product strategy, team coaching, and technical reviews.',
  }

  test('accepts a fully valid input', () => {
    const result = SolutionsSchema.safeParse(validSolution)
    expect(result.success).toBe(true)
  })

  test('rejects missing providerName', () => {
    const { providerName: _p, ...rest } = validSolution
    const result = SolutionsSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('rejects missing email', () => {
    const { email: _e, ...rest } = validSolution
    const result = SolutionsSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('rejects missing category', () => {
    const { category: _c, ...rest } = validSolution
    const result = SolutionsSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('rejects missing bio', () => {
    const { bio: _b, ...rest } = validSolution
    const result = SolutionsSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('rejects missing servicesOffered', () => {
    const { servicesOffered: _s, ...rest } = validSolution
    const result = SolutionsSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('rejects invalid category value', () => {
    const result = SolutionsSchema.safeParse({ ...validSolution, category: 'InvalidCategory' })
    expect(result.success).toBe(false)
  })

  test('rejects invalid email format', () => {
    const result = SolutionsSchema.safeParse({ ...validSolution, email: 'bad-email' })
    expect(result.success).toBe(false)
  })

  test('trims whitespace from providerName', () => {
    const result = SolutionsSchema.safeParse({ ...validSolution, providerName: '  Bob Provider  ' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.providerName).toBe('Bob Provider')
    }
  })

  test('lowercases email', () => {
    const result = SolutionsSchema.safeParse({ ...validSolution, email: 'BOB@SOLUTIONS.COM' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('bob@solutions.com')
    }
  })
})
