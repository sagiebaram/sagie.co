import 'server-only'
import { Resend } from 'resend'
import * as Sentry from '@sentry/nextjs'
import { env } from '@/env/server'
import { ConfirmationEmail } from '@/emails/ConfirmationEmail'
import { AdminAlertEmail } from '@/emails/AdminAlertEmail'

export type FormType =
  | 'Membership Application'
  | 'Chapter Lead Application'
  | 'Ventures Intake'
  | 'Solutions Provider'
  | 'Event Suggestion'
  | 'Blog Post Submission'
  | 'Resource Submission'
  | 'Contact Form'

const resend = new Resend(env.RESEND_API_KEY)

const FROM_ADDRESS = 'SAGIE <hello@sagie.co>'
const ADMIN_EMAIL = 'hello@sagie.co'

export async function sendEmails(
  formType: FormType,
  applicantEmail: string | null,
  submissionData: Record<string, unknown>
): Promise<void> {
  if (env.NODE_ENV !== 'production') {
    console.log(`[email] skip (non-production): ${formType}`)
    return
  }

  const subject = `SAGIE — ${formType} Received`

  const sends: Promise<void>[] = []

  if (applicantEmail !== null) {
    sends.push(
      resend.emails
        .send({
          from: FROM_ADDRESS,
          to: applicantEmail,
          subject,
          react: ConfirmationEmail({ formType }),
        })
        .then(() => undefined)
        .catch((err: unknown) => {
          Sentry.captureException(err, {
            tags: { service: 'resend', type: 'confirmation' },
          })
        })
    )
  }

  sends.push(
    resend.emails
      .send({
        from: FROM_ADDRESS,
        to: ADMIN_EMAIL,
        subject: `[ADMIN] ${subject}`,
        react: AdminAlertEmail({ formType, data: submissionData }),
      })
      .then(() => undefined)
      .catch((err: unknown) => {
        Sentry.captureException(err, {
          tags: { service: 'resend', type: 'admin_alert' },
        })
      })
  )

  await Promise.allSettled(sends)
}
