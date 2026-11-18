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
import { adminUsersService } from '@/features/admin/services/admin-users.service';
import { useAdminSchools } from '@/features/admin/hooks/use-admin-schools';
import { userFormSchema, type UserFormValues } from '@/features/admin/schemas/admin.schema';
import { AdminUser } from '@/types/admin';

interface AdminUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUser | null;
  onSuccess: () => void;
}

export function AdminUserModal({ open, onOpenChange, user, onSuccess }: AdminUserModalProps) {
  const isEditing = Boolean(user);
  const [loading, setLoading] = useState(false);

  const { data: schoolsData } = useAdminSchools({ limit: 100 });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      fullName: '',
      identityCode: '',
      role: 'student',
      schoolId: '',
      status: 'active',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email,
        fullName: user.fullName,
        identityCode: user.identityCode || '',
        role: user.role,
        schoolId: user.schoolId || '',
        status: user.status,
        password: '',
      });
    } else {
      form.reset({
        email: '',
        fullName: '',
        identityCode: '',
        role: 'student',
        schoolId: '',
        status: 'active',
        password: '',
      });
    }
  }, [user, open, form]);

  const onSubmit = async (values: UserFormValues) => {
    setLoading(true);
    try {
      if (isEditing && user) {
        await adminUsersService.updateUser(user.id, {
          fullName: values.fullName,
          role: values.role,
          status: values.status,
          schoolId: values.schoolId || undefined,
          identityCode: values.identityCode || undefined,
        });
        toast.success('Cập nhật tài khoản người dùng thành công');
      } else {
        await adminUsersService.createUser({
          email: values.email,
          fullName: values.fullName,
          role: values.role,
          schoolId: values.schoolId,
          identityCode: values.identityCode || undefined,
          password: values.password || undefined,
        });
        toast.success('Khởi tạo tài khoản người dùng thành công');
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
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            {isEditing ? 'Cập nhật tài khoản người dùng' : 'Thêm người dùng mới'}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {isEditing
              ? 'Chỉnh sửa thông tin hồ sơ và phân quyền người dùng'
              : 'Cấp phát tài khoản mới tham gia nền tảng KEIVerse'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5 py-2">
            {!isEditing && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Địa chỉ Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="VD: student@university.edu.vn"
                        className="rounded-xl h-10 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Họ và tên *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="VD: Nguyễn Văn A"
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
                name="identityCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Mã định danh</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="VD: 2011001"
                        className="rounded-xl h-10 text-sm font-mono"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Vai trò *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl h-10 text-xs">
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="student">Sinh viên</SelectItem>
                        <SelectItem value="teacher">Giảng viên</SelectItem>
                        <SelectItem value="admin">Quản trị viên</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="schoolId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Trường trực thuộc *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-10 text-xs">
                        <SelectValue placeholder="Chọn trường học" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      {schoolsData?.data?.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.shortname} - {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            {isEditing && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Trạng thái tài khoản</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl h-10 text-xs">
                          <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="active">Hoạt động (Active)</SelectItem>
                        <SelectItem value="locked">Bị khóa (Locked)</SelectItem>
                        <SelectItem value="banned">Cấm truy cập (Banned)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            )}

            {!isEditing && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Mật khẩu khởi tạo</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="Để trống để tự tạo mật khẩu mạnh ngẫu nhiên"
                        className="rounded-xl h-10 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            )}

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
                {loading ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
