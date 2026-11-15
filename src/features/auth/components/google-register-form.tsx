'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GoogleProfileFormValues, GoogleRegisterSchema } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, BookOpen, GraduationCap, UserIcon, IdCard, ArrowRight, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { GoogleUser } from '@/types/auth';
import { authService } from '@/features/auth/services/auth.service';
import { useSchools } from '@/features/school/hooks/use-schools';
import { SchoolSelect } from './school-select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface GoogleRegisterFormProps {
  user: GoogleUser;
}

export function GoogleRegisterForm({ user }: GoogleRegisterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { schools, isLoading } = useSchools();

  const form = useForm<GoogleProfileFormValues>({
    resolver: zodResolver(GoogleRegisterSchema),
    defaultValues: {
      role: 'student',
      fullName: user.fullName || '',
      schoolId: '',
      identityCode: '',
    },
  });

  const { reset, watch, setValue } = form;

  useEffect(() => {
    if (user) {
      reset({
        role: 'student',
        fullName: user.fullName || '',
        schoolId: '',
        identityCode: '',
      });
    }
  }, [user, reset]);

  const selectedRole = watch('role');

  async function onSubmit(values: GoogleProfileFormValues) {
    setLoading(true);

    try {
      const result = await authService.googleRegister(values);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success('Cập nhật hồ sơ thành công!');
      router.push('/classes');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Cập nhật hồ sơ thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-3.5">
          {/* Email Read-only */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Địa chỉ Email</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <Input
                value={user.email}
                disabled
                className="pl-10 h-10 text-xs sm:text-sm rounded-xl border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Role Selector Tabs */}
          <div className="p-1 bg-slate-100 border border-slate-200 rounded-xl flex gap-1">
            {(['student', 'teacher'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setValue('role', role)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-xs font-bold ${
                  role === selectedRole
                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {role === 'student' ? (
                  <BookOpen className="size-3.5" />
                ) : (
                  <GraduationCap className="size-3.5" />
                )}
                <span>{role === 'student' ? 'Sinh viên' : 'Giảng viên'}</span>
              </button>
            ))}
          </div>

          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-semibold text-slate-700">
                  Họ và tên
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                    <Input
                      {...field}
                      placeholder="Nguyễn Văn A"
                      className="pl-10 h-10 text-xs sm:text-sm rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-500"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-rose-500 font-medium" />
              </FormItem>
            )}
          />

          {/* School Select */}
          <FormField
            control={form.control}
            name="schoolId"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-semibold text-slate-700">
                  Trường học / Đơn vị
                </FormLabel>
                <FormControl>
                  <SchoolSelect
                    schools={schools}
                    isLoading={isLoading}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage className="text-xs text-rose-500 font-medium" />
              </FormItem>
            )}
          />

          {/* Identity Code */}
          <FormField
            control={form.control}
            name="identityCode"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-semibold text-slate-700">
                  {selectedRole === 'student' ? 'Mã số sinh viên (MSSV)' : 'Mã số giảng viên (MSGV)'}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <IdCard className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                    <Input
                      {...field}
                      placeholder={selectedRole === 'student' ? '21120001' : 'GV12345 (Tùy chọn)'}
                      className="pl-10 h-10 text-xs sm:text-sm rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-500"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-rose-500 font-medium" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-indigo-500/20 gap-2 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Đang lưu thông tin...</span>
            </>
          ) : (
            <>
              <span>Hoàn tất hồ sơ</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
