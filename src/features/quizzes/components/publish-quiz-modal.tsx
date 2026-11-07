'use client';

import { useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, CheckCircle2, Clock, HelpCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getAllMockQuizzes } from '@/mocks/classes/mock-quizzes';
import { publishQuizSchema, type PublishQuizFormData } from '../schemas/quiz.schema';
import { quizzesService } from '../services/quizzes.service';
import type { Quiz } from '@/types/quiz';
import type { Topic } from '@/types/topic';

interface PublishQuizModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  topics?: Topic[];
  onSubmit: (data: PublishQuizFormData, topicName?: string) => Promise<void>;
}

/**
 * Formats a Date object to local YYYY-MM-DDTHH:mm string for datetime-local input.
 */
function formatForDateTimeInput(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Modal for teachers to publish an existing quiz into the classroom workspace.
 * Allows choosing quiz from repository, associating with topic, and setting active window.
 */
export function PublishQuizModal({
  isOpen,
  onOpenChange,
  topics = [],
  onSubmit,
}: PublishQuizModalProps) {
  const safeTopics = useMemo(() => (Array.isArray(topics) ? topics : []), [topics]);
  const fallbackQuizzes = useMemo(() => getAllMockQuizzes(), []);

  const { data: availableQuizzes = fallbackQuizzes, isLoading: isLoadingQuizzes } = useSWR<Quiz[]>(
    isOpen ? 'available-quizzes' : null,
    () => quizzesService.getAvailableQuizzes(),
    {
      fallbackData: fallbackQuizzes,
    },
  );

  const initialQuizzes = availableQuizzes.length > 0 ? availableQuizzes : fallbackQuizzes;

  const defaultDates = useMemo(() => {
    const open = new Date();
    const close = new Date(open.getTime() + 7 * 24 * 60 * 60 * 1000);
    return {
      openAt: formatForDateTimeInput(open),
      closeAt: formatForDateTimeInput(close),
    };
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PublishQuizFormData>({
    resolver: zodResolver(publishQuizSchema),
    defaultValues: {
      quizId: initialQuizzes[0]?.id || '',
      topicId: safeTopics[0]?.id || '',
      openAt: defaultDates.openAt,
      closeAt: defaultDates.closeAt,
    },
  });

  useEffect(() => {
    if (isOpen) {
      const activeList = availableQuizzes.length > 0 ? availableQuizzes : fallbackQuizzes;
      const open = new Date();
      const close = new Date(open.getTime() + 7 * 24 * 60 * 60 * 1000);
      reset({
        quizId: activeList[0]?.id || '',
        topicId: safeTopics[0]?.id || '',
        openAt: formatForDateTimeInput(open),
        closeAt: formatForDateTimeInput(close),
      });
    }
  }, [isOpen, reset, safeTopics, availableQuizzes, fallbackQuizzes]);

  const handleFormSubmit = async (values: PublishQuizFormData) => {
    try {
      const selectedTopic = safeTopics.find((t) => t.id === values.topicId);
      await onSubmit(values, selectedTopic?.title);
      onOpenChange(false);
    } catch {
      toast.error('Có lỗi xảy ra khi xuất bản bài thi. Vui lòng thử lại!');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-5 sm:p-6">
        <DialogHeader className="space-y-1 text-left pb-2 border-b border-border/60">
          <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="size-5 text-rose-500" />
            <span>Xuất bản bài trắc nghiệm vào lớp</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Chọn đề thi có sẵn từ kho bài thi cá nhân và thiết lập thời hạn làm bài cho lớp.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
          {/* Quiz Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="quiz-select" className="text-xs font-bold text-foreground">
              Đề thi trắc nghiệm <span className="text-rose-500">*</span>
            </Label>
            {isLoadingQuizzes ? (
              <div className="h-10 rounded-xl bg-muted/50 animate-pulse flex items-center px-3 text-xs text-muted-foreground">
                Đang tải danh sách bài thi...
              </div>
            ) : availableQuizzes.length === 0 ? (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
                Kho bài thi cá nhân chưa có đề nào. Bạn có thể soạn đề mới tại phân hệ Quiz.
              </div>
            ) : (
              <select
                id="quiz-select"
                {...register('quizId')}
                className="w-full h-10 px-3 text-sm rounded-xl border border-border bg-background focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {availableQuizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title} ({q.timeLimit} phút - {q.questionCount || 15} câu)
                  </option>
                ))}
              </select>
            )}
            {errors.quizId && (
              <p className="text-xs text-rose-500 font-medium">{errors.quizId.message}</p>
            )}
          </div>

          {/* Topic Association */}
          <div className="space-y-1.5">
            <Label htmlFor="topic-select" className="text-xs font-bold text-foreground">
              Chủ đề bài học (Topic)
            </Label>
            <select
              id="topic-select"
              {...register('topicId')}
              className="w-full h-10 px-3 text-sm rounded-xl border border-border bg-background focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="">-- Không gắn chủ đề (Bài thi chung) --</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Timeline Row (openAt & closeAt) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label
                htmlFor="open-at-input"
                className="text-xs font-bold text-foreground flex items-center gap-1.5"
              >
                <Calendar className="size-3.5 text-primary" />
                <span>Thời gian mở bài</span> <span className="text-rose-500">*</span>
              </Label>
              <Input
                type="datetime-local"
                id="open-at-input"
                {...register('openAt')}
                className="text-sm rounded-xl"
              />
              {errors.openAt && (
                <p className="text-xs text-rose-500 font-medium">{errors.openAt.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="close-at-input"
                className="text-xs font-bold text-foreground flex items-center gap-1.5"
              >
                <Clock className="size-3.5 text-rose-500" />
                <span>Hạn chót đóng bài</span> <span className="text-rose-500">*</span>
              </Label>
              <Input
                type="datetime-local"
                id="close-at-input"
                {...register('closeAt')}
                className="text-sm rounded-xl"
              />
              {errors.closeAt && (
                <p className="text-xs text-rose-500 font-medium">{errors.closeAt.message}</p>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground flex items-start gap-2">
            <HelpCircle className="size-4 text-primary shrink-0 mt-0.5" />
            <span>
              Bài trắc nghiệm sau khi xuất bản sẽ hiển thị ngay trong danh sách của lớp. Sinh viên
              sẽ chỉ được làm bài trong khoảng thời gian mở và đóng đã cấu hình.
            </span>
          </div>

          <DialogFooter className="pt-3 border-t border-border/50 flex flex-col sm:flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto h-9 text-sm rounded-xl"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || availableQuizzes.length === 0}
              className="w-full sm:w-auto h-9 text-sm font-semibold rounded-xl gap-1.5 shadow-xs bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Đang xuất bản...</span>
                </>
              ) : (
                <span>Xuất bản vào lớp</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
