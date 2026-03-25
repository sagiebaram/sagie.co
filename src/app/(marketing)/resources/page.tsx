import { ResourcesDirectory } from '@/components/sections/ResourcesDirectory'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Resources — SAGIE',
  description: 'Curated tools and resources for the startup ecosystem. Accelerators, incubators, providers and more.',
}

export default function ResourcesPage() {
  return (
    <main className="relative">
      <CircuitBackground />
      <Navbar />
      <ResourcesDirectory />
      <Footer />
    </main>
  )
}
