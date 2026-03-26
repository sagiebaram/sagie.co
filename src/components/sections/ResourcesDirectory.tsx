'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gsap } from '@/lib/gsap'
import { GridBackground } from '@/components/ui/GridBackground'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ResourceFilter } from '@/components/ui/ResourceFilter'
import { SubmitResourceForm } from '@/components/ui/SubmitResourceForm'
import { PageHeroAnimation } from '@/components/ui/PageHeroAnimation'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import type { Resource } from '@/lib/resources'

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span
        className="font-body uppercase shrink-0"
        style={{ fontSize: '13px', letterSpacing: '0.18em', color: 'var(--text-ghost)', width: '100px' }}
      >
        {label}
      </span>
      <span
        className="font-body"
        style={{ fontSize: '15px', color: 'var(--text-secondary)' }}
      >
        {value}
      </span>
    </div>
  )
}

export function ResourcesDirectory({ resources }: { resources: Resource[] }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const featured = resources.find((r) => r.featured) ?? resources[0]
  const filtered = activeCategory === 'All'
    ? resources
    : resources.filter((r) => r.category === activeCategory)

  const featuredRef = useRef<HTMLDivElement>(null)
  const filterRef = useScrollReveal({ y: 10, duration: 0.35 })
  const gridRef = useScrollReveal({ selector: '.res-card', stagger: 0.05, y: 16, duration: 0.45 })
  const submitRef = useScrollReveal({ y: 16, duration: 0.5 })

  useLayoutEffect(() => {
    if (!featuredRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        featuredRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, featuredRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="relative z-[1] overflow-hidden">
        <GridBackground />
        <PageHeroAnimation>
          <div className="relative z-10 max-w-[880px] mx-auto px-6 md:px-0 pt-32 pb-8 md:pt-40 md:pb-10">
            <Eyebrow>Resources</Eyebrow>
            <h1 className="font-display uppercase mb-8 text-hero leading-[0.9]">
              <span className="page-hero-line block text-foreground-secondary">TOOLS FOR THE</span>
              <span className="page-hero-line block text-foreground">ECOSYSTEM.</span>
            </h1>
            <p className="page-hero-sub font-body italic text-foreground-muted mb-10 text-body-lg font-light leading-[1.7] max-w-[520px]">
              Curated by SAGIE and contributed by the community. Accelerators, incubators, providers and more.
            </p>
            <p
              className="page-hero-sub font-body uppercase"
              style={{ fontSize: '11px', letterSpacing: '0.18em', color: 'var(--text-secondary)' }}
            >
              Directory last updated March 2026
            </p>
          </div>
        </PageHeroAnimation>
      </section>

      {/* Featured resource */}
      {featured && (
        <section className="relative z-[1] overflow-hidden border-t border-border-strong md:border-border-subtle py-12 md:py-20 px-6 md:px-8">
          <GridBackground />
          <div ref={featuredRef} className="relative z-10 max-w-[880px] mx-auto" style={{ opacity: 0 }}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <p
                  className="font-body uppercase mb-3"
                  style={{ fontSize: '12px', letterSpacing: '0.22em', color: 'var(--silver)' }}
                >
                  Featured resource
                </p>
                <p
                  className="font-display uppercase mb-3"
                  style={{ fontSize: '32px', color: 'var(--text-primary)', letterSpacing: '0.04em' }}
                >
                  {featured.name}
                </p>
                <p className="font-body text-foreground-muted text-body font-light leading-[1.7] mb-5 max-w-[480px]">
                  {featured.description}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="font-body uppercase"
                    style={{ fontSize: '12px', letterSpacing: '0.12em', color: 'var(--text-muted)' }}
                  >
                    {featured.category}
                  </span>
                  <span style={{ color: 'var(--text-dim)' }}>·</span>
                  <span
                    className="font-body uppercase"
                    style={{ fontSize: '12px', letterSpacing: '0.12em', color: 'var(--text-muted)' }}
                  >
                    {featured.location}
                  </span>
                  <span style={{ color: 'var(--text-dim)' }}>·</span>
                  <span
                    className="font-body uppercase"
                    style={{ fontSize: '12px', letterSpacing: '0.12em', color: 'var(--text-muted)' }}
                  >
                    Curated by SAGIE
                  </span>
                </div>
              </div>
              <a
                href={featured.url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body uppercase bg-white hover:opacity-85 hover:-translate-y-px transition-all duration-150 shrink-0 self-start md:self-center"
                style={{
                  color: 'black',
                  fontSize: '13px',
                  letterSpacing: '0.12em',
                  padding: '12px 28px',
                }}
              >
                Visit resource →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Filter bar */}
      <section className="relative z-[1] border-t border-border-strong md:border-border-subtle px-6 md:px-8 py-6">
        <div ref={filterRef} className="max-w-[880px] mx-auto">
          <ResourceFilter
            resources={resources}
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </div>
      </section>

      {/* Resource grid */}
      <section className="relative z-[1] overflow-hidden border-t border-border-strong md:border-border-subtle py-12 md:py-20 px-6 md:px-8">
        <GridBackground />
        <div ref={gridRef} className="relative z-10 max-w-[880px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px">
            {filtered.map((resource) => {
              const isExpanded = expandedId === resource.id
              return (
                <div
                  key={resource.id}
                  className="res-card"
                  style={{ border: '1px solid var(--border-default)' }}
                >
                  {/* Collapsed card */}
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : resource.id)}
                    className="w-full text-left p-7 flex flex-col gap-4 transition-colors duration-200"
                    style={{
                      background: isExpanded ? 'var(--bg-card-featured)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isExpanded) e.currentTarget.style.background = 'var(--bg-card-featured)'
                    }}
                    onMouseLeave={(e) => {
                      if (!isExpanded) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="font-display uppercase"
                        style={{ fontSize: '20px', color: 'var(--silver)', letterSpacing: '0.04em' }}
                      >
                        {resource.name}
                      </span>
                      <span
                        className="font-body shrink-0 mt-0.5"
                        style={{ fontSize: '16px', color: 'var(--text-muted)' }}
                      >
                        {isExpanded ? '\u2212' : '+'}
                      </span>
                    </div>
                    <p
                      className="font-body font-light leading-[1.7]"
                      style={{ fontSize: '14px', color: 'var(--text-muted)' }}
                    >
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between gap-3 mt-auto pt-1">
                      <span
                        className="font-body uppercase truncate"
                        style={{ fontSize: '11px', letterSpacing: '0.12em', color: 'var(--text-muted)' }}
                      >
                        {resource.category}
                      </span>
                      <a
                        href={resource.url ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-body uppercase shrink-0 hover:text-silver transition-colors duration-150"
                        style={{
                          fontSize: '11px',
                          letterSpacing: '0.1em',
                          color: 'var(--text-muted)',
                          borderBottom: '0.5px solid var(--border-subtle)',
                          paddingBottom: '1px',
                        }}
                      >
                        Visit →
                      </a>
                    </div>
                  </button>

                  {/* Expanded panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-7 py-7"
                          style={{
                            borderTop: '1px solid var(--border-subtle)',
                            background: 'var(--bg-card)',
                          }}
                        >
                          <div className="flex flex-col gap-3 mb-6">
                            <DetailRow label="Category" value={resource.category} />
                            {resource.location && <DetailRow label="Location" value={resource.location} />}
                            {resource.bestFor && <DetailRow label="Best for" value={resource.bestFor} />}
                            <DetailRow label="Source" value={resource.source} />
                          </div>
                          <div className="flex flex-wrap items-center gap-5">
                            <a
                              href={resource.url ?? '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-body uppercase hover:text-silver hover:-translate-y-px transition-all duration-150"
                              style={{
                                fontSize: '13px',
                                letterSpacing: '0.12em',
                                color: 'var(--text-muted)',
                                borderBottom: '0.5px solid var(--border-subtle)',
                                paddingBottom: '2px',
                              }}
                            >
                              Visit {resource.name} →
                            </a>
                            <button
                              type="button"
                              onClick={() => navigator.clipboard.writeText(resource.url ?? '')}
                              className="font-body uppercase hover:text-foreground-muted transition-colors duration-150"
                              style={{
                                fontSize: '13px',
                                letterSpacing: '0.12em',
                                color: 'var(--text-dim)',
                                borderBottom: '0.5px solid var(--border-subtle)',
                                paddingBottom: '2px',
                              }}
                            >
                              Share resource
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Submit section */}
      <section className="relative z-[1] overflow-hidden border-t border-border-strong md:border-border-subtle py-12 md:py-20 px-6 md:px-8">
        <GridBackground />
        <div ref={submitRef} className="relative z-10 max-w-[880px] mx-auto">
          <Eyebrow>Contribute</Eyebrow>
          <h2
            className="font-display uppercase mb-4"
            style={{ fontSize: '36px', color: 'var(--text-primary)', letterSpacing: '0.04em', lineHeight: 1 }}
          >
            Know something the ecosystem should know about?
          </h2>
          <p className="font-body text-foreground-muted text-body-lg font-light leading-[1.7] mb-10 max-w-[520px]">
            Submit a resource and we&apos;ll review it for the directory.
          </p>
          <SubmitResourceForm />
          <p
            className="font-body uppercase mt-5"
            style={{ fontSize: '11px', letterSpacing: '0.12em', color: 'var(--text-muted)' }}
          >
            Category · Description · Your name collected on next step
          </p>
        </div>
      </section>
    </>
  )
}
