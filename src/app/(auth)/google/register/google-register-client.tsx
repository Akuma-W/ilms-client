'use client';

import { motion } from 'motion/react';
import { Logo } from '@/components/common/logo';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
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
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40 px-4">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader>
            <CardTitle>Phiên đăng nhập đã hết hạn</CardTitle>
            <CardDescription>Vui lòng đăng nhập lại để tiếp tục hoàn tất đăng ký.</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            <Button className="w-full" onClick={() => router.replace('/login')}>
              Đăng nhập lại
            </Button>

            <Button variant="outline" className="w-full" onClick={() => router.back()}>
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <div className="h-2 bg-galaxy" />
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
              Hoàn tất hồ sơ
            </CardTitle>
            <CardDescription className="text-sm">
              Cung cấp thêm thông tin để bắt đầu sử dụng hệ thống
            </CardDescription>
          </CardHeader>

          {/* Google Register Form */}
          <CardContent>
            <GoogleRegisterForm user={user} />
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pb-8">
            <p className="text-xs text-center text-muted-foreground px-4">
              Bằng cách nhấn hoàn tất, bạn đồng ý với các điều khoản sử dụng của chúng tôi.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
