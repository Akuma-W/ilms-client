'use client';

import { Lock, LogIn, Mail } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { LoginState, loginAction } from '@/features/auth/actions/login.action';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const initialState: LoginState = {
  success: false,
  message: '',
  errors: {},
  data: {},
};

export function LoginForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.success === false) {
      toast.error(state.message, { duration: 1000 });
    } else if (state.message) {
      toast.success(state.message, { duration: 1000 });

      setTimeout(() => {
        router.push('/classes');
        router.refresh();
      }, 1000)
    }
  }, [state, router]);

  return (
    <form action={action} className="space-y-4">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={state.data?.email}
            autoComplete="email"
            placeholder="Nhập email của bạn"
            className="pl-10"
            aria-describedby="email-error"
          />
        </div>
        <div id="email-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.email &&
            state.errors.email.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Mật khẩu</Label>
          <Link href="#" className="text-xs text-galaxy-blue hover:underline">
            Quên mật khẩu?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Nhập mật khẩu của bạn"
            className="pl-10"
            aria-describedby="password-error"
          />
        </div>
        <div id="password-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.password && (
            <div className="mt-2 text-sm text-red-500">
              <p>Mật khẩu phải:</p>
              <ul>
                {state.errors.password.map((error) => (
                  <li key={error}>- {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Submit Button */}
      <Button
        type="submit"
        disabled={pending}
        className="w-full bg-galaxy hover:opacity-90 text-white font-bold py-6 rounded-xl shadow-lg transition-all"
      >
        {pending ? 'Đang xử lý...' : 'Đăng nhập'}
        {!pending && <LogIn className="ml-2 h-4 w-4" />}
      </Button>
    </form>
  );
}
