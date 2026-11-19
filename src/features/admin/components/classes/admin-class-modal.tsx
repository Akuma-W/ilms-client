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
import { GraduationCap, BookOpen, UserCheck } from 'lucide-react';
import { adminClassesService } from '@/features/admin/services/admin-classes.service';
import { useAdminSchools, useAdminSchoolSubjects } from '@/features/admin/hooks/use-admin-schools';
import { useAdminUsers } from '@/features/admin/hooks/use-admin-users';
import { classFormSchema, type ClassFormValues } from '@/features/admin/schemas/admin.schema';
import { AdminClass } from '@/types/admin';
import { AdminFormCombobox } from '../shared/admin-form-combobox';

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

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      title: '',
      courseCode: '',
      schoolId: '',
      subjectId: '',
      teacherId: '',
      maxStudents: 50,
      isPrivate: false,
    },
  });

  const selectedSchoolId = form.watch('schoolId');
  const { subjects = [] } = useAdminSchoolSubjects(selectedSchoolId || null);
  const { data: teachersData } = useAdminUsers({
    limit: 100,
    role: 'teacher',
    schoolId: selectedSchoolId || undefined,
  });

  useEffect(() => {
    if (targetClass) {
      form.reset({
        title: targetClass.title || '',
        courseCode: targetClass.courseCode || '',
        schoolId: targetClass.school?.id || '',
        subjectId: targetClass.subjectRef?.id || '',
        teacherId: targetClass.teacher?.id || '',
        maxStudents: targetClass.maxStudents ?? 50,
        isPrivate: targetClass.isPrivate,
      });
    } else {
      form.reset({
        title: '',
        courseCode: '',
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
          title: values.title,
          teacherId: values.teacherId,
          maxStudents: values.maxStudents,
          isPrivate: values.isPrivate,
        });
        toast.success('Cập nhật lớp học thành công');
      } else {
        await adminClassesService.createClass({
          title: values.title,
          courseCode: values.courseCode?.trim() || undefined,
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
              name="title"
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
                name="courseCode"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                <FormField
                  control={form.control}
                  name="schoolId"
                  render={({ field }) => (
                    <FormItem className="min-w-0 w-full">
                      <FormLabel className="text-xs font-semibold">Trường học *</FormLabel>
                      <FormControl>
                        <AdminFormCombobox
                          options={
                            schoolsData?.data?.map((sch) => ({
                              value: sch.id,
                              label: sch.name,
                              badge: sch.shortname || undefined,
                            })) || []
                          }
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val);
                            form.setValue('subjectId', '');
                            form.setValue('teacherId', '');
                          }}
                          placeholder="Chọn trường học..."
                          searchPlaceholder="Tìm kiếm trường..."
                          emptyText="Không tìm thấy trường học"
                          icon={GraduationCap}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subjectId"
                  render={({ field }) => (
                    <FormItem className="min-w-0 w-full">
                      <FormLabel className="text-xs font-semibold">Môn học *</FormLabel>
                      <FormControl>
                        <AdminFormCombobox
                          options={subjects.map((sub) => ({
                            value: sub.id,
                            label: sub.name,
                            badge: sub.code,
                          }))}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={!selectedSchoolId}
                          placeholder={selectedSchoolId ? 'Chọn môn học...' : 'Chọn trường trước'}
                          searchPlaceholder="Tìm kiếm môn học..."
                          emptyText="Không có môn học thuộc trường này"
                          icon={BookOpen}
                        />
                      </FormControl>
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
                <FormItem className="min-w-0 w-full">
                  <FormLabel className="text-xs font-semibold">Giảng viên phụ trách *</FormLabel>
                  <FormControl>
                    <AdminFormCombobox
                      options={
                        teachersData?.data?.map((t) => ({
                          value: t.id,
                          label: t.fullName,
                          badge: 'GV',
                          sublabel: t.email,
                        })) || []
                      }
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!selectedSchoolId}
                      placeholder={
                        selectedSchoolId ? 'Chọn giảng viên chủ nhiệm...' : 'Chọn trường học trước'
                      }
                      searchPlaceholder="Tìm kiếm giảng viên theo tên, email..."
                      emptyText="Không có giảng viên nào thuộc trường này"
                      icon={UserCheck}
                    />
                  </FormControl>
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
                className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium"
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
