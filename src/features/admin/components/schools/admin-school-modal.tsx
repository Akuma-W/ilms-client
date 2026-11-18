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
import { adminSchoolService } from '@/features/admin/services/admin-schools.service';
import { schoolFormSchema, type SchoolFormValues } from '@/features/admin/schemas/admin.schema';
import { AdminSchool } from '@/types/admin';

interface AdminSchoolModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  school?: AdminSchool | null;
  onSuccess: () => void;
}

export function AdminSchoolModal({ open, onOpenChange, school, onSuccess }: AdminSchoolModalProps) {
  const isEditing = Boolean(school);
  const [loading, setLoading] = useState(false);

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: '',
      shortname: '',
      address: '',
      city: '',
    },
  });

  useEffect(() => {
    if (school) {
      form.reset({
        name: school.name,
        shortname: school.shortname || '',
        address: school.address || '',
        city: school.city || '',
      });
    } else {
      form.reset({
        name: '',
        shortname: '',
        address: '',
        city: '',
      });
    }
  }, [school, open, form]);

  const onSubmit = async (values: SchoolFormValues) => {
    setLoading(true);
    try {
      if (isEditing && school) {
        await adminSchoolService.updateSchool(school.id, values);
        toast.success('Cập nhật thông tin trường học thành công');
      } else {
        await adminSchoolService.createSchool(values);
        toast.success('Thêm mới trường học thành công');
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
            {isEditing ? 'Chỉnh sửa trường học' : 'Thêm trường học mới'}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {isEditing
              ? 'Cập nhật thông tin nhận diện cơ sở đào tạo'
              : 'Tạo cơ sở đào tạo mới vào hệ sinh thái KEIVerse'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Tên trường học *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="VD: Trường Đại học Bách Khoa"
                      className="rounded-xl h-10 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Mã viết tắt *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="VD: HCMUT, UET, HUST"
                      className="rounded-xl h-10 text-sm uppercase"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Địa chỉ trụ sở</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="VD: 268 Lý Thường Kiệt, Q.10"
                      className="rounded-xl h-10 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Tỉnh / Thành phố</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="VD: TP. Hồ Chí Minh"
                      className="rounded-xl h-10 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2 gap-2">
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
