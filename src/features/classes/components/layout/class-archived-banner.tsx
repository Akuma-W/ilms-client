'use client';

import { Archive } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface ClassArchivedBannerProps {
  className?: string;
}

export function ClassArchivedBanner({ className }: ClassArchivedBannerProps) {
  return (
    <div className={cn('w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4', className)}>
      <Alert className="rounded-2xl border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 shadow-2xs">
        <Archive className="size-4 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="space-y-0.5 ml-2">
          <AlertTitle className="text-sm font-bold tracking-tight text-amber-900 dark:text-amber-200">
            Lớp học đã được lưu trữ (Chế độ Chỉ đọc)
          </AlertTitle>
          <AlertDescription className="text-xs text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
            Lớp học này đã kết thúc hoặc được chuyển vào kho lưu trữ. Tất cả các tính năng tạo tài
            liệu, giao bài tập, nộp bài, làm bài thi và thảo luận đều được chuyển sang chế độ chỉ
            xem nhằm bảo toàn hồ sơ học tập.
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}
