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
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { adminUsersService } from '@/features/admin/services/admin-users.service';
import { useAdminSchools } from '@/features/admin/hooks/use-admin-schools';
import { userFormSchema, type UserFormValues } from '@/features/admin/schemas/admin.schema';
import { AdminUser } from '@/types/admin';
import { AdminUserCreatedSuccess } from './admin-user-created-success';
import { AdminUserFormFields } from './admin-user-form-fields';

interface AdminUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUser | null;
  onSuccess: () => void;
}

export function AdminUserModal({ open, onOpenChange, user, onSuccess }: AdminUserModalProps) {
  const isEditing = Boolean(user);
  const isEditingAdmin = isEditing && user?.role === 'admin';
  const [loading, setLoading] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    fullName: string;
    temporaryPassword: string;
  } | null>(null);

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
      statusReason: '',
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
        statusReason: user.statusReason || '',
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
        statusReason: '',
        password: '',
      });
    }
  }, [user, open, form]);

  const handleFinishCreation = () => {
    setCreatedCredentials(null);
    onOpenChange(false);
    onSuccess();
  };

  const handleClose = () => {
    setCreatedCredentials(null);
    onOpenChange(false);
  };

  const onSubmit = async (values: UserFormValues) => {
    setLoading(true);
    try {
      if (isEditing && user) {
        await adminUsersService.updateUser(user.id, {
          fullName: values.fullName,
          role: values.role,
          status: values.status,
          statusReason: values.status === 'active' ? '' : values.statusReason?.trim() || undefined,
          schoolId: values.schoolId || undefined,
          identityCode: values.identityCode || undefined,
        });
        toast.success('Cập nhật tài khoản người dùng thành công');
        onOpenChange(false);
        onSuccess();
      } else {
        const res = await adminUsersService.createUser({
          email: values.email,
          fullName: values.fullName,
          role: values.role,
          schoolId: values.schoolId,
          identityCode: values.identityCode || undefined,
          password: values.password || undefined,
        });

        if (res?.temporaryPassword) {
          setCreatedCredentials({
            email: res.email,
            fullName: res.fullName,
            temporaryPassword: res.temporaryPassword,
          });
          toast.success('Khởi tạo tài khoản thành công!');
        } else {
          toast.success('Khởi tạo tài khoản người dùng thành công');
          onOpenChange(false);
          onSuccess();
        }
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Thao tác thất bại';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            {createdCredentials
              ? 'Khởi tạo tài khoản thành công'
              : isEditing
                ? 'Cập nhật tài khoản người dùng'
                : 'Thêm người dùng mới'}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {createdCredentials
              ? 'Lưu lại thông tin tài khoản và mật khẩu khởi tạo cho người dùng'
              : isEditing
                ? 'Chỉnh sửa thông tin hồ sơ và phân quyền người dùng'
                : 'Cấp phát tài khoản mới tham gia nền tảng KEIVerse'}
          </DialogDescription>
        </DialogHeader>

        {createdCredentials ? (
          <AdminUserCreatedSuccess
            credentials={createdCredentials}
            onFinish={handleFinishCreation}
          />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5 py-2">
              <AdminUserFormFields
                form={form}
                isEditing={isEditing}
                isEditingAdmin={isEditingAdmin}
                schools={schoolsData?.data || []}
              />

              <DialogFooter className="pt-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="rounded-xl"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium"
                >
                  {loading ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
