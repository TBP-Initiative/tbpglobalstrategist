import { Skeleton } from "@/components/ui/skeleton";

export default function StrategistsLoading() {
  return (
    <div className="min-h-screen">
      <div className="gradient-hero relative overflow-hidden px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="mx-auto mb-4 h-12 w-64 rounded-lg bg-white/10" />
          <Skeleton className="mx-auto mb-8 h-5 w-96 rounded bg-white/10" />
          <Skeleton className="mx-auto h-14 w-full max-w-2xl rounded-xl bg-white/10" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <div className="hidden w-64 shrink-0 space-y-6 lg:block">
            <Skeleton className="h-8 w-32 bg-muted" />
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full bg-muted" />
            ))}
          </div>
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <Skeleton className="h-5 w-48 bg-muted" />
              <Skeleton className="h-9 w-40 rounded-lg bg-muted" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                  <div className="mb-4 flex items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-full bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-32 bg-white/10" />
                      <Skeleton className="h-4 w-24 bg-white/10" />
                    </div>
                  </div>
                  <Skeleton className="mb-3 h-4 w-full bg-white/10" />
                  <Skeleton className="mb-4 h-4 w-3/4 bg-white/10" />
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <Skeleton key={j} className="h-6 w-20 rounded-full bg-white/10" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
