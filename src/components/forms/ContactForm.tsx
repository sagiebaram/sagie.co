'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ContactSchema } from '@/lib/schemas'
import { FormField } from '@/components/ui/FormField'
import { FormSuccess } from '@/components/ui/FormSuccess'
import { PrivacyConsent } from '@/components/ui/PrivacyConsent'

type FormData = z.input<typeof ContactSchema>

export function ContactForm() {
  const trapRef = useRef('')
  const loadTime = useRef(0)
  useEffect(() => { loadTime.current = Date.now() }, [])
  const [success, setSuccess] = useState(false)
  const [submitWarning, setSubmitWarning] = useState<string | null>(null)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [privacyError, setPrivacyError] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(ContactSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  })

  const onSubmit = async (data: FormData) => {
    if (isRateLimited) return
    if (!privacyConsent) { setPrivacyError(true); return }
    setPrivacyError(false)
    setSubmitWarning(null)
    setSubmitError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, _trap: trapRef.current, _t: loadTime.current }),
      })

      if (res.status === 429) {
        const retryAfterRaw = res.headers.get('Retry-After')
        const waitSeconds = retryAfterRaw ? parseInt(retryAfterRaw, 10) : 30
        const safeWait = isNaN(waitSeconds) ? 30 : waitSeconds
        setSubmitWarning("You've submitted several times recently. Please wait a few minutes before trying again.")
        setIsRateLimited(true)
        setTimeout(() => setIsRateLimited(false), safeWait * 1000)
        return
      }

      if (!res.ok) {
        try {
          const body = await res.json()
          if (body.fieldErrors && typeof body.fieldErrors === 'object') {
            const firstError = Object.values(body.fieldErrors).flat()[0]
            setSubmitError(typeof firstError === 'string' ? firstError : 'Please check your input and try again.')
          } else if (body.error && typeof body.error === 'string') {
            setSubmitError(body.error)
          } else {
            setSubmitError('Something went wrong. Please try again.')
          }
        } catch {
          setSubmitError('Something went wrong. Please try again.')
        }
        return
      }

      setSuccess(true)
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    }
  }

  if (success) {
    return (
      <FormSuccess
        headline="Message sent."
        message="We read every message personally. If your inquiry needs a response, expect to hear from us within a few business days."
      />
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField
          label="Name"
          name="name"
          placeholder="Your name"
          required
          autoComplete="name"
          registration={register('name')}
          error={errors.name?.message}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          autoComplete="email"
          registration={register('email')}
          error={errors.email?.message}
        />
      </div>

      <FormField
        label="Subject"
        name="subject"
        type="select"
        options={['General Inquiry', 'Partnership', 'Speaking', 'Media', 'Other']}
        required
        value={watch('subject') || ''}
        onValueChange={(v) => setValue('subject', v as FormData['subject'], { shouldValidate: true })}
        error={errors.subject?.message}
      />

      <FormField
        label="Message"
        name="message"
        type="textarea"
        placeholder="What would you like to talk about?"
        required
        registration={register('message')}
        error={errors.message?.message}
      />

      <input
        type="text"
        name="_trap"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        style={{ display: 'none' }}
        onChange={e => { trapRef.current = e.target.value }}
      />

      <PrivacyConsent checked={privacyConsent} onChange={(v) => { setPrivacyConsent(v); if (v) setPrivacyError(false) }} error={privacyError} />

      {submitWarning && (
        <span style={{ fontSize: '11px', color: 'var(--color-warning)', lineHeight: '1.5' }}>
          {submitWarning}
        </span>
      )}
      {submitError && (
        <span style={{ fontSize: '13px', color: 'var(--color-error)', lineHeight: '1.5' }}>{submitError}</span>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isRateLimited}
        style={{
          background: isSubmitting ? 'var(--border-default)' : 'var(--silver)',
          color: 'var(--bg)',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          padding: '14px 32px',
          border: 'none',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          alignSelf: 'flex-start',
        }}
      >
        {isSubmitting ? 'Sending...' : 'Send Message \u2192'}
      </button>
    </form>
  )
}
