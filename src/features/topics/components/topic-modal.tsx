'use client';

import { BookOpen, Pencil } from 'lucide-react';
import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TopicFormValues, topicSchema } from '../schemas/topic.schema';
import { topicsService } from '../services/topics.service';
import type { Topic } from '@/types/topic';

interface TopicModalProps {
  classId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
  initialData?: Topic | null;
  onSuccess: () => void;
}

const DEFAULT_VALUES: TopicFormValues = {
  title: '',
  description: '',
};

/**
 * Modal dialog for teachers to create or edit a lecture topic.
 */
export function TopicModal({
  classId,
  isOpen,
  onOpenChange,
  mode = 'create',
  initialData,
  onSuccess,
}: TopicModalProps) {
  const formId = useId();
  const isEdit = mode === 'edit';

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (isOpen) {
      if (isEdit && initialData) {
        reset({
          title: initialData.title || '',
          description: initialData.description || '',
        });
      } else {
        reset(DEFAULT_VALUES);
      }
    }
  }, [isOpen, isEdit, initialData, reset]);

  const handleClose = () => {
    if (isSubmitting) return;
    onOpenChange(false);
    reset(DEFAULT_VALUES);
  };

  const onSubmit = async (values: TopicFormValues) => {
    try {
      if (isEdit) {
        if (!initialData?.id) {
          throw new Error('Không tìm thấy thông tin chủ đề để chỉnh sửa');
        }
        const res = await topicsService.updateTopic(initialData.id, {
          title: values.title,
          description: values.description || undefined,
        });

        if (!res.success) {
          throw new Error(res.message || 'Cập nhật chủ đề thất bại');
        }

        toast.success('Cập nhật chủ đề thành công!');
      } else {
        const res = await topicsService.createTopic(classId, {
          title: values.title,
          description: values.description || undefined,
        });

        if (!res.success) {
          throw new Error(res.message || 'Tạo chủ đề thất bại');
        }

        toast.success('Tạo chủ đề bài giảng thành công!');
      }

      onSuccess();
      handleClose();
    } catch (error) {
      toast.error(isEdit ? 'Lỗi khi cập nhật chủ đề' : 'Lỗi khi tạo chủ đề', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại sau.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md rounded-xl border border-border bg-card text-card-foreground shadow-xl p-6"
        onInteractOutside={(e) => isSubmitting && e.preventDefault()}
        onEscapeKeyDown={(e) => isSubmitting && e.preventDefault()}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 pb-3 border-b border-border/50">
          <div className="flex items-center justify-center size-9 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shrink-0">
            {isEdit ? <Pencil className="size-4.5" /> : <BookOpen className="size-4.5" />}
          </div>
          <div>
            <DialogTitle className="text-base font-semibold text-foreground">
              {isEdit ? 'Chỉnh sửa chủ đề bài giảng' : 'Tạo chủ đề bài giảng mới'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              {isEdit
                ? 'Cập nhật tiêu đề hoặc mô tả giới thiệu của chủ đề.'
                : 'Phân nhóm tài liệu, bài tập và bài giảng theo tiến độ học.'}
            </DialogDescription>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2" noValidate>
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-foreground">
                    Tiêu đề chủ đề <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="vd: Chương 1 - Giới thiệu lập trình Web"
                      className="h-9 text-xs rounded-lg bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-foreground">
                    Mô tả chủ đề
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tóm tắt nội dung chính hoặc mục tiêu học tập của chương này..."
                      className="text-xs rounded-lg bg-background resize-none min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="gap-2 pt-2 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg text-xs h-8.5 cursor-pointer"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form={formId}
            size="sm"
            className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs h-8.5 px-4 font-medium cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? isEdit
                ? 'Đang lưu...'
                : 'Đang tạo...'
              : isEdit
                ? 'Lưu thay đổi'
                : 'Tạo chủ đề'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
