import { Skeleton } from '@/components/ui/Skeleton'

export default function MarketingLoading() {
  return (
    <main className="relative">
      {/* Hero area placeholder */}
      <section className="relative z-1 overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-8">
        <div className="max-w-[880px] mx-auto">
          <Skeleton className="h-3 w-20 mb-6" />
          <Skeleton className="h-20 w-3/4 mb-3" />
          <Skeleton className="h-20 w-1/2 mb-8" />
          <Skeleton className="h-4 w-96 mb-3" />
          <Skeleton className="h-4 w-80 mb-3" />
          <Skeleton className="h-4 w-72 mb-12" />
          <Skeleton className="h-12 w-40" />
        </div>
      </section>

      {/* Content section placeholder */}
      <section className="relative z-1 py-20 px-6 md:px-8">
        <div className="max-w-[880px] mx-auto">
          <Skeleton className="h-3 w-24 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="py-6 border-t border-border-subtle">
                <Skeleton className="h-4 w-8 mb-3" />
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second content section */}
      <section className="relative z-1 py-20 px-6 md:px-8">
        <div className="max-w-[880px] mx-auto">
          <Skeleton className="h-3 w-28 mb-8" />
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
    </main>
  )
}
