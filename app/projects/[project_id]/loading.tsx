// app/projects/[project_id]/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  const skeletonRows = [
    "row-1",
    "row-2",
    "row-3",
    "row-4",
    "row-5",
    "row-6",
  ] as const;

  return (
    <div className="space-y-6">
      {/* Project header skeleton */}
      <section className="rounded-xl border border-card/40 bg-card/40 p-4 shadow-md ring-1 ring-card/40 backdrop-blur sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-28 rounded-full" />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="min-w-0">
            <Skeleton className="mb-2 h-3 w-14" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="min-w-0">
            <Skeleton className="mb-2 h-3 w-20" />
            <Skeleton className="h-5 w-64 max-w-full" />
          </div>
          <div>
            <Skeleton className="mb-2 h-3 w-14" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </section>

      {/* Notices section skeleton */}
      <section className="rounded-xl sm:overflow-hidden sm:border sm:border-card/40 sm:bg-card/40 sm:shadow-md sm:ring-1 sm:ring-card/40 sm:backdrop-blur">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border border-card/40 bg-card/40 px-4 py-3 shadow-xs sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none sm:border-b sm:border-card/40">
          <Skeleton className="h-4 w-16" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-44" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        <div className="space-y-2 p-4 sm:p-0">
          {skeletonRows.map((key) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 rounded-lg border border-card/40 bg-card/40 px-4 py-3 shadow-xs sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Skeleton className="h-5 w-28 shrink-0 rounded-full" />
                <Skeleton className="h-5 w-40 min-w-0" />
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
