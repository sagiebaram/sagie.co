import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'

const SOLUTIONS_DB_ID = 'f13af2979d1d455d960fdd962721401d'

export async function POST(request: Request) {
  try {
    const { fullName, email, category, bio, servicesOffered, website, memberStatus } = await request.json()

    await notion.pages.create({
      parent: { database_id: SOLUTIONS_DB_ID },
      properties: {
        'Provider Name': { title: [{ text: { content: fullName } }] },
        Email: { email },
        Category: { select: { name: category || 'General' } },
        Bio: { rich_text: [{ text: { content: bio } }] },
        'Services Offered': { rich_text: [{ text: { content: servicesOffered } }] },
        ...(website ? { Website: { url: website } } : {}),
        Status: { select: { name: 'Pending Vetting' } },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Solutions application failed:', error)
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 })
  }
}
