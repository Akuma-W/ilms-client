'use client';

import { Plus, BookOpen } from 'lucide-react';
import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { CreateTopicFormValues, createTopicSchema } from '../../schemas/topic.schema';
import { topicsService } from '../../services/topics.service';

interface CreateTopicModalProps {
  classId: string;
  onSuccess: () => void;
}

const DEFAULT_VALUES: CreateTopicFormValues = {
  title: '',
  description: '',
};

/**
 * Modal dialog for teachers to create a new lecture topic inside a class.
 */
export function CreateTopicModal({ classId, onSuccess }: CreateTopicModalProps) {
  const formId = useId();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreateTopicFormValues>({
    resolver: zodResolver(createTopicSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: CreateTopicFormValues) => {
    try {
      const res = await topicsService.createTopic(classId, {
        title: values.title,
        description: values.description || undefined,
      });

      if (!res.success) {
        throw new Error(res.message || 'Tạo bài giảng thất bại');
      }

      toast.success('Tạo bài giảng thành công!');
      onSuccess();
      handleOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Đã có lỗi xảy ra, vui lòng thử lại.';
      toast.error('Tạo bài giảng thất bại', { description: message });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (isSubmitting) return;
    setIsOpen(open);

    if (!open) {
      setTimeout(() => reset(DEFAULT_VALUES), 150);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white h-9 px-4 rounded-lg shadow-sm font-medium transition-colors">
          <Plus className="w-4 h-4 mr-1.5" />
          Thêm bài giảng mới
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md rounded-xl border border-border bg-card text-card-foreground shadow-xl p-6"
        onInteractOutside={(e) => isSubmitting && e.preventDefault()}
        onEscapeKeyDown={(e) => isSubmitting && e.preventDefault()}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 pb-2 border-b border-border/50">
          <div className="flex items-center justify-center size-9 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shrink-0">
            <BookOpen className="size-4.5" />
          </div>
          <div>
            <DialogTitle className="text-base font-semibold text-foreground">
              Tạo bài giảng / Chuyên đề mới
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Phân nhóm nội dung học tập và tài liệu theo từng chương.
            </p>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-3" noValidate>
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-foreground">
                    Tiêu đề bài giảng <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Chương 1: Giới thiệu và Kiến trúc Client-Server"
                      disabled={isSubmitting}
                      className="rounded-lg h-9 text-sm"
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
                  <FormLabel className="text-xs font-medium text-foreground">
                    Mô tả ngắn (Tùy chọn)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả mục tiêu và nội dung cốt lõi của chuyên đề này..."
                      rows={3}
                      className="resize-none rounded-lg text-sm"
                      disabled={isSubmitting}
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
            variant="outline"
            size="sm"
            className="cursor-pointer rounded-lg text-xs h-8.5"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            size="sm"
            className="cursor-pointer bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs h-8.5 px-4 font-medium"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo mới'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
