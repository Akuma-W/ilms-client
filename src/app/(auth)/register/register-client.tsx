'use client';

import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { GoogleIcon } from '@/features/auth/components/google-icon';
import { RegisterForm } from '@/features/auth/components/register-form';
import { authService } from '@/features/auth/services/auth.service';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function RegisterClient() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Subtle Galaxy Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-2/3 lg:w-1/2 relative z-10"
      >
        <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <div className="h-2 bg-galaxy" />
          <CardHeader className="space-y-1 pb-6 text-center">
            <div className="flex justify-center">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
              Tạo tài khoản
            </CardTitle>
            <CardDescription className="text-sm">
              Tham gia cộng đồng học tập thông minh
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Register Form */}
            <RegisterForm />

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
              Đăng ký với Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-gray-500 pb-8">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-bold text-galaxy-blue hover:underline">
              Đăng nhập
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
