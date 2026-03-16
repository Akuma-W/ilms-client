"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FaGoogle } from "react-icons/fa6";
import { login } from "@/services/auth.service";
import { API_URL } from "@/services/api-client";
import { Logo } from "@/components/common/logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { MdEmail } from "react-icons/md";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call API to login
      const result = await login(loginForm);

      toast.success(result.message, { duration: 1500 });
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      toast.error("Login failed!");
      setError(typeof err === "string" ? err : (err instanceof Error ? err.message : "Đã xảy ra lỗi"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="w-full flex justify-center">
      <Card className="w-full max-w-md relative z-10 border-white bg-white/80 backdrop-blur-xl shadow-2xl shadow-indigo-100/50 rounded-[2.5rem] border-none">
        <CardHeader className="text-center pb-2 pt-6">
          <div className="flex justify-center mb-2">
            <div className="p-4 bg-indigo-50 rounded-3xl shadow-inner">
              <Logo size="md" withText={false} />
            </div>
          </div>
          <CardTitle className="text-3xl font-heading font-black text-slate-900">
            Chào mừng trở lại
          </CardTitle>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Đăng nhập để tiếp tục khám phá tri thức
          </p>
        </CardHeader>
        <CardContent className="px-10 pb-4">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[12px] font-black text-indigo-600 uppercase tracking-widest ml-1">
                Email
              </Label>
              <div className="relative">
                <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                <Input
                  id="email"
                  autoComplete="email"
                  type="email"
                  required
                  placeholder="Tài khoản của bạn..."
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="pl-12 text-sm bg-white border-slate-100 text-slate-900 h-14 rounded-2xl focus:ring-indigo-500 shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-[12px] font-black text-indigo-600 uppercase tracking-widest">
                  Mật khẩu
                </Label>
                <a
                  href="#"
                  className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                <Input
                  id="password"
                  required
                  type="password"
                  placeholder="Mật khẩu của bạn"
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="pl-12 text-sm bg-white border-slate-100 text-slate-900 h-14 rounded-2xl focus:ring-indigo-500 shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Sign In button */}
            <Button
              type="submit"
              variant="default"
              disabled={loading}
              className="w-full h-12 text-lg rounded-2xl shadow-lg shadow-indigo-200 font-bold"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
            {error && <p className="text-sm text-red-500 mt-4 text-center">{error}</p>}
          </form>

          {/* Divier */}
          <div className="relative mt-8 mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-3 text-muted-foreground">
                hoặc tiếp tục với
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="h-10 w-full rounded-lg"
            type="button"
            onClick={handleGoogleLogin}
          >
            <FaGoogle className="size-4" />
            <span>Đăng nhập với Google</span>
          </Button>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground my-4">
            {"Không có tài khoản? "}
            <a
              href="/register"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Đăng ký
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
