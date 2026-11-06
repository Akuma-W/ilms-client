'use client';

import { Plus, BookOpen } from 'lucide-react';
import { useId, useState } from 'react';
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
import { CreateTopicFormValues, createTopicSchema } from '../schemas/topic.schema';
import { topicsService } from '../services/topics.service';

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

  const handleClose = () => {
    if (isSubmitting) return;
    setIsOpen(false);
    reset(DEFAULT_VALUES);
  };

  const onSubmit = async (values: CreateTopicFormValues) => {
    try {
      const res = await topicsService.createTopic(classId, {
        title: values.title,
        description: values.description || undefined,
      });

      if (!res.success) {
        throw new Error(res.message || 'Tạo chủ đề thất bại');
      }

      toast.success('Tạo chủ đề bài giảng thành công!');
      onSuccess();
      handleClose();
    } catch (error) {
      toast.error('Lỗi khi tạo chủ đề', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại sau.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm h-9 px-3 font-medium cursor-pointer">
          <Plus className="size-4" />
          Thêm chủ đề
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md rounded-xl border border-border bg-card text-card-foreground shadow-xl p-6"
        onInteractOutside={(e) => isSubmitting && e.preventDefault()}
        onEscapeKeyDown={(e) => isSubmitting && e.preventDefault()}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 pb-3 border-b border-border/50">
          <div className="flex items-center justify-center size-9 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shrink-0">
            <BookOpen className="size-4.5" />
          </div>
          <div>
            <DialogTitle className="text-base font-semibold text-foreground">
              Tạo chủ đề bài giảng mới
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Phân nhóm tài liệu, bài tập và bài giảng theo tiến độ học.
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
            {isSubmitting ? 'Đang tạo...' : 'Tạo chủ đề'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
