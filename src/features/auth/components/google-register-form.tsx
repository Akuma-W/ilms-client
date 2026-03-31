'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GoogleProfileFormValues, GoogleRegisterSchema } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, BookOpen, GraduationCap, UserIcon, IdCard, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { GoogleUser } from '@/types/auth';
import { authService } from '@/features/auth/services/auth.service';
import { useSchools } from '@/features/school/hooks/use-schools';
import { SchoolSelect } from './school-select';

interface GoogleRegisterFormProps {
  user: GoogleUser;
}

export function GoogleRegisterForm({ user }: GoogleRegisterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { schools, isLoading } = useSchools();

  const googleRegisterForm = useForm<GoogleProfileFormValues>({
    resolver: zodResolver(GoogleRegisterSchema),
    defaultValues: {
      role: 'student',
      fullName: user.fullName || '',
      schoolId: '',
      identityCode: '',
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = googleRegisterForm;

  useEffect(() => {
    if (user) {
      reset({
        role: 'student',
        fullName: user.fullName || '',
        schoolId: '',
        identityCode: '',
      });
    }
  }, [user, reset]);

  const selectedRole = watch('role');

  async function onSubmit(values: GoogleProfileFormValues) {
    setLoading(true);

    try {
      const result = await authService.googleRegister(values);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success('Cập nhật hồ sơ thành công!');
      router.push('/classes');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Cập nhật hồ sơ thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="font-bold text-gray-700">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={user.email}
              disabled
              className="pl-10 text-sm h-11 rounded-xl border-gray-200 bg-muted/40 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="p-1 bg-gray-100 rounded-xl flex gap-1">
          <button
            type="button"
            onClick={() => setValue('role', 'student')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all font-bold text-sm ${
              selectedRole === 'student'
                ? 'bg-galaxy-blue text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Sinh viên</span>
          </button>
          <button
            type="button"
            onClick={() => setValue('role', 'teacher')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all font-bold text-sm ${
              selectedRole === 'teacher'
                ? 'bg-galaxy-purple text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Giảng viên</span>
          </button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName" className="font-bold text-gray-700">
            Họ và tên
          </Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="fullName"
              placeholder="Nguyễn Văn A"
              className="text-sm pl-10 h-11 rounded-xl border-gray-200 focus:ring-galaxy-blue bg-white/50"
              {...register('fullName')}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-destructive font-medium">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="schoolId" className="font-bold text-gray-700">
            Trường đại học
          </Label>
          <SchoolSelect
            schools={schools!}
            isLoading={isLoading}
            value={watch('schoolId')}
            onChange={(value) => setValue('schoolId', value)}
            error={errors.schoolId?.message}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="identityCode" className="text-sm font-bold text-gray-700">
            {selectedRole === 'student' ? 'Mã số sinh viên' : 'Mã số giảng viên'}
          </Label>

          <div className="relative">
            <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="identityCode"
              placeholder={selectedRole === 'student' ? 'MSSV123456' : 'MSGV123456 (Tùy chọn)'}
              className="text-sm pl-10 h-11 rounded-xl border-gray-200 focus:ring-galaxy-blue bg-white/50"
              {...register('identityCode')}
            />
          </div>
          {selectedRole === 'student' && errors.identityCode && (
            <p className="text-xs text-destructive font-medium">
              {errors.identityCode?.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-xl bg-galaxy hover:opacity-90 transition-all text-white font-bold text-lg shadow-lg shadow-blue-900/20"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Đang xử lý...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>Hoàn tất hồ sơ</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        )}
      </Button>
    </form>
  );
}
