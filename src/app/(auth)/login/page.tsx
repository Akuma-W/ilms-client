"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { login } from "@/services/auth/auth.service";
import { API_URL } from "@/services/api-client";
import { Logo } from "@/components/common/logo";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export default function Login() {
  const router = useRouter();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call API to login
      const result = await login(loginForm);

      if (!result.success) {
        toast.error("Đăng nhập thất bại", {
          description: result.message,
        });
        return;
      }

      toast.success("Đăng nhập thành công", {
        description: result.message,
      });

      console.log(user);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      toast.error(
        "Đăng nhập thất bại",
        { description: error instanceof Error ? error.message : "Đăng nhập thất bại" },
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <Card className="w-full max-w-md shadow-xl border-gray-100 overflow-hidden">
        <div className="h-2 bg-galaxy"></div>
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Chào mừng trở lại!</CardTitle>
          <CardDescription>Vui lòng nhập thông tin để truy cập tài khoản của bạn</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  id="email" 
                  type="email"
                  autoComplete="email"
                  placeholder="Nhập email của bạn" 
                  className="pl-10"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({
                    ...loginForm,
                    email: e.target.value,
                  })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link href="#" className="text-xs text-galaxy-blue hover:underline">Quên mật khẩu?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  id="password" 
                  type="password"
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu của bạn" 
                  className="pl-10"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({
                    ...loginForm,
                    password: e.target.value,
                  })}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-galaxy hover:opacity-90 text-white font-bold py-6 rounded-xl shadow-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
              {!isLoading && <LogIn className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Hoặc tiếp tục với</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full py-6 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <FaGoogle className="mr-2 h-5 w-5 text-red-500" />
            Đăng nhập với Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-gray-500 pb-8">
          Chưa có tài khoản? 
          <Link href="/register" className="font-bold text-galaxy-blue hover:underline">Đăng ký ngay</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
