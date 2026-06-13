import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen">
      <Skeleton className="h-[50vh] w-full rounded-none bg-gradient-to-b from-primary/20 to-background" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-32 mb-8 flex flex-col items-center gap-6 sm:flex-row sm:items-end">
          <Skeleton className="h-40 w-40 rounded-2xl border-4 border-background bg-muted shadow-xl" />
          <div className="flex-1 space-y-3 pb-4 text-center sm:text-left">
            <Skeleton className="mx-auto h-8 w-64 sm:mx-0" />
            <Skeleton className="mx-auto h-5 w-96 sm:mx-0" />
            <Skeleton className="mx-auto h-6 w-32 sm:mx-0" />
          </div>
        </div>
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl bg-muted" />
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl bg-muted" />
            ))}
          </div>
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
