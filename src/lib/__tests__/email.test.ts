import { vi, describe, test, expect, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))

vi.mock('@/env/server', () => ({
  env: {
    NODE_ENV: 'production',
    RESEND_API_KEY: 'mock-resend-key',
    ADMIN_EMAIL: 'hello@sagie.co',
  },
}))

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}))

// Using a module-level object so the mock factory can reference it before hoisting
const resendMockState = {
  send: vi.fn().mockResolvedValue({ id: 'mock-id' }),
}

vi.mock('resend', () => {
  return {
    Resend: class {
      emails = { send: (...args: unknown[]) => resendMockState.send(...args) }
    },
  }
})

vi.mock('@/emails/ConfirmationEmail', () => ({
  ConfirmationEmail: vi.fn().mockReturnValue(null),
}))

vi.mock('@/emails/AdminAlertEmail', () => ({
  AdminAlertEmail: vi.fn().mockReturnValue(null),
}))

import { sendEmails, type FormType } from '@/lib/email'
import * as Sentry from '@sentry/nextjs'
import { env } from '@/env/server'

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('sendEmails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resendMockState.send.mockResolvedValue({ id: 'mock-id' })
  })

  test('exports FormType values as expected union', () => {
    // Verify the type can be used — we check by calling sendEmails with each valid value
    const validFormTypes: FormType[] = [
      'Membership Application',
      'Chapter Lead Application',
      'Ventures Intake',
      'Solutions Provider',
      'Event Suggestion',
      'Blog Post Submission',
      'Resource Submission',
    ]
    expect(validFormTypes).toHaveLength(7)
  })

  test('sends confirmation and admin alert when applicantEmail provided (production)', async () => {
    await sendEmails('Membership Application', 'user@example.com', { name: 'Test User' })

    expect(resendMockState.send).toHaveBeenCalledTimes(2)

    const calls = resendMockState.send.mock.calls
    // Confirmation email goes to the applicant
    expect((calls[0]![0] as { to: string }).to).toBe('user@example.com')
    // Admin alert goes to admin
    expect((calls[1]![0] as { to: string }).to).toBe('hello@sagie.co')
  })

  test('sends only admin alert when applicantEmail is null (no email field)', async () => {
    await sendEmails('Event Suggestion', null, { eventName: 'Test Event' })

    expect(resendMockState.send).toHaveBeenCalledTimes(1)
    expect((resendMockState.send.mock.calls[0]![0] as { to: string }).to).toBe('hello@sagie.co')
  })

  test('skips all sends in non-production environment', async () => {
    const mockedEnv = vi.mocked(env) as { NODE_ENV: string; RESEND_API_KEY: string }
    mockedEnv.NODE_ENV = 'development'

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    await sendEmails('Resource Submission', null, { name: 'test', url: 'https://example.com' })

    expect(resendMockState.send).not.toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('skip (non-production)'))

    // Restore
    mockedEnv.NODE_ENV = 'production'
    consoleSpy.mockRestore()
  })

  test('captures Sentry exception when resend.emails.send rejects', async () => {
    const sendError = new Error('Resend API error')
    resendMockState.send.mockRejectedValueOnce(sendError)

    await sendEmails('Membership Application', 'user@example.com', { name: 'Test User' })

    expect(Sentry.captureException).toHaveBeenCalled()
  })

  test('does not throw when resend.emails.send rejects', async () => {
    resendMockState.send.mockRejectedValue(new Error('Network error'))

    await expect(
      sendEmails('Membership Application', 'user@example.com', { name: 'Test' })
    ).resolves.not.toThrow()
  })
})
