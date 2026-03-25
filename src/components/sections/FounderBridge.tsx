import Image from 'next/image'
import { Section } from '@/components/ui/Section'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { FOUNDER, SITE } from '@/constants/copy'

export function FounderBridge() {
  return (
    <Section>
      <AnimatedSection>
        <Eyebrow>{FOUNDER.eyebrow}</Eyebrow>
      </AnimatedSection>

      <AnimatedSection
        delay={0.1}
        className="grid mt-2"
        style={{ gridTemplateColumns: '96px 1fr' }}
      >
        <div className="pt-1">
          <div
            className="relative overflow-hidden rounded-full border border-ink-2"
            style={{ width: 72, height: 72 }}
          >
            <Image src="/founder-portrait.png" alt={FOUNDER.name} fill className="object-cover" />
          </div>
        </div>

        <div>
          <p className="font-bebas text-silver text-founder tracking-heading mb-0.5">
            {FOUNDER.name}
          </p>
          <p className="font-dm uppercase text-ink-4 text-label tracking-label mb-5">
            {FOUNDER.title}
          </p>
          <div className="flex flex-col gap-2.5">
            {FOUNDER.paragraphs.map((para, i) => (
              <p key={i} className="font-dm text-ink-8 text-body-lg font-light leading-[1.75]">
                {para}
              </p>
            ))}
          </div>
          <a
            href={SITE.founderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-dm uppercase text-ink-5 hover:text-ink-11 transition-colors duration-150 mt-6 inline-block text-caption tracking-label border-b border-ink-1"
          >
            {FOUNDER.link}
          </a>
        </div>
      </AnimatedSection>
    </Section>
  )
}
