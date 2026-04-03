'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const ResourceSchema = z.object({
  name: z.string().min(1, 'Give it a name').max(200).trim(),
  url: z.string().url('Please enter a valid URL').max(500).trim(),
})

type FormData = z.infer<typeof ResourceSchema>

export function SubmitResourceForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitWarning, setSubmitWarning] = useState<string | null>(null)
  const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(ResourceSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  useEffect(() => {
    if (!rateLimitUntil) return
    const remaining = Math.max(0, rateLimitUntil - Date.now())
    const timer = setTimeout(() => setRateLimitUntil(null), remaining)
    return () => clearTimeout(timer)
  }, [rateLimitUntil])

  const nameReg = register('name')
  const urlReg = register('url')

  const onSubmit = async (data: FormData) => {
    setSubmitWarning(null)
    setStatus('idle')
    try {
      const res = await fetch('/api/submit-resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, url: data.url }),
      })

      if (res.status === 429) {
        const retryAfterRaw = res.headers.get('Retry-After')
        const waitSeconds = retryAfterRaw ? parseInt(retryAfterRaw, 10) : 30
        const safeWait = isNaN(waitSeconds) ? 30 : waitSeconds
        setSubmitWarning("You've submitted several times recently. Please wait a few minutes before trying again.")
        // eslint-disable-next-line react-hooks/purity -- event handler, not render
        setRateLimitUntil(Date.now() + safeWait * 1000)
        return
      }

      if (!res.ok) {
        setStatus('error')
        return
      }

      setStatus('success')
      reset()
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col flex-1 min-w-0">
          <input
            type="text"
            placeholder="Resource name"
            {...nameReg}
            onBlur={(e) => { nameReg.onBlur(e); e.currentTarget.style.borderColor = 'var(--border-default)' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--silver)' }}
            className="font-body bg-transparent w-full"
            style={{
              border: '1px solid var(--border-default)',
              fontSize: '15px',
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
              padding: '14px 18px',
              outline: 'none',
            }}
          />
          {errors.name && (
            <span style={{ fontSize: '10px', color: 'var(--color-error)', marginTop: '4px' }}>{errors.name.message}</span>
          )}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <input
            type="url"
            placeholder="https://"
            {...urlReg}
            onBlur={(e) => { urlReg.onBlur(e); e.currentTarget.style.borderColor = 'var(--border-default)' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--silver)' }}
            className="font-body bg-transparent w-full"
            style={{
              border: '1px solid var(--border-default)',
              fontSize: '15px',
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
              padding: '14px 18px',
              outline: 'none',
            }}
          />
          {errors.url && (
            <span style={{ fontSize: '10px', color: 'var(--color-error)', marginTop: '4px' }}>{errors.url.message}</span>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting || rateLimitUntil !== null}
          className="font-body uppercase bg-button-primary-bg hover:opacity-85 hover:-translate-y-px transition-all duration-150 disabled:opacity-50 shrink-0"
          style={{
            color: 'var(--bg)',
            fontSize: '13px',
            letterSpacing: '0.12em',
            padding: '14px 28px',
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {submitWarning && (
        <p style={{ fontSize: '11px', color: 'var(--color-warning)', lineHeight: '1.5', marginTop: '8px' }}>
          {submitWarning}
        </p>
      )}
      {status === 'error' && (
        <p style={{ fontSize: '11px', color: 'var(--color-error)', marginTop: '8px' }}>
          Something went wrong. Please try again.
        </p>
      )}
    </>
  )
}
