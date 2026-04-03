import { describe, test, expect } from 'vitest'
import { sanitizeForEmail, sanitizeRecord } from '@/lib/sanitize'

// ---------------------------------------------------------------------------
// sanitizeForEmail
// ---------------------------------------------------------------------------
describe('sanitizeForEmail', () => {
  test('escapes all five HTML entities', () => {
    expect(sanitizeForEmail('<script>alert("xss")</script>'))
      .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
  })

  test('escapes ampersands', () => {
    expect(sanitizeForEmail('Tom & Jerry')).toBe('Tom &amp; Jerry')
  })

  test('escapes single quotes', () => {
    expect(sanitizeForEmail("it's")).toBe('it&#x27;s')
  })

  test('returns empty string unchanged', () => {
    expect(sanitizeForEmail('')).toBe('')
  })

  test('leaves safe strings unchanged', () => {
    expect(sanitizeForEmail('Hello World 123')).toBe('Hello World 123')
  })

  test('handles multiple entities in one string', () => {
    expect(sanitizeForEmail('a < b & c > d "e" \'f\''))
      .toBe('a &lt; b &amp; c &gt; d &quot;e&quot; &#x27;f&#x27;')
  })

  test('handles unicode and emoji safely', () => {
    expect(sanitizeForEmail('Café ☕ naïve')).toBe('Café ☕ naïve')
  })
})

// ---------------------------------------------------------------------------
// sanitizeRecord
// ---------------------------------------------------------------------------
describe('sanitizeRecord', () => {
  test('sanitizes all string values in a flat object', () => {
    const input = {
      name: '<b>Bold</b>',
      email: 'user@example.com',
      age: 25,
    }
    const result = sanitizeRecord(input)
    expect(result.name).toBe('&lt;b&gt;Bold&lt;/b&gt;')
    expect(result.email).toBe('user@example.com')
    expect(result.age).toBe(25)
  })

  test('sanitizes string values inside arrays', () => {
    const input = { tags: ['<script>', 'safe', '&danger'] }
    const result = sanitizeRecord(input)
    expect(result.tags).toEqual(['&lt;script&gt;', 'safe', '&amp;danger'])
  })

  test('preserves non-string array values', () => {
    const input = { ids: [1, 2, 3] }
    const result = sanitizeRecord(input)
    expect(result.ids).toEqual([1, 2, 3])
  })

  test('returns a new object (does not mutate)', () => {
    const input = { name: '<b>test</b>' }
    const result = sanitizeRecord(input)
    expect(result).not.toBe(input)
    expect(input.name).toBe('<b>test</b>')
  })

  test('handles empty object', () => {
    expect(sanitizeRecord({})).toEqual({})
  })

  test('preserves null and undefined values', () => {
    const input = { a: null, b: undefined, c: 'ok' }
    const result = sanitizeRecord(input)
    expect(result.a).toBeNull()
    expect(result.b).toBeUndefined()
    expect(result.c).toBe('ok')
  })
})
