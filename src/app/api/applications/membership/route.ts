import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'

const MEMBER_DB_ID = 'ec753df1-ca8d-46d7-8c74-9b6f64cea2d5'

const ROLE_MAP: Record<string, string> = {
  Founder: 'Founder',
  Investor: 'Investor',
  Operator: 'Tech Pro',
  'Ecosystem Builder': 'Ecosystem Builder',
  Academic: 'Advisor',
  Partner: 'Partner',
}

function mapLocation(city: string): string {
  const lower = city.toLowerCase()
  if (lower.includes('miami')) return 'Miami'
  if (lower.includes('tel aviv') || lower.includes('israel')) return 'Israel'
  if (lower.includes('us') || lower.includes('usa') || lower.includes('united states') ||
      lower.includes('new york') || lower.includes('los angeles') || lower.includes('san francisco') ||
      lower.includes('chicago') || lower.includes('boston') || lower.includes('austin') ||
      lower.includes('seattle') || lower.includes('denver') || lower.includes('atlanta')) return 'Other US'
  return 'International'
}

export async function POST(request: Request) {
  try {
    const { fullName, email, city, role, building, whySagie, linkedIn, referral } = await request.json()

    const categoryName = ROLE_MAP[role] || role || 'Founder'
    const notes = [building, whySagie].filter(Boolean).join('\n\n')

    await notion.pages.create({
      parent: { database_id: MEMBER_DB_ID },
      properties: {
        'Full Name': { title: [{ text: { content: fullName } }] },
        Email: { email },
        Category: { multi_select: [{ name: categoryName }] },
        Location: { select: { name: mapLocation(city || '') } },
        Tier: { select: { name: 'Explorer' } },
        Status: { select: { name: 'New' } },
        ...(referral ? { 'How They Know Sagie': { rich_text: [{ text: { content: referral } }] } } : {}),
        ...(linkedIn ? { 'LinkedIn URL': { url: linkedIn } } : {}),
        ...(notes ? { Notes: { rich_text: [{ text: { content: notes } }] } } : {}),
        ...(role ? { Role: { rich_text: [{ text: { content: role } }] } } : {}),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Membership application failed:', error)
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 })
  }
}
