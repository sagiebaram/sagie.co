import { NextResponse } from 'next/server'
import { withValidation } from '@/lib/validation'
import { ContactSchema } from '@/lib/schemas'
import { sendEmails } from '@/lib/email'
import { sanitizeRecord } from '@/lib/sanitize'

export const POST = withValidation(ContactSchema, async (_req: Request, rawBody) => {
  try {
    const body = sanitizeRecord(rawBody)
    void sendEmails('Contact Form', body.email, body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form submission failed:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
})
