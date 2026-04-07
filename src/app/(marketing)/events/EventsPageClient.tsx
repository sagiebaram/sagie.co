'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { useQueryState, parseAsString } from 'nuqs'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { GridBackground } from '@/components/ui/GridBackground'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { EventFilter } from '@/components/ui/EventFilter'
import { PageHeroAnimation } from '@/components/ui/PageHeroAnimation'
import { ErrorPage } from '@/components/ui/ErrorPage'
import { SplitTextReveal } from '@/components/ui/SplitTextReveal'
import { PageIcon } from '@/components/ui/PageIcon'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import type { SAGIEEvent } from '@/types/events'
import { buildGoogleCalendarUrl, buildOutlookCalendarUrl } from '@/lib/calendar'

function formatEventDate(dateStr: string): string {
  const d = dateStr.slice(0, 10)
  const [y, m, day] = d.split('-')
  return `${m}-${day}-${y}`
}

const STATUS_COLORS: Record<string, string> = {
  Confirmed: 'var(--silver)',
  Live: 'var(--color-eco)',
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

function TypeDivider({ label, filterKey }: { label: string; filterKey?: string }) {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = divRef.current
    if (!el) return
    // Reveal after mount (initial scroll-reveal or filter change)
    const rafId = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
    return () => cancelAnimationFrame(rafId)
  }, [filterKey])

  return (
    <div
      ref={divRef}
      className="type-divider flex items-center gap-4 mt-10 mb-4"
      style={{ opacity: 0, transform: 'translateY(12px)' }}
    >
      <span className="font-display uppercase shrink-0 text-subhead tracking-heading text-foreground-muted">
        {label}
      </span>
      <div className="flex-1 h-px bg-border-default" />
    </div>
  )
}

const ACTION_LINK_CLASS =
  'font-body uppercase text-label tracking-label text-foreground-muted hover:text-silver hover:-translate-y-px transition-all duration-150 border-b border-border-subtle pb-px'

function ExternalActionLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={ACTION_LINK_CLASS}
    >
      {label} -&gt;{' '}
      <svg
        viewBox="0 0 10 10"
        className="inline-block w-2.5 h-2.5 ml-1"
        fill="none"
        aria-hidden="true"
      >
        <path d="M2 8L8 2M3 2h5v5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </a>
  )
}

function InternalActionLink({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} className={ACTION_LINK_CLASS}>
      {label} -&gt;
    </Link>
  )
}

