import { Logo } from '@/components/ui/Logo'
import { GridBackground } from '@/components/ui/GridBackground'
import { Button } from '@/components/ui/Button'
import { HeroAnimation } from '@/components/sections/HeroAnimation'
import { HERO } from '@/constants/copy'

export function Hero() {
  return (
    <section className="relative z-[1] overflow-hidden min-h-screen">
      <GridBackground />
      <HeroAnimation>
        <div className="relative z-10 max-w-[880px] mx-auto px-8 min-h-screen grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-16">

          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full max-w-[420px]" style={{ aspectRatio: '1 / 0.6' }}>
              <Logo width={420} height={252} className="object-contain" />
            </div>
          </div>

          <div className="flex flex-col justify-center py-16">
            <h1 className="font-display uppercase mb-8 text-hero leading-[0.9]">
              {HERO.headingLines.map((line) => (
                <span key={line.text} className={`hero-line block ${line.colorClass}`}>
                  {line.text}
                </span>
              ))}
            </h1>

            <p className="hero-body font-body italic text-foreground-muted mb-10 text-body-lg font-light leading-[1.7] max-w-[380px]">
              {HERO.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Button variant="primary" className="hero-cta">{HERO.primaryCta}</Button>
            </div>
          </div>

        </div>
      </HeroAnimation>
    </section>
  )
}
