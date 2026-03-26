import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'

const DEAL_PIPELINE_DB_ID = process.env.NOTION_DEAL_PIPELINE_DB_ID ?? ''

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const answers = body.form_response?.answers ?? []

    const name = answers[0]?.text ?? answers[0]?.value ?? ''
    const email = answers[1]?.email ?? answers[1]?.text ?? answers[1]?.value ?? ''
    const company = answers[2]?.text ?? answers[2]?.value ?? ''
    const description = answers[3]?.text ?? answers[3]?.value ?? ''

    await notion.pages.create({
      parent: { database_id: DEAL_PIPELINE_DB_ID },
      properties: {
        Name: { title: [{ text: { content: company || name } }] },
        Email: { email },
        'Contact Name': { rich_text: [{ text: { content: name } }] },
        Description: { rich_text: [{ text: { content: description } }] },
        Source: { select: { name: 'Website Application' } },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ventures application failed:', error)
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 })
  }
}
