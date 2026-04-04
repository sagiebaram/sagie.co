import { Suspense } from 'react'
import { ResourcesDirectory } from '@/components/sections/ResourcesDirectory'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { Skeleton } from '@/components/ui/Skeleton'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getResources, type Resource } from '@/lib/resources'

export const revalidate = 3600

export const metadata = {
  title: 'Resources',
  description:
    'Curated tools and resources for the startup ecosystem. Accelerators, incubators, providers and more.',
  openGraph: {
    title: 'Resources | SAGIE',
    description:
      'Curated tools and resources for the startup ecosystem. Accelerators, incubators, providers and more.',
  },
}

function ResourcesSkeleton() {
  return (
    <div className="max-w-[880px] mx-auto px-6 md:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-7 border border-border-default">
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

async function ResourcesContent() {
  let resources: Resource[] = []

  try {
    resources = await getResources()
  } catch (e) {
    console.error('Failed to fetch resources:', e)
  }

  return <ResourcesDirectory resources={resources} />
}

export default function ResourcesPage() {
  return (
    <main id="main-content" className="relative">
      <CircuitBackground />
      <Navbar />
      <Suspense fallback={<ResourcesSkeleton />}>
        <ResourcesContent />
      </Suspense>
      <Footer />
    </main>
  )
}
