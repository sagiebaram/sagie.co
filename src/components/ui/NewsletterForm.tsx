'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SubscribeSchema } from '@/lib/schemas'

type SubscribeData = z.infer<typeof SubscribeSchema>

type NewsletterFormProps = {
  variant?: 'compact' | 'featured'
}

export function NewsletterForm({ variant = 'compact' }: NewsletterFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscribeData>({
    resolver: zodResolver(SubscribeSchema),
  })

  const onSubmit = async (data: SubscribeData) => {
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, _t: Date.now() }),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => null)
        throw new Error(json?.error || 'Something went wrong')
      }

      setStatus('success')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p
        className="font-body text-silver tracking-button uppercase"
        style={{ fontSize: variant === 'featured' ? '15px' : '13px' }}
      >
        You&apos;re in.
      </p>
    )
  }

  if (variant === 'featured') {
    return (
      <div
        className="border border-border-subtle"
        style={{ background: 'var(--bg-subtle)', padding: '48px 40px' }}
      >
        <p
          className="font-body uppercase text-foreground-muted tracking-eyebrow"
          style={{ fontSize: '9px', marginBottom: '12px' }}
        >
          Newsletter
        </p>
        <h2
          className="font-display uppercase text-foreground tracking-heading"
          style={{ fontSize: '36px', lineHeight: 1, marginBottom: '12px' }}
        >
          THE SAGIE LETTER
        </h2>
        <p
          className="font-body text-foreground-secondary font-light"
          style={{ fontSize: '14px', lineHeight: 1.7, maxWidth: '480px', marginBottom: '32px' }}
        >
          Weekly insights on ecosystem building, cross-border innovation,
          and the people shaping what&apos;s next. Delivered every week.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Your email"
            autoComplete="email"
            aria-label="Email address"
            aria-describedby={errors.email ? 'featured-email-error' : undefined}
            aria-invalid={errors.email ? true : undefined}
            disabled={status === 'loading'}
            {...register('email')}
            style={{
              flex: 1,
              background: 'var(--bg-card)',
              border: '0.5px solid var(--border-default)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              padding: '14px 16px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="font-body uppercase tracking-button hover:opacity-80 transition-opacity duration-150"
            style={{
              background: 'var(--text-primary)',
              color: 'var(--bg)',
              fontSize: '13px',
              fontWeight: 500,
              padding: '14px 32px',
              border: 'none',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              opacity: status === 'loading' ? 0.5 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {errors.email && (
          <p id="featured-email-error" className="font-body text-foreground-muted" style={{ fontSize: '11px', marginTop: '8px' }}>
            {errors.email.message}
          </p>
        )}
        {status === 'error' && (
          <p className="font-body text-foreground-muted" style={{ fontSize: '11px', marginTop: '8px' }}>
            {errorMessage}
          </p>
        )}
      </div>
    )
  }

  // Compact variant (footer)
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
        <input
          type="email"
          placeholder="Your email"
          autoComplete="email"
          aria-label="Email address"
          aria-describedby={errors.email ? 'compact-email-error' : undefined}
          aria-invalid={errors.email ? true : undefined}
          disabled={status === 'loading'}
          {...register('email')}
          style={{
            flex: 1,
            background: 'var(--bg-card)',
            border: '0.5px solid var(--border-default)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            padding: '12px 14px',
            outline: 'none',
            minWidth: 0,
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="font-body uppercase tracking-button hover:opacity-80 transition-opacity duration-150"
          style={{
            background: 'var(--text-primary)',
            color: 'var(--bg)',
            fontSize: '11px',
            fontWeight: 500,
            padding: '12px 20px',
            border: 'none',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            opacity: status === 'loading' ? 0.5 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>

      {errors.email && (
        <p id="compact-email-error" className="font-body text-foreground-muted" style={{ fontSize: '10px', marginTop: '6px' }}>
          {errors.email.message}
        </p>
      )}
      {status === 'error' && (
        <p className="font-body text-foreground-muted" style={{ fontSize: '10px', marginTop: '6px' }}>
          {errorMessage}
        </p>
      )}
    </div>
  )
}
