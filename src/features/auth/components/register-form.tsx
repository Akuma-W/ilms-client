'use client';

import { useSchools } from "@/features/school/hooks/use-schools";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { RegisterFormValues, RegisterSchema } from "../schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, IdCard, Lock, BookOpen, GraduationCap, UserIcon, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authService } from "../services/auth.service";
import { SchoolSelect } from "./school-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { schools, isLoading } = useSchools();

  const registerForm = useForm<RegisterFormValues>({
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = registerForm;

  const selectedRole = watch('role');

  useEffect(() => {
    if (selectedRole === 'teacher') {
      setValue('identityCode', '');
    }
  }, [selectedRole, setValue]);

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    
    try {
      const payload = {
        role: values.role,
        password: values.password,
        schoolId: values.schoolId,
        identityCode: values.identityCode,
        fullName: values.fullName.trim(),
        email: values.email.toLowerCase(),
      };

      const res = await authService.register(payload);

      toast.success(res.message || 'Đăng ký thành công');

      router.push('/login');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      else {
        toast.error('Đăng ký thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Role */}
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

      {/* Full Name */}
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

      {/* Email */}
      <div  className="space-y-2">
        <Label htmlFor="email" className="font-bold text-gray-700">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@university.edu.vn"
            className="text-sm pl-10 h-11 rounded-xl border-gray-200 focus:ring-galaxy-blue bg-white/50"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* School */}
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

      {/* Identity Code */}
      <div className="space-y-2">
        <Label htmlFor="identityCode" className="font-bold text-gray-700">
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

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" title="Mật khẩu" className="text-sm font-bold text-gray-700">Mật khẩu</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="Nhập mật khẩu"
            className="text-sm pl-10 h-11 rounded-xl border-gray-200 focus:ring-galaxy-blue bg-white/50"
            {...register("password")}
          />
        </div>
      </div>
      {errors.password?.types && (
        <div className="text-xs text-destructive font-medium">
          <p>Mật khẩu phải:</p>
          <ul>
            {Object.values(errors.password?.types).flat().map((error, idx) => (
              <li key={idx}>- {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Confirm password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" title="Xác nhận" className="text-sm font-bold text-gray-700">Xác nhận</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Xác nhận lại mật khẩu"
            className="text-sm pl-10 h-11 rounded-xl border-gray-200 focus:ring-galaxy-blue bg-white/50"
            {...register("confirmPassword")}
          />
        </div>
      </div>
      {errors.confirmPassword && (
        <p className="text-xs text-destructive font-medium">
          {errors.confirmPassword?.message}
        </p>
      )}

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
            <span>Đăng ký ngay</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        )}
      </Button>
    </form>
  );
}
