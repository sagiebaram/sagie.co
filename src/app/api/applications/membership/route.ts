import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'

const MEMBER_DB_ID = '08ec39a6-865f-4938-bb4d-44f86cd1e967'

export async function POST(request: Request) {
  try {
    const { fullName, email, city, role, building, whySagie, linkedIn, referral } = await request.json()

    await notion.pages.create({
      parent: { database_id: MEMBER_DB_ID },
      properties: {
        'Full Name': { title: [{ text: { content: fullName } }] },
        Email: { email },
        Location: { rich_text: [{ text: { content: city } }] },
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
