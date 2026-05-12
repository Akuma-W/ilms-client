'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/components/login-form';
import { authService } from '@/features/auth/services/auth.service';
import { GoogleIcon } from '@/features/auth/components/google-icon';
import { motion } from 'motion/react';

export default function LoginClient() {
  return (
    <div className="flex items-center justify-center px-4 py-12 bg-muted/40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="w-full max-w-md shadow-xl border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="h-2 bg-galaxy"></div>
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="flex justify-center">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Chào mừng trở lại!</CardTitle>
            <CardDescription>Vui lòng nhập thông tin để truy cập tài khoản của bạn</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Form */}
            <LoginForm />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Hoặc tiếp tục với</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="cursor-pointer w-full py-6 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all"
              onClick={authService.googleLogin}
            >
              <GoogleIcon className="w-5 h-5" />
              Đăng nhập với Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-gray-500 pb-8">
            Chưa có tài khoản?
            <Link href="/register" className="font-bold text-galaxy-blue hover:underline">
              Đăng ký ngay
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
