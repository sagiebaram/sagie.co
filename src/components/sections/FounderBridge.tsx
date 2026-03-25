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

      <AnimatedSection delay={0.1} className="mt-2">
        <div className="flex gap-6 items-start">
          <div className="shrink-0">
            <div
              className="relative overflow-hidden rounded-full border border-border-default"
              style={{ width: 72, height: 72 }}
            >
              <Image src="/founder-portrait.png" alt={FOUNDER.name} fill sizes="72px" className="object-cover" />
            </div>
          </div>

          <div className="min-w-0">
            <p className="font-display text-silver text-founder tracking-heading mb-0.5">
              {FOUNDER.name}
            </p>
            <p className="font-body uppercase text-foreground-dim text-label tracking-label mb-5">
              {FOUNDER.title}
            </p>
            <div className="flex flex-col gap-2.5">
              {FOUNDER.paragraphs.map((para, i) => (
                <p key={i} className="font-body text-foreground-muted text-body-lg font-light leading-[1.75]">
                  {para}
                </p>
              ))}
            </div>
            <a
              href={SITE.founderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body uppercase text-foreground-dim hover:text-foreground-muted transition-colors duration-150 mt-6 inline-block text-caption tracking-label border-b border-border-subtle"
            >
              {FOUNDER.link}
            </a>
          </div>
        </div>
      </AnimatedSection>
    </Section>
  )
}
