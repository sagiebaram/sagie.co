import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'

const MEMBER_DB_ID = '08ec39a6-865f-4938-bb4d-44f86cd1e967'

export async function POST(request: Request) {
  try {
    const { fullName, email, city, whyCity, background, chapterVision, linkedIn } = await request.json()

    const notes = `Chapter Lead Application — ${city}\n\nWhy this city: ${whyCity}\n\nBackground: ${background}\n\nChapter vision: ${chapterVision}`

    await notion.pages.create({
      parent: { database_id: MEMBER_DB_ID },
      properties: {
        'Full Name': { title: [{ text: { content: fullName } }] },
        Email: { email },
        Notes: { rich_text: [{ text: { content: notes } }] },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Chapter application failed:', error)
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 })
  }
}
