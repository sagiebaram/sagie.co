import { Skeleton } from '@/components/ui/Skeleton'

export default function ContributeLoading() {
  return (
    <main id="main-content" className="relative">
      <section className="relative pt-[160px] pb-[100px] px-6 md:px-8">
        <div className="relative max-w-[1200px] mx-auto">
          <Skeleton className="h-4 w-40 mb-6" />
          <Skeleton className="h-20 w-64 mb-3" />
          <Skeleton className="h-20 w-64 mb-3" />
          <Skeleton className="h-20 w-40 mb-8" />
          <Skeleton className="h-4 w-[520px] max-w-full mb-2" />
          <Skeleton className="h-4 w-[420px] max-w-full mb-12" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-56" />
            <Skeleton className="h-12 w-44" />
          </div>
        </div>
      </section>

      <div className="border-y border-border-subtle py-3">
        <Skeleton className="h-3 w-full" />
      </div>

      <section className="relative py-20 px-6 md:px-8">
        <div className="relative max-w-[1200px] mx-auto">
          <Skeleton className="h-3 w-32 mb-3" />
          <Skeleton className="h-14 w-80 mb-4" />
          <Skeleton className="h-4 w-[420px] max-w-full mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] mb-[2px]">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
