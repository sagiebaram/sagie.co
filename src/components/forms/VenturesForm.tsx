'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { VenturesSchema } from '@/lib/schemas'
import { FormField } from '@/components/ui/FormField'
import { FormSuccess } from '@/components/ui/FormSuccess'

type FormData = z.infer<typeof VenturesSchema>

function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{
      borderTop: '0.5px solid var(--border-default)',
      paddingTop: '16px',
      marginTop: '4px',
    }}>
      <span style={{
        fontSize: '9px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-body)',
      }}>
        {label}
      </span>
    </div>
  )
}

export function VenturesForm() {
  const trapRef = useRef('')
  const loadTime = useRef(Date.now())
  const [success, setSuccess] = useState(false)
  const [submitWarning, setSubmitWarning] = useState<string | null>(null)
  const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!rateLimitUntil) return
    const remaining = rateLimitUntil - Date.now()
    if (remaining <= 0) { setRateLimitUntil(null); return }
    const timer = setTimeout(() => setRateLimitUntil(null), remaining)
    return () => clearTimeout(timer)
  }, [rateLimitUntil])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(VenturesSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  })

  const onSubmit = async (data: FormData) => {
    if (rateLimitUntil !== null && Date.now() < rateLimitUntil) return
    setSubmitWarning(null)
    setSubmitError(null)
    try {
      const res = await fetch('/api/applications/ventures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, _trap: trapRef.current, _t: loadTime.current }),
      })

      if (res.status === 429) {
        const retryAfterRaw = res.headers.get('Retry-After')
        const waitSeconds = retryAfterRaw ? parseInt(retryAfterRaw, 10) : 30
        const safeWait = isNaN(waitSeconds) ? 30 : waitSeconds
        setSubmitWarning("You've submitted several times recently. Please wait a few minutes before trying again.")
        setRateLimitUntil(Date.now() + safeWait * 1000)
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
        headline="We'll be in touch."
        message="We review every application. If there's alignment with the thesis and the ecosystem, we'll start a conversation."
      />
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      <SectionHeader label="Company" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField
          label="Company Name"
          name="companyName"
          placeholder="Your company or project name"
          required
          registration={register('companyName')}
          error={errors.companyName?.message}
        />
        <FormField
          label="Founder Name"
          name="founderName"
          placeholder="Your full name"
          required
          registration={register('founderName')}
          error={errors.founderName?.message}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          registration={register('email')}
          error={errors.email?.message}
        />
        <FormField
          label="Website"
          name="website"
          type="url"
          placeholder="https://yoursite.com"
          registration={register('website')}
          error={errors.website?.message}
        />
      </div>

      <FormField
        label="LinkedIn URL"
        name="linkedIn"
        type="url"
        placeholder="https://linkedin.com/in/yourname"
        registration={register('linkedIn')}
        error={errors.linkedIn?.message}
      />

      <SectionHeader label="Details" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField
          label="Sector"
          name="sector"
          type="select"
          options={['Fintech', 'AI / ML', 'SaaS', 'Health Tech', 'EdTech', 'Impact / Social', 'Deep Tech', 'Other']}
          registration={register('sector')}
          error={errors.sector?.message}
        />
        <FormField
          label="Stage"
          name="stage"
          type="select"
          options={['Pre-Seed', 'Seed', 'Series A', 'Series B+', 'Revenue-Stage']}
          registration={register('stage')}
          error={errors.stage?.message}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField
          label="Raise Amount"
          name="raiseAmount"
          placeholder="e.g. $500K, $2M"
          registration={register('raiseAmount')}
          error={errors.raiseAmount?.message}
        />
        <FormField
          label="Pitch Deck URL"
          name="pitchDeckUrl"
          type="url"
          placeholder="https://deck.link/yourpitch"
          registration={register('pitchDeckUrl')}
          error={errors.pitchDeckUrl?.message}
        />
      </div>

      <FormField
        label="One-line description"
        name="oneLineDescription"
        placeholder="Give us the elevator pitch — one sentence."
        required
        registration={register('oneLineDescription')}
        error={errors.oneLineDescription?.message}
      />

      <SectionHeader label="About SAGIE" />

      <FormField
        label="Why SAGIE Ventures?"
        name="whySAGIE"
        type="textarea"
        placeholder="What kind of alignment are you looking for?"
        registration={register('whySAGIE')}
        error={errors.whySAGIE?.message}
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

      {submitWarning && (
        <span style={{ fontSize: '11px', color: '#B8860B', lineHeight: '1.5' }}>
          {submitWarning}
        </span>
      )}
      {submitError && (
        <span style={{ fontSize: '13px', color: '#c0392b', lineHeight: '1.5' }}>{submitError}</span>
      )}

      <button
        type="submit"
        disabled={isSubmitting || (rateLimitUntil !== null && Date.now() < rateLimitUntil)}
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
        {isSubmitting ? 'Submitting...' : 'Submit Application →'}
      </button>
    </form>
  )
}
