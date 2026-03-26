'use client'

import { useState } from 'react'

export function SubmitResourceForm() {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !url.trim()) return

    setStatus('submitting')
    try {
      const res = await fetch('/api/submit-resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), url: url.trim() }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
      setName('')
      setUrl('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p
        className="font-body uppercase"
        style={{ fontSize: '15px', letterSpacing: '0.18em', color: 'var(--silver)' }}
      >
        Submitted. We&apos;ll review it shortly.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        placeholder="Resource name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="font-body bg-transparent flex-1 min-w-0"
        style={{
          border: '1px solid var(--border-default)',
          fontSize: '15px',
          color: 'var(--text-secondary)',
          letterSpacing: '0.04em',
          padding: '14px 18px',
          outline: 'none',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--silver)' }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
      />
      <input
        type="url"
        placeholder="https://"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        className="font-body bg-transparent flex-1 min-w-0"
        style={{
          border: '1px solid var(--border-default)',
          fontSize: '15px',
          color: 'var(--text-secondary)',
          letterSpacing: '0.04em',
          padding: '14px 18px',
          outline: 'none',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--silver)' }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="font-body uppercase bg-white hover:opacity-85 hover:-translate-y-px transition-all duration-150 disabled:opacity-50 shrink-0"
        style={{
          color: 'black',
          fontSize: '13px',
          letterSpacing: '0.12em',
          padding: '14px 28px',
        }}
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
