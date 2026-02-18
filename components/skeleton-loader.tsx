"use client";

export function HeroSkeleton() {
  return (
    <div className="relative h-[70vh] w-full animate-pulse bg-secondary">
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
        <div className="max-w-2xl">
          <div className="h-8 w-48 rounded-md bg-muted mb-4" />
          <div className="h-12 w-96 rounded-md bg-muted mb-4" />
          <div className="h-4 w-full rounded-md bg-muted mb-2" />
          <div className="h-4 w-3/4 rounded-md bg-muted mb-6" />
          <div className="flex gap-4">
            <div className="h-11 w-32 rounded-lg bg-muted" />
            <div className="h-11 w-40 rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="flex shrink-0 w-40 md:w-50 animate-pulse">
      <div className="aspect-2/3 rounded-lg bg-secondary mb-2" />
      <div className="h-4 w-3/3 rounded bg-muted mb-1" />
      <div className="h-4 w-1/2 rounded bg-muted" />
    </div>
  );
}

export function MovieRowSkeleton() {
  return (
    <div className="py-6">
      <div className="h-7 w-40 rounded bg-muted mb-4 ml-4 lg:ml-8" />
      <div className="flex gap-3 px-4 lg:px-8 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
