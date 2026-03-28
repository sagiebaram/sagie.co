import { revalidateTag } from 'next/cache'
import { env } from '@/env/server'

const ALL_TAGS = [
  'notion:blog',
  'notion:events',
  'notion:resources',
  'notion:solutions',
  'notion:members',
  'notion:chapters',
]

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!env.REVALIDATE_SECRET || body.secret !== env.REVALIDATE_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tags: string[] = body.tags?.length ? body.tags : ALL_TAGS

    for (const tag of tags) {
      revalidateTag(tag, 'max')
    }

    return Response.json({ revalidated: true, tags, now: Date.now() })
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }
}
