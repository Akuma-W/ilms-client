'use client';

import { Globe, Lock, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSWRConfig } from 'swr';
import { CreateClassFormValues, createClassSchema } from '../../schemas/class.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { classService } from '../../services/class.service';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const DEFAULT_CREATE_CLASS_VALUES = {
  title: '',
  subject: '',
  isPrivate: false,
  description: '',
  semester: '',
};

export function CreateClassModal() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const formId = useId();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreateClassFormValues>({
    resolver: zodResolver(createClassSchema),
    defaultValues: DEFAULT_CREATE_CLASS_VALUES,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: CreateClassFormValues) => {
    try {
      const data = await classService.createClass({
        title: values.title,
        subject: values.subject,
        isPrivate: values.isPrivate,
        description: values.description || undefined,
        semester: values.semester || undefined,
      });

      await mutate(
        (key: unknown) => Array.isArray(key) && (key[0] === 'classes' || key[0] === 'my-classes'),
        undefined,
        { revalidate: true },
      );

      toast.success('Tạo lớp học thành công!', {
        description: data?.title,
      });

      router.push(`/classes/${data?.id}/info`);
      handleOpenChange(false);
    } catch (error) {
      const status = (error as { status?: number }).status;

      const message =
        status === 409
          ? 'Tên lớp học đã tồn tại, vui lòng chọn tên khác.'
          : status === 403
            ? 'Bạn không có quyền tạo lớp học.'
            : 'Đã có lỗi xảy ra, vui lòng thử lại.';

      toast.error('Tạo lớp học thất bại', { description: message });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (isSubmitting) return;
    setIsOpen(open);

    if (!open) {
      setTimeout(() => reset(DEFAULT_CREATE_CLASS_VALUES), 150);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-galaxy hover:opacity-90 text-white h-11 px-6 shadow-lg shadow-blue-500/20">
          <Plus className="w-4 h-4" />
          Tạo lớp
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-125"
        onInteractOutside={(e) => isSubmitting && e.preventDefault()}
        onEscapeKeyDown={(e) => isSubmitting && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-galaxy-blue">Tạo lớp học mới</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2" noValidate>
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tiêu đề lớp học <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Lập trình Web nâng cao"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Môn học <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Công nghệ thông tin"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormLabel>
                    Chế độ hiển thị <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value ? 'private' : 'public'}
                      onValueChange={(v) => field.onChange(v === 'private')}
                      className="flex gap-6 cursor-pointer"
                    >
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <RadioGroupItem value="public" className="cursor-pointer" />
                        </FormControl>
                        <FormLabel className="cursor-pointer flex items-center gap-2 font-normal text-green-600">
                          <Globe className="h-3.5 w-3.5" />
                          Công khai
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <RadioGroupItem value="private" className="cursor-pointer" />
                        </FormControl>
                        <FormLabel className="cursor-pointer flex items-center gap-2 font-normal text-red-600">
                          <Lock className="h-3.5 w-3.5" />
                          Riêng tư
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả (tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ngắn gọn về lớp học..."
                      rows={3}
                      className="resize-none"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Học kỳ (Tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Học kỳ 2 - 2024" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" className="cursor-pointer" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button className="cursor-pointer bg-galaxy text-white" onClick={handleSubmit(onSubmit)}>
            Tạo lớp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
