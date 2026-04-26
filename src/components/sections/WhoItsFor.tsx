'use client'

import { useState, useRef, useCallback } from 'react'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { PillarIcon } from '@/components/ui/PillarIcon'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { getGSAP } from '@/lib/gsap'
import { PERSONAS } from '@/constants/personas'

export function WhoItsFor() {
  const [activeCards, setActiveCards] = useState<Set<number>>(new Set())
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const tlRefs = useRef<(gsap.core.Timeline | null)[]>([])

  const ref = useScrollReveal({
    selector: '.persona-card',
    stagger: 0.08,
    y: 24,
    duration: 0.6,
  })

  const toggleCard = useCallback(async (i: number) => {
    const isActive = activeCards.has(i)
    const card = cardRefs.current[i]
    if (!card) return

    const front = card.querySelector<HTMLElement>('.face-front')
    const back = card.querySelector<HTMLElement>('.face-back')
    if (!front || !back) return

    const { gsap } = await getGSAP()

    // Kill any running animation on this card
    if (tlRefs.current[i]) tlRefs.current[i]!.kill()

    setActiveCards(prev => {
      const next = new Set(prev)
      if (isActive) next.delete(i); else next.add(i)
      return next
    })

    const showEl = isActive ? front : back
    const hideEl = isActive ? back : front

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(hideEl, { visibility: 'hidden', opacity: 1, scale: 1 })
      },
    })
    tlRefs.current[i] = tl

    // Crossfade: both happen simultaneously
    gsap.set(showEl, { visibility: 'visible', opacity: 0, scale: 1.03 })
    tl.to(hideEl, { opacity: 0, scale: 0.96, duration: 0.3, ease: 'power2.inOut' }, 0)
    tl.to(showEl, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.inOut' }, 0)
  }, [activeCards])

  return (
    <Section>
      <Eyebrow>Who it&apos;s for</Eyebrow>

      <p style={{
        fontSize: '13px',
        color: 'var(--silver)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '24px',
        fontFamily: 'var(--font-body)',
      }}>Click any card to learn what&apos;s in it for you.</p>

      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px">
        {PERSONAS.map((persona, i) => {
          return (
            <div
              key={persona.name}
              ref={el => { cardRefs.current[i] = el }}
              className="persona-card cursor-pointer border border-border-default hover:bg-background-card-featured transition-all duration-200"
              style={{ position: 'relative' }}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${persona.name}`}
              aria-pressed={activeCards.has(i)}
              onClick={() => toggleCard(i)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard(i) } }}
            >
              {/* Front face */}
              <div
                className="face-front group flex flex-col gap-5 px-8 py-10"
                style={{ position: 'relative' }}
              >
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  fontSize: '9px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  border: '1px solid var(--border-strong)',
                  padding: '5px 12px',
                }}>
                  {persona.frontLabel}
                </span>
                <div className="size-10">
                  <PillarIcon name={persona.name} />
                </div>
                <p className="font-display uppercase text-silver group-hover:text-foreground transition-colors duration-150 text-persona tracking-heading">
                  {persona.name}
                </p>
                <p className="font-body text-foreground-muted group-hover:text-foreground-secondary transition-colors duration-150 text-body font-light leading-[1.7]">
                  {persona.line}
                </p>
              </div>

              {/* Back face */}
              <div
                className="face-back flex flex-col gap-5 px-8 py-10"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderColor: 'var(--silver)',
                  background: 'var(--bg-card-featured)',
                  visibility: 'hidden',
                }}
              >
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  fontSize: '9px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--silver)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  border: '1px solid var(--silver)',
                  padding: '5px 12px',
                }}>
                  {persona.backLabel}
                </span>
                <div className="size-10">
                  <PillarIcon name={persona.name} />
                </div>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '28px',
                  color: 'var(--silver)',
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                }}>
                  {persona.name}
                </span>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.8',
                  fontWeight: 300,
                }}>
                  {persona.expanded}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
