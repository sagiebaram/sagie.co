'use client'

import { useState } from 'react'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { FAQ_EYEBROW } from '@/constants/copy'

const FAQS = [
  {
    q: 'How do I become a part of SAGIE ECO?',
    a: 'Every application is reviewed — not accepted automatically. The community is curated by design. Start by sharing who you are, what you\u2019re building, and what a community means to you.',
  },
  {
    q: 'How do I provide services at SAGIE Solutions?',
    a: 'You have to be a community member and a Builder. Your expertise will be vetted before being offered to other members or clients outside the community.',
  },
  {
    q: 'How do I align with SAGIE Ventures?',
    a: 'Your startup, company or venture is all about positive impact or innovation? Reach out and see if we\u2019re a match.',
  },
  {
    q: 'How is SAGIE different from other communities or networks?',
    a: 'We are not another community or network. We are a living ecosystem built on the belief that when people are genuinely connected by mindset, values and principles, they can bridge backgrounds, cultures, borders and industries. They don\u2019t just grow individually — they shape what\u2019s next as a collective. We operate across interconnected pillars combining community, services and capital — designed not just to create relationships, but to activate them.',
  },
  {
    q: 'What does it mean that tiers are earned?',
    a: 'There\u2019s no upgrade path you can buy into. Explorer is where everyone starts. Builder is what you become when you consistently show up and create value for others — the community feels the difference you make. Shaper isn\u2019t applied for — it\u2019s an invitation extended when the time is right. That\u2019s how progression works here.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <Section>
      <Eyebrow>{FAQ_EYEBROW}</Eyebrow>

      <div style={{ borderTop: '1px solid var(--border-default)' }}>
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i
          const panelId = `faq-panel-${i}`
          const headingId = `faq-heading-${i}`

          return (
            <div key={i} style={{ borderBottom: '1px solid var(--border-default)' }}>
              <h3 style={{ margin: 0 }}>
                <button
                  type="button"
                  id={headingId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '3px 48px 1fr auto',
                    gap: '0 16px',
                    alignItems: 'start',
                    padding: '24px 0',
                    cursor: 'pointer',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    font: 'inherit',
                    color: 'inherit',
                  }}
                >
                  {/* Accent bar */}
                  <span
                    aria-hidden="true"
                    style={{
                      height: '100%',
                      minHeight: '24px',
                      background: isOpen ? 'var(--silver)' : 'var(--border-subtle)',
                      transition: 'background 0.2s',
                      display: 'block',
                    }}
                  />

                  {/* Number */}
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '16px',
                      letterSpacing: '0.14em',
                      color: isOpen ? 'var(--text-muted)' : 'var(--text-ghost)',
                      lineHeight: '1.5',
                      transition: 'color 0.2s',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Question text */}
                  <span
                    style={{
                      fontSize: '18px',
                      color: isOpen ? 'var(--silver)' : 'var(--text-secondary)',
                      fontWeight: 400,
                      lineHeight: '1.5',
                      transition: 'color 0.2s',
                    }}
                  >
                    {faq.q}
                  </span>

                  {/* Icon */}
                  <span
                    aria-hidden="true"
                    style={{
                      fontSize: '24px',
                      color: isOpen ? 'var(--text-secondary)' : 'var(--text-dim)',
                      lineHeight: '1.15',
                      marginTop: '0px',
                      transition: 'color 0.2s',
                      userSelect: 'none',
                    }}
                  >
                    {isOpen ? '\u2212' : '+'}
                  </span>
                </button>
              </h3>

              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headingId}
                  style={{ paddingBottom: '24px', paddingLeft: '67px' }}
                >
                  <p
                    style={{
                      fontSize: '16px',
                      color: 'var(--text-muted)',
                      lineHeight: '1.8',
                      fontWeight: 300,
                      maxWidth: '640px',
                      marginTop: '0',
                    }}
                  >
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Section>
  )
}
