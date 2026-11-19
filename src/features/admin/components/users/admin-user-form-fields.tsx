'use client';

import { UseFormReturn } from 'react-hook-form';
import { GraduationCap } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminSchool } from '@/types/admin';
import { UserFormValues } from '@/features/admin/schemas/admin.schema';
import { AdminFormCombobox } from '../shared/admin-form-combobox';

interface AdminUserFormFieldsProps {
  form: UseFormReturn<UserFormValues>;
  isEditing: boolean;
  isEditingAdmin: boolean;
  schools: AdminSchool[];
}

export function AdminUserFormFields({
  form,
  isEditing,
  isEditingAdmin,
  schools,
}: AdminUserFormFieldsProps) {
  const currentStatus = form.watch('status');

  return (
    <>
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
              <Select value={field.value} onValueChange={field.onChange} disabled={isEditingAdmin}>
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
              {isEditingAdmin && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400">
                  Tài khoản Quản trị viên được bảo vệ
                </p>
              )}
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="schoolId"
        render={({ field }) => (
          <FormItem className="min-w-0 w-full">
            <FormLabel className="text-xs font-semibold">Trường trực thuộc *</FormLabel>
            <FormControl>
              <AdminFormCombobox
                options={schools.map((s) => ({
                  value: s.id,
                  label: s.name,
                  badge: s.shortname || undefined,
                }))}
                value={field.value}
                onChange={field.onChange}
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

      {isEditing && (
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Trạng thái tài khoản</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={isEditingAdmin}>
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

      {isEditing && currentStatus !== 'active' && (
        <FormField
          control={form.control}
          name="statusReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">
                Lý do thay đổi / giữ trạng thái
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nhập lý do tạm khóa hoặc đình chỉ tài khoản..."
                  className="rounded-xl h-10 text-sm"
                />
              </FormControl>
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
    </>
  );
}
