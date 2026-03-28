import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'

const BLOG_POSTS_DB_ID = 'e949d62be0de4681b62cebe876a50ece'

export async function POST(request: Request) {
  try {
    const { postTitle, category, yourName, yourEmail, content, url } = await request.json()

    const excerpt = content.length > 150 ? content.slice(0, 150) + '...' : content

    await notion.pages.create({
      parent: { database_id: BLOG_POSTS_DB_ID },
      properties: {
        Title: { title: [{ text: { content: postTitle } }] },
        ...(category ? { Category: { select: { name: category } } } : {}),
        Author: { rich_text: [{ text: { content: yourName } }] },
        Excerpt: { rich_text: [{ text: { content: excerpt } }] },
        Status: { select: { name: 'Review' } },
        'Author Type': { select: { name: 'Community Member' } },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Blog post submission failed:', error)
    return NextResponse.json({ error: 'Failed to submit post' }, { status: 500 })
  }
}
