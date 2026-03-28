'use client'

import { useState } from 'react'
import { FormField } from '@/components/ui/FormField'
import { FormSuccess } from '@/components/ui/FormSuccess'

export function SuggestEventForm() {
  const [fields, setFields] = useState({
    eventName: '',
    eventType: '',
    proposedDate: '',
    description: '',
    yourName: '',
    yourEmail: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (key: string) => (value: string) =>
    setFields(prev => ({ ...prev, [key]: value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!fields.eventName) e.eventName = 'Required'
    if (!fields.eventType) e.eventType = 'Required'
    if (!fields.description) e.description = 'Required'
    if (!fields.yourName) e.yourName = 'Required'
    if (!fields.yourEmail) e.yourEmail = 'Required'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await fetch('/api/suggest-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
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
        headline="We got your idea."
        message="If it fits the ecosystem, we'll reach out to make it happen."
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Event Name" name="eventName" placeholder="What's the event called?" required value={fields.eventName} onChange={set('eventName')} error={errors.eventName} />
        <FormField
          label="Event Type"
          name="eventType"
          type="select"
          options={['SAGIE Event', 'Local Event', 'Webinar']}
          required
          value={fields.eventType}
          onChange={set('eventType')}
          error={errors.eventType}
        />
      </div>
      <FormField label="Proposed Date" name="proposedDate" placeholder="Approximate date or timeframe" value={fields.proposedDate} onChange={set('proposedDate')} />
      <FormField label="Description" name="description" type="textarea" placeholder="What's the idea?" required value={fields.description} onChange={set('description')} error={errors.description} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Your Name" name="yourName" placeholder="Your full name" required value={fields.yourName} onChange={set('yourName')} error={errors.yourName} />
        <FormField label="Your Email" name="yourEmail" type="email" placeholder="your@email.com" required value={fields.yourEmail} onChange={set('yourEmail')} error={errors.yourEmail} />
      </div>
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
        {loading ? 'Submitting...' : 'Submit Suggestion →'}
      </button>
    </div>
  )
}
