import { Section } from '@/components/ui/Section'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { FAQAccordion } from '@/components/ui/FAQAccordion'
import { FAQS } from '@/constants/faq'
import { FAQ_EYEBROW } from '@/constants/copy'

export function FAQ() {
  return (
    <Section>
      <AnimatedSection>
        <Eyebrow>{FAQ_EYEBROW}</Eyebrow>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <FAQAccordion items={FAQS} />
      </AnimatedSection>
    </Section>
  )
}
