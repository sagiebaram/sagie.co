import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { GridBackground } from '@/components/ui/GridBackground'

export const metadata: Metadata = {
  title: 'Apply — Ventures',
}

export default function ApplyVenturesForkPage() {
  return (
    <main id="main-content" className="relative">
      <CircuitBackground />
      <Navbar />

      <section className="relative z-1 overflow-hidden">
        <GridBackground />
        <div className="relative z-10 max-w-[880px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
          <p className="font-body uppercase text-foreground-muted mb-4 text-label tracking-eyebrow">
            SAGIE Ventures
          </p>
          <h1 className="font-display uppercase text-hero leading-[0.9] mb-8">
            <span className="block text-foreground-dim">BUILD SOMETHING</span>
            <span className="block text-foreground-secondary">THAT MATTERS.</span>
          </h1>
          <p className="font-body italic text-foreground-muted text-body-lg font-light leading-[1.7] max-w-[480px] mb-16">
            Whether you&apos;re building the next big thing or backing it — start here.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[640px]">
            <Link
              href="/apply/ventures/founder"
              className="group border border-border-default hover:border-silver/40 transition-colors p-8 flex flex-col justify-between min-h-[180px]"
            >
              <div>
                <p className="font-display uppercase text-foreground text-xl tracking-wide mb-2">
                  Founder
                </p>
                <p className="font-body text-foreground-muted text-sm leading-relaxed">
                  Show us what you&apos;re building. Apply for portfolio consideration.
                </p>
              </div>
              <p className="font-body text-silver text-sm mt-6 group-hover:translate-x-1 transition-transform">
                I&apos;m a Founder →
              </p>
            </Link>

            <Link
              href="/apply/ventures/investor"
              className="group border border-border-default hover:border-silver/40 transition-colors p-8 flex flex-col justify-between min-h-[180px]"
            >
              <div>
                <p className="font-display uppercase text-foreground text-xl tracking-wide mb-2">
                  Investor
                </p>
                <p className="font-body text-foreground-muted text-sm leading-relaxed">
                  Community-sourced deal flow built on trust. Join the network.
                </p>
              </div>
              <p className="font-body text-silver text-sm mt-6 group-hover:translate-x-1 transition-transform">
                I&apos;m an Investor →
              </p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
