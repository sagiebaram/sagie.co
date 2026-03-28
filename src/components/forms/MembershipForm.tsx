'use client'

import { useState, useRef } from 'react'
import { FormField } from '@/components/ui/FormField'
import { FormSuccess } from '@/components/ui/FormSuccess'

export function MembershipForm() {
  const [fields, setFields] = useState({
    fullName: '',
    email: '',
    city: '',
    role: '',
    building: '',
    whySagie: '',
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
    if (!fields.city) e.city = 'Required'
    if (!fields.building) e.building = 'Required'
    if (!fields.whySagie) e.whySagie = 'Required'
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
        <FormField label="City" name="city" placeholder="Where are you based?" required value={fields.city} onChange={set('city')} error={errors.city} />
        <FormField
          label="I am a..."
          name="role"
          type="select"
          options={['Founder', 'Investor', 'Operator', 'Ecosystem Builder', 'Academic', 'Partner']}
          value={fields.role}
          onChange={set('role')}
        />
      </div>
      <FormField label="What are you building or working on?" name="building" type="textarea" placeholder="Tell us what you're focused on right now." required value={fields.building} onChange={set('building')} error={errors.building} />
      <FormField label="Why SAGIE?" name="whySagie" type="textarea" placeholder="What does this community mean to you — or what are you hoping it will mean?" required value={fields.whySagie} onChange={set('whySagie')} error={errors.whySagie} />
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
