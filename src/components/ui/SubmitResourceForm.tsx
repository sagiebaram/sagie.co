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
      <p className="font-body text-silver text-[11px] tracking-label uppercase">
        Submitted. We&apos;ll review it shortly.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        placeholder="Resource name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="font-body bg-transparent border border-border-default text-foreground-secondary text-[11px] tracking-wide px-4 py-2.5 placeholder:text-foreground-dim focus:outline-none focus:border-silver transition-colors flex-1 min-w-0"
      />
      <input
        type="url"
        placeholder="https://"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        className="font-body bg-transparent border border-border-default text-foreground-secondary text-[11px] tracking-wide px-4 py-2.5 placeholder:text-foreground-dim focus:outline-none focus:border-silver transition-colors flex-1 min-w-0"
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="font-body uppercase bg-white text-black text-[10px] tracking-button px-6 py-2.5 hover:opacity-85 hover:-translate-y-px transition-all duration-150 disabled:opacity-50 shrink-0"
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
