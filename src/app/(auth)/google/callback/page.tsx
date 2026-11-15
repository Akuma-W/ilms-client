'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useCurrentUser } from '@/features/user/hooks/use-current-user';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { AuthCallbackStatus } from '@/types/auth';
import { Button } from '@/components/ui/button';

export default function GoogleCallback() {
  const router = useRouter();
  const { mutateUser } = useCurrentUser();
  const [status, setStatus] = useState<AuthCallbackStatus>('loading');

  useEffect(() => {
    const handleGoogleLogin = async () => {
      try {
        await mutateUser();
        setStatus('success');

        setTimeout(() => {
          router.replace('/classes');
        }, 800);
      } catch (error) {
        setStatus('error');
        console.error(error);
      }
    };

    handleGoogleLogin();
  }, [router, mutateUser]);

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="w-full shadow-2xl border border-indigo-500/30 bg-slate-900/90 backdrop-blur-xl rounded-3xl overflow-hidden text-slate-100 text-center">
        <div className="h-1.5 w-full bg-linear-to-r from-cyan-400 via-indigo-500 to-purple-500" />
        <CardHeader className="pt-7 pb-4">
          <CardTitle className="text-xl font-bold text-white">
            {status === 'loading' && 'Đang xác thực Google...'}
            {status === 'success' && 'Đăng nhập thành công!'}
            {status === 'error' && 'Đăng nhập thất bại'}
          </CardTitle>

          <CardDescription className="text-sm text-slate-400">
            {status === 'loading' && 'Hệ thống đang đồng bộ phiên đăng nhập của bạn...'}
            {status === 'success' && 'Đang chuyển hướng đến không gian học tập...'}
            {status === 'error' && 'Đã xảy ra sự cố trong quá trình xác thực.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4 pb-8">
          {status === 'loading' && <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />}

          {status === 'success' && <CheckCircle2 className="w-10 h-10 text-emerald-400" />}

          {status === 'error' && (
            <>
              <AlertCircle className="w-10 h-10 text-rose-500" />
              <Button
                variant="outline"
                onClick={() => router.replace('/login')}
                className="mt-2 border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200"
              >
                Quay lại đăng nhập
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
