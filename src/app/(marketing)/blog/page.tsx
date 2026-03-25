import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { BlogFilter } from '@/components/ui/BlogFilter'

export default function BlogPage() {
  return (
    <main className="relative">
      <Navbar />

      <Section className="pt-28 md:pt-36">
        <Eyebrow>The Blog</Eyebrow>
        <h1 className="font-display uppercase text-hero leading-[0.95] tracking-heading mb-5">
          <span className="text-silver">IDEAS FROM</span>
          <br />
          <span className="text-foreground">THE ECOSYSTEM.</span>
        </h1>
        <p className="font-body text-foreground-muted font-light text-body leading-[1.75] max-w-[520px] mb-14">
          Personal writing, community spotlights, event recaps and thought leadership from SAGIE.
        </p>

        <BlogFilter />
      </Section>

      <Footer />
    </main>
  )
}
