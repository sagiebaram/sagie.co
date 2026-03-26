'use client'

import { useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { FOUNDER, SITE } from '@/constants/copy'
import { gsap } from '@/lib/gsap'

export function FounderBridge() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      // Photo slides in from left
      gsap.fromTo(
        '.founder-photo',
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Text elements stagger in
      gsap.fromTo(
        ['.founder-name', '.founder-title', '.founder-body', '.founder-link'],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <Section>
      <Eyebrow>{FOUNDER.eyebrow}</Eyebrow>

      <div ref={sectionRef}>
        {/* Desktop: side-by-side */}
        <div
          className="hidden md:grid"
          style={{
            gridTemplateColumns: '220px 1fr',
            gap: 0,
          }}
        >
          {/* Photo column */}
          <div
            className="founder-photo"
            style={{
              minHeight: '320px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Image
              src="/founder-portrait.png"
              alt={FOUNDER.name}
              width={220}
              height={320}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>

          {/* Text column */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '32px 28px',
            }}
          >
            <FounderContent />
          </div>
        </div>

        {/* Mobile: stacked */}
        <div className="flex flex-col md:hidden">
          <div
            className="founder-photo"
            style={{
              height: '360px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Image
              src="/founder-portrait.png"
              alt={FOUNDER.name}
              width={400}
              height={360}
              style={{ objectFit: 'cover', objectPosition: 'top', width: '100%', height: '100%' }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '28px 24px',
            }}
          >
            <FounderContent />
          </div>
        </div>
      </div>
    </Section>
  )
}

function FounderContent() {
  return (
    <>
      <span
        className="founder-name"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          color: 'var(--silver)',
          letterSpacing: '0.04em',
          lineHeight: 1,
          marginBottom: '2px',
        }}
      >
        {FOUNDER.name}
      </span>
      <span
        className="founder-title"
        style={{
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--silver)',
          marginBottom: '20px',
          fontWeight: 400,
        }}
      >
        {FOUNDER.title}
      </span>
      <div
        className="founder-body"
        style={{
          fontSize: '14px',
          color: 'var(--text-muted)',
          lineHeight: 1.75,
          fontWeight: 300,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {FOUNDER.paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <a
        href={SITE.founderUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="founder-link hover:-translate-y-px transition-transform duration-150"
        style={{
          fontSize: '11px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--silver)',
          borderBottom: '0.5px solid var(--text-muted)',
          paddingBottom: '2px',
          display: 'inline-block',
          marginTop: '20px',
          textDecoration: 'none',
          width: 'fit-content',
        }}
      >
        {FOUNDER.link}
      </a>
    </>
  )
}
