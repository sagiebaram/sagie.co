import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'

const EVENT_TRACKER_DB_ID = '89c65fc6665a49c8b1af382a3daef4d3'

export async function POST(request: Request) {
  try {
    const { eventName, eventType, proposedDate, description, yourName, yourEmail } = await request.json()

    const descriptionBlocks = []
    if (description) {
      descriptionBlocks.push({ text: { content: description + '\n\n' } })
    }
    if (proposedDate) {
      descriptionBlocks.push({ text: { content: `Proposed Date: ${proposedDate}\n` }, annotations: { bold: true } })
    }
    if (yourName) {
      descriptionBlocks.push({ text: { content: `Submitted By: ${yourName} (${yourEmail})` }, annotations: { bold: true } })
    }

    await notion.pages.create({
      parent: { database_id: EVENT_TRACKER_DB_ID },
      properties: {
        'Event Name': { title: [{ text: { content: eventName } }] },
        ...(descriptionBlocks.length > 0 ? { Description: { rich_text: descriptionBlocks } } : {}),
        Status: { select: { name: 'Concept' } },
        ...(eventType ? { Type: { select: { name: eventType } } } : {}),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Event suggestion failed:', error)
    return NextResponse.json({ error: 'Failed to submit event suggestion' }, { status: 500 })
  }
}
