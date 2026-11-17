import { Header } from '@/components/header/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { BookOpen, Compass, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-200 text-indigo-700 dark:bg-slate-950 dark:text-white overflow-hidden relative">
      {/* Cosmic background glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <Header />

      <main className="flex-1 flex items-center justify-center p-4 relative z-10 my-16 sm:my-24">
        <div className="text-center space-y-6 max-w-lg mx-auto">
          {/* Cosmic Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-600 text-white dark:bg-white/10 border dark:border-white/15 dark:text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Compass
              className="size-3.5 transition-colors animate-spin"
              style={{ animationDuration: '8s' }}
            />
            <span>Mất tín hiệu định vị tọa độ</span>
          </div>

          {/* 404 Heading */}
          <div className="relative">
            <h1 className="text-8xl sm:text-9xl font-black tracking-tighter bg-linear-to-r from-indigo-700 via-purple-700 to-indigo-700 dark:opacity-20 bg-clip-text text-transparent select-none drop-shadow-sm">
              404
            </h1>
            <div className="absolute inset-0 bg-indigo-500/10 blur-2xl -z-10 rounded-full" />
          </div>

          <div className="space-y-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Lạc Vào Không Gian Vô Định
            </h2>
            <p className="text-indigo-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              Tọa độ trang bạn đang tìm kiếm dường như chưa từng tồn tại hoặc đã di chuyển sang một
              quỹ đạo khác trong hệ thống KEIVerse.
            </p>
          </div>

          {/* Quick Action Navigation */}
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
              <Link href="/classes">
                <BookOpen className="size-4" />
                <span>Khám phá lớp học</span>
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
