'use client'

interface FormSuccessProps {
  headline: string
  message: string
}

export function FormSuccess({ headline, message }: FormSuccessProps) {
  return (
    <div
      style={{
        padding: '48px 32px',
        border: '0.5px solid var(--border-default)',
        background: 'var(--bg-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <span
        style={{
          fontSize: '8px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--silver)',
        }}
      >
        Application received
      </span>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '32px',
          color: 'var(--text-primary)',
          letterSpacing: '0.04em',
          lineHeight: 0.95,
        }}
      >
        {headline}
      </h2>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          lineHeight: 1.75,
          fontWeight: 300,
          maxWidth: '480px',
        }}
      >
        {message}
      </p>
    </div>
  )
}
