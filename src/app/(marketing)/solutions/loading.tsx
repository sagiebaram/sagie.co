import { Skeleton } from '@/components/ui/Skeleton'

export default function SolutionsLoading() {
  return (
    <main className="relative">
      {/* Hero — mirrors solutions/page.tsx with pt-32 md:pt-40 */}
      <section className="relative z-1 overflow-hidden">
        <div className="max-w-[880px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
          <Skeleton className="h-3 w-36 mb-4" />
          <Skeleton className="h-16 w-2/3 mb-2" />
          <Skeleton className="h-16 w-3/5 mb-8" />
          <Skeleton className="h-4 w-96 mb-2" />
          <Skeleton className="h-4 w-80 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
      </section>

      {/* How it works — 3-col grid */}
      <section className="relative z-1 py-16 md:py-24 px-6 md:px-8">
        <div className="max-w-[880px] mx-auto">
          <Skeleton className="h-3 w-28 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="py-6 border-t border-border-subtle">
                <Skeleton className="h-4 w-8 mb-2" />
                <Skeleton className="h-5 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service categories — 3-col grid */}
      <section className="relative z-1 py-16 md:py-24 px-6 md:px-8">
        <div className="max-w-[880px] mx-auto">
          <Skeleton className="h-3 w-36 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-border-default p-8">
                <Skeleton className="h-5 w-2/3 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gated bar */}
      <section className="relative z-1 border-t border-border-strong border-b border-b-border-strong">
        <div className="max-w-[880px] mx-auto px-6 md:px-8 py-10 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-[560px] flex flex-col gap-2">
            <Skeleton className="h-4 w-full max-w-[480px]" />
            <Skeleton className="h-4 w-4/5 max-w-[420px]" />
          </div>
          <Skeleton className="h-4 w-28 shrink-0" />
        </div>
      </section>

      {/* Community providers */}
      <section className="relative z-1 py-16 md:py-24 px-6 md:px-8">
        <div className="max-w-[880px] mx-auto">
          <Skeleton className="h-3 w-40 mb-8" />
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-24 rounded-full" />
            ))}
          </div>
          {/* Provider cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-border-default p-7 flex flex-col gap-3">
                <Skeleton className="h-5 w-3/5" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-20 mt-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
