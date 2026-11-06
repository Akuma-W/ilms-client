'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Server, RefreshCw, CheckCircle2, Clock, Home } from 'lucide-react';
import { BACKEND_REQUIRED_ROUTES } from '@/config';

const MAX_AUTO_ATTEMPTS = 5;
const COUNTDOWN_SECONDS = 5;

/**
 * Checks if current pathname is in the list of routes that need server communication.
 */
function isServerRequiredRoute(pathname: string): boolean {
  return BACKEND_REQUIRED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function BackendConnectionModal() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [attempts, setAttempts] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/health-check', { cache: 'no-store' });
      const data = await res.json().catch(() => ({ online: false }));

      if (res.ok && data.online) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsSuccess(false);
          setAttempts(0);
          router.refresh();
        }, 800);
        return;
      }

      setAttempts((prev) => prev + 1);
      setCountdown(COUNTDOWN_SECONDS);
    } catch {
      setAttempts((prev) => prev + 1);
      setCountdown(COUNTDOWN_SECONDS);
    } finally {
      setIsChecking(false);
    }
  }, [router]);

  // Listen for offline trigger event from API clients
  useEffect(() => {
    const handleOffline = () => {
      if (isServerRequiredRoute(pathname)) {
        setIsOpen(true);
      }
    };

    window.addEventListener('backend:offline', handleOffline);
    return () => window.removeEventListener('backend:offline', handleOffline);
  }, [pathname]);

  // Initial check on page route transition
  useEffect(() => {
    if (!isServerRequiredRoute(pathname)) {
      setIsOpen(false);
      return;
    }

    // Check server health silently when entering a server-required route
    let isMounted = true;
    fetch('/api/health-check', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && (!data || !data.online)) {
          setIsOpen(true);
        }
      })
      .catch(() => {
        if (isMounted) setIsOpen(true);
      });

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  // Countdown timer polling loop when modal is open
  useEffect(() => {
    if (!isOpen || isSuccess || isChecking) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          checkConnection();
          return COUNTDOWN_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isSuccess, isChecking, checkConnection]);

  if (!isOpen) return null;

  const isTakingLonger = attempts >= MAX_AUTO_ATTEMPTS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-card text-card-foreground border border-border shadow-xl rounded-xl p-6 transition-all">
        {/* Header with status icon */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
            {isSuccess ? (
              <CheckCircle2 className="size-5 text-emerald-500 animate-in zoom-in-75 duration-200" />
            ) : (
              <Server className="size-5 text-primary animate-pulse" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              {isSuccess ? 'Kết nối thành công!' : 'Đang kết nối tới máy chủ...'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {isSuccess
                ? 'Máy chủ đã sẵn sàng. Đang đồng bộ lại trang hiện tại...'
                : 'Hệ thống đang kiểm tra kết nối tới máy chủ KEIVerse.'}
            </p>
          </div>
        </div>

        {/* Real-time status indicator */}
        {!isSuccess && (
          <div className="bg-muted/50 border border-border/60 rounded-lg px-3 py-2 mb-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-amber-500" />
              </span>
              Lần thử: #{attempts}
            </span>
            <span className="font-mono text-primary font-medium">
              {isChecking ? 'Đang kiểm tra...' : `Thử lại sau ${countdown}s`}
            </span>
          </div>
        )}

        {/* Notice when connection takes longer than expected */}
        {!isSuccess && isTakingLonger && (
          <Alert className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 py-2.5">
            <Clock className="size-4 text-amber-500" />
            <AlertTitle className="text-xs font-semibold">Chờ đợi lâu hơn bình thường</AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Máy chủ đang mất nhiều thời gian để phản hồi. Hệ thống có thể đang bảo trì. Bạn có thể
              tiếp tục chờ hoặc quay lại sau.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/')}
            className="text-xs h-8.5 px-3 cursor-pointer"
          >
            <Home className="size-3.5 mr-1.5" />
            Về trang chủ
          </Button>

          <Button
            size="sm"
            onClick={checkConnection}
            disabled={isChecking || isSuccess}
            className="text-xs h-8.5 px-3.5 cursor-pointer"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Đang thử lại...' : 'Thử lại ngay'}
          </Button>
        </div>
      </div>
    </div>
  );
}
