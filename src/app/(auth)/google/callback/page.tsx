'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { AuthCallbackStatus } from '@/types/auth';

export default function GoogleCallback() {
  const router = useRouter();
  const { mutateUser } = useCurrentUser();
  const [status, setStatus] = useState<AuthCallbackStatus>('loading');

  useEffect(() => {
    const handleGoogleLogin = async () => {
      try {
        // When BE redirect to here, fetch user
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
    <div className="flex items-center justify-center min-h-screen bg-muted/40 px-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <CardTitle>
            {status === 'loading' && 'Đang đăng nhập với Google'}
            {status === 'success' && 'Đăng nhập thành công'}
            {status === 'error' && 'Đăng nhập thất bại'}
          </CardTitle>

          <CardDescription>
            {status === 'loading' && 'Hệ thống đang xác thực tài khoản của bạn...'}
            {status === 'success' && 'Đang chuyển hướng đến trang học...'}
            {status === 'error' && 'Có lỗi xảy ra. Vui lòng thử lại.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4">
          {status === 'loading' && <Loader2 className="w-10 h-10 animate-spin text-primary" />}

          {status === 'success' && <CheckCircle2 className="w-10 h-10 text-green-500" />}

          {status === 'error' && (
            <>
              <AlertCircle className="w-10 h-10 text-destructive" />
              <button
                onClick={() => router.replace('/login')}
                className="text-sm text-primary underline"
              >
                Quay lại đăng nhập
              </button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
