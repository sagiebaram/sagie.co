import { NextResponse } from 'next/server'
import { z } from 'zod'
import { notion } from '@/lib/notion'
import { env } from '@/env/server'
import { withValidation } from '@/lib/validation'
import { notionWrite } from '@/lib/notion-monitor'

const ResourceSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  url: z.string().url(),
})

export const POST = withValidation(ResourceSchema, async (_req: Request, body) => {
  try {
    await notionWrite(() => notion.pages.create({
      parent: { database_id: env.NOTION_RESOURCES_DB_ID },
      properties: {
        'Resource Name': { title: [{ text: { content: body.name } }] },
        URL: { url: body.url },
        Status: { select: { name: 'Pending Review' } },
        Source: { select: { name: 'Community' } },
      },
    }))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to submit resource:', error)
    return NextResponse.json({ error: 'Failed to submit resource' }, { status: 500 })
  }
})
