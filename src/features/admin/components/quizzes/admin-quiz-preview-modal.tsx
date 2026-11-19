'use client';

import { Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminQuiz } from '@/features/admin/hooks/use-admin-quizzes';

interface AdminQuizPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizId: string | null;
}

export function AdminQuizPreviewModal({ open, onOpenChange, quizId }: AdminQuizPreviewModalProps) {
  const { quiz, isLoading: loading } = useAdminQuiz(open && quizId ? quizId : null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-6 rounded-2xl">
        <DialogHeader className="pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700"
            >
              {quiz?.visibility === 'public' ? 'Đề thi công khai' : 'Đề thi riêng tư'}
            </Badge>
            <Badge variant="outline" className="text-[11px]">
              {quiz?.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
            </Badge>
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            {quiz?.title || 'Đang tải thông tin đề thi...'}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Tác giả: {quiz?.creator.fullName} ({quiz?.creator.email}) • {quiz?.timeLimit} phút
          </DialogDescription>
        </DialogHeader>

        {/* Question Audit Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : !quiz?.questions || quiz.questions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              Đề thi này chưa có danh sách câu hỏi
            </div>
          ) : (
            quiz.questions.map((q, qIndex) => (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-xs md:text-sm text-slate-900 dark:text-slate-100">
                    Câu {qIndex + 1}: {q.content}
                  </span>
                  <Badge variant="secondary" className="text-[10px] shrink-0 font-mono">
                    {q.points} điểm
                  </Badge>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, oIndex) => {
                    const optLabel = String.fromCharCode(65 + oIndex);

                    return (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                          opt.isCorrect
                            ? 'bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-medium'
                            : 'bg-slate-50 border-slate-200 dark:bg-slate-800/40 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span className="size-5 rounded-md bg-white dark:bg-slate-800 border flex items-center justify-center font-bold text-[10px] shrink-0">
                          {optLabel}
                        </span>
                        <span className="flex-1">{opt.content}</span>
                        {opt.isCorrect && (
                          <Check className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
