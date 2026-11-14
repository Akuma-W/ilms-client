import { Skeleton } from '@/components/ui/skeleton';

interface QuizGridSkeletonProps {
  count?: number;
}

export function QuizGridSkeleton({ count = 6 }: QuizGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <QuizCardSkeleton key={i} />
      ))}
    </div>
  );
}

function QuizCardSkeleton() {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden">
      {/* Accent bar */}
      <div className="h-1 w-full bg-slate-200 dark:bg-slate-700" />
      <div className="p-5 space-y-4">
        {/* Badges row */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-20 rounded-sm" />
          <Skeleton className="h-6 w-6 rounded-sm" />
        </div>
        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-4/5 rounded-sm" />
          <Skeleton className="h-4 w-full rounded-sm" />
          <Skeleton className="h-4 w-2/3 rounded-sm" />
        </div>
        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex gap-3">
            <Skeleton className="h-4 w-14 rounded-sm" />
            <Skeleton className="h-4 w-12 rounded-sm" />
          </div>
          <Skeleton className="h-4 w-20 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
