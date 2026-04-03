import { Skeleton } from '@/components/ui/Skeleton'

export default function ResourcesLoading() {
  return (
    <main id="main-content" className="relative">
      {/* Hero — mirrors ResourcesDirectory hero with pt-32 md:pt-40 */}
      <section className="relative z-1 overflow-hidden pt-32 pb-8 md:pt-40 md:pb-10 px-6 md:px-0">
        <div className="max-w-[880px] mx-auto">
          <Skeleton className="h-3 w-24 mb-6" />
          <Skeleton className="h-16 w-3/4 mb-2" />
          <Skeleton className="h-16 w-1/2 mb-8" />
          <Skeleton className="h-4 w-[520px] max-w-full mb-2" />
          <Skeleton className="h-4 w-64 mb-10" />
          <Skeleton className="h-3 w-48" />
        </div>
      </section>

      {/* Featured resource block */}
      <section className="relative z-1 border-t border-border-subtle py-12 md:py-20 px-6 md:px-8">
        <div className="max-w-[880px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
            <div>
              <Skeleton className="h-3 w-32 mb-3" />
              <Skeleton className="h-8 w-56 mb-3" />
              <Skeleton className="h-4 w-full max-w-[480px] mb-2" />
              <Skeleton className="h-4 w-4/5 max-w-[420px] mb-5" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-2" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-2" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="relative z-1 border-t border-border-subtle px-6 md:px-8 py-6">
        <div className="max-w-[880px] mx-auto flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>
      </section>

      {/* Resource grid */}
      <section className="relative z-1 border-t border-border-subtle py-12 md:py-20 px-6 md:px-8">
        <div className="max-w-[880px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-border-default p-7 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <Skeleton className="h-5 w-3/5" />
                  <Skeleton className="h-4 w-4 shrink-0" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <div className="flex items-center justify-between mt-auto pt-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit resource section */}
      <section className="relative z-1 border-t border-border-subtle py-12 md:py-20 px-6 md:px-8">
        <div className="max-w-[880px] mx-auto">
          <Skeleton className="h-3 w-24 mb-4" />
          <Skeleton className="h-9 w-2/3 mb-4" />
          <Skeleton className="h-4 w-[520px] max-w-full mb-2" />
          <Skeleton className="h-4 w-80 mb-10" />
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
      </section>
    </main>
  )
}
