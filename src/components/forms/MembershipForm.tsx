'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MembershipSchema } from '@/lib/schemas'
import { FormField } from '@/components/ui/FormField'
import { FormSuccess } from '@/components/ui/FormSuccess'

type FormData = z.input<typeof MembershipSchema>

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

export function MembershipForm() {
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
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(MembershipSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  })

  const onSubmit = async (data: FormData) => {
    if (rateLimitUntil !== null && Date.now() < rateLimitUntil) return
    setSubmitWarning(null)
    setSubmitError(null)
    try {
      const res = await fetch('/api/applications/membership', {
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
        message="Every application is reviewed personally. If there's alignment, you'll hear from us within a few days. In the meantime — follow what we're building."
      />
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      <SectionHeader label="About You" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField
          label="Full Name"
          name="fullName"
          placeholder="Your full name"
          required
          registration={register('fullName')}
          error={errors.fullName?.message}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          registration={register('email')}
          error={errors.email?.message}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField
          label="I am a..."
          name="role"
          type="select"
          options={['Founder', 'Investor', 'Operator', 'Ecosystem Builder', 'Academic', 'Partner']}
          required
          value={watch('role') || ''}
          onValueChange={(v) => setValue('role', v, { shouldValidate: true })}
          allowOther
          error={errors.role?.message}
        />
        <FormField
          label="Company / Organisation"
          name="company"
          placeholder="Where do you work?"
          registration={register('company')}
          error={errors.company?.message}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField
          label="City"
          name="location"
          placeholder="Where are you based?"
          required
          registration={register('location')}
          error={errors.location?.message}
        />
        <FormField
          label="LinkedIn URL"
          name="linkedIn"
          type="url"
          placeholder="linkedin.com/in/yourname"
          registration={register('linkedIn')}
          error={errors.linkedIn?.message}
        />
      </div>

      <SectionHeader label="Your Interests" />

      <Controller
        name="category"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <FormField
            label="What are you interested in? (select all that apply)"
            name="category"
            type="checkbox-group"
            options={['Founder', 'Investor', 'Tech Pro', 'Ecosystem Builder', 'Sponsor', 'Partner', 'Advisor']}
            value={field.value ?? []}
            onArrayChange={(v) => field.onChange(v)}
            error={errors.category?.message}
          />
        )}
      />

      <FormField
        label="What are you building or working on?"
        name="whatTheyNeed"
        type="textarea"
        placeholder="Tell us what you're focused on right now."
        registration={register('whatTheyNeed')}
        error={errors.whatTheyNeed?.message}
      />

      <FormField
        label="What do you bring to the community?"
        name="whatTheyOffer"
        type="textarea"
        placeholder="Skills, expertise, connections — what could you offer others?"
        registration={register('whatTheyOffer')}
        error={errors.whatTheyOffer?.message}
      />

      <SectionHeader label="Connection" />

      <FormField
        label="Why SAGIE?"
        name="howTheyKnowSagie"
        type="textarea"
        placeholder="What does this community mean to you — or what are you hoping it will mean?"
        registration={register('howTheyKnowSagie')}
        error={errors.howTheyKnowSagie?.message}
      />

      <FormField
        label="How did you hear about us?"
        name="referral"
        placeholder="Name, event, social..."
        registration={register('referral')}
        error={errors.referral?.message}
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
