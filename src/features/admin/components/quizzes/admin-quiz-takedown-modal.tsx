'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ShieldAlert } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { adminQuizzesService } from '@/features/admin/services/admin-quizzes.service';
import { quizTakedownSchema, type QuizTakedownValues } from '@/features/admin/schemas/admin.schema';
import { AdminQuiz } from '@/types/admin';

interface AdminQuizTakedownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: AdminQuiz | null;
  onSuccess: () => void;
}

export function AdminQuizTakedownModal({
  open,
  onOpenChange,
  quiz,
  onSuccess,
}: AdminQuizTakedownModalProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<QuizTakedownValues>({
    resolver: zodResolver(quizTakedownSchema),
    defaultValues: {
      reason: '',
    },
  });

  const onSubmit = async (values: QuizTakedownValues) => {
    if (!quiz) return;
    setLoading(true);
    try {
      await adminQuizzesService.takedownQuiz(quiz.id, values.reason);
      toast.success('Đã thu hồi quyền công khai đề thi thành công');
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Kiểm duyệt thất bại';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <div className="size-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-1">
            <ShieldAlert className="size-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Khóa công khai & Kiểm duyệt bản quyền
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Đề thi &quot;{quiz?.title}&quot; sẽ bị chuyển sang chế độ riêng tư (private) và trạng
            thái bản nháp.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">
                    Lý do kiểm duyệt / Vi phạm bản quyền *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="VD: Đề thi sao chép tài liệu khảo thí không có bản quyền từ bộ đề chuẩn..."
                      className="rounded-xl min-h-23 text-xs resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium"
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận Khóa công khai'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
