'use client'

import { useLayoutEffect, useRef } from 'react'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { gsap } from '@/lib/gsap'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { FINAL_CTA } from '@/constants/copy'

export function FinalCTA() {
  const sectionRef = useScrollReveal({ y: 24, duration: 0.6 })
  const taglineRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tagline-letter-hi',
        { opacity: 0.1 },
        {
          opacity: 1,
          duration: 0.3,
          stagger: 0.08,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: taglineRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, taglineRef)

    return () => ctx.revert()
  }, [])

  return (
    <Section className="py-[140px]">
      <div ref={sectionRef} className="text-center mx-auto max-w-[700px]">
        <h2 className="font-display uppercase text-foreground mb-10 text-hero-cta leading-[0.9]">
          {FINAL_CTA.heading.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < 2 && <br />}
            </span>
          ))}
        </h2>

        <p ref={taglineRef} className="font-display uppercase mb-6 text-quote tracking-ultra">
          {FINAL_CTA.acronym.map((part, i) => (
            <span key={i}>
              {part.letter === ' ' ? (
                <span className="tagline-letter-hi text-silver">{part.letter}</span>
              ) : (
                <>
                  <span className="tagline-letter-hi text-silver">{part.letter}</span>
                  <span className="text-foreground-ghost">{part.rest}</span>
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

        <Button variant="primary">{FINAL_CTA.cta}</Button>
      </div>
    </Section>
  )
}
