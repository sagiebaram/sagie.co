'use client'

import { useState } from 'react'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ResourceFilter } from '@/components/ui/ResourceFilter'
import { SubmitResourceForm } from '@/components/ui/SubmitResourceForm'
import { MOCK_RESOURCES } from '@/constants/resources'

export function ResourcesDirectory() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const featured = MOCK_RESOURCES.find((r) => r.featured)
  const filtered = activeCategory === 'All'
    ? MOCK_RESOURCES
    : MOCK_RESOURCES.filter((r) => r.category === activeCategory)

  return (
    <>
      {/* Hero */}
      <section className="relative z-[1] overflow-hidden pt-32 pb-16 px-6 md:px-8">
        <div className="relative z-10 mx-auto max-w-[880px]">
          <Eyebrow>Resources</Eyebrow>
          <h1 className="font-display uppercase text-hero leading-[0.9] mb-6">
            <span className="block text-foreground-dim">TOOLS FOR THE</span>
            <span className="block text-foreground">ECOSYSTEM.</span>
          </h1>
          <p className="font-body italic text-foreground-muted text-body-lg font-light leading-[1.7] max-w-[440px] mb-3">
            Curated by SAGIE and contributed by the community. Accelerators, incubators, providers and more.
          </p>
          <p className="font-body text-[9px] tracking-label uppercase" style={{ color: 'var(--text-ghost)' }}>
            Directory last updated March 2026
          </p>
        </div>
      </section>

      {/* Featured resource */}
      {featured && (
        <Section>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <p className="font-body uppercase text-[10px] tracking-eyebrow text-silver mb-3">
                Featured resource
              </p>
              <h2 className="font-display uppercase text-[28px] leading-[1] text-foreground mb-3">
                {featured.name}
              </h2>
              <p className="font-body text-foreground-muted text-[11px] font-light leading-[1.7] mb-4 max-w-[480px]">
                {featured.description}
              </p>
              <div className="flex items-center gap-2 font-body text-foreground-dim text-[10px] tracking-wide uppercase">
                <span>{featured.category}</span>
                <span className="text-foreground-dim/40">·</span>
                <span>{featured.location}</span>
                <span className="text-foreground-dim/40">·</span>
                <span>Curated by SAGIE</span>
              </div>
            </div>
            <a
              href={featured.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body uppercase bg-white text-black text-[10px] tracking-button px-6 py-2.5 hover:opacity-85 hover:-translate-y-px transition-all duration-150 shrink-0 self-start md:self-center"
            >
              Visit resource →
            </a>
          </div>
        </Section>
      )}

      {/* Filter + Grid */}
      <Section>
        <div className="mb-8">
          <ResourceFilter
            resources={MOCK_RESOURCES}
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-default">
          {filtered.map((resource) => {
            const isExpanded = expandedId === resource.id
            return (
              <div
                key={resource.id}
                className="bg-background flex flex-col"
              >
                {/* Collapsed card */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : resource.id)}
                  className="text-left p-5 flex flex-col gap-3 group hover:bg-background-card transition-colors duration-150 flex-1"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display uppercase text-[17px] leading-[1.1] text-silver">
                      {resource.name}
                    </h3>
                    <span className="font-body text-foreground-dim text-[14px] shrink-0 mt-0.5">
                      {isExpanded ? '\u2212' : '+'}
                    </span>
                  </div>
                  <p className="font-body text-foreground-muted text-[10px] font-light leading-[1.6]">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between gap-2 mt-auto pt-2">
                    <div className="flex items-center gap-1.5 font-body text-foreground-dim text-[9px] tracking-wide uppercase">
                      <span>{resource.category}</span>
                      <span className="text-foreground-dim/40">·</span>
                      <span>{resource.location}</span>
                    </div>
                    <span className={`font-body text-[8px] tracking-label uppercase px-2 py-0.5 border ${
                      resource.source === 'Curated'
                        ? 'text-silver border-silver/20'
                        : 'text-foreground-dim border-border-default'
                    }`}>
                      {resource.source}
                    </span>
                  </div>
                </button>

                {/* Expanded panel */}
                {isExpanded && (
                  <div className="border-t border-border-default px-5 py-5 bg-background-card">
                    <div className="space-y-3 mb-5">
                      {[
                        ['Category', resource.category],
                        ['Location', resource.location],
                        ['Best for', resource.bestFor],
                        ['Source', resource.source],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-start gap-4">
                          <span className="font-body uppercase text-foreground-dim text-[9px] tracking-label w-16 shrink-0 pt-px">
                            {label}
                          </span>
                          <span className="font-body text-foreground-secondary text-[11px] font-light leading-[1.5]">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body uppercase text-silver text-[10px] tracking-button hover:text-foreground hover:-translate-y-px transition-all duration-150"
                      >
                        Visit {resource.name} →
                      </a>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(resource.url)
                        }}
                        className="font-body uppercase text-foreground-dim text-[10px] tracking-button hover:text-foreground-muted transition-colors duration-150"
                      >
                        Share resource
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Section>

      {/* Submit section */}
      <Section>
        <div className="max-w-[600px]">
          <h2 className="font-display uppercase text-[28px] leading-[1] text-foreground mb-3">
            Know something the ecosystem should know about?
          </h2>
          <p className="font-body text-foreground-muted text-[11px] font-light leading-[1.7] mb-6">
            Submit a resource and we&apos;ll review it for the directory.
          </p>
          <SubmitResourceForm />
          <p className="font-body text-foreground-dim text-[9px] tracking-wide mt-4">
            Category · Description · Your name collected on next step
          </p>
        </div>
      </Section>
    </>
  )
}
