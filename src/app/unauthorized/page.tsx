import { Header } from '@/components/header/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { BookOpen, Home, LogIn, ShieldAlert } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Khu vực giới hạn truy cập (403)',
  description: 'Bạn không có quyền hạn truy cập vào tài nguyên này.',
};

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-white overflow-hidden relative">
      {/* Cosmic Security Glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <Header />

      <main className="flex-1 flex items-center justify-center p-4 relative z-10 my-16 sm:my-24">
        <div className="text-center space-y-6 max-w-lg mx-auto">
          {/* Security Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500 dark:opacity-15 border border-rose-400/20 dark:text-rose-300 text-xs font-semibold backdrop-blur-md">
            <ShieldAlert className="size-3.5 transition-colors" />
            <span>Phân khu an ninh giới hạn</span>
          </div>

          {/* 403 Heading */}
          <div className="relative">
            <h1 className="text-8xl sm:text-9xl font-black tracking-tighter bg-linear-to-r from-rose-700 via-purple-700 to-indigo-700 dark:opacity-30 bg-clip-text text-transparent select-none drop-shadow-sm">
              403
            </h1>
            <div className="absolute inset-0 bg-rose-500/10 blur-2xl -z-10 rounded-full" />
          </div>

          <div className="space-y-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Quyền Hạn Bị Giới Hạn
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              Tài khoản hiện tại của bạn chưa được cấp đặc quyền truy cập vào phân khu này. Vui lòng
              kiểm tra lại vai trò tài khoản (Học sinh, Giảng viên hoặc Quản trị viên) hoặc yêu cầu hỗ trợ.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Button
              asChild
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-6 font-semibold shadow-xs gap-2"
            >
              <Link href="/">
                <Home className="size-4" />
                <span>Về trang chủ</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="rounded-xl h-11 px-6 font-semibold border-white/20 hover:opacity-80 dark:hover:bg-white/10 gap-2"
            >
              <Link href="/classes?tab=joined">
                <BookOpen className="size-4" />
                <span>Lớp của tôi</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="rounded-xl h-11 px-4 font-semibold text-slate-700 hover:opacity-80 dark:hover:bg-white/5 gap-1.5"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                <span>Đổi tài khoản</span>
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
