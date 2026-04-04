import { NextResponse } from 'next/server'
import { env } from '@/env/server'
import { withValidation } from '@/lib/validation'
import { SubscribeSchema } from '@/lib/schemas'

export const POST = withValidation(SubscribeSchema, async (_req: Request, body) => {
  if (!env.BEEHIIV_API_KEY || !env.BEEHIIV_PUBLICATION_ID) {
    console.warn('Beehiiv not configured — skipping subscription')
    return NextResponse.json({ success: true })
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.BEEHIIV_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: body.email,
          reactivate_existing: true,
          send_welcome_email: true,
        }),
      }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error('Beehiiv API error:', res.status, text)
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Subscribe failed:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
})
