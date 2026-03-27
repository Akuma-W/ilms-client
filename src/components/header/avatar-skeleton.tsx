import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

interface AvatarSkeletonProps {
  className?: string;
  showName?: boolean;
}

export function AvatarSkeleton({ className, showName = false }: AvatarSkeletonProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Avatar */}
      <Skeleton className="w-8 h-8 rounded-full" />

      {/* Optional name */}
      {showName && (
        <div className="hidden sm:flex flex-col gap-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
      )}
    </div>
  );
}
