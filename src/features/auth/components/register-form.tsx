'use client';

import { useSchools } from '@/features/school/hooks/use-schools';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { RegisterFormValues, RegisterSchema } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, BookOpen, GraduationCap, UserIcon, ArrowRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { authService } from '../services/auth.service';
import { SchoolSelect } from './school-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/shared/password-input';
import { OtpPinSection } from './otp-pin-section';
import { AnimatePresence, motion } from 'motion/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const { schools, isLoading: isSchoolsLoading } = useSchools();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    criteriaMode: 'all',
    defaultValues: {
      role: 'student',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      schoolId: '',
      identityCode: '',
    },
  });

  const selectedRole = form.watch('role');

  useEffect(() => {
    if (selectedRole === 'teacher') {
      form.setValue('identityCode', '');
    }
  }, [selectedRole, form]);

  const onFormSubmit = async (values: RegisterFormValues) => {
    setLoading(true);

    try {
      const payload = {
        role: values.role,
        password: values.password,
        schoolId: values.schoolId,
        identityCode: values.identityCode,
        fullName: values.fullName.trim(),
        email: values.email.toLowerCase().trim(),
      };

      const res = await authService.register(payload);
      setRegisteredEmail(payload.email);
      toast.success(res.message || 'Mã OTP đã được gửi đến email của bạn');
      setStep('otp');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gửi mã đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setLoading(true);
    try {
      await authService.verifyRegistrationOtp({
        email: registeredEmail,
        otp,
      });

      toast.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      router.push('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Xác thực OTP thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await authService.resendRegistrationOtp(registeredEmail);
      toast.success('Đã gửi lại mã OTP đến email của bạn');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gửi lại mã OTP thất bại');
      throw error;
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {step === 'form' ? (
          <motion.div
            key="register-form"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-3.5">
                {/* Role Selector Tabs */}
                <div className="p-1 bg-slate-100 rounded-xl flex gap-1 border border-slate-200">
                  {(['student', 'teacher'] as const).map((role) => (
                    <button
                      type="button"
                      key={role}
                      onClick={() => form.setValue('role', role)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                        role === selectedRole
                          ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {role === 'student' ? (
                        <BookOpen className="size-3.5" />
                      ) : (
                        <GraduationCap className="size-3.5" />
                      )}
                      <span>{role === 'student' ? 'Sinh viên' : 'Giảng viên'}</span>
                    </button>
                  ))}
                </div>

                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Họ và tên
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                          <Input
                            {...field}
                            placeholder="Nguyễn Văn A"
                            className="pl-9 h-10 text-xs sm:text-sm bg-white border-slate-200 text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500 font-medium" />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        Địa chỉ Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="student@school.edu.vn"
                            className="pl-9 h-10 text-xs sm:text-sm bg-white border-slate-200 text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500 font-medium" />
                    </FormItem>
                  )}
                />

                {/* School & Identity Code Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                  <FormField
                    control={form.control}
                    name="schoolId"
                    render={({ field }) => (
                      <FormItem className="space-y-1 min-w-0">
                        <FormLabel className="text-xs font-semibold text-slate-700">
                          Trường học
                        </FormLabel>
                        <FormControl>
                          <SchoolSelect
                            schools={schools}
                            isLoading={isSchoolsLoading}
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-rose-500 font-medium" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="identityCode"
                    render={({ field }) => (
                      <FormItem className="space-y-1 min-w-0">
                        <FormLabel className="text-xs font-semibold text-slate-700">
                          {selectedRole === 'student' ? 'Mã số sinh viên (MSSV)' : 'Mã số giảng viên (MSGV)'}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={selectedRole === 'student' ? 'VD: SV21120001' : 'VD: GV123456 (Tùy chọn)'}
                            className="h-10 text-xs sm:text-sm bg-white border-slate-200 text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-rose-500 font-medium" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1 min-w-0">
                        <FormLabel className="text-xs font-semibold text-slate-700">
                          Mật khẩu
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            {...field}
                            placeholder="Password@123"
                            className="h-10 text-xs sm:text-sm bg-white border-slate-200 text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-rose-500 font-medium" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-1 min-w-0">
                        <FormLabel className="text-xs font-semibold text-slate-700">
                          Xác nhận mật khẩu
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            {...field}
                            placeholder="Password@123"
                            className="h-10 text-xs sm:text-sm bg-white border-slate-200 text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-rose-500 font-medium" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 text-sm font-bold rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white shadow-md shadow-indigo-500/20 gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Đang gửi mã xác thực...</span>
                    </>
                  ) : (
                    <>
                      <span>Đăng ký</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        ) : (
          <motion.div
            key="register-otp"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <OtpPinSection
              email={registeredEmail}
              title="Xác thực Email đăng ký"
              description="Mã OTP gồm 6 chữ số đã được gửi đến địa chỉ:"
              isLoading={loading}
              onVerify={handleVerifyOtp}
              onResend={handleResendOtp}
              onBack={() => setStep('form')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
