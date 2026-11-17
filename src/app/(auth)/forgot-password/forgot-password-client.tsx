'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, KeyRound, Loader2, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/shared/password-input';
import { authService } from '@/features/auth/services/auth.service';
import { OtpPinSection } from '@/features/auth/components/otp-pin-section';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ForgotPasswordEmailSchema,
  ForgotPasswordEmailValues,
  NewPasswordSchema,
  NewPasswordValues,
} from '@/features/auth/schemas/auth.schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function ForgotPasswordClient() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [verifiedOtp, setVerifiedOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [loading, setLoading] = useState(false);

  const emailForm = useForm<ForgotPasswordEmailValues>({
    resolver: zodResolver(ForgotPasswordEmailSchema),
    defaultValues: { email: '' },
  });

  const passwordForm = useForm<NewPasswordValues>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  // Step 1: Send OTP to user email
  const onSendEmailSubmit = async (values: ForgotPasswordEmailValues) => {
    setLoading(true);
    try {
      const normalizedEmail = values.email.toLowerCase().trim();
      await authService.forgotPassword(normalizedEmail);
      setEmail(normalizedEmail);
      toast.success('Mã OTP khôi phục mật khẩu đã được gửi đến email của bạn');
      setStep('otp');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gửi mã xác nhận thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP code before entering new password
  const handleVerifyOtp = async (otp: string) => {
    setLoading(true);
    try {
      await authService.verifyForgotPasswordOtp({
        email,
        otp,
      });

      setVerifiedOtp(otp);
      toast.success('Mã xác thực hợp lệ! Vui lòng thiết lập mật khẩu mới.');
      setStep('password');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Mã OTP không chính xác hoặc đã hết hạn',
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2 fallback: Resend OTP code
  const handleResendOtp = async () => {
    try {
      await authService.forgotPassword(email);
      toast.success('Đã gửi lại mã OTP mới đến email');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gửi lại mã OTP thất bại');
      throw error;
    }
  };

  // Step 3: Submit new password
  const onPasswordSubmit = async (values: NewPasswordValues) => {
    setLoading(true);
    try {
      await authService.resetPassword({
        email,
        otp: verifiedOtp,
        newPassword: values.newPassword,
      });

      toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.');
      router.push('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Đặt lại mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

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
          Khôi phục mật khẩu
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {step === 'email' && 'Nhập địa chỉ email đăng ký tài khoản để nhận mã OTP'}
          {step === 'otp' && 'Nhập mã xác thực 6 số gửi đến hòm thư của bạn'}
          {step === 'password' && 'Thiết lập mật khẩu mới an toàn cho tài khoản'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'email' && (
          <motion.div
            key="step-email"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onSendEmailSubmit)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Địa chỉ Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="name@example.com"
                            className="pl-10 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500 font-medium" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      <span>Đang gửi mã...</span>
                    </>
                  ) : (
                    <span>Tiếp tục nhận mã OTP</span>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div
            key="step-otp"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            <OtpPinSection
              email={email}
              title="Xác thực OTP khôi phục"
              description="Vui lòng nhập mã OTP 6 số đã được gửi đến"
              isLoading={loading}
              onVerify={handleVerifyOtp}
              onResend={handleResendOtp}
              onBack={() => setStep('email')}
            />
          </motion.div>
        )}

        {step === 'password' && (
          <motion.div
            key="step-password"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2.5 text-xs text-indigo-700 font-medium">
                  <Lock className="size-4 shrink-0 text-indigo-600" />
                  <span>Mã OTP đã được xác thực thành công. Vui lòng nhập mật khẩu mới.</span>
                </div>

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Mật khẩu mới
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          placeholder="••••••••"
                          className="h-11 bg-white border-slate-200 text-slate-900 rounded-xl focus:border-indigo-500"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500 font-medium" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Xác nhận mật khẩu mới
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          placeholder="••••••••"
                          className="h-11 bg-white border-slate-200 text-slate-900 rounded-xl focus:border-indigo-500"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500 font-medium" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      <span>Đang cập nhật mật khẩu...</span>
                    </>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <KeyRound className="size-4" />
                      <span>Xác nhận đặt lại mật khẩu</span>
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center pt-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Quay lại Đăng nhập</span>
        </Link>
      </div>
    </motion.div>
  );
}
