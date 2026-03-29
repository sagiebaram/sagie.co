'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormField } from '@/components/ui/FormField'
import { FormSuccess } from '@/components/ui/FormSuccess'
import { SolutionsSchema } from '@/lib/schemas'

type FormData = z.infer<typeof SolutionsSchema>

export function SolutionsForm() {
  const trapRef = useRef('')
  const loadTime = useRef(0)
  useEffect(() => { loadTime.current = Date.now() }, [])
  const [success, setSuccess] = useState(false)
  const [submitWarning, setSubmitWarning] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isRateLimited, setIsRateLimited] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(SolutionsSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  })

  const onSubmit = async (data: FormData) => {
    setSubmitWarning(null)
    setSubmitError(null)
    try {
      const res = await fetch('/api/applications/solutions', {
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
        headline="We'll review your application."
        message="Solutions providers are vetted before being listed. You'll hear from us within a week."
      />
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Your Name" name="providerName" placeholder="Your full name" required registration={register('providerName')} error={errors.providerName?.message} />
        <FormField label="Email" name="email" type="email" placeholder="your@email.com" required registration={register('email')} error={errors.email?.message} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="LinkedIn URL" name="linkedIn" type="url" placeholder="linkedin.com/in/yourname" registration={register('linkedIn')} error={errors.linkedIn?.message} />
        <FormField label="Location" name="location" placeholder="New York, NY" registration={register('location')} error={errors.location?.message} />
      </div>
      <FormField
        label="Service Category"
        name="category"
        type="select"
        options={['Operations & Systems', 'Strategy & Advisory', 'Technology & Product', 'Growth & Marketing', 'Finance & Legal', 'Talent & People']}
        required
        value={watch('category') || ''}
        onValueChange={(v) => setValue('category', v as 'Operations & Systems' | 'Strategy & Advisory' | 'Technology & Product' | 'Growth & Marketing' | 'Finance & Legal' | 'Talent & People', { shouldValidate: true })}
        error={errors.category?.message}
      />
      <FormField label="Tell us about your background" name="bio" type="textarea" placeholder="Your experience and expertise." required registration={register('bio')} error={errors.bio?.message} />
      <FormField label="What specific services do you offer?" name="servicesOffered" type="textarea" placeholder="Describe the services you provide." required registration={register('servicesOffered')} error={errors.servicesOffered?.message} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Portfolio URL" name="portfolioUrl" type="url" placeholder="yoursite.com" registration={register('portfolioUrl')} error={errors.portfolioUrl?.message} />
        <FormField label="Rate Range" name="rateRange" placeholder="$100-200/hr" registration={register('rateRange')} error={errors.rateRange?.message} />
      </div>
      <input type="text" name="_trap" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} onChange={e => { trapRef.current = e.target.value }} />
      <input type="hidden" name="_t" value={loadTime.current.toString()} />
      {submitWarning && (
        <span style={{ fontSize: '11px', color: '#B8860B', lineHeight: '1.5' }}>
          {submitWarning}
        </span>
      )}
      {submitError && (
        <span style={{ fontSize: '13px', color: '#c0392b', lineHeight: '1.5' }}>
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
        {isSubmitting ? 'Submitting...' : 'Submit Application →'}
      </button>
    </form>
  )
}
