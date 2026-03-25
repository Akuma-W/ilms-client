'use client';

import { Lock, LogIn, Mail } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Link from "next/link";
import { Button } from "../ui/button";
import { useActionState } from "react";
import { FormState, loginAction } from "@/lib/actions/auth";

export function LoginForm() {
  const initialState: FormState = { message: '', errors: {} };
  const [state, action, pending] = useActionState(loginAction, initialState);
  
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
            ))
          }
        </div>
      </div>
      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Mật khẩu</Label>
          <Link href="#" className="text-xs text-galaxy-blue hover:underline">Quên mật khẩu?</Link>
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
            <div>
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
