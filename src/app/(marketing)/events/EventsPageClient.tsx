'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { GridBackground } from '@/components/ui/GridBackground'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { PageHeroAnimation } from '@/components/ui/PageHeroAnimation'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import type { SAGIEEvent } from '@/lib/events'

const STATUS_COLORS: Record<string, string> = {
  Confirmed: 'var(--silver)',
  Live: '#2E7D32',
  Planning: 'var(--text-dim)',
  Complete: 'var(--text-dim)',
  Concept: 'var(--text-dim)',
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="font-body uppercase text-label tracking-button px-2 py-0.5 whitespace-nowrap"
      style={{ border: `1px solid ${color}`, color }}
    >
      {label}
    </span>
  )
}

function TypeDivider({ label }: { label: string }) {
  return (
    <div className="type-divider flex items-center gap-4 mt-10 mb-4">
      <span className="font-display uppercase shrink-0 text-subhead tracking-heading text-foreground-muted">
        {label}
      </span>
      <div className="flex-1 h-px bg-border-default" />
    </div>
  )
}

function EventAccordion({
  events,
  openId,
  onToggle,
  dimmed = false,
}: {
  events: SAGIEEvent[]
  openId: string | null
  onToggle: (id: string) => void
  dimmed?: boolean
}) {
  const ref = useScrollReveal({ selector: '.event-item', stagger: 0.06, y: 16, duration: 0.5 })

  return (
    <div ref={ref} style={{ opacity: dimmed ? 0.45 : 1 }}>
      {events.map((event) => {
        const isOpen = openId === event.id
        return (
          <div key={event.id} className="event-item border-b border-border-subtle">
            {/* Collapsed row */}
            <button
              onClick={() => onToggle(event.id)}
              className="w-full text-left py-5 flex items-center gap-4 flex-wrap"
            >
              <span className="font-display uppercase flex-1 min-w-[180px] text-quote text-silver tracking-heading">
                {event.name}
              </span>
              <span className="font-body text-foreground-muted text-label shrink-0">{event.date}</span>
              <div className="flex items-center gap-2 shrink-0">
                <Badge label={event.status} color={STATUS_COLORS[event.status] ?? 'var(--text-dim)'} />
                {event.format && <Badge label={event.format} color="var(--text-dim)" />}
                {event.tierTarget && <Badge label={event.tierTarget} color="var(--text-dim)" />}
              </div>
              <span
                className="text-foreground-muted transition-transform duration-200 shrink-0 text-caption"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                ▾
              </span>
            </button>

            {/* Expanded panel */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="pb-8 pt-2">
                    <div className="grid gap-6" style={{ gridTemplateColumns: '200px 1fr' }}>
                      {/* Image slot */}
                      <div
                        className="hidden md:flex items-start justify-center rounded bg-background-card border border-border-subtle"
                        style={{ aspectRatio: '4/3' }}
                      >
                        <span className="font-body text-foreground-ghost text-label mt-auto mb-auto">
                          {event.eventImage ? 'Image' : 'No image'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col gap-4">
                        {event.description && (
                          <p className="font-body text-foreground-muted text-body font-light leading-[1.7]">
                            {event.description}
                          </p>
                        )}

                        <div className="flex flex-col gap-2">
                          {event.date && (
                            <DetailRow label="Date / Time" value={`${event.date}${event.time ? ' · ' + event.time : ''}`} />
                          )}
                          {event.type === 'Webinar' && event.venue && (
                            <DetailRow label="Platform" value={event.venue} />
                          )}
                          {event.type !== 'Webinar' && event.venue && (
                            <DetailRow label="Venue" value={event.venue} />
                          )}
                          {event.expectedAttendees && (
                            <DetailRow
                              label="Capacity"
                              value={
                                event.actualAttendees
                                  ? `${event.actualAttendees} attended (${event.expectedAttendees} expected)`
                                  : `${event.expectedAttendees} expected`
                              }
                            />
                          )}
                          {event.tierTarget && <DetailRow label="Tier" value={event.tierTarget} />}
                          {event.speakers && (
                            <DetailRow label="Speakers" value={event.speakers} />
                          )}
                        </div>

                        {event.type === 'Local Event' && (
                          <p className="font-body text-foreground-ghost text-label italic">
                            Curated by SAGIE · Third-party event
                          </p>
                        )}

                        {/* Action row */}
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          {event.status !== 'Complete' && (
                            <>
                              {event.status === 'Confirmed' && event.type === 'SAGIE Event' && (
                                <ActionLink label="Register →" />
                              )}
                              {event.status === 'Confirmed' && event.type === 'Webinar' && (
                                <ActionLink label="Register →" href={event.webinarLink ?? '#'} />
                              )}
                              {event.type === 'Local Event' && <ActionLink label="More info →" />}
                              {event.status === 'Confirmed' && <ActionLink label="+ Add to Calendar" />}
                              {event.status === 'Planning' && (
                                <ActionLink label="Notify me when confirmed →" />
                              )}
                            </>
                          )}
                          {event.status === 'Complete' && (
                            <>
                              {event.photoGallery && (
                                <ActionLink label="View Photo Gallery →" href={event.photoGallery} />
                              )}
                              {event.recordingLink && (
                                <ActionLink label="Watch Recording →" href={event.recordingLink} />
                              )}
                              <ActionLink label="Read Recap →" />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="font-body uppercase text-foreground-dim text-label tracking-label w-[100px] shrink-0">
        {label}
      </span>
      <span className="font-body text-foreground-muted text-label">{value}</span>
    </div>
  )
}

function ActionLink({ label, href = '#' }: { label: string; href?: string }) {
  return (
    <a
      href={href}
      className="font-body uppercase text-label tracking-label text-foreground-muted hover:text-silver hover:-translate-y-px transition-all duration-150 border-b border-border-subtle pb-px"
    >
      {label}
    </a>
  )
}

export function EventsPageClient({
  upcoming,
  past,
}: {
  upcoming: SAGIEEvent[]
  past: SAGIEEvent[]
}) {
  const [openId, setOpenId] = useState<string | null>(null)

  const upcomingRef = useScrollReveal({ selector: '.type-divider', stagger: 0.15, y: 8 })
  const suggestRef = useScrollReveal({ y: 16, duration: 0.5 })

  const sagieEvents = upcoming.filter((e) => e.type === 'SAGIE Event' || e.type === null)
  const localEvents = upcoming.filter((e) => e.type === 'Local Event')
  const webinars = upcoming.filter((e) => e.type === 'Webinar')

  function handleToggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <main className="relative">
      <CircuitBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative z-[1] overflow-hidden">
        <GridBackground />
        <PageHeroAnimation>
          <div className="relative z-10 max-w-[880px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-20">
            <p className="page-hero-eyebrow font-body uppercase text-foreground-muted mb-6 text-label tracking-eyebrow">
              SAGIE ECO Events
            </p>
            <h1 className="font-display uppercase mb-8 text-hero leading-[0.9]">
              <span className="page-hero-line block text-foreground-dim">WHERE THE</span>
              <span className="page-hero-line block text-foreground-secondary">ECOSYSTEM</span>
              <span className="page-hero-line block text-foreground">COMES TOGETHER.</span>
            </h1>
            <p className="page-hero-sub font-body italic text-foreground-muted mb-10 text-body-lg font-light leading-[1.7] max-w-[520px]">
              Curated events, local happenings and online conversations — designed to create real connection.
            </p>
          </div>
        </PageHeroAnimation>
      </section>

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <section className="relative z-[1] overflow-hidden border-t border-border-strong md:border-border-subtle py-12 md:py-20 px-6 md:px-8">
          <GridBackground />
          <div ref={upcomingRef} className="relative z-10 max-w-[880px] mx-auto">
            <Eyebrow>Upcoming</Eyebrow>

            {sagieEvents.length > 0 && (
              <>
                <TypeDivider label="SAGIE Events" />
                <EventAccordion events={sagieEvents} openId={openId} onToggle={handleToggle} />
              </>
            )}

            {localEvents.length > 0 && (
              <>
                <TypeDivider label="Local Events" />
                <EventAccordion events={localEvents} openId={openId} onToggle={handleToggle} />
              </>
            )}

            {webinars.length > 0 && (
              <>
                <TypeDivider label="Webinars" />
                <EventAccordion events={webinars} openId={openId} onToggle={handleToggle} />
              </>
            )}
          </div>
        </section>
      )}

      {/* No upcoming events fallback */}
      {upcoming.length === 0 && (
        <section className="relative z-[1] overflow-hidden border-t border-border-strong md:border-border-subtle py-12 md:py-20 px-6 md:px-8">
          <GridBackground />
          <div className="relative z-10 max-w-[880px] mx-auto">
            <Eyebrow>Upcoming</Eyebrow>
            <p className="font-body text-foreground-muted text-body font-light leading-[1.7] mt-6">
              No upcoming events right now. Check back soon.
            </p>
          </div>
        </section>
      )}

      {/* Past Events */}
      {past.length > 0 && (
        <section className="relative z-[1] overflow-hidden border-t border-border-strong md:border-border-subtle py-12 md:py-20 px-6 md:px-8">
          <GridBackground />
          <div className="relative z-10 max-w-[880px] mx-auto">
            <Eyebrow>Past Events</Eyebrow>
            <EventAccordion events={past} openId={openId} onToggle={handleToggle} dimmed />
          </div>
        </section>
      )}

      {/* Suggest an Event */}
      <section className="relative z-[1] overflow-hidden border-t border-border-strong md:border-border-subtle">
        <GridBackground />
        <div ref={suggestRef} className="relative z-10 max-w-[880px] mx-auto px-6 md:px-8 py-16 md:py-24">
          <Eyebrow>Contribute</Eyebrow>
          <h2 className="font-display uppercase text-pillar leading-none text-foreground-secondary mb-4">
            Know of an event the ecosystem should attend?
          </h2>
          <p className="font-body text-foreground-muted text-body-lg font-light leading-[1.7] max-w-[480px] mb-8">
            Suggest a local event, workshop or conference and we&apos;ll review it for the calendar.
          </p>
          <a
            href="/suggest-event"
            className="font-body uppercase text-button tracking-button text-foreground-secondary hover:text-silver hover:-translate-y-px transition-all duration-150 border-b border-border-strong pb-px"
          >
            Suggest an Event →
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
