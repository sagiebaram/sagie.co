'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { GridBackground } from '@/components/ui/GridBackground'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { EventFilter } from '@/components/ui/EventFilter'
import { MOCK_EVENTS, type SagieEvent } from '@/constants/events'

const STATUS_COLORS: Record<SagieEvent['status'], string> = {
  Confirmed: 'var(--silver)',
  Live: '#2E7D32',
  Planning: 'var(--border-default)',
  Complete: 'var(--border-subtle)',
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="font-body uppercase"
      style={{
        fontSize: '10px',
        letterSpacing: '0.12em',
        padding: '3px 8px',
        border: `0.5px solid ${color}`,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

function TypeDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mt-10 mb-4">
      <span
        className="font-display uppercase shrink-0"
        style={{ fontSize: '14px', letterSpacing: '0.1em', color: 'var(--text-ghost)' }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
    </div>
  )
}

function EventAccordion({
  events,
  openId,
  onToggle,
  dimmed = false,
}: {
  events: SagieEvent[]
  openId: string | null
  onToggle: (id: string) => void
  dimmed?: boolean
}) {
  return (
    <div style={{ opacity: dimmed ? 0.45 : 1 }}>
      {events.map((event) => {
        const isOpen = openId === event.id
        return (
          <div key={event.id} className="border-b border-border-subtle">
            {/* Collapsed row */}
            <button
              onClick={() => onToggle(event.id)}
              className="w-full text-left py-5 flex items-center gap-4 flex-wrap"
            >
              <span
                className="font-display uppercase flex-1 min-w-[180px]"
                style={{ fontSize: '20px', color: 'var(--silver)', letterSpacing: '0.04em' }}
              >
                {event.name}
              </span>
              <span className="font-body text-foreground-muted text-label shrink-0">{event.date}</span>
              <div className="flex items-center gap-2 shrink-0">
                <Badge label={event.status} color={STATUS_COLORS[event.status]} />
                <Badge label={event.format} color="var(--border-default)" />
                {event.tierTarget && <Badge label={event.tierTarget} color="var(--border-default)" />}
              </div>
              <span
                className="text-foreground-muted transition-transform duration-200 shrink-0"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: '14px' }}
              >
                ▾
              </span>
            </button>

            {/* Expanded panel */}
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: isOpen ? '600px' : '0px', opacity: isOpen ? 1 : 0 }}
            >
              <div className="pb-8 pt-2">
                <div className="grid gap-6" style={{ gridTemplateColumns: '200px 1fr' }}>
                  {/* Image slot */}
                  <div
                    className="hidden md:flex items-start justify-center rounded"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      aspectRatio: '4/3',
                    }}
                  >
                    <span className="font-body text-foreground-ghost text-label mt-auto mb-auto">
                      {event.eventImage ? 'Image' : 'No image'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-4">
                    <p className="font-body text-foreground-muted text-body font-light leading-[1.7]">
                      {event.description}
                    </p>

                    <div className="flex flex-col gap-2">
                      {(event.date || event.time) && (
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
                      {event.speakers && event.speakers.length > 0 && (
                        <DetailRow label="Speakers" value={event.speakers.join(', ')} />
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
                            <ActionLink label="View Photo Gallery →" href={event.photoGallery ?? '#'} />
                          )}
                          {event.recordingLink && (
                            <ActionLink label="Watch Recording →" href={event.recordingLink ?? '#'} />
                          )}
                          <ActionLink label="Read Recap →" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="font-body uppercase text-foreground-ghost text-label tracking-label w-[100px] shrink-0">
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
      className="font-body uppercase text-label tracking-label text-foreground-muted hover:text-silver hover:-translate-y-px transition-all duration-150"
      style={{ borderBottom: '0.5px solid var(--border-subtle)', paddingBottom: '1px' }}
    >
      {label}
    </a>
  )
}

export default function EventsPage() {
  const [filter, setFilter] = useState('All')
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered = MOCK_EVENTS.filter((e) => filter === 'All' || e.chapter === filter)

  const upcoming = filtered.filter((e) => e.status !== 'Complete')
  const past = filtered.filter((e) => e.status === 'Complete')

  const sagieEvents = upcoming.filter((e) => e.type === 'SAGIE Event')
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
        <div className="relative z-10 max-w-[880px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-20">
          <p className="font-body uppercase text-foreground-muted mb-6 text-label tracking-eyebrow">
            SAGIE ECO Events
          </p>
          <h1 className="font-display uppercase text-foreground mb-6 text-hero leading-[0.9]">
            WHERE THE{'\n'}
            <span className="block">ECOSYSTEM</span>
            <span className="block">COMES TOGETHER.</span>
          </h1>
          <p className="font-body italic text-foreground-muted text-body-lg font-light leading-[1.7] max-w-[520px]">
            Curated events, local happenings and online conversations — designed to create real connection.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="relative z-[1] border-t border-border-strong md:border-border-subtle px-6 md:px-8 py-6">
        <div className="max-w-[880px] mx-auto">
          <EventFilter onChange={(f) => setFilter(f)} />
        </div>
      </section>

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <section className="relative z-[1] overflow-hidden border-t border-border-strong md:border-border-subtle py-12 md:py-20 px-6 md:px-8">
          <GridBackground />
          <div className="relative z-10 max-w-[880px] mx-auto">
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

      <Footer />
    </main>
  )
}
