'use client';

import { getSchools } from '@/services/school/school.service';
import { School } from '@/types/school.type';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { RegisterFormValues, registerSchema } from './register.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { register } from '@/services/auth/auth.service';
import { toast } from 'sonner';
import { API_URL } from '@/services/api-client';
import { Logo } from '@/components/common/logo';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, GraduationCap, IdCard, Lock, Mail, SchoolIcon, UserIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FaGoogle } from 'react-icons/fa';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
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

  const selectedRole = useWatch({
    control: form.control,
    name: 'role',
  });

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const { data } = await getSchools();
        setSchools(data);
      } catch (error) {
        console.error('Failed to fetch schools:', error);
      }
    };
    fetchSchools();
  }, []);

  async function handleRegister(values: RegisterFormValues) {
    setIsLoading(true);

    try {
      await register({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        role: values.role,
        schoolId: values.schoolId,
        identityCode: values.identityCode,
      });
      toast.success("Đăng ký thành công");
      setTimeout(() => {
        router.push('/register');
      }, 1500);
    } catch (error) {
      toast.error('Đăng ký thất bại', {
        description: error instanceof Error ? error.message : 'Đăng ký thất bại',
      });
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  }

  const [search, setSearch] = useState("");

  // Lọc trường dựa vào input
  const filteredSchools = useMemo(() => {
    if (!search) return schools;
    return schools.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.shortname?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, schools]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Subtle Galaxy Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <div className="h-2 bg-galaxy"></div>
          <CardHeader className="space-y-1 pb-6 text-center">
            <div className="flex flex-col items-center mb-8">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
              Tạo tài khoản
            </CardTitle>
            <CardDescription className="text-sm">
              Tham gia cộng đồng học tập thông minh
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-5">
              <div className="p-1 bg-gray-100 rounded-xl flex gap-1">
                <button
                  type="button"
                  onClick={() => form.setValue("role", "student")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all font-bold text-sm ${
                    selectedRole === "student" 
                      ? "bg-galaxy-blue text-white shadow-md" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Sinh viên</span>
                </button>
                <button
                  type="button"
                  onClick={() => form.setValue("role", "teacher")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all font-bold text-sm ${
                    selectedRole === "teacher" 
                      ? "bg-galaxy-purple text-white shadow-md" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Giảng viên</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-bold text-gray-700">Họ và tên</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="fullName"
                      placeholder="Nguyễn Văn A"
                      className="pl-10 h-11 rounded-xl border-gray-200 focus:ring-galaxy-blue bg-white/50"
                      {...form.register("fullName")}
                    />
                  </div>
                  {form.formState.errors.fullName && (
                    <p className="text-xs text-destructive font-medium">
                      {form.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-gray-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@university.edu.vn"
                      className="pl-10 h-11 rounded-xl border-gray-200 focus:ring-galaxy-blue bg-white/50"
                      {...form.register("email")}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive font-medium">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolId" className="text-sm font-bold text-gray-700">Trường đại học</Label>
                  <div className="relative">
                    <SchoolIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                    <Select onValueChange={(value) => form.setValue("schoolId", value as string)}>
                      <SelectTrigger className="pl-10 w-full h-11 rounded-xl border-gray-200 focus:ring-galaxy-blue bg-white/50">
                        <SelectValue placeholder="Chọn trường học" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <Command>
                          <CommandInput 
                            placeholder="Tìm kiếm trường ..."
                            value={search}
                            onValueChange={setSearch}
                          />
                          <CommandList className="max-h-64 overflow-y-auto">
                            {filteredSchools.length === 0 && <CommandEmpty>Không tìm thấy</CommandEmpty>}
                            {filteredSchools.map((school) => (
                              <CommandItem
                                key={school.id}
                                value={school.id}
                                onSelect={(value) => form.setValue("schoolId", value)}
                              >
                                <span className="font-bold mr-2">{school.shortname}</span>
                                <span>{school.name}</span>
                              </CommandItem>
                            ))}
                          </CommandList>
                        </Command>
                      </SelectContent>
                    </Select>
                  </div>
                  {form.formState.errors.schoolId && (
                    <p className="text-xs text-destructive font-medium">
                      {form.formState.errors.schoolId.message}
                    </p>
                  )}
                </div>

                {selectedRole === "student" && (
                  <div className="space-y-2">
                    <Label htmlFor="identityCode" className="text-sm font-bold text-gray-700">Mã số sinh viên</Label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="identityCode"
                        placeholder="MSSV123456"
                        className="pl-10 h-11 rounded-xl border-gray-200 focus:ring-galaxy-blue bg-white/50"
                        {...form.register("identityCode")}
                      />
                    </div>
                    {form.formState.errors.identityCode && (
                      <p className="text-xs text-destructive font-medium">
                        {form.formState.errors.identityCode.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" title="Mật khẩu" className="text-sm font-bold text-gray-700">Mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        className="pl-10 h-11 rounded-xl border-gray-200 focus:ring-galaxy-blue bg-white/50"
                        {...form.register("password")}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" title="Xác nhận" className="text-sm font-bold text-gray-700">Xác nhận</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="pl-10 h-11 rounded-xl border-gray-200 focus:ring-galaxy-blue bg-white/50"
                        {...form.register("confirmPassword")}
                      />
                    </div>
                  </div>
                </div>
                {(form.formState.errors.password || form.formState.errors.confirmPassword) && (
                  <p className="text-xs text-destructive font-medium">
                    {form.formState.errors.password?.message || form.formState.errors.confirmPassword?.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-galaxy hover:opacity-90 transition-all text-white font-bold text-lg shadow-lg shadow-blue-900/20" 
                disabled={isLoading}
              >
                {isLoading ? (
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

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white px-2 text-muted-foreground font-bold tracking-wider">Hoặc tiếp tục với</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl border-gray-100 hover:bg-gray-50 font-bold flex items-center justify-center gap-3 bg-white/50"
                onClick={handleGoogleLogin}
              >
                <FaGoogle className="w-4 h-4" />
                Google
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8">
            <div className="text-sm text-center text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link href="/login" className="text-galaxy-blue font-bold hover:underline">
                Đăng nhập
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
