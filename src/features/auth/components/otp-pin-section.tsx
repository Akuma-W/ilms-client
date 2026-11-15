'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Loader2, RotateCw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OtpPinSectionProps {
  email: string;
  title?: string;
  description?: string;
  isLoading?: boolean;
  onVerify: (otp: string) => void;
  onResend: () => Promise<void>;
  onBack: () => void;
}

export function OtpPinSection({
  email,
  title = 'Xác thực mã OTP',
  description = 'Vui lòng nhập mã xác thực 6 số đã được gửi đến email của bạn',
  isLoading = false,
  onVerify,
  onResend,
  onBack,
}: OtpPinSectionProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState<number>(300);
  const [canResendAfter, setCanResendAfter] = useState<number>(60);
  const [isResending, setIsResending] = useState<boolean>(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // 300-second session expiration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      setCanResendAfter((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-focus first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const nextDigits = [...digits];
      nextDigits[index] = '';
      setDigits(nextDigits);
      return;
    }

    // Support copy-paste 6-digit OTP
    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 6).split('');
      const nextDigits = [...digits];
      pasted.forEach((char, i) => {
        if (i < 6) nextDigits[i] = char;
      });
      setDigits(nextDigits);
      const nextFocus = Math.min(pasted.length, 5);
      inputsRef.current[nextFocus]?.focus();

      if (nextDigits.every((d) => d !== '')) {
        onVerify(nextDigits.join(''));
      }
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = cleaned[0];
    setDigits(nextDigits);

    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (nextDigits.every((d) => d !== '')) {
      onVerify(nextDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResendClick = async () => {
    if (canResendAfter > 0 || isResending) return;
    setIsResending(true);
    try {
      await onResend();
      setCanResendAfter(60);
      setCountdown(300);
      setDigits(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isComplete = digits.every((d) => d !== '');

  return (
    <div className="w-full space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Chỉnh sửa thông tin</span>
        </button>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <ShieldCheck className="size-3.5" />
          <span>Bảo mật</span>
        </span>
      </div>

      <div className="space-y-1 text-center sm:text-left">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600">
          {description} <span className="font-semibold text-indigo-600">{email}</span>
        </p>
      </div>

      {/* 6-digit OTP Inputs */}
      <div className="flex justify-between items-center gap-2 sm:gap-3 py-2">
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            disabled={isLoading || countdown === 0}
            className={cn(
              'size-11 sm:size-13 text-center text-lg sm:text-xl font-bold rounded-xl border bg-white text-slate-900 transition-all shadow-xs',
              'focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
              digit
                ? 'border-indigo-500 bg-indigo-50/50'
                : 'border-slate-200',
              countdown === 0 && 'opacity-50 cursor-not-allowed',
            )}
          />
        ))}
      </div>

      {/* Expiration Timer & Resend Button */}
      <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
        <div className="text-slate-500">
          {countdown > 0 ? (
            <span>
              Hết hạn sau: <strong className="text-amber-600 font-mono">{formatTime(countdown)}</strong>
            </span>
          ) : (
            <span className="text-rose-600 font-semibold">Mã OTP đã hết hiệu lực</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleResendClick}
          disabled={canResendAfter > 0 || isResending || isLoading}
          className={cn(
            'inline-flex items-center gap-1 font-semibold transition-colors',
            canResendAfter > 0
              ? 'text-slate-400 cursor-not-allowed opacity-60'
              : 'text-indigo-600 hover:text-indigo-700 hover:underline',
          )}
        >
          {isResending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RotateCw className="size-3.5" />
          )}
          <span>{canResendAfter > 0 ? `Gửi lại sau (${canResendAfter}s)` : 'Gửi lại mã'}</span>
        </button>
      </div>

      {/* Submit Action */}
      <Button
        type="button"
        disabled={!isComplete || isLoading || countdown === 0}
        onClick={() => onVerify(digits.join(''))}
        className="w-full h-11 text-sm font-bold rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white shadow-md shadow-indigo-500/20"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 mr-2 animate-spin" />
            <span>Đang xác thực...</span>
          </>
        ) : (
          <span>Xác nhận hoàn tất</span>
        )}
      </Button>
    </div>
  );
}
