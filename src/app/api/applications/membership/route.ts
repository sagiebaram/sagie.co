import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'
import { env } from '@/env/server'
import { withValidation } from '@/lib/validation'
import { MembershipSchema } from '@/lib/schemas'
import { notionWrite } from '@/lib/notion-monitor'

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

export const POST = withValidation(MembershipSchema, async (_req: Request, body) => {
  try {
    const categoryNames = body.category?.length
      ? body.category.map((c: string) => ({ name: c }))
      : [{ name: ROLE_MAP[body.role] || body.role || 'Founder' }]

    await notionWrite(() => notion.pages.create({
      parent: { database_id: env.NOTION_MEMBER_DB_ID },
      properties: {
        'Full Name': { title: [{ text: { content: body.fullName } }] },
        Email: { email: body.email },
        Category: { multi_select: categoryNames },
        Location: { select: { name: mapLocation(body.location || '') } },
        Tier: { select: { name: body.tier || 'Explorer' } },
        Status: { select: { name: 'New' } },
        'Application Status': { select: { name: 'Pending Review' } },
        'Application Source': { select: { name: 'Website Form' } },
        ...(body.howTheyKnowSagie ? { 'How They Know Sagie': { rich_text: [{ text: { content: body.howTheyKnowSagie } }] } } : {}),
        ...(body.linkedIn ? { 'LinkedIn URL': { url: body.linkedIn } } : {}),
        ...(body.whatTheyNeed ? { 'What They Need': { rich_text: [{ text: { content: body.whatTheyNeed } }] } } : {}),
        ...(body.whatTheyOffer ? { 'What They Offer': { rich_text: [{ text: { content: body.whatTheyOffer } }] } } : {}),
        ...(body.role ? { Role: { rich_text: [{ text: { content: body.role } }] } } : {}),
        ...(body.company ? { Company: { rich_text: [{ text: { content: body.company } }] } } : {}),
        ...(body.referral ? { 'Referral': { rich_text: [{ text: { content: body.referral } }] } } : {}),
      },
    }))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Membership application failed:', error)
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 })
  }
})
