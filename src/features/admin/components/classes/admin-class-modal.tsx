'use client';

import { useState, useEffect } from 'react';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { adminClassesService } from '@/features/admin/services/admin-classes.service';
import { useAdminSchools, useAdminSchoolSubjects } from '@/features/admin/hooks/use-admin-schools';
import { useAdminUsers } from '@/features/admin/hooks/use-admin-users';
import { classFormSchema, type ClassFormValues } from '@/features/admin/schemas/admin.schema';
import { AdminClass } from '@/types/admin';

interface AdminClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetClass?: AdminClass | null;
  onSuccess: () => void;
}

export function AdminClassModal({
  open,
  onOpenChange,
  targetClass,
  onSuccess,
}: AdminClassModalProps) {
  const isEditing = Boolean(targetClass);
  const [loading, setLoading] = useState(false);

  // Load schools & teachers via custom hooks
  const { data: schoolsData } = useAdminSchools({ limit: 100 });
  const { data: teachersData } = useAdminUsers({ limit: 100, role: 'teacher' });

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: '',
      code: '',
      schoolId: '',
      subjectId: '',
      teacherId: '',
      maxStudents: 50,
      isPrivate: false,
    },
  });

  const selectedSchoolId = form.watch('schoolId');
  const { subjects = [] } = useAdminSchoolSubjects(selectedSchoolId || null);

  useEffect(() => {
    if (targetClass) {
      form.reset({
        name: targetClass.title || (targetClass as unknown as { name?: string }).name || '',
        code: targetClass.courseCode || (targetClass as unknown as { code?: string }).code || '',
        schoolId:
          targetClass.school?.id ||
          (targetClass as unknown as { schoolId?: string }).schoolId ||
          '',
        subjectId:
          targetClass.subjectRef?.id ||
          (targetClass as unknown as { subjectId?: string }).subjectId ||
          '',
        teacherId:
          targetClass.teacher?.id ||
          (targetClass as unknown as { teacherId?: string }).teacherId ||
          '',
        maxStudents: targetClass.maxStudents ?? 50,
        isPrivate: targetClass.isPrivate,
      });
    } else {
      form.reset({
        name: '',
        code: '',
        schoolId: '',
        subjectId: '',
        teacherId: '',
        maxStudents: 50,
        isPrivate: false,
      });
    }
  }, [targetClass, open, form]);

  const onSubmit = async (values: ClassFormValues) => {
    setLoading(true);
    try {
      if (isEditing && targetClass) {
        await adminClassesService.updateClass(targetClass.id, {
          name: values.name,
          code: values.code || undefined,
          teacherId: values.teacherId,
          maxStudents: values.maxStudents,
          isPrivate: values.isPrivate,
        });
        toast.success('Cập nhật lớp học thành công');
      } else {
        await adminClassesService.createClass({
          name: values.name,
          code: values.code || undefined,
          schoolId: values.schoolId,
          subjectId: values.subjectId,
          teacherId: values.teacherId,
          maxStudents: values.maxStudents,
          isPrivate: values.isPrivate,
        });
        toast.success('Khởi tạo lớp học mới thành công');
      }
      onOpenChange(false);
      onSuccess();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Thao tác thất bại';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            {isEditing ? 'Chỉnh sửa lớp học' : 'Tạo lớp học mới'}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {isEditing
              ? 'Cập nhật cấu hình và giảng viên phụ trách lớp học'
              : 'Thiết lập không gian lớp học mới trong hệ thống'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Tên lớp học *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="VD: Nhập môn Lập trình Web - Nhóm 01"
                      className="rounded-xl h-10 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Mã lớp</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Tự động sinh nếu để trống"
                        className="rounded-xl h-10 text-sm font-mono uppercase"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxStudents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Sĩ số tối đa</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={500}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        className="rounded-xl h-10 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            {!isEditing && (
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="schoolId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Trường học *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          form.setValue('subjectId', '');
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl h-10 text-xs">
                            <SelectValue placeholder="Chọn trường" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          {schoolsData?.data?.map((sch) => (
                            <SelectItem key={sch.id} value={sch.id}>
                              {sch.shortname} - {sch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subjectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Môn học *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!selectedSchoolId}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl h-10 text-xs">
                            <SelectValue
                              placeholder={selectedSchoolId ? 'Chọn môn học' : 'Chọn trường trước'}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          {subjects.map((sub) => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.code} - {sub.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Giảng viên phụ trách *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-10 text-xs">
                        <SelectValue placeholder="Chọn giảng viên chủ nhiệm" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      {teachersData?.data?.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.fullName} ({t.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0 pt-1">
                  <FormControl>
                    <input
                      type="checkbox"
                      id="isPrivateInput"
                      checked={field.value}
                      onChange={field.onChange}
                      className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </FormControl>
                  <label htmlFor="isPrivateInput" className="text-xs font-medium cursor-pointer">
                    Lớp học riêng tư (Chỉ sinh viên có mã ghi danh mới có thể tham gia)
                  </label>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-3 gap-2">
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
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {loading ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Khởi tạo'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
