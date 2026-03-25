'use client'

import { useState } from 'react'
import { FILTER_OPTIONS, MOCK_PROVIDERS } from '@/constants/solutions'
import type { SolutionCategory } from '@/constants/solutions'

export function SolutionsFilter() {
  const [active, setActive] = useState<string>('all')

  const filtered = active === 'all'
    ? MOCK_PROVIDERS
    : MOCK_PROVIDERS.filter((p) => p.category === active)

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-10">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActive(opt.value)}
            className={`font-body uppercase text-label tracking-label px-4 py-2 border transition-colors duration-150 ${
              active === opt.value
                ? 'border-silver text-silver'
                : 'border-border-subtle text-foreground-muted hover:text-silver hover:border-border-default'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Provider grid */}
      {filtered.length === 0 ? (
        <p className="font-body text-foreground-muted text-body text-center py-16">
          Community providers coming soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map((provider) => (
            <div
              key={provider.id}
              className="border border-border-subtle flex flex-col"
            >
              <div className="p-5 flex-1">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 border border-border-subtle flex items-center justify-center shrink-0">
                    <span className="font-display text-foreground-dim text-[14px] leading-none">
                      {provider.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-display text-silver text-[16px] leading-none">
                      {provider.name}
                    </p>
                    <p className="font-body uppercase text-foreground-ghost text-[8px] tracking-label mt-1">
                      {provider.category}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="font-body text-foreground-muted text-[10px] font-light leading-[1.6] line-clamp-3">
                  {provider.bio}
                </p>
              </div>

              {/* Footer */}
              <div className="border-t border-border-subtle px-5 py-3 flex items-center justify-between">
                <span
                  className={`font-body uppercase text-[8px] tracking-label px-2 py-0.5 border ${
                    provider.memberTier === 'Shaper'
                      ? 'border-silver text-silver'
                      : 'border-border-default text-foreground-muted'
                  }`}
                >
                  {provider.memberTier}
                </span>
                <span className="font-body text-foreground-dim text-[10px]">
                  Work with me →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
