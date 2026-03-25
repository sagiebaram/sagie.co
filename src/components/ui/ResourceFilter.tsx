'use client'

import { cn } from '@/lib/utils'
import type { Resource } from '@/constants/resources'

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

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange('All')}
        className={cn(
          'font-body uppercase text-[10px] tracking-label px-3 py-1.5 border transition-colors duration-150',
          active === 'All'
            ? 'text-silver border-silver'
            : 'text-foreground-dim border-border-default hover:text-foreground-muted hover:border-border-strong'
        )}
      >
        All<span className={cn(active === 'All' ? 'text-foreground-dim' : 'text-foreground-dim/50', 'ml-0.5')}>({resources.length})</span>
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={cn(
            'font-body uppercase text-[10px] tracking-label px-3 py-1.5 border transition-colors duration-150',
            active === cat
              ? 'text-silver border-silver'
              : 'text-foreground-dim border-border-default hover:text-foreground-muted hover:border-border-strong'
          )}
        >
          {cat}<span className={cn(active === cat ? 'text-foreground-dim' : 'text-foreground-dim/50', 'ml-0.5')}>({counts[cat]})</span>
        </button>
      ))}
    </div>
  )
}
