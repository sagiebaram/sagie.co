'use client'

import { useState, useEffect } from 'react'

export function SubmitResourceForm() {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [submitWarning, setSubmitWarning] = useState<string | null>(null)
  const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null)

  useEffect(() => {
    if (!rateLimitUntil) return
    const remaining = Math.max(0, rateLimitUntil - Date.now())
    const timer = setTimeout(() => setRateLimitUntil(null), remaining)
    return () => clearTimeout(timer)
  }, [rateLimitUntil])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !url.trim()) return

    setStatus('submitting')
    setSubmitWarning(null)
    try {
      const res = await fetch('/api/submit-resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), url: url.trim() }),
      })

      if (res.status === 429) {
        const retryAfterRaw = res.headers.get('Retry-After')
        const waitSeconds = retryAfterRaw ? parseInt(retryAfterRaw, 10) : 30
        const safeWait = isNaN(waitSeconds) ? 30 : waitSeconds
        setSubmitWarning("You've submitted several times recently. Please wait a few minutes before trying again.")
        setRateLimitUntil(Date.now() + safeWait * 1000)
        setStatus('idle')
        return
      }

      if (!res.ok) {
        setStatus('error')
        return
      }

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
    <>
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
          disabled={status === 'submitting' || rateLimitUntil !== null}
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
      {submitWarning && (
        <p style={{ fontSize: '11px', color: '#B8860B', lineHeight: '1.5', marginTop: '8px' }}>
          {submitWarning}
        </p>
      )}
      {status === 'error' && (
        <p style={{ fontSize: '11px', color: '#c0392b', marginTop: '8px' }}>
          Something went wrong. Please try again.
        </p>
      )}
    </>
  )
}
