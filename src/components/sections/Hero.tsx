import Image from 'next/image'
import { GridBackground } from '@/components/ui/GridBackground'
import { Button } from '@/components/ui/Button'
import { HERO } from '@/constants/copy'

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen bg-surface">
      <GridBackground />
      <div className="relative z-10 max-w-[880px] mx-auto px-8 min-h-screen grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-16">

        <div className="flex flex-col justify-center py-16">
          <h1 className="font-bebas uppercase mb-8 text-hero leading-[0.9]">
            {HERO.headingLines.map((line) => (
              <span key={line.text} className={`block ${line.colorClass}`}>
                {line.text}
              </span>
            ))}
          </h1>

          <p className="font-dm italic text-ink-11 mb-10 text-body-lg font-light leading-[1.7] max-w-[380px]">
            {HERO.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Button variant="primary">{HERO.primaryCta}</Button>
            <Button variant="ghost">{HERO.secondaryCta}</Button>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-full max-w-[420px]" style={{ aspectRatio: '1 / 0.6' }}>
            <Image src="/logo-white.png" alt="SAGIE" fill className="object-contain opacity-15" />
          </div>
        </div>

      </div>
    </section>
  )
}
