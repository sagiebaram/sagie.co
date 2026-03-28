'use client'

import { useState, useRef } from 'react'
import { FormField } from '@/components/ui/FormField'
import { FormSuccess } from '@/components/ui/FormSuccess'

export function SolutionsForm() {
  const [fields, setFields] = useState({
    fullName: '',
    email: '',
    category: '',
    bio: '',
    servicesOffered: '',
    website: '',
    memberStatus: '',
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
    if (!fields.category) e.category = 'Required'
    if (!fields.bio) e.bio = 'Required'
    if (!fields.servicesOffered) e.servicesOffered = 'Required'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await fetch('/api/applications/solutions', {
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
        headline="We'll review your application."
        message="Solutions providers are vetted before being listed. You'll hear from us within a week."
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Full Name" name="fullName" placeholder="Your full name" required value={fields.fullName} onChange={set('fullName')} error={errors.fullName} />
        <FormField label="Email" name="email" type="email" placeholder="your@email.com" required value={fields.email} onChange={set('email')} error={errors.email} />
      </div>
      <FormField
        label="Service Category"
        name="category"
        type="select"
        options={['Operations & Systems', 'Strategy & Advisory', 'Technology & Product', 'Growth & Marketing', 'Finance & Legal', 'Talent & People']}
        required
        value={fields.category}
        onChange={set('category')}
        error={errors.category}
      />
      <FormField label="Tell us about your background" name="bio" type="textarea" placeholder="Your experience and expertise." required value={fields.bio} onChange={set('bio')} error={errors.bio} />
      <FormField label="What specific services do you offer?" name="servicesOffered" type="textarea" placeholder="Describe the services you provide." required value={fields.servicesOffered} onChange={set('servicesOffered')} error={errors.servicesOffered} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Website / Portfolio URL" name="website" type="url" placeholder="yoursite.com" value={fields.website} onChange={set('website')} />
        <FormField
          label="Are you currently a SAGIE member?"
          name="memberStatus"
          type="select"
          options={['Yes, Explorer', 'Yes, Builder', 'Yes, Shaper', 'Not yet']}
          value={fields.memberStatus}
          onChange={set('memberStatus')}
        />
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
