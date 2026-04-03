'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormField } from '@/components/ui/FormField'
import { FormSuccess } from '@/components/ui/FormSuccess'
import { EventSuggestionSchema } from '@/lib/schemas'

type FormData = z.infer<typeof EventSuggestionSchema>

export function SuggestEventForm() {
  const trapRef = useRef('')
  const [loadTime] = useState(() => Date.now())
  const [success, setSuccess] = useState(false)
  const [submitWarning, setSubmitWarning] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isRateLimited, setIsRateLimited] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(EventSuggestionSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  })

  const onSubmit = async (data: FormData) => {
    setSubmitWarning(null)
    setSubmitError(null)
    try {
      const res = await fetch('/api/suggest-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, _trap: trapRef.current, _t: loadTime }),
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
        headline="We got your idea."
        message="If it fits the ecosystem, we'll reach out to make it happen."
      />
    )
  }

  return (
    <form onSubmit={(e) => handleSubmit(onSubmit)(e)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <FormField label="Event Name" name="eventName" placeholder="What's the event called?" required registration={register('eventName')} error={errors.eventName?.message} />
      <FormField label="Your Name" name="suggestedBy" placeholder="Your full name" required registration={register('suggestedBy')} error={errors.suggestedBy?.message} />
      <FormField label="Description" name="description" type="textarea" placeholder="What's the idea?" required registration={register('description')} error={errors.description?.message} />
      <input type="text" name="_trap" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} onChange={e => { trapRef.current = e.target.value }} />
      <input type="hidden" name="_t" value={loadTime.toString()} />
      {submitWarning && (
        <span style={{ fontSize: '11px', color: '#B8860B', lineHeight: '1.5' }}>
          {submitWarning}
        </span>
      )}
      {submitError && (
        <span role="alert" aria-live="assertive" style={{ fontSize: '13px', color: '#c0392b', lineHeight: '1.5' }}>
          {submitError}
        </span>
      )}
      <button
        type="submit"
        disabled={isSubmitting || isRateLimited}
        style={{
          background: isSubmitting ? 'var(--border-default)' : 'var(--silver)',
          color: 'var(--bg)',
          fontFamily: 'var(--font-display)',
          fontSize: '14px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          padding: '14px 32px',
          border: 'none',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          alignSelf: 'flex-start',
        }}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Suggestion →'}
      </button>
    </form>
  )
}
