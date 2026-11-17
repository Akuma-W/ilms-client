'use client';

import { AlertTriangle, CheckCircle2, Loader2, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface QuizPlayConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalQuestions: number;
  answeredCount: number;
  isSubmitting: boolean;
  onConfirmSubmit: () => void;
}

export function QuizPlayConfirmDialog({
  open,
  onOpenChange,
  totalQuestions,
  answeredCount,
  isSubmitting,
  onConfirmSubmit,
}: QuizPlayConfirmDialogProps) {
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);
  const isComplete = unansweredCount === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            {isComplete ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Xác nhận nộp bài thi
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Bạn còn câu hỏi chưa làm!
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-sm pt-1">
            {isComplete ? (
              <span>
                Bạn đã hoàn thành toàn bộ <strong>{totalQuestions}</strong> câu hỏi. Bạn có chắc
                chắn muốn nộp bài để xem kết quả?
              </span>
            ) : (
              <span>
                Bạn mới chỉ hoàn thành{' '}
                <strong>
                  {answeredCount}/{totalQuestions}
                </strong>{' '}
                câu hỏi. Còn{' '}
                <strong className="text-rose-500">{unansweredCount} câu chưa trả lời</strong>.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {!isComplete && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200">
            Các câu chưa chọn đáp án sẽ được tính là 0 điểm.
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            Quay lại làm tiếp
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isSubmitting}
            onClick={onConfirmSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Đang nộp bài...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Xác nhận nộp bài
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
