import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'

const MEMBER_DB_ID = '08ec39a6-865f-4938-bb4d-44f86cd1e967'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const answers = body.form_response?.answers ?? []

    const name = answers[0]?.text ?? answers[0]?.value ?? ''
    const email = answers[1]?.email ?? answers[1]?.text ?? answers[1]?.value ?? ''
    const role = answers[2]?.text ?? answers[2]?.choice?.label ?? answers[2]?.value ?? ''

    await notion.pages.create({
      parent: { database_id: MEMBER_DB_ID },
      properties: {
        'Full Name': { title: [{ text: { content: name } }] },
        Email: { email },
        Category: { select: { name: role || 'General' } },
        Tier: { select: { name: 'Explorer' } },
        Source: { select: { name: 'Website Application' } },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Membership application failed:', error)
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 })
  }
}
