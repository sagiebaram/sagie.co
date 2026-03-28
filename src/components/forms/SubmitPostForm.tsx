'use client'

import { useState } from 'react'
import { FormField } from '@/components/ui/FormField'
import { FormSuccess } from '@/components/ui/FormSuccess'

export function SubmitPostForm() {
  const [fields, setFields] = useState({
    postTitle: '',
    category: '',
    yourName: '',
    yourEmail: '',
    content: '',
    url: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (key: string) => (value: string) =>
    setFields(prev => ({ ...prev, [key]: value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!fields.postTitle) e.postTitle = 'Required'
    if (!fields.category) e.category = 'Required'
    if (!fields.yourName) e.yourName = 'Required'
    if (!fields.yourEmail) e.yourEmail = 'Required'
    if (!fields.content) e.content = 'Required'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await fetch('/api/submit-post', {
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
        headline="Post submitted."
        message="We'll review it and be in touch. If it's a good fit for the ecosystem, it goes live."
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Post Title" name="postTitle" placeholder="Title of your post" required value={fields.postTitle} onChange={set('postTitle')} error={errors.postTitle} />
        <FormField
          label="Category"
          name="category"
          type="select"
          options={['Ecosystem', 'Spotlight', 'Thought Leadership', 'Event Recap']}
          required
          value={fields.category}
          onChange={set('category')}
          error={errors.category}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Your Name" name="yourName" placeholder="Your full name" required value={fields.yourName} onChange={set('yourName')} error={errors.yourName} />
        <FormField label="Your Email" name="yourEmail" type="email" placeholder="your@email.com" required value={fields.yourEmail} onChange={set('yourEmail')} error={errors.yourEmail} />
      </div>
      <FormField label="Write your post" name="content" type="textarea" placeholder="Share your perspective with the ecosystem." required value={fields.content} onChange={set('content')} error={errors.content} />
      <FormField label="LinkedIn or website URL" name="url" type="url" placeholder="linkedin.com/in/yourname" value={fields.url} onChange={set('url')} />
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
        {loading ? 'Submitting...' : 'Submit Post →'}
      </button>
    </div>
  )
}
