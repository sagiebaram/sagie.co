import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { Hero } from '@/components/sections/Hero'
import { Manifesto } from '@/components/sections/Manifesto'
import { Pillars } from '@/components/sections/Pillars'
import { WhoItsFor } from '@/components/sections/WhoItsFor'
import { SocialProof } from '@/components/sections/SocialProof'
import { ChapterMap } from '@/components/sections/ChapterMap'
import { Tiers } from '@/components/sections/Tiers'
import { FounderBridge } from '@/components/sections/FounderBridge'
import { FAQ } from '@/components/sections/FAQ'
import { FinalCTA } from '@/components/sections/FinalCTA'

export default function HomePage() {
  return (
    <main className="relative">
      <CircuitBackground />
      <Navbar />
      <Hero />
      <Manifesto />
      <Pillars />
      <WhoItsFor />
      <SocialProof />
      <ChapterMap />
      <Tiers />
      <FAQ />
      <FounderBridge />
      <FinalCTA />
      <Footer />
    </main>
  )
}
