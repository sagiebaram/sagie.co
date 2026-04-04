'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormField } from '@/components/ui/FormField'
import { PhoneField } from '@/components/ui/PhoneField'
import { FormSuccess } from '@/components/ui/FormSuccess'
import { ChapterSchema, COUNTRY_OPTIONS } from '@/lib/schemas'

type FormData = z.infer<typeof ChapterSchema>

export function ChapterForm() {
  const trapRef = useRef('')
  const [loadTime] = useState(() => Date.now())
  const [success, setSuccess] = useState(false)
  const [submitWarning, setSubmitWarning] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isRateLimited, setIsRateLimited] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(ChapterSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  })

  const onSubmit = async (data: FormData) => {
    setSubmitWarning(null)
    setSubmitError(null)
    try {
      const res = await fetch('/api/applications/chapter', {
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
        headline="We'll reach out if it's the right time."
        message="Chapter leads are selected, not just approved. If the city and alignment are right, we'll start a conversation."
      />
    )
  }

  return (
    <form onSubmit={(e) => handleSubmit(onSubmit)(e)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Full Name" name="fullName" placeholder="Your full name" required registration={register('fullName')} error={errors.fullName?.message} />
        <FormField label="Email" name="email" type="email" placeholder="your@email.com" required registration={register('email')} error={errors.email?.message} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Which city do you want to lead?" name="city" placeholder="City name" required registration={register('city')} error={errors.city?.message} />
        <FormField label="Country" name="country" type="select" options={[...COUNTRY_OPTIONS]} required value={watch('country') || ''} onValueChange={(v) => setValue('country', v, { shouldValidate: true })} error={errors.country?.message} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Community size (approx.)" name="communitySize" placeholder="e.g. 200 people in my network" registration={register('communitySize')} error={errors.communitySize?.message} />
        <PhoneField label="Phone" name="phone" control={control} required error={errors.phone?.message} />
      </div>
      <FormField label="Why is this city ready for a SAGIE chapter?" name="whyLead" type="textarea" placeholder="Tell us why this city is ready." required registration={register('whyLead')} error={errors.whyLead?.message} />
      <FormField label="Tell us about yourself" name="background" type="textarea" placeholder="Your background and experience." registration={register('background')} error={errors.background?.message} />
      <FormField label="What does a chapter look like to you?" name="chapterVision" type="textarea" placeholder="Your vision for the chapter." registration={register('chapterVision')} error={errors.chapterVision?.message} />
      <FormField label="LinkedIn URL" name="linkedIn" type="url" placeholder="linkedin.com/in/yourname" registration={register('linkedIn')} error={errors.linkedIn?.message} />
      <input type="text" name="_trap" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} onChange={e => { trapRef.current = e.target.value }} />
      <input type="hidden" name="_t" value={loadTime.toString()} />
      {submitWarning && (<span style={{ fontSize: '11px', color: 'var(--color-warning)', lineHeight: '1.5' }}>{submitWarning}</span>)}
      {submitError && (<span style={{ fontSize: '13px', color: 'var(--color-error)', lineHeight: '1.5' }}>{submitError}</span>)}
      <button type="submit" disabled={isSubmitting || isRateLimited} style={{ background: isSubmitting ? 'var(--border-default)' : 'var(--silver)', color: 'var(--bg)', fontFamily: 'var(--font-body)', fontSize: '14px', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '14px 32px', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', alignSelf: 'flex-start' }}>
        {isSubmitting ? 'Submitting...' : 'Submit Application →'}
      </button>
    </form>
  )
}
