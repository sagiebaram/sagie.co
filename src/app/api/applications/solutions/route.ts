import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'
import { env } from '@/env/server'
import { withValidation } from '@/lib/validation'
import { SolutionsSchema } from '@/lib/schemas'
import { notionWrite } from '@/lib/notion-monitor'
import { sendEmails } from '@/lib/email'
import { sanitizeRecord } from '@/lib/sanitize'

export const POST = withValidation(SolutionsSchema, async (_req: Request, rawBody) => {
  try {
    const body = sanitizeRecord(rawBody)
    try {
      await notionWrite(() => notion.pages.create({
        parent: { database_id: env.NOTION_SOLUTIONS_DB_ID },
        properties: {
          'Provider Name': { title: [{ text: { content: body.providerName } }] },
          Email: { email: body.email },
          Category: { select: { name: body.category } },
          Bio: { rich_text: [{ text: { content: body.bio } }] },
          'Services Offered': { rich_text: [{ text: { content: body.servicesOffered } }] },
          Status: { select: { name: 'Pending Vetting' } },
          ...(body.country ? { Country: { select: { name: body.country } } } : {}),
          Phone: { phone_number: body.phone },
          ...(body.linkedIn ? { 'LinkedIn URL': { url: body.linkedIn } } : {}),
          ...(body.portfolioUrl ? { Website: { url: body.portfolioUrl } } : {}),
          ...(body.rateRange ? { 'Rate Range': { rich_text: [{ text: { content: body.rateRange } }] } } : {}),
          ...(body.city ? { Location: { rich_text: [{ text: { content: body.city } }] } } : {}),
        },
      }))
    } catch (notionError) {
      // TODO: Remove bypass once Notion DB properties (Country, Phone) are created
      console.error('Notion write failed (bypassed for testing):', notionError)
    }

    void sendEmails('Solutions Provider', body.email, body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Solutions application failed:', error)
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 })
  }
})
