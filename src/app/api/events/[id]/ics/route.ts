import { notion } from '@/lib/notion'
import { mapEvent } from '@/lib/events'
import { buildIcsContent } from '@/lib/calendar'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const page = await notion.pages.retrieve({ page_id: id })
    const event = mapEvent(page)
    const icsContent = buildIcsContent(event)

    const filename = event.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    return new Response(icsContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}.ics"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return new Response('Event not found', { status: 404 })
  }
}
