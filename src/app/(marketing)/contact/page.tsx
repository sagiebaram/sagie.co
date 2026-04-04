import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { GridBackground } from '@/components/ui/GridBackground'
import { ContactForm } from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with SAGIE. Reach out for partnerships, speaking inquiries, media requests, or general questions.',
}

export default function ContactPage() {
  return (
    <main className="relative">
      <CircuitBackground />
      <Navbar />

      <section className="relative z-[1] overflow-hidden">
        <GridBackground />
        <div className="relative z-10 max-w-[880px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
          <p className="font-body uppercase text-foreground-muted mb-4 text-label tracking-eyebrow">
            Get in Touch
          </p>
          <h1 className="font-display uppercase text-hero leading-[0.9] mb-8">
            <span className="block text-foreground-dim">LET&apos;S</span>
            <span className="block text-foreground-secondary">CONNECT.</span>
          </h1>
          <p className="font-body italic text-foreground-muted text-body-lg font-light leading-[1.7] max-w-[380px] mb-12">
            Whether it&apos;s a partnership, a speaking opportunity, or just a conversation — we&apos;re listening.
          </p>
          <h2 className="font-display uppercase text-foreground text-manifesto tracking-heading mb-8">
            Send us a message.
          </h2>
          <ContactForm />
        </div>
      </section>

      <Footer />
    </main>
  )
}
