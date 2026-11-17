'use client';

import { Archive } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface ArchiveClassDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isArchived: boolean;
  isArchiving: boolean;
  onConfirm: () => void;
}

export function ArchiveClassDialog({
  isOpen,
  onOpenChange,
  isArchived,
  isArchiving,
  onConfirm,
}: ArchiveClassDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <AlertDialogHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
            <Archive className="size-5" />
          </div>
          <div className="space-y-1">
            <AlertDialogTitle className="text-base font-bold text-foreground">
              {isArchived ? 'Xác nhận mở lại lớp học' : 'Xác nhận lưu trữ lớp học'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
              {isArchived
                ? 'Lớp học sẽ được kích hoạt lại. Giảng viên và học sinh có thể tiếp tục giao bài, nộp bài và tương tác bình thường.'
                : 'Khi lưu trữ, lớp học sẽ chuyển sang chế độ Chỉ đọc. Học sinh sẽ không thể nộp bài, làm quiz hoặc đăng thảo luận mới. Toàn bộ điểm số và tài liệu vẫn được bảo toàn.'}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel disabled={isArchiving} className="rounded-xl">
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isArchiving}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className={cn(
              'rounded-xl font-semibold',
              isArchived
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                : 'bg-amber-600 hover:bg-amber-700 text-white',
            )}
          >
            {isArchiving ? 'Đang xử lý...' : isArchived ? 'Mở lại lớp' : 'Lưu trữ lớp'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
