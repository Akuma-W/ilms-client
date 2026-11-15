'use client';

import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/features/auth/components/google-icon';
import { RegisterForm } from '@/features/auth/components/register-form';
import { authService } from '@/features/auth/services/auth.service';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function RegisterClient() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-6"
    >
      <div className="space-y-2 text-center">
        <div className="flex justify-center lg:hidden mb-2">
          <Logo size="md" variant="light" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Đăng ký tài khoản
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Tham gia nền tảng học tập tương tác thế hệ mới KEIVerse
        </p>
      </div>

      {/* Main Register Form with smooth conditional Step Slide */}
      <RegisterForm />

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
            Hoặc tiếp tục với
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-11 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl shadow-xs transition-all gap-2"
        onClick={authService.googleLogin}
      >
        <GoogleIcon className="size-4" />
        <span>Đăng ký với Google</span>
      </Button>

      <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm text-slate-500 pt-2">
        <span>Đã có tài khoản?</span>
        <Link
          href="/login"
          className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
        >
          Đăng nhập ngay
        </Link>
      </div>
    </motion.div>
  );
}
