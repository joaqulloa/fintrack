interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="hidden h-4 w-24 sm:block" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

export function CardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-40 rounded-2xl" />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="w-full max-w-xs space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-4 w-44" />
        </div>

        <Skeleton className="h-16 w-64 rounded-2xl" />
      </section>

      <CardsSkeleton />

      <div className="grid items-start gap-6 xl:grid-cols-3">
        <Skeleton className="h-96 rounded-2xl xl:col-span-2" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  );
}

export function CategoriesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}
