/**
 * Escapes HTML entities in user input to prevent injection in email
 * templates and as a belt-and-suspenders measure before Notion writes.
 */
export function sanitizeForEmail(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Deep-sanitize all string values in a flat object.
 * Returns a new object with every string value escaped.
 */
export function sanitizeRecord<T extends Record<string, unknown>>(data: T): T {
  const result = { ...data }
  for (const key of Object.keys(result)) {
    const value = result[key]
    if (typeof value === 'string') {
      ;(result as Record<string, unknown>)[key] = sanitizeForEmail(value)
    } else if (Array.isArray(value)) {
      ;(result as Record<string, unknown>)[key] = value.map((v) =>
        typeof v === 'string' ? sanitizeForEmail(v) : v
      )
    }
  }
  return result
}
