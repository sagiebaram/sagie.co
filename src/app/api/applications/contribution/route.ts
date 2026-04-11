import { NextResponse } from 'next/server'
import { withValidation } from '@/lib/validation'
import { ContributeSchema } from '@/lib/schemas'
import { sanitizeRecord } from '@/lib/sanitize'
import { writeContributionToNotion } from '@/lib/contributions'
import { sendEmails } from '@/lib/email'

/**
 * POST /api/applications/contribution
 *
 * Handles submissions from the /contribute form.
 * Route naming follows the existing `/api/applications/{type}` convention
 * (membership, chapter, solutions, ventures) — see Sprint 04-11 Track 2 spec.
 *
 * withValidation handles rate limiting, honeypot, form-load-time check, and
 * Zod parsing before the handler runs. On success the handler writes to
 * the Notion Contributions DB and fires confirmation + admin alert emails.
 */
export const POST = withValidation(ContributeSchema, async (_req: Request, rawBody) => {
  try {
    const body = sanitizeRecord(rawBody)

    try {
      await writeContributionToNotion({
        name: body.name,
        email: body.email,
        contributionTypes: body.contributionTypes,
        ...(body.description ? { description: body.description } : {}),
        availability: body.availability,
      })
    } catch (notionError) {
      // Matches the membership route's pattern: log and continue so the user
      // still gets their confirmation email. notionWrite() already reported
      // this to Sentry. See Sprint 04-11 spec §Known concerns.
      console.error('[contribution] Notion write failed:', notionError)
    }

    // sendEmails is intentionally fire-and-forget (no production await) to
    // keep the submit response snappy. Errors are captured inside sendEmails.
    void sendEmails('Contribution Submission', body.email, body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contribution submission failed:', error)
    return NextResponse.json(
      { error: 'Failed to process contribution' },
      { status: 500 }
    )
  }
})
