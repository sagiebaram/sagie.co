import { vi, describe, test, expect } from 'vitest'

vi.mock('server-only', () => ({}))

import {
  MembershipSchema,
  ChapterSchema,
  VenturesSchema,
  SolutionsSchema,
  SubmitPostSchema,
} from '@/lib/schemas'

// ---------------------------------------------------------------------------
// MembershipSchema
// ---------------------------------------------------------------------------
describe('MembershipSchema', () => {
  const validMembership = {
    fullName: 'Jane Doe',
    email: 'JANE@EXAMPLE.COM',
    role: 'Founder',
    country: 'IL',
    city: 'Tel Aviv',
    phone: '+972501234567',
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

  test('rejects missing country', () => {
    const { country: _c, ...rest } = validMembership
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

  test('accepts any non-empty string as role (free-text Other support)', () => {
    const result = MembershipSchema.safeParse({ ...validMembership, role: 'InvalidRole' })
    expect(result.success).toBe(true)
  })

  test('rejects empty string for role', () => {
    const result = MembershipSchema.safeParse({ ...validMembership, role: '' })
    expect(result.success).toBe(false)
  })

  test('accepts all predefined role values', () => {
    const validRoles = ['Founder', 'Investor', 'Operator', 'Ecosystem Builder', 'Academic', 'Partner']
    for (const role of validRoles) {
      const result = MembershipSchema.safeParse({ ...validMembership, role })
      expect(result.success).toBe(true)
    }
  })

  test('accepts custom Other free-text for role', () => {
    const result = MembershipSchema.safeParse({ ...validMembership, role: 'Blockchain Developer' })
    expect(result.success).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// ChapterSchema
// ---------------------------------------------------------------------------
describe('ChapterSchema', () => {
  const validChapter = {
    fullName: 'John Smith',
    email: 'john@example.com',
    country: 'GB',
    city: 'London',
    phone: '+442071234567',
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
    phone: '+14155551234',
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
    phone: '+14165551234',
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

// ---------------------------------------------------------------------------
// optional URL fields accept empty strings
// ---------------------------------------------------------------------------
describe('optional URL fields accept empty strings', () => {
  const validMembership = {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    role: 'Founder',
    country: 'IL',
    city: 'Tel Aviv',
    phone: '+972501234567',
  }

  const validChapter = {
    fullName: 'John Smith',
    email: 'john@example.com',
    country: 'GB',
    city: 'London',
    phone: '+442071234567',
    whyLead: 'I have 10 years of community building experience.',
  }

  const validVenture = {
    companyName: 'TechCo',
    founderName: 'Alice Brown',
    email: 'alice@techco.com',
    phone: '+14155551234',
    oneLineDescription: 'AI-powered supply chain optimization.',
  }

  const validSolution = {
    providerName: 'Bob Provider',
    email: 'bob@solutions.com',
    phone: '+14165551234',
    category: 'Technology & Product' as const,
    bio: 'Expert product consultant with 15 years of experience.',
    servicesOffered: 'Product strategy, team coaching, and technical reviews.',
  }

  const validPost = {
    postTitle: 'My Post',
    category: 'Ecosystem',
    yourName: 'Alice',
    yourEmail: 'alice@example.com',
    content: 'This is the post content with enough characters.',
  }

  // MembershipSchema
  test('MembershipSchema: empty linkedIn passes (becomes undefined)', () => {
    const result = MembershipSchema.safeParse({ ...validMembership, linkedIn: '' })
    expect(result.success).toBe(true)
  })

  test('MembershipSchema: valid LinkedIn URL passes', () => {
    const result = MembershipSchema.safeParse({ ...validMembership, linkedIn: 'https://linkedin.com/in/test' })
    expect(result.success).toBe(true)
  })

  test('MembershipSchema: invalid LinkedIn URL fails', () => {
    const result = MembershipSchema.safeParse({ ...validMembership, linkedIn: 'not-a-url' })
    expect(result.success).toBe(false)
  })

  // ChapterSchema
  test('ChapterSchema: empty linkedIn passes', () => {
    const result = ChapterSchema.safeParse({ ...validChapter, linkedIn: '' })
    expect(result.success).toBe(true)
  })

  // VenturesSchema
  test('VenturesSchema: empty website passes', () => {
    const result = VenturesSchema.safeParse({ ...validVenture, website: '' })
    expect(result.success).toBe(true)
  })

  test('VenturesSchema: empty linkedIn passes', () => {
    const result = VenturesSchema.safeParse({ ...validVenture, linkedIn: '' })
    expect(result.success).toBe(true)
  })

  test('VenturesSchema: empty pitchDeckUrl passes', () => {
    const result = VenturesSchema.safeParse({ ...validVenture, pitchDeckUrl: '' })
    expect(result.success).toBe(true)
  })

  // SolutionsSchema
  test('SolutionsSchema: empty linkedIn passes', () => {
    const result = SolutionsSchema.safeParse({ ...validSolution, linkedIn: '' })
    expect(result.success).toBe(true)
  })

  test('SolutionsSchema: empty portfolioUrl passes', () => {
    const result = SolutionsSchema.safeParse({ ...validSolution, portfolioUrl: '' })
    expect(result.success).toBe(true)
  })

  // SubmitPostSchema
  test('SubmitPostSchema: empty url passes', () => {
    const result = SubmitPostSchema.safeParse({ ...validPost, url: '' })
    expect(result.success).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Phone + Country fields
// ---------------------------------------------------------------------------
describe('phone and country fields', () => {
  const validMembership = {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    role: 'Founder',
    country: 'IL',
    city: 'Tel Aviv',
    phone: '+972501234567',
  }

  const validChapter = {
    fullName: 'John Smith',
    email: 'john@example.com',
    country: 'GB',
    city: 'London',
    phone: '+442071234567',
    whyLead: 'I have 10 years of community building experience.',
  }

  test('MembershipSchema requires country', () => {
    const { country: _c, ...rest } = validMembership
    const result = MembershipSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('MembershipSchema accepts valid phone (E.164)', () => {
    const result = MembershipSchema.safeParse({ ...validMembership, phone: '+14155551234' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.phone).toBe('+14155551234')
    }
  })

  test('MembershipSchema rejects missing phone', () => {
    const { phone: _p, ...rest } = validMembership
    const result = MembershipSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('MembershipSchema rejects invalid phone', () => {
    const result = MembershipSchema.safeParse({ ...validMembership, phone: '123' })
    expect(result.success).toBe(false)
  })

  test('ChapterSchema requires country', () => {
    const { country: _c, ...rest } = validChapter
    const result = ChapterSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('ChapterSchema accepts valid phone', () => {
    const result = ChapterSchema.safeParse({ ...validChapter, phone: '+442071234567' })
    expect(result.success).toBe(true)
  })

  test('VenturesSchema accepts optional country', () => {
    const validVenture = {
      companyName: 'TechCo',
      founderName: 'Alice Brown',
      email: 'alice@techco.com',
      phone: '+14155551234',
      oneLineDescription: 'AI-powered supply chain optimization.',
      country: 'US',
    }
    const result = VenturesSchema.safeParse(validVenture)
    expect(result.success).toBe(true)
  })

  test('SolutionsSchema accepts optional country', () => {
    const validSolution = {
      providerName: 'Bob Provider',
      email: 'bob@solutions.com',
      category: 'Technology & Product' as const,
      bio: 'Expert product consultant with 15 years of experience.',
      servicesOffered: 'Product strategy, team coaching, and technical reviews.',
      country: 'CA',
      phone: '+14165551234',
    }
    const result = SolutionsSchema.safeParse(validSolution)
    expect(result.success).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Upgraded validation patterns
// ---------------------------------------------------------------------------
describe('upgraded validation patterns', () => {
  test('MembershipSchema name accepts Unicode (Chinese)', () => {
    const result = MembershipSchema.safeParse({
      fullName: '李明',
      email: 'li@example.com',
      role: 'Founder',
      country: 'CN',
      city: 'Shanghai',
      phone: '+8613800138000',
    })
    expect(result.success).toBe(true)
  })

  test('MembershipSchema name accepts hyphens and apostrophes', () => {
    const result = MembershipSchema.safeParse({
      fullName: "O'Brien-Smith",
      email: 'ob@example.com',
      role: 'Investor',
      country: 'IE',
      city: 'Dublin',
      phone: '+353871234567',
    })
    expect(result.success).toBe(true)
  })

  test('MembershipSchema name rejects numbers', () => {
    const result = MembershipSchema.safeParse({
      fullName: 'Test123',
      email: 'test@example.com',
      role: 'Founder',
      country: 'US',
      state: 'NY',
      city: 'Manhattan',
      phone: '+12125551234',
    })
    expect(result.success).toBe(false)
  })

  test('VenturesSchema companyName accepts numbers and ampersand', () => {
    const result = VenturesSchema.safeParse({
      companyName: 'AT&T',
      founderName: 'Jane Doe',
      email: 'jane@att.com',
      phone: '+12125551234',
      oneLineDescription: 'Telecommunications giant.',
    })
    expect(result.success).toBe(true)
  })

  test('MembershipSchema LinkedIn validates domain', () => {
    const result = MembershipSchema.safeParse({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      role: 'Founder',
      country: 'IL',
      city: 'Tel Aviv',
      phone: '+972501234567',
      linkedIn: 'https://linkedin.com/in/janedoe',
    })
    expect(result.success).toBe(true)
  })

  test('MembershipSchema LinkedIn rejects non-LinkedIn URL', () => {
    const result = MembershipSchema.safeParse({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      role: 'Founder',
      country: 'IL',
      city: 'Tel Aviv',
      phone: '+972501234567',
      linkedIn: 'https://twitter.com/janedoe',
    })
    expect(result.success).toBe(false)
  })

  test('ChapterSchema whyLead rejects spam (repeated chars)', () => {
    const result = ChapterSchema.safeParse({
      fullName: 'John Smith',
      email: 'john@example.com',
      country: 'GB',
      city: 'London',
      phone: '+442071234567',
      whyLead: 'aaaaaaaaaaaaaaaaaaa',
    })
    expect(result.success).toBe(false)
  })

  test('SolutionsSchema bio rejects excessive URLs', () => {
    const result = SolutionsSchema.safeParse({
      providerName: 'Bob Provider',
      email: 'bob@solutions.com',
      phone: '+14165551234',
      category: 'Technology & Product' as const,
      bio: 'Check out https://spam1.com and https://spam2.com and https://spam3.com for more info.',
      servicesOffered: 'Product strategy, team coaching, and technical reviews.',
    })
    expect(result.success).toBe(false)
  })
})
