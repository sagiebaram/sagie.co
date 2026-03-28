import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'
import { env } from '@/env/server'
import { withValidation } from '@/lib/validation'
import { ChapterSchema } from '@/lib/schemas'
import { notionWrite } from '@/lib/notion-monitor'

export const POST = withValidation(ChapterSchema, async (_req: Request, body) => {
  try {
    await notionWrite(() => notion.pages.create({
      parent: { database_id: env.NOTION_MEMBER_DB_ID },
      properties: {
        'Full Name': { title: [{ text: { content: body.fullName } }] },
        Email: { email: body.email },
        'Chapter Lead Applicant': { checkbox: true },
        ...(body.linkedIn ? { 'LinkedIn URL': { url: body.linkedIn } } : {}),
        ...(body.communitySize ? { 'Existing Community Size': { rich_text: [{ text: { content: body.communitySize } }] } } : {}),
        ...(body.whyLead ? { 'Why Lead': { rich_text: [{ text: { content: body.whyLead } }] } } : {}),
        Notes: { rich_text: [{ text: { content: `Chapter Lead Application — ${body.city}` } }] },
      },
    }))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Chapter application failed:', error)
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 })
  }
})
