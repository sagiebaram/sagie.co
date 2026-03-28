'use client'

import { useState, useRef, useEffect } from 'react'
import { FormField } from '@/components/ui/FormField'
import { FormSuccess } from '@/components/ui/FormSuccess'

export function VenturesForm() {
  const [fields, setFields] = useState({
    fullName: '',
    email: '',
    companyName: '',
    building: '',
    stage: '',
    whySagie: '',
    website: '',
  })
  const trapRef = useRef('')
  const loadTime = useRef(Date.now())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitWarning, setSubmitWarning] = useState<string | null>(null)
  const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null)

  useEffect(() => {
    if (!rateLimitUntil) return
    const remaining = rateLimitUntil - Date.now()
    if (remaining <= 0) { setRateLimitUntil(null); return }
    const timer = setTimeout(() => setRateLimitUntil(null), remaining)
    return () => clearTimeout(timer)
  }, [rateLimitUntil])

  const set = (key: string) => (value: string) =>
    setFields(prev => ({ ...prev, [key]: value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!fields.fullName) e.fullName = 'Required'
    if (!fields.email) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Enter a valid email'
    if (!fields.companyName) e.companyName = 'Required'
    if (!fields.building) e.building = 'Required'
    if (!fields.stage) e.stage = 'Required'
    if (!fields.whySagie) e.whySagie = 'Required'
    if (fields.website && !/^https?:\/\/.+/.test(fields.website)) e.website = 'Enter a full URL (https://...)'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    setSubmitWarning(null)
    try {
      const res = await fetch('/api/applications/ventures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, _trap: trapRef.current, _t: loadTime.current }),
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
        setErrors({ submit: 'Something went wrong. Please try again.' })
        return
      }

      setSuccess(true)
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Full Name" name="fullName" placeholder="Your full name" required value={fields.fullName} onChange={set('fullName')} error={errors.fullName} />
        <FormField label="Email" name="email" type="email" placeholder="your@email.com" required value={fields.email} onChange={set('email')} error={errors.email} />
      </div>
      <FormField label="Company Name" name="companyName" placeholder="Your company or project name" required value={fields.companyName} onChange={set('companyName')} error={errors.companyName} />
      <FormField label="What are you building?" name="building" type="textarea" placeholder="Tell us about your product or service." required value={fields.building} onChange={set('building')} error={errors.building} />
      <FormField
        label="Stage"
        name="stage"
        type="select"
        options={['Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B+']}
        required
        value={fields.stage}
        onChange={set('stage')}
        error={errors.stage}
      />
      <FormField label="Why SAGIE Ventures?" name="whySagie" type="textarea" placeholder="What kind of alignment are you looking for?" required value={fields.whySagie} onChange={set('whySagie')} error={errors.whySagie} />
      <FormField label="Website / Deck URL" name="website" type="url" placeholder="yoursite.com or deck link" value={fields.website} onChange={set('website')} />
      <input type="text" name="_trap" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} onChange={e => { trapRef.current = e.target.value }} />
      <input type="hidden" name="_t" value={loadTime.current.toString()} />
      {submitWarning && (
        <span style={{ fontSize: '11px', color: '#B8860B', lineHeight: '1.5' }}>
          {submitWarning}
        </span>
      )}
      {errors.submit && (
        <span style={{ fontSize: '11px', color: '#c0392b' }}>{errors.submit}</span>
      )}
      <button
        onClick={handleSubmit}
        disabled={loading || (rateLimitUntil !== null && Date.now() < rateLimitUntil)}
        style={{
          background: loading ? 'var(--border-default)' : 'var(--silver)',
          color: 'var(--bg)',
          fontFamily: 'var(--font-display)',
          fontSize: '14px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          padding: '14px 32px',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          alignSelf: 'flex-start',
        }}
      >
        {loading ? 'Submitting...' : 'Submit Application →'}
      </button>
    </div>
  )
}
