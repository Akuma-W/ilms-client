'use client';

import { Globe, Lock, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSWRConfig } from 'swr';
import { CreateClassFormValues, createClassSchema } from '../../schemas/class.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { classService } from '../../services/class.service';
import { AssistantTeacherSelect } from './assistant-teacher-select';
import { SubjectSelectCombobox } from '@/features/subjects/components/subject-select-combobox';
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

const DEFAULT_CREATE_CLASS_VALUES: CreateClassFormValues = {
  title: '',
  subjectId: '',
  maxStudents: 60,
  assistantIds: [],
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
        subjectId: values.subjectId,
        maxStudents: values.maxStudents,
        assistantIds:
          values.assistantIds && values.assistantIds.length > 0 ? values.assistantIds : undefined,
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

      if (data?.id) {
        router.push(`/classes/${data.id}/info`);
      }
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
        <Button className="bg-galaxy hover:opacity-90 text-white h-11 px-6 shadow-lg shadow-blue-500/20">
          <Plus className="w-4 h-4 mr-1.5" />
          Tạo lớp
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => isSubmitting && e.preventDefault()}
        onEscapeKeyDown={(e) => isSubmitting && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-galaxy-blue">Tạo lớp học mới</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-1" noValidate>
            {/* Subject Select Combobox */}
            <FormField
              control={control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Môn học trực thuộc <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <SubjectSelectCombobox
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Class Title */}
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
                      placeholder="VD: Lập trình Web nâng cao - Nhóm 01"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Capacity & Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="maxStudents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Sĩ số tối đa <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={500}
                        placeholder="60"
                        disabled={isSubmitting}
                        value={field.value ?? 60}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                      <Input
                        placeholder="VD: HK1 (2026 - 2027)"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Assistant Teachers */}
            <FormField
              control={control}
              name="assistantIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bổ nhiệm Trợ giảng (Tùy chọn)</FormLabel>
                  <FormControl>
                    <AssistantTeacherSelect
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Privacy Mode */}
            <FormField
              control={control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>
                    Chế độ hiển thị <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value ? 'private' : 'public'}
                      onValueChange={(v) => field.onChange(v === 'private')}
                      className="flex gap-6 pt-1"
                    >
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="public" />
                        </FormControl>
                        <FormLabel className="flex items-center gap-1.5 font-normal text-green-700 cursor-pointer">
                          <Globe className="h-4 w-4" />
                          Công khai (Tự động duyệt)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="private" />
                        </FormControl>
                        <FormLabel className="flex items-center gap-1.5 font-normal text-amber-700 cursor-pointer">
                          <Lock className="h-4 w-4" />
                          Riêng tư (Chờ phê duyệt)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả lớp học (Tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả tóm tắt về mục tiêu hoặc tài liệu môn học..."
                      rows={2}
                      className="resize-none"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="pt-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            className="bg-galaxy text-white"
            type="submit"
            form={formId}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang tạo lớp...' : 'Tạo lớp học'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
