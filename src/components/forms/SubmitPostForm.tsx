'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormField } from '@/components/ui/FormField'
import { FormSuccess } from '@/components/ui/FormSuccess'
import { PrivacyConsent } from '@/components/ui/PrivacyConsent'
import { SubmitPostSchema } from '@/lib/schemas'

type FormData = z.infer<typeof SubmitPostSchema>

export function SubmitPostForm() {
  const trapRef = useRef('')
  const loadTime = useRef(0)
  useEffect(() => { loadTime.current = Date.now() }, [])
  const [success, setSuccess] = useState(false)
  const [submitWarning, setSubmitWarning] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [privacyError, setPrivacyError] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(SubmitPostSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  })

  const onSubmit = async (data: FormData) => {
    if (!privacyConsent) { setPrivacyError(true); return }
    setPrivacyError(false)
    setSubmitWarning(null)
    setSubmitError(null)
    try {
      const res = await fetch('/api/submit-post', {
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
        headline="Post submitted."
        message="We'll review it and be in touch. If it's a good fit for the ecosystem, it goes live."
      />
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Post Title" name="postTitle" placeholder="Title of your post" required registration={register('postTitle')} error={errors.postTitle?.message} />
        <FormField
          label="Category"
          name="category"
          type="select"
          options={['Ecosystem', 'Spotlight', 'Thought Leadership', 'Event Recap']}
          required
          value={watch('category') || ''}
          onValueChange={(v) => setValue('category', v, { shouldValidate: true })}
          error={errors.category?.message}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Your Name" name="yourName" placeholder="Your full name" required registration={register('yourName')} error={errors.yourName?.message} />
        <FormField label="Your Email" name="yourEmail" type="email" placeholder="your@email.com" required registration={register('yourEmail')} error={errors.yourEmail?.message} />
      </div>
      <FormField label="Write your post" name="content" type="textarea" placeholder="Share your perspective with the ecosystem." required registration={register('content')} error={errors.content?.message} />
      <FormField label="LinkedIn or website URL" name="url" type="url" placeholder="linkedin.com/in/yourname" registration={register('url')} error={errors.url?.message} />
      <PrivacyConsent checked={privacyConsent} onChange={(v) => { setPrivacyConsent(v); if (v) setPrivacyError(false) }} error={privacyError} />
      <input type="text" name="_trap" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} onChange={e => { trapRef.current = e.target.value }} />
      <input type="hidden" name="_t" value={loadTime.current.toString()} />
      {submitWarning && (
        <span style={{ fontSize: '11px', color: 'var(--color-warning)', lineHeight: '1.5' }}>
          {submitWarning}
        </span>
      )}
      {submitError && (
        <span style={{ fontSize: '13px', color: 'var(--color-error)', lineHeight: '1.5' }}>
          {submitError}
        </span>
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
        {isSubmitting ? 'Submitting...' : 'Submit Post →'}
      </button>
    </form>
  )
}
