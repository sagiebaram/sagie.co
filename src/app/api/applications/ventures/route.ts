import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'
import { env } from '@/env/server'
import { withValidation } from '@/lib/validation'
import { VenturesSchema } from '@/lib/schemas'
import { notionWrite } from '@/lib/notion-monitor'
import { sendEmails } from '@/lib/email'
import { sanitizeRecord } from '@/lib/sanitize'

export const POST = withValidation(VenturesSchema, async (_req: Request, rawBody) => {
  try {
    const body = sanitizeRecord(rawBody)
    await notionWrite(() => notion.pages.create({
      parent: { database_id: env.NOTION_VENTURES_INTAKE_DB_ID },
      properties: {
        Name: { title: [{ text: { content: body.companyName } }] },
        Email: { email: body.email },
        'Contact Name': { rich_text: [{ text: { content: body.founderName } }] },
        'One-Line Description': { rich_text: [{ text: { content: body.oneLineDescription } }] },
        ...(body.sector ? { Sector: { select: { name: body.sector } } } : {}),
        ...(body.stage ? { Stage: { select: { name: body.stage } } } : {}),
        ...(body.raiseAmount ? { 'Raise Amount': { rich_text: [{ text: { content: body.raiseAmount } }] } } : {}),
        ...(body.pitchDeckUrl ? { 'Pitch Deck URL': { url: body.pitchDeckUrl } } : {}),
        ...(body.website ? { Website: { url: body.website } } : {}),
        ...(body.linkedIn ? { 'LinkedIn URL': { url: body.linkedIn } } : {}),
        ...(body.whySAGIE ? { 'Why SAGIE': { rich_text: [{ text: { content: body.whySAGIE } }] } } : {}),
        Source: { select: { name: 'Website Application' } },
      },
    }))

    void sendEmails('Ventures Intake', body.email, body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ventures application failed:', error)
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 })
  }
})
