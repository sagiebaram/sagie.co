import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'
import { env } from '@/env/server'
import { withValidation } from '@/lib/validation'
import { SubmitPostSchema } from '@/lib/schemas'
import { notionWrite } from '@/lib/notion-monitor'
import { sendEmails } from '@/lib/email'

export const POST = withValidation(SubmitPostSchema, async (_req: Request, body) => {
  try {
    const excerpt = body.content.length > 150 ? body.content.slice(0, 150) + '...' : body.content

    await notionWrite(() => notion.pages.create({
      parent: { database_id: env.NOTION_BLOG_DB_ID },
      properties: {
        Title: { title: [{ text: { content: body.postTitle } }] },
        Category: { select: { name: body.category } },
        Author: { rich_text: [{ text: { content: body.yourName } }] },
        Excerpt: { rich_text: [{ text: { content: excerpt } }] },
        Status: { select: { name: 'Review' } },
        'Author Type': { select: { name: 'Community Member' } },
      },
    }))

    void sendEmails('Blog Post Submission', body.yourEmail, body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Blog post submission failed:', error)
    return NextResponse.json({ error: 'Failed to submit post' }, { status: 500 })
  }
})
