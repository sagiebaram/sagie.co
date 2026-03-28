'use client'

const FILTERS = ['All', 'Miami', 'Tel Aviv', 'Online'] as const
type Filter = (typeof FILTERS)[number]

interface EventFilterProps {
  active: string
  onChange: (filter: string) => void
}

export function EventFilter({ active, onChange }: EventFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
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
