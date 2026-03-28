import { Skeleton } from '@/components/ui/Skeleton'

export default function ApplyLoading() {
  return (
    <main className="relative">
      {/* Hero + form area — mirrors apply/page.tsx with pt-32 md:pt-40 */}
      <section className="relative z-1 overflow-hidden">
        <div className="max-w-[880px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-24">

          {/* Page hero */}
          <Skeleton className="h-3 w-28 mb-4" />
          <Skeleton className="h-16 w-2/3 mb-2" />
          <Skeleton className="h-16 w-1/2 mb-8" />
          <Skeleton className="h-4 w-96 mb-2" />
          <Skeleton className="h-4 w-72 mb-12" />

          {/* Form skeleton — mirrors MembershipForm layout */}
          <div className="flex flex-col gap-5">

            {/* Row 1: Full Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Row 2: City + Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* What are you building — textarea */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-24 w-full" />
            </div>

            {/* Why SAGIE — textarea */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-24 w-full" />
            </div>

            {/* Row 3: LinkedIn + Referral */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-44" />
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