function AddToCalendarDropdown({ event }: { event: SAGIEEvent }) {
  const [open, setOpen] = useState(false)
  const googleUrl = buildGoogleCalendarUrl(event)
  const outlookUrl = buildOutlookCalendarUrl(event)
  const icsUrl = `/api/events/${event.id}/ics`

  return (
    <div>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={ACTION_LINK_CLASS}
      >
        + Add to Calendar
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="flex flex-col">
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-label text-foreground-muted hover:text-silver py-1.5 pl-4 block"
              >
                Google Calendar
              </a>
              <a
                href={outlookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-label text-foreground-muted hover:text-silver py-1.5 pl-4 block"
              >
                Outlook
              </a>
              <a
                href={icsUrl}
                download
                className="font-body text-label text-foreground-muted hover:text-silver py-1.5 pl-4 block"
              >
                Apple Calendar (.ics)
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EventAccordion({
  events,
  openId,
  onToggle,
  dimmed = false,
  filterKey,
}: {
  events: SAGIEEvent[]
  openId: string | null
  onToggle: (id: string) => void
  dimmed?: boolean
  filterKey?: string | undefined
}) {
  const ref = useScrollReveal({ selector: '.event-item', stagger: 0.06, y: 16, duration: 0.5, filterKey })

  return (
    <div ref={ref} style={{ opacity: dimmed ? 0.45 : 1 }}>
      {events.map((event) => {
        const isOpen = openId === event.id
        return (
          <div key={event.id} className="event-item border-b border-border-subtle">
            {/* Collapsed row */}
            <button
              onClick={() => onToggle(event.id)}
              aria-expanded={isOpen}
              aria-controls={`event-detail-${event.id}`}
              className="w-full text-left py-5 flex items-center gap-4 flex-wrap"
            >
              <span className="font-display uppercase flex-1 min-w-[180px] text-quote text-silver tracking-heading">
                {event.name}
              </span>
              {event.date ? (
                <time dateTime={event.date.slice(0, 10)} className="font-body text-foreground-muted text-label shrink-0">
                  {formatEventDate(event.date)}
                </time>
              ) : (
                <span className="font-body text-foreground-muted text-label shrink-0">{event.date}</span>
              )}
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
                  id={`event-detail-${event.id}`}
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
                        className="hidden md:flex items-start justify-center rounded overflow-hidden bg-background-card border border-border-subtle"
                        style={{ aspectRatio: '4/3' }}
                      >
                        {event.eventImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={event.eventImage}
                            alt={event.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <span className="font-body text-foreground-ghost text-label m-auto">
                            No image
                          </span>
                        )}
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
                            <div className="flex gap-4">
                              <span className="font-body uppercase text-foreground-dim text-label tracking-label w-[100px] shrink-0">
                                Date / Time
                              </span>
                              <span className="font-body text-foreground-muted text-label">
                                <time dateTime={event.date.slice(0, 10)}>
                                  {formatEventDate(event.date)}{event.time ? ` · ${event.time}` : ''}
                                </time>
                              </span>
                            </div>
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
                          {event.registrationLink && (
                            <ExternalActionLink label="Register" href={event.registrationLink} />
                          )}
                          {event.moreInfoLink && (
                            <ExternalActionLink label="More Info" href={event.moreInfoLink} />
                          )}
                          {event.recapLink && (
                            <InternalActionLink label="Read Recap" href={event.recapLink} />
                          )}
                          {event.status === 'Confirmed' && event.date && (
                            <AddToCalendarDropdown event={event} />
                          )}
                          {event.photoGallery && (
                            <ExternalActionLink label="View Photo Gallery" href={event.photoGallery} />
                          )}
                          {event.recordingLink && (
                            <ExternalActionLink label="Watch Recording" href={event.recordingLink} />
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

export function EventsPageClient({
  upcoming,
  past,
  fetchError = false,
}: {
  upcoming: SAGIEEvent[]
  past: SAGIEEvent[]
  fetchError?: boolean
}) {
  const router = useRouter()
  const [openId, setOpenId] = useState<string | null>(null)
  const [activeLocation, setActiveLocation] = useQueryState(
    'location',
    parseAsString.withDefault('All').withOptions({ history: 'replace', shallow: true })
  )

  const upcomingRef = useScrollReveal({ selector: '.type-divider', stagger: 0.15, y: 8 })
  const suggestRef = useScrollReveal({ y: 16, duration: 0.5 })

  const locationFiltered = activeLocation === 'All'
    ? upcoming
    : upcoming.filter(e => e.chapter === activeLocation)

  const sagieEvents = locationFiltered.filter((e) => e.type === 'SAGIE Event' || e.type === null)
  const localEvents = locationFiltered.filter((e) => e.type === 'Local Event')
  const webinars = locationFiltered.filter((e) => e.type === 'Webinar')

  function handleToggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <main id="main-content" className="relative">
      <CircuitBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative z-1 overflow-hidden">
        <GridBackground parallax />
        <PageHeroAnimation>
          <div className="relative z-10 max-w-[880px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-20">
            <PageIcon name="Events" />
            <p className="page-hero-eyebrow font-body uppercase text-foreground-muted mb-6 text-label tracking-eyebrow">
              SAGIE ECO Events
            </p>
            <SplitTextReveal as="h1" className="font-display uppercase mb-8 text-hero leading-[0.9]" lines={[
              { text: 'WHERE THE', className: 'text-foreground-dim' },
              { text: 'ECOSYSTEM', className: 'text-foreground-secondary' },
              { text: 'COMES TOGETHER.', className: 'text-foreground' },
            ]} />
            <p className="page-hero-sub font-body italic text-foreground-muted mb-10 text-body-lg font-light leading-[1.7] max-w-[520px]">
              Curated events, local happenings and online conversations — designed to create real connection.
            </p>
          </div>
        </PageHeroAnimation>
      </section>

      {/* Error state */}
      {fetchError && (
        <section className="relative z-1 overflow-hidden border-t border-border-strong md:border-border-subtle py-12 md:py-20 px-6 md:px-8">
          <GridBackground parallax />
          <div className="relative z-10 max-w-[880px] mx-auto">
            <ErrorPage
              title="Connection Issue"
              message="Unable to load events. Please try again."
              illustration={
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground-muted">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              }
              onRetry={() => router.refresh()}
            />
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {!fetchError && upcoming.length > 0 && (
        <section className="relative z-1 overflow-hidden border-t border-border-strong md:border-border-subtle py-12 md:py-20 px-6 md:px-8">
          <GridBackground parallax />
          <div ref={upcomingRef} className="relative z-10 max-w-[880px] mx-auto">
            <Eyebrow>Upcoming</Eyebrow>

            <div className="mb-6">
              <EventFilter active={activeLocation} onChange={(f) => setActiveLocation(f)} />
            </div>

            {sagieEvents.length > 0 && (
              <>
                <TypeDivider label="SAGIE Events" filterKey={activeLocation} />
                <EventAccordion events={sagieEvents} openId={openId} onToggle={handleToggle} filterKey={activeLocation} />
              </>
            )}

            {localEvents.length > 0 && (
              <>
                <TypeDivider label="Local Events" filterKey={activeLocation} />
                <EventAccordion events={localEvents} openId={openId} onToggle={handleToggle} filterKey={activeLocation} />
              </>
            )}

            {webinars.length > 0 && (
              <>
                <TypeDivider label="Webinars" filterKey={activeLocation} />
                <EventAccordion events={webinars} openId={openId} onToggle={handleToggle} filterKey={activeLocation} />
              </>
            )}
          </div>
        </section>
      )}

      {/* No upcoming events fallback */}
      {!fetchError && upcoming.length === 0 && (
        <section className="relative z-1 overflow-hidden border-t border-border-strong md:border-border-subtle py-12 md:py-20 px-6 md:px-8">
          <GridBackground parallax />
          <div className="relative z-10 max-w-[880px] mx-auto">
            <Eyebrow>Upcoming</Eyebrow>
            <p className="font-body text-foreground-muted text-body font-light leading-[1.7] mt-6">
              No upcoming events right now. Check back soon.
            </p>
          </div>
        </section>
      )}

      {/* Past Events */}
      {!fetchError && past.length > 0 && (
        <section className="relative z-1 overflow-hidden border-t border-border-strong md:border-border-subtle py-12 md:py-20 px-6 md:px-8">
          <GridBackground parallax />
          <div className="relative z-10 max-w-[880px] mx-auto">
            <Eyebrow>Past Events</Eyebrow>
            <EventAccordion events={past} openId={openId} onToggle={handleToggle} dimmed />
          </div>
        </section>
      )}

      {/* Suggest an Event */}
      <section className="relative z-1 overflow-hidden border-t border-border-strong md:border-border-subtle">
        <GridBackground parallax />
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
