import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'
import { env } from '@/env/server'
import { withValidation } from '@/lib/validation'
import { MembershipSchema } from '@/lib/schemas'
import { notionWrite } from '@/lib/notion-monitor'
import { sendEmails } from '@/lib/email'
import { sanitizeRecord } from '@/lib/sanitize'

function mapLocation(city: string): string {
  const lower = city.toLowerCase()
  if (lower.includes('miami')) return 'Miami'
  if (lower.includes('tel aviv') || lower.includes('israel')) return 'Israel'
  if (
    lower.includes('us') ||
    lower.includes('usa') ||
    lower.includes('united states') ||
    lower.includes('new york') ||
    lower.includes('los angeles') ||
    lower.includes('san francisco') ||
    lower.includes('chicago') ||
    lower.includes('boston') ||
    lower.includes('austin') ||
    lower.includes('seattle') ||
    lower.includes('denver') ||
    lower.includes('atlanta')
  ) {
    return 'Other US'
  }
  return 'International'
}

// Membership form is a 6-step wizard (see .planning/ADR-MEMBERSHIP-WIZARD.md).
// The shape below matches MembershipSchema in src/lib/schemas.ts exactly.
export const POST = withValidation(MembershipSchema, async (_req: Request, rawBody) => {
  try {
    const body = sanitizeRecord(rawBody)

    await notionWrite(() =>
      notion.pages.create({
        parent: { database_id: env.NOTION_MEMBER_DB_ID },
        properties: {
          'Full Name': { title: [{ text: { content: body.fullName } }] },
          Email: { email: body.email },
          Location: { select: { name: mapLocation(body.city || '') } },
          ...(body.country ? { Country: { select: { name: body.country } } } : {}),
          Phone: { phone_number: body.phone },
          Tier: { select: { name: body.tier || 'Explorer' } },
          Status: { select: { name: 'New' } },
          'Application Status': { select: { name: 'Pending Review' } },
          'Application Source': { select: { name: 'Website Form' } },
          ...(body.linkedIn
            ? { 'LinkedIn URL': { url: body.linkedIn } }
            : {}),
          'Work Style': {
            multi_select: body.workStyle.map((w: string) => ({ name: w })),
          },
          'Identity Tags': {
            multi_select: body.identityTags.map((t: string) => ({ name: t })),
          },
          'Need Tags': {
            multi_select: body.needTags.map((t: string) => ({ name: t })),
          },
          ...(body.companyName
            ? { 'Company Name': { rich_text: [{ text: { content: body.companyName } }] } }
            : {}),
          ...(body.organizationName
            ? { 'Organization Name': { rich_text: [{ text: { content: body.organizationName } }] } }
            : {}),
          ...(body.freelancerDescription
            ? {
                'Freelancer Description': {
                  rich_text: [{ text: { content: body.freelancerDescription } }],
                },
              }
            : {}),
          ...(body.serviceProviderDetail
            ? {
                'Service Provider Detail': {
                  rich_text: [{ text: { content: body.serviceProviderDetail } }],
                },
              }
            : {}),
          'What They Need': { rich_text: [{ text: { content: body.whatTheyNeed } }] },
          'Community Expectation': {
            rich_text: [{ text: { content: body.communityExpectation } }],
          },
          'Community Meaning': {
            rich_text: [{ text: { content: body.communityMeaning } }],
          },
          'How They Know Sagie': {
            rich_text: [{ text: { content: body.howTheyKnowSagie } }],
          },
          'Referral Source': { select: { name: body.referralSource } },
          ...(body.referralName
            ? { 'Referral Name': { rich_text: [{ text: { content: body.referralName } }] } }
            : {}),
          'Newsletter Consent': { checkbox: body.newsletterConsent ?? false },
        },
      }),
    )

    void sendEmails('Membership Application', body.email, body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Membership application failed:', error)
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 })
  }
})
