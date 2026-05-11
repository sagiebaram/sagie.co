import { Skeleton } from '@/components/ui/Skeleton'

export default function ContributeV2Loading() {
  return (
    <main id="main-content" className="relative">
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-28 px-6 md:px-8">
        <div className="relative max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-16 items-end">
          <div>
            <Skeleton className="h-3 w-44 mb-5" />
            <Skeleton className="h-20 w-full max-w-[720px] mb-4" />
            <Skeleton className="h-20 w-full max-w-[620px]" />
          </div>
          <div>
            <Skeleton className="h-4 w-64 mb-2" />
            <Skeleton className="h-4 w-52" />
          </div>
        </div>
      </section>

      <section className="relative py-20 px-6 md:px-8">
        <div className="max-w-[880px] mx-auto">
          <Skeleton className="h-3 w-32 mb-3" />
          <Skeleton className="h-14 w-[480px] max-w-full mb-10" />
          <Skeleton className="h-24 w-[520px] max-w-full mb-8" />
          <Skeleton className="h-4 w-full max-w-[600px] mb-2" />
          <Skeleton className="h-4 w-full max-w-[580px] mb-2" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </section>

      <section className="relative py-20 px-6 md:px-8">
        <div className="max-w-[880px] mx-auto">
          <Skeleton className="h-3 w-32 mb-3" />
          <Skeleton className="h-14 w-[520px] max-w-full mb-12" />
          <div className="flex flex-col gap-10">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="grid grid-cols-[80px_1fr] gap-6">
                <Skeleton className="h-14 w-16" />
                <div>
                  <Skeleton className="h-8 w-48 mb-3" />
                  <Skeleton className="h-4 w-full max-w-[520px] mb-2" />
                  <Skeleton className="h-4 w-full max-w-[500px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
