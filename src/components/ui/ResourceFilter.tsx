'use client'

import type { Resource } from '@/lib/resources'

interface ResourceFilterProps {
  resources: Resource[]
  active: string
  onChange: (category: string) => void
}

export function ResourceFilter({ resources, active, onChange }: ResourceFilterProps) {
  const categories = Array.from(new Set(resources.map((r) => r.category)))
  const counts = categories.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = resources.filter((r) => r.category === cat).length
    return acc
  }, {})

  const items = [
    { label: 'All', count: resources.length },
    ...categories.map((cat) => ({ label: cat, count: counts[cat] })),
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {items.map(({ label, count }) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(label)}
          className="font-body uppercase text-label tracking-label px-4 py-2 transition-all duration-150"
          style={{
            border: active === label ? '1px solid var(--silver)' : '1px solid var(--border-default)',
            color: active === label ? 'var(--silver)' : 'var(--text-muted)',
          }}
        >
          {label}
          <span style={{ color: 'var(--text-dim)', marginLeft: '2px' }}>({count})</span>
        </button>
      ))}
    </div>
  )
}
