import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { PILLARS } from '@/constants/pillars'

const PILLAR_ACCENT: Record<string, string> = {
  ECO: 'var(--eco)',
  SOLUTIONS: 'var(--solutions)',
  VENTURES: 'var(--ventures)',
}

const PILLAR_HREF: Record<string, string> = {
  ECO: '/eco',
  SOLUTIONS: '/solutions',
  VENTURES: '/ventures',
}

export function Pillars() {
  return (
    <Section>
      <Eyebrow>The Pillars</Eyebrow>

      <ScrollReveal selector=".pillar-row" stagger={0.1} y={20} duration={0.5} className="border-t border-line">
        {PILLARS.map((pillar) => {
          const accent = PILLAR_ACCENT[pillar.word] ?? 'var(--silver)'
          const href = PILLAR_HREF[pillar.word] ?? '#'
          return (
            <div
              key={pillar.word}
              className="pillar-row group relative grid grid-cols-1 md:grid-cols-[360px_1fr] gap-5 md:gap-12 py-10 border-b border-line cursor-pointer transition-colors duration-300 hover:bg-[var(--bg-card)]"
              style={{ '--pillar-accent': accent } as React.CSSProperties}
            >
              {/* Left edge accent bar */}
              <div
                className="absolute left-[-24px] top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: accent }}
              />

              {/* Left column */}
              <div>
                <div
                  className="w-2.5 h-2.5 rounded-full mb-4"
                  style={{ background: accent, boxShadow: `0 0 16px ${accent}` }}
                />
                <h3 className="font-display uppercase leading-[0.88] mb-3" style={{ fontSize: 'clamp(42px, 4.5vw, 68px)', letterSpacing: '-0.02em' }}>
                  <span className="block text-ink-muted text-[0.55em] tracking-[0.02em] mb-1">SAGIE</span>
                  <span style={{ color: accent }}>{pillar.word}</span>
                </h3>
                <p className="font-body text-micro tracking-micro uppercase text-ink-muted">
                  {pillar.subtitle}
                </p>
              </div>

              {/* Right column */}
              <div className="pt-2">
                <p className="font-serif italic font-light text-ink leading-[1.25] mb-4" style={{ fontSize: 'var(--text-manifesto)', letterSpacing: 'var(--tracking-serif)' }}>
                  {pillar.where}
                </p>
                <p className="font-body text-body-lg text-ink-muted leading-[1.65] max-w-[560px] mb-6">
                  {pillar.desc}
                </p>
                <a
                  href={href}
                  className="pillar-link font-body text-caption tracking-[0.06em] pb-1 transition-all duration-200"
                  style={{
                    color: accent,
                    borderBottom: `1px solid color-mix(in oklch, ${accent} 40%, transparent)`,
                  }}
                >
                  Explore /{pillar.word.toLowerCase()} →
                </a>
              </div>
            </div>
          )
        })}
      </ScrollReveal>
    </Section>
  )
}
