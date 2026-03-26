import { ResourcesDirectory } from '@/components/sections/ResourcesDirectory'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getResources, type Resource } from '@/lib/resources'

export const revalidate = 3600

export const metadata = {
  title: 'Resources — SAGIE',
  description: 'Curated tools and resources for the startup ecosystem. Accelerators, incubators, providers and more.',
}

export default async function ResourcesPage() {
  let resources: Resource[] = []

  try {
    resources = await getResources()
  } catch (e) {
    console.error('Failed to fetch resources:', e)
  }

  return (
    <main className="relative">
      <CircuitBackground />
      <Navbar />
      <ResourcesDirectory resources={resources} />
      <Footer />
    </main>
  )
}
