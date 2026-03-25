'use client'

import { useState } from 'react'

const FILTERS = ['All', 'Miami', 'Tel Aviv', 'Online'] as const
type Filter = (typeof FILTERS)[number]

interface EventFilterProps {
  onChange: (filter: Filter) => void
}

export function EventFilter({ onChange }: EventFilterProps) {
  const [active, setActive] = useState<Filter>('All')

  function handleClick(filter: Filter) {
    setActive(filter)
    onChange(filter)
  }

  return (
    <div className="flex flex-wrap gap-3">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => handleClick(filter)}
          className="font-body uppercase text-label tracking-label px-4 py-2 transition-all duration-150"
          style={{
            border: active === filter ? '1px solid var(--silver)' : '1px solid var(--border-default)',
            color: active === filter ? 'var(--silver)' : 'var(--text-muted)',
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
