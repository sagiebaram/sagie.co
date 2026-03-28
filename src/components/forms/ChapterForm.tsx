'use client'

import { useState, useRef, useEffect } from 'react'
import { FormField } from '@/components/ui/FormField'
import { FormSuccess } from '@/components/ui/FormSuccess'

export function ChapterForm() {
  const [fields, setFields] = useState({
    fullName: '',
    email: '',
    city: '',
    whyLead: '',
    background: '',
    chapterVision: '',
    linkedIn: '',
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
    if (!fields.city) e.city = 'Required'
    if (!fields.whyLead) e.whyLead = 'Required'
    if (!fields.background) e.background = 'Required'
    if (!fields.chapterVision) e.chapterVision = 'Required'
    if (fields.linkedIn && !/^https?:\/\/.+/.test(fields.linkedIn)) e.linkedIn = 'Enter a full URL (https://...)'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    setSubmitWarning(null)
    try {
      const res = await fetch('/api/applications/chapter', {
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
        headline="We'll reach out if it's the right time."
        message="Chapter leads are selected, not just approved. If the city and alignment are right, we'll start a conversation."
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Full Name" name="fullName" placeholder="Your full name" required value={fields.fullName} onChange={set('fullName')} error={errors.fullName} />
        <FormField label="Email" name="email" type="email" placeholder="your@email.com" required value={fields.email} onChange={set('email')} error={errors.email} />
      </div>
      <FormField label="Which city do you want to lead?" name="city" placeholder="City name" required value={fields.city} onChange={set('city')} error={errors.city} />
      <FormField label="Why is this city ready for a SAGIE chapter?" name="whyLead" type="textarea" placeholder="Tell us why this city is ready." required value={fields.whyLead} onChange={set('whyLead')} error={errors.whyLead} />
      <FormField label="Tell us about yourself" name="background" type="textarea" placeholder="Your background and experience." required value={fields.background} onChange={set('background')} error={errors.background} />
      <FormField label="What does a chapter look like to you?" name="chapterVision" type="textarea" placeholder="Your vision for the chapter." required value={fields.chapterVision} onChange={set('chapterVision')} error={errors.chapterVision} />
      <FormField label="LinkedIn URL" name="linkedIn" type="url" placeholder="linkedin.com/in/yourname" value={fields.linkedIn} onChange={set('linkedIn')} />
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
