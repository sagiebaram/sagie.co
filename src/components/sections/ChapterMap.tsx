import { Section } from '@/components/ui/Section'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Button } from '@/components/ui/Button'
import { CHAPTERS, CHAPTER_SECTION } from '@/constants/copy'

export function ChapterMap() {
  return (
    <Section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
        <AnimatedSection>
          <Eyebrow>{CHAPTER_SECTION.eyebrow}</Eyebrow>
          <h2 className="font-display uppercase text-foreground mb-6 text-chapter leading-[0.95]">
            {CHAPTER_SECTION.heading.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
          </h2>
          <p className="font-body text-foreground-dim mb-10 text-body-lg font-light leading-[1.75] max-w-[380px]">
            {CHAPTER_SECTION.body}
          </p>
          <Button variant="primary">{CHAPTER_SECTION.cta}</Button>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          {CHAPTERS.map((item) => (
            <div
              key={item.city}
              className="flex items-center justify-between px-2 py-5 group hover:bg-background-card-featured transition-colors duration-150 -mx-2 border-b border-border-subtle"
            >
              <p className="font-body text-foreground-muted group-hover:text-silver transition-colors duration-150 text-subhead">
                {item.city}
              </p>
              <span
                className="font-body uppercase px-2.5 py-1 text-label tracking-label"
                style={{ border: `0.5px solid ${item.borderColor}`, color: item.textColor }}
              >
                {item.badge}
              </span>
            </div>
          ))}
        </AnimatedSection>
      </div>
    </Section>
  )
}
