import { Skeleton } from '@/components/ui/Skeleton'

export default function SuggestEventLoading() {
  return (
    <main id="main-content" className="relative">
      {/* Hero + form area — mirrors suggest-event/page.tsx with pt-32 md:pt-40 */}
      <section className="relative z-[1] overflow-hidden">
        <div className="max-w-[880px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-24">

          {/* Page hero */}
          <Skeleton className="h-3 w-36 mb-4" />
          <Skeleton className="h-16 w-2/3 mb-2" />
          <Skeleton className="h-16 w-3/5 mb-8" />
          <Skeleton className="h-4 w-96 mb-2" />
          <Skeleton className="h-4 w-80 mb-12" />

          {/* Form skeleton — mirrors SuggestEventForm layout */}
          <div className="flex flex-col gap-5">

            {/* Row 1: Event Name + Event Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Proposed Date — single full-width field */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Description — textarea */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full" />
            </div>

            {/* Row 2: Your Name + Your Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Submit button */}
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </section>
    </main>
  )
}
