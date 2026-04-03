import { Skeleton } from '@/components/ui/Skeleton'

export default function EventsLoading() {
  return (
    <main id="main-content" className="relative">
      {/* Hero — mirrors EventsPageClient hero with pt-32 md:pt-40 */}
      <section className="relative z-1 overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20 px-6 md:px-8">
        <div className="max-w-[880px] mx-auto">
          <Skeleton className="h-3 w-32 mb-6" />
          <Skeleton className="h-16 w-2/3 mb-2" />
          <Skeleton className="h-16 w-3/4 mb-2" />
          <Skeleton className="h-16 w-1/2 mb-8" />
          <Skeleton className="h-4 w-96 mb-2" />
          <Skeleton className="h-4 w-80 mb-10" />
        </div>
      </section>

      {/* Upcoming events section */}
      <section className="relative z-1 border-t border-border-subtle py-12 md:py-20 px-6 md:px-8">
        <div className="max-w-[880px] mx-auto">
          <Skeleton className="h-3 w-20 mb-8" />

          {/* Type divider */}
          <div className="flex items-center gap-4 mt-10 mb-4">
            <Skeleton className="h-5 w-32 shrink-0" />
            <Skeleton className="flex-1 h-px" />
          </div>

          {/* Event rows — name · date · status badges */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-b border-border-subtle py-5 flex items-center gap-4 flex-wrap">
              <Skeleton className="h-5 flex-1 min-w-[180px] max-w-xs" />
              <Skeleton className="h-3 w-24 shrink-0" />
              <div className="flex items-center gap-2 shrink-0">
                <Skeleton className="h-5 w-20 rounded-sm" />
                <Skeleton className="h-5 w-16 rounded-sm" />
              </div>
              <Skeleton className="h-4 w-4 shrink-0" />
            </div>
          ))}

          {/* Second type divider */}
          <div className="flex items-center gap-4 mt-10 mb-4">
            <Skeleton className="h-5 w-28 shrink-0" />
            <Skeleton className="flex-1 h-px" />
          </div>

          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="border-b border-border-subtle py-5 flex items-center gap-4 flex-wrap">
              <Skeleton className="h-5 flex-1 min-w-[180px] max-w-sm" />
              <Skeleton className="h-3 w-24 shrink-0" />
              <div className="flex items-center gap-2 shrink-0">
                <Skeleton className="h-5 w-20 rounded-sm" />
              </div>
              <Skeleton className="h-4 w-4 shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* Suggest an event section */}
      <section className="relative z-1 border-t border-border-subtle py-16 md:py-24 px-6 md:px-8">
        <div className="max-w-[880px] mx-auto">
          <Skeleton className="h-3 w-24 mb-6" />
          <Skeleton className="h-8 w-2/3 mb-4" />
          <Skeleton className="h-4 w-96 mb-2" />
          <Skeleton className="h-4 w-80 mb-8" />
          <Skeleton className="h-4 w-40" />
        </div>
      </section>
    </main>
  )
}
