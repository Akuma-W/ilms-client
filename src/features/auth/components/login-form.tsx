'use client';

import { LogIn, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormSchema, LoginFormValues } from '../schemas/auth.schema';
import { loginAction } from '@/features/auth/actions/login.action';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/shared/password-input';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/classes';
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);

      const state = await loginAction(
        { success: null, message: '', errors: {}, data: {} },
        formData,
      );

      if (state.success === false) {
        toast.error(state.message || 'Đăng nhập thất bại');
        if (state.errors?.email?.[0]) {
          form.setError('email', { message: state.errors.email[0] });
        }
        if (state.errors?.password?.[0]) {
          form.setError('password', { message: state.errors.password[0] });
        }
      } else if (state.message) {
        toast.success('Đăng nhập thành công');
        router.push(redirectTarget);
        router.refresh();
      }
    } catch {
      toast.error('Đã xảy ra lỗi trong quá trình đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-xs font-semibold text-slate-700">
                Địa chỉ Email
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    className="pl-10 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs text-rose-500 font-medium" />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <div className="flex items-center justify-between">
                <FormLabel className="text-xs font-semibold text-slate-700">
                  Mật khẩu
                </FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <FormControl>
                <PasswordInput
                  {...field}
                  autoComplete="current-password"
                  placeholder="Password@123"
                  className="h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </FormControl>
              <FormMessage className="text-xs text-rose-500 font-medium" />
            </FormItem>
          )}
        />

        {/* Action Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 text-sm font-bold rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white shadow-md shadow-indigo-500/20 gap-2 mt-2"
        >
          <LogIn className="size-4" />
          <span>{loading ? 'Đang xác thực...' : 'Đăng nhập'}</span>
        </Button>
      </form>
    </Form>
  );
}
