// app/projects/[project_id]/edit/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  const skeletonCards = ["card-1", "card-2", "card-3", "card-4"] as const;

  return (
    <div className="space-y-6 pb-8">
      <section className="rounded-xl border border-card/40 bg-card/40 p-4 shadow-md ring-1 ring-card/40 backdrop-blur sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {skeletonCards.map((key) => (
          <div
            key={key}
            className="rounded-xl border border-card/40 bg-card/40 p-4 shadow-md ring-1 ring-card/40 backdrop-blur sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
