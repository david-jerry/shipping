import { Skeleton } from "@/components/ui/skeleton"

export function MarketingPageLoading() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.12),_transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl space-y-10 px-6 py-14">
        <section className="space-y-4 rounded-xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-sm">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-11 w-full max-w-3xl" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-full max-w-xl" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-36" />
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <article
              key={index}
              className="space-y-4 rounded-xl border border-border/60 bg-card/60 p-4 shadow-sm backdrop-blur-sm"
            >
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-9 w-28" />
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
