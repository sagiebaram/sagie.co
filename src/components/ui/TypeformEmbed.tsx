'use client'

import { Widget } from '@typeform/embed-react'

interface TypeformEmbedProps {
  formId: string
  height?: number
}

export function TypeformEmbed({ formId, height = 600 }: TypeformEmbedProps) {
  if (!formId) {
    return (
      <div
        style={{
          height,
          background: 'var(--bg-card)',
          border: '0.5px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-ghost)',
          }}
        >
          Form coming soon
        </span>
      </div>
    )
  }

  return <Widget id={formId} style={{ height }} className="w-full" />
}
