import { Skeleton } from "@/components/ui/skeleton"

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white p-8 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="space-y-4 mb-12">
          <Skeleton className="h-12 w-3/4 bg-neutral-800" />
          <Skeleton className="h-6 w-1/2 bg-neutral-800" />
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full bg-neutral-800" />
              <Skeleton className="h-4 w-3/4 bg-neutral-800" />
              <Skeleton className="h-4 w-1/2 bg-neutral-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AdminDashboardSkeleton() {
  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Sidebar Skeleton */}
      <div className="w-64 border-r border-neutral-800 p-6 space-y-4">
        <Skeleton className="h-8 w-32 bg-neutral-800" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-10 w-full bg-neutral-800" />
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 p-8 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3 bg-neutral-800" />
          <Skeleton className="h-6 w-1/4 bg-neutral-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-24 w-full bg-neutral-800" />
              <Skeleton className="h-4 w-2/3 bg-neutral-800" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full bg-neutral-800" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function FormLoadingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/2 bg-neutral-800" />
        <Skeleton className="h-6 w-3/4 bg-neutral-800" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24 bg-neutral-800" />
            <Skeleton className="h-12 w-full bg-neutral-800" />
          </div>
        ))}
      </div>

      <Skeleton className="h-12 w-full bg-neutral-800" />
    </div>
  )
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border border-neutral-800 rounded-lg p-6 space-y-3 bg-[#1a1a1a]"
        >
          <Skeleton className="h-6 w-1/3 bg-neutral-800" />
          <Skeleton className="h-4 w-full bg-neutral-800" />
          <Skeleton className="h-4 w-5/6 bg-neutral-800" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-20 bg-neutral-800" />
            <Skeleton className="h-8 w-20 bg-neutral-800" />
          </div>
        </div>
      ))}
    </div>
  )
}
