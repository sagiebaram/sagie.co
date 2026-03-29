import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { Hero } from '@/components/sections/Hero'
import { Belief } from '@/components/sections/Belief'
import { Pillars } from '@/components/sections/Pillars'
import { WhoItsFor } from '@/components/sections/WhoItsFor'
import { SocialProof } from '@/components/sections/SocialProof'
import { GlobeShell } from '@/components/GlobeShell'
import { ChapterMap } from '@/components/sections/ChapterMap'
import { getChapters } from '@/lib/chapters'
import { Tiers } from '@/components/sections/Tiers'
import { FounderBridge } from '@/components/sections/FounderBridge'
import { FAQ } from '@/components/sections/FAQ'
import { FinalCTA } from '@/components/sections/FinalCTA'

export default async function HomePage() {
  const chapters = await getChapters()

  return (
    <main className="relative">
      <CircuitBackground />
      <Navbar />
      <Hero />
      <Belief />
      <Pillars />
      <WhoItsFor />
      <SocialProof globe={<GlobeShell />} />
      <ChapterMap chapters={chapters} />
      <Tiers />
      <FAQ />
      <FounderBridge />
      <FinalCTA />
      <Footer />
    </main>
  )
}
