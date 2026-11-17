'use client';

import { motion } from 'motion/react';
import { Logo } from '@/components/common/logo';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GoogleRegisterForm } from '@/features/auth/components/google-register-form';
import { useGoogleUser } from '@/features/auth/hooks/use-google-user';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GoogleRegisterClient() {
  const router = useRouter();
  const { user, isLoading, error } = useGoogleUser();

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-sm text-slate-600 font-medium">Đang tải thông tin tài khoản...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="w-full max-w-md mx-auto space-y-4">
        <Card className="w-full border border-rose-200 bg-rose-50/50 rounded-2xl overflow-hidden text-center shadow-xs">
          <CardHeader className="space-y-2 pt-6">
            <CardTitle className="text-lg font-bold text-slate-900">
              Phiên đăng nhập đã hết hạn
            </CardTitle>
            <CardDescription className="text-xs text-slate-600">
              Vui lòng đăng nhập lại với Google để tiếp tục hoàn tất hồ sơ tài khoản.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-2.5 pb-6">
            <Button
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-xs"
              onClick={() => router.replace('/login')}
            >
              Đăng nhập lại
            </Button>

            <Button
              variant="outline"
              className="w-full h-10 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl"
              onClick={() => router.replace('/')}
            >
              Quay lại trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          Hoàn tất hồ sơ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Bổ sung thông tin trường học và định danh để bắt đầu trải nghiệm KEIVerse
        </p>
      </div>

      {/* Google Register Form */}
      <GoogleRegisterForm user={user} />

      <p className="text-[11px] text-center text-slate-500 px-4 pt-2">
        Bằng cách nhấn hoàn tất, bạn đồng ý với các điều khoản dịch vụ và chính sách bảo mật của
        chúng tôi.
      </p>
    </motion.div>
  );
}
