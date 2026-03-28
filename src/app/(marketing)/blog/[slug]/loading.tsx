import { Skeleton } from '@/components/ui/Skeleton'

export default function BlogPostLoading() {
  return (
    <main className="relative">
      {/* Section mirrors blog/[slug]/page.tsx Section with pt-28 md:pt-36 */}
      <section className="relative z-1 pt-28 md:pt-36 px-6 md:px-8 pb-20">
        <div className="max-w-[880px] mx-auto">

          {/* Back link */}
          <Skeleton className="h-3 w-28 mb-8" />

          {/* Post meta: category · date · read time */}
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-2" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-2" />
            <Skeleton className="h-3 w-16" />
          </div>

          {/* Post title — 2 lines */}
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-4/5 mb-6" />

          {/* Author block */}
          <Skeleton className="h-3 w-40 mb-2" />
          <Skeleton className="h-3 w-56 mb-6" />

          {/* Share button placeholder */}
          <Skeleton className="h-8 w-28 mb-8" />

          {/* Divider */}
          <div className="border-t border-border-default my-8" />

          {/* Body content — paragraph lines with varying widths */}
          <div className="max-w-[600px] flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <div className="mt-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[88%]" />
            <div className="mt-4" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[70%]" />
            <Skeleton className="h-4 w-[92%]" />
            <Skeleton className="h-4 w-3/5" />
          </div>

          {/* Related posts */}
          <div className="mt-16">
            <Skeleton className="h-3 w-16 mb-6" />
            <div className="grid md:grid-cols-3 gap-px">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-6 border border-border-default flex flex-col gap-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-3 w-16 mt-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Next post bar */}
      <div className="border-t border-border-strong">
        <div className="max-w-[880px] mx-auto px-6 md:px-8 py-6 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-56" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </main>
  )
}
