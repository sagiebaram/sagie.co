import { Skeleton } from '@/components/ui/Skeleton'

export default function BlogLoading() {
  return (
    <main id="main-content" className="relative">
      {/* Section: hero + filter + grid — mirrors blog/page.tsx Section wrapper with pt-28 md:pt-36 */}
      <section className="relative z-1 pt-28 md:pt-36 px-6 md:px-8 pb-20">
        <div className="max-w-[880px] mx-auto">

          {/* Page hero area */}
          <Skeleton className="h-3 w-16 mb-6" />
          <Skeleton className="h-16 w-2/3 mb-2" />
          <Skeleton className="h-16 w-1/2 mb-8" />
          <Skeleton className="h-4 w-80 mb-2" />
          <Skeleton className="h-4 w-64 mb-14" />

          {/* Filter bar — pill row */}
          <div className="flex flex-wrap gap-2 mb-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>

          {/* Card grid — 3 cols on lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="w-full aspect-video rounded-sm" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-3/4" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Submit post section */}
          <div className="border-t border-border-subtle pt-12 mt-12">
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-7 w-56 mb-3" />
            <Skeleton className="h-4 w-96 mb-8" />
            <Skeleton className="h-10 w-full max-w-md" />
          </div>
        </div>
      </section>
    </main>
  )
}
