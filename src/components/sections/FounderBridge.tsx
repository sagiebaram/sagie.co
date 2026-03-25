'use client'

import Image from 'next/image'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { FOUNDER, SITE } from '@/constants/copy'

export function FounderBridge() {
  return (
    <Section>
      <Eyebrow>{FOUNDER.eyebrow}</Eyebrow>

      <div
        className="hidden md:grid border border-border-default"
        style={{
          gridTemplateColumns: '220px 1fr',
          gap: 0,
        }}
      >
        {/* Photo column */}
        <div
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
      <div className="flex flex-col md:hidden border border-border-default">
        <div
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
    </Section>
  )
}

function FounderContent() {
  return (
    <>
      <span
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
        className="hover:-translate-y-px transition-transform duration-150"
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
