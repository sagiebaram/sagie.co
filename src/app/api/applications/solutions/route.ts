import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'

const SOLUTIONS_DB_ID = 'f13af2979d1d455d960fdd962721401d'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const answers = body.form_response?.answers ?? []

    const name = answers[0]?.text ?? answers[0]?.value ?? ''
    const email = answers[1]?.email ?? answers[1]?.text ?? answers[1]?.value ?? ''
    const category = answers[2]?.text ?? answers[2]?.choice?.label ?? answers[2]?.value ?? ''
    const bio = answers[3]?.text ?? answers[3]?.value ?? ''

    await notion.pages.create({
      parent: { database_id: SOLUTIONS_DB_ID },
      properties: {
        'Provider Name': { title: [{ text: { content: name } }] },
        Email: { email },
        Category: { select: { name: category || 'General' } },
        Bio: { rich_text: [{ text: { content: bio } }] },
        Status: { select: { name: 'Pending Vetting' } },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Solutions application failed:', error)
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 })
  }
}
