import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'

const RESOURCES_DB_ID = '1756dccaddfc4f78864a4ebea15ef2d4'

export async function POST(request: Request) {
  try {
    const { name, url } = await request.json()

    if (!name || !url) {
      return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 })
    }

    await notion.pages.create({
      parent: { database_id: RESOURCES_DB_ID },
      properties: {
        Name: { title: [{ text: { content: name } }] },
        URL: { url },
        Status: { select: { name: 'Pending Review' } },
        Source: { select: { name: 'Community' } },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to submit resource:', error)
    return NextResponse.json({ error: 'Failed to submit resource' }, { status: 500 })
  }
}
