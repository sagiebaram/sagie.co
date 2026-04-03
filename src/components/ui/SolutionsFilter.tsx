'use client'

import { useQueryState, parseAsString } from 'nuqs'
import { FILTER_OPTIONS } from '@/constants/solutions'
import type { SolutionProvider } from '@/lib/solutions'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export function SolutionsFilter({ providers }: { providers: SolutionProvider[] }) {
  const [active, setActive] = useQueryState(
    'category',
    parseAsString.withDefault('All').withOptions({ history: 'replace', shallow: true })
  )

  const gridRef = useScrollReveal({ selector: '.dir-card', stagger: 0.08, y: 20, duration: 0.5, filterKey: active })

  const filtered = active === 'All'
    ? providers
    : providers.filter((p) => p.category === active)

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-10" role="group" aria-label="Filter solutions by category">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActive(opt.value)}
            aria-pressed={active === opt.value}
            className={`font-body uppercase text-label tracking-label px-3 py-1.5 border transition-all duration-150 ${active === opt.value
                ? 'text-silver border-border-strong'
                : 'text-foreground-muted border-transparent hover:text-foreground-secondary'
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
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-px">
          {filtered.map((provider) => (
            <div
              key={provider.id}
              className="dir-card border border-border-default p-8 hover:bg-background-card-featured transition-colors duration-200 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 border border-border-default flex items-center justify-center shrink-0">
                  <span className="font-display text-foreground-muted text-caption leading-none">
                    {provider.initials}
                  </span>
                </div>
                <div>
                  <p className="font-display uppercase text-foreground-secondary text-subhead leading-none">
                    {provider.name}
                  </p>
                  <p className="font-body uppercase text-foreground-muted text-label tracking-spaced mt-1">
                    {provider.category}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="font-body text-foreground-muted text-caption font-light leading-[1.75] mb-6 flex-1 line-clamp-3">
                {provider.bio}
              </p>

              {/* Footer */}
              <div className="border-t border-border-subtle pt-4 flex items-center justify-between">
                <span
                  className={`font-body uppercase text-label tracking-label px-2 py-0.5 border ${provider.memberTier === 'Shaper'
                      ? 'border-border-strong text-foreground-secondary'
                      : 'border-border-default text-foreground-muted'
                    }`}
                >
                  {provider.memberTier}
                </span>
                <span className="font-body text-foreground-muted text-caption tracking-mid">
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
