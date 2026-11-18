'use client';

import { History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminRecentActivity } from '@/types/admin';
import { formatDateTime, getActivityIconConfig } from '@/features/admin/utils/admin-formatters';

interface AdminRecentActivitiesCardProps {
  activities: AdminRecentActivity[];
  isLoading?: boolean;
}

export function AdminRecentActivitiesCard({
  activities,
  isLoading,
}: AdminRecentActivitiesCardProps) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-2xs p-6 space-y-4">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="h-3.5 w-64 rounded-md" />
        </div>
        <div className="space-y-3 pt-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3 p-2.5">
              <Skeleton className="size-8 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-2xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="size-4.5 text-blue-500" />
          Nhật ký Hoạt động Hệ thống Gần đây
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
          Các giao dịch đăng ký, tạo lớp và kiểm tra tự động cập nhật
        </CardDescription>
      </CardHeader>

      <CardContent>
        {activities.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Chưa có sự kiện nào được ghi nhận
          </div>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 8).map((act) => {
              const { icon: EventIcon, colorClass } = getActivityIconConfig(act.type);
              const timeFormatted = formatDateTime(act.createdAt);

              return (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200/60 dark:hover:border-slate-800"
                >
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 mt-0.5">
                    <EventIcon className={`size-4 ${colorClass}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-snug">
                      {act.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>{act.actorName}</span>
                      <span>•</span>
                      <span>{timeFormatted}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
