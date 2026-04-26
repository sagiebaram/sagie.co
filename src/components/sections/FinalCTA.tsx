'use client'

import { useEffect, useRef } from 'react'
import { Section } from '@/components/ui/Section'

import { useScrollReveal } from '@/hooks/useScrollReveal'
import { FINAL_CTA } from '@/constants/copy'

export function FinalCTA() {
  const sectionRef = useScrollReveal({ y: 24, duration: 0.6 })
  const taglineRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = taglineRef.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      el.querySelectorAll<HTMLElement>('.tagline-letter-hi').forEach((node) => {
        node.style.opacity = '1'
      })
      return
    }

    // Set initial dim state
    const letters = Array.from(el.querySelectorAll<HTMLElement>('.tagline-letter-hi'))
    letters.forEach((node) => { node.style.opacity = '0.1' })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          letters.forEach((node, i) => {
            const delay = i * 0.08
            node.style.transition = `opacity 0.3s ease-out ${delay}s`
            node.style.opacity = '1'
          })

          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 }
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return (
    <Section className="py-[140px]">
      <div ref={sectionRef} className="text-center mx-auto max-w-[700px]">
        <div style={{ marginBottom: '40px' }}>
          <span style={{
            display: 'block',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(60px, 8vw, 90px)',
            color: 'var(--text-primary)',
            lineHeight: '0.92',
            letterSpacing: '0.02em',
          }}>A VISION.</span>
          <span style={{
            display: 'block',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(60px, 8vw, 90px)',
            color: 'var(--text-secondary)',
            lineHeight: '0.92',
            letterSpacing: '0.02em',
          }}>A MOVEMENT.</span>
          <span style={{
            display: 'block',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(60px, 8vw, 90px)',
            color: 'var(--text-dim)',
            lineHeight: '0.92',
            letterSpacing: '0.02em',
          }}>AN ECOSYSTEM.</span>
        </div>

        <p ref={taglineRef} className="font-display uppercase mb-6 text-quote tracking-ultra">
          {FINAL_CTA.acronym.map((part, i) => (
            <span key={i}>
              {part.letter === ' ' ? (
                <span className="tagline-letter-hi text-silver">{part.letter}</span>
              ) : (
                <>
                  <span className="tagline-letter-hi text-silver">{part.letter}</span>
                  <span className="text-foreground-dim">{part.rest}</span>
                </>
              )}
            </span>
          ))}
        </p>

        <p className="font-body text-foreground-muted mb-12 text-subhead font-light leading-[1.7]">
          {FINAL_CTA.subtitle.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i === 0 && <br />}
            </span>
          ))}
        </p>

        <span className="inline-block font-body uppercase text-button tracking-button px-[34px] py-4 opacity-40 cursor-default border border-border-subtle text-foreground-muted">
          Coming Soon
        </span>
      </div>
    </Section>
  )
}
