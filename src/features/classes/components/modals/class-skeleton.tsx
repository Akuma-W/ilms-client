import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ClassSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card
          key={i}
          className="h-full overflow-hidden border-none shadow-md bg-white/80 backdrop-blur-sm"
        >
          <CardHeader className="pb-2">
            <Skeleton className="w-full h-32 rounded-xl mb-4" />
            <Skeleton className="w-20 h-6 mb-2 rounded-full" />
            <Skeleton className="w-full h-8 rounded-lg" />
          </CardHeader>
          <CardContent className="pb-4">
            <Skeleton className="w-full h-10 rounded-lg mb-4" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="w-full h-4 rounded-full" />
              <Skeleton className="w-full h-4 rounded-full" />
            </div>
          </CardContent>
          <CardFooter className="pt-0 flex justify-between items-center border-t border-gray-50 mt-2 py-4">
            <Skeleton className="w-16 h-4 rounded-full" />
            <Skeleton className="w-20 h-6 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
