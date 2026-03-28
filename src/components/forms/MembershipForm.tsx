'use client'

import { useState, useRef } from 'react'
import { FormField } from '@/components/ui/FormField'
import { FormSuccess } from '@/components/ui/FormSuccess'

export function MembershipForm() {
  const [fields, setFields] = useState({
    fullName: '',
    email: '',
    location: '',
    role: '',
    whatTheyNeed: '',
    howTheyKnowSagie: '',
    linkedIn: '',
    referral: '',
  })
  const trapRef = useRef('')
  const loadTime = useRef(Date.now())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (key: string) => (value: string) =>
    setFields(prev => ({ ...prev, [key]: value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!fields.fullName) e.fullName = 'Required'
    if (!fields.email) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Enter a valid email'
    if (!fields.location) e.location = 'Required'
    if (!fields.whatTheyNeed) e.whatTheyNeed = 'Required'
    if (!fields.role) e.role = 'Required'
    if (!fields.howTheyKnowSagie) e.howTheyKnowSagie = 'Required'
    if (fields.linkedIn && !/^https?:\/\/.+/.test(fields.linkedIn)) e.linkedIn = 'Enter a full URL (https://...)'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await fetch('/api/applications/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, _trap: trapRef.current, _t: loadTime.current }),
      })
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
        message="Every application is reviewed personally. If there's alignment, you'll hear from us within a few days. In the meantime — follow what we're building."
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Full Name" name="fullName" placeholder="Your full name" required value={fields.fullName} onChange={set('fullName')} error={errors.fullName} />
        <FormField label="Email" name="email" type="email" placeholder="your@email.com" required value={fields.email} onChange={set('email')} error={errors.email} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="City" name="location" placeholder="Where are you based?" required value={fields.location} onChange={set('location')} error={errors.location} />
        <FormField
          label="I am a..."
          name="role"
          type="select"
          options={['Founder', 'Investor', 'Operator', 'Ecosystem Builder', 'Academic', 'Partner']}
          required
          value={fields.role}
          onChange={set('role')}
          error={errors.role}
        />
      </div>
      <FormField label="What are you building or working on?" name="whatTheyNeed" type="textarea" placeholder="Tell us what you're focused on right now." required value={fields.whatTheyNeed} onChange={set('whatTheyNeed')} error={errors.whatTheyNeed} />
      <FormField label="Why SAGIE?" name="howTheyKnowSagie" type="textarea" placeholder="What does this community mean to you — or what are you hoping it will mean?" required value={fields.howTheyKnowSagie} onChange={set('howTheyKnowSagie')} error={errors.howTheyKnowSagie} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="LinkedIn URL" name="linkedIn" type="url" placeholder="linkedin.com/in/yourname" value={fields.linkedIn} onChange={set('linkedIn')} />
        <FormField label="How did you hear about us?" name="referral" placeholder="Name, event, social..." value={fields.referral} onChange={set('referral')} />
      </div>
      <input type="text" name="_trap" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} onChange={e => { trapRef.current = e.target.value }} />
      <input type="hidden" name="_t" value={loadTime.current.toString()} />
      {errors.submit && (
        <span style={{ fontSize: '11px', color: '#c0392b' }}>{errors.submit}</span>
      )}
      <button
        onClick={handleSubmit}
        disabled={loading}
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
