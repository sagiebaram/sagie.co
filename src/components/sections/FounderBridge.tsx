'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { FOUNDER, SITE } from '@/constants/copy'

export function FounderBridge() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      el.querySelectorAll('.founder-photo, .founder-name, .founder-title, .founder-body, .founder-link').forEach((node) => {
        ;(node as HTMLElement).style.opacity = '1'
        ;(node as HTMLElement).style.transform = 'none'
      })
      return
    }

    // Set initial states
    el.querySelectorAll<HTMLElement>('.founder-photo').forEach((node) => {
      node.style.opacity = '0'
      node.style.transform = 'translateX(-40px)'
      node.style.willChange = 'opacity, transform'
    })

    const textEls = Array.from(
      el.querySelectorAll<HTMLElement>('.founder-name, .founder-title, .founder-body, .founder-link')
    )
    textEls.forEach((node) => {
      node.style.opacity = '0'
      node.style.transform = 'translateY(20px)'
      node.style.willChange = 'opacity, transform'
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          // Animate photo from left
          el.querySelectorAll<HTMLElement>('.founder-photo').forEach((node) => {
            node.style.transition = 'opacity 0.7s cubic-bezier(0.33, 1, 0.68, 1), transform 0.7s cubic-bezier(0.33, 1, 0.68, 1)'
            node.style.opacity = '1'
            node.style.transform = 'translateX(0)'
          })

          // Stagger text elements
          textEls.forEach((node, i) => {
            const delay = 0.1 + i * 0.1
            node.style.transition = `opacity 0.5s cubic-bezier(0.33, 1, 0.68, 1) ${delay}s, transform 0.5s cubic-bezier(0.33, 1, 0.68, 1) ${delay}s`
            node.style.opacity = '1'
            node.style.transform = 'translateY(0)'
          })

          // Clean up will-change
          const maxDelay = 0.1 + textEls.length * 0.1 + 0.7
          setTimeout(() => {
            el.querySelectorAll<HTMLElement>('.founder-photo, .founder-name, .founder-title, .founder-body, .founder-link').forEach((node) => {
              node.style.willChange = ''
            })
          }, maxDelay * 1000)

          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 }
    )

    observer.observe(el)

    return () => observer.disconnect()
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
      <div className="founder-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto', paddingTop: '20px' }}>
        <a
          href={SITE.founderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:-translate-y-px transition-transform duration-150"
          style={{
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--silver)',
            borderBottom: '0.5px solid var(--text-muted)',
            paddingBottom: '2px',
            textDecoration: 'none',
          }}
        >
          {FOUNDER.link}
        </a>
        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>|</span>
        <a
          href="https://www.linkedin.com/in/sagie-baram"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:-translate-y-px transition-transform duration-150"
          style={{
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--silver)',
            borderBottom: '0.5px solid var(--text-muted)',
            paddingBottom: '2px',
            textDecoration: 'none',
          }}
        >
          LinkedIn
        </a>
      </div>
    </>
  )
}
