import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'
import { env } from '@/env/server'
import { withValidation } from '@/lib/validation'
import { EventSuggestionSchema } from '@/lib/schemas'
import { notionWrite } from '@/lib/notion-monitor'
import { sendEmails } from '@/lib/email'

export const POST = withValidation(EventSuggestionSchema, async (_req: Request, body) => {
  try {
    await notionWrite(() => notion.pages.create({
      parent: { database_id: env.NOTION_EVENT_DB_ID },
      properties: {
        'Event Name': { title: [{ text: { content: body.eventName } }] },
        Description: { rich_text: [{ text: { content: body.description } }] },
        Status: { select: { name: 'Concept' } },
        'Submitted By': { rich_text: [{ text: { content: body.suggestedBy } }] },
      },
    }))

    void sendEmails('Event Suggestion', null, body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Event suggestion failed:', error)
    return NextResponse.json({ error: 'Failed to submit event suggestion' }, { status: 500 })
  }
})
