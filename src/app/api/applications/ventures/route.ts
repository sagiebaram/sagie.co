import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'

const DEAL_PIPELINE_DB_ID = process.env.NOTION_DEAL_PIPELINE_DB_ID ?? ''

export async function POST(request: Request) {
  try {
    const { fullName, email, companyName, building, stage, whySagie, website } = await request.json()

    const notes = `${building}\n\nWhy SAGIE Ventures: ${whySagie}`

    await notion.pages.create({
      parent: { database_id: DEAL_PIPELINE_DB_ID },
      properties: {
        Name: { title: [{ text: { content: companyName } }] },
        Email: { email },
        'Contact Name': { rich_text: [{ text: { content: fullName } }] },
        Stage: { select: { name: stage } },
        Description: { rich_text: [{ text: { content: notes } }] },
        Source: { select: { name: 'Website Application' } },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ventures application failed:', error)
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 })
  }
}
