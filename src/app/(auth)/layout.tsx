import { Logo } from '@/components/common/logo';
import { SITE_CONFIG } from '@/config';
import { ArrowLeft, Sparkles, Trophy, Users } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { slogan } = SITE_CONFIG;

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-white selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Ambient Cosmic Galaxy Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-140 h-140 bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-140 h-140 bg-cyan-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-[160px]" />
      </div>

      {/* Top Header Navigation: Back to Home Link */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors group px-3.5 py-2 rounded-full bg-linear-to-r from-blue-800 via-indigo-800 to-purple-800 hover:opacity-95 shadow-md shadow-indigo-500/20"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1 text-cyan-400" />
          <span>Quay về Trang chủ</span>
        </Link>
        <div className="flex sm:hidden">
          <Logo size="sm" variant="dark" withSlogan={false} />
        </div>
      </header>

      {/* Main Centered Auth Shell with Galaxy Border Glow */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 w-full max-w-6xl mx-auto my-auto">
        <div className="w-full p-0.5 rounded-3xl bg-linear-to-r from-blue-500/40 via-indigo-500/50 to-purple-500/40 shadow-2xl shadow-indigo-950/70">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden bg-white shadow-2xl">
            {/* Left Column: Visual Galaxy Branding Panel (Desktop Only, takes 5 cols) */}
            <aside className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 relative overflow-hidden bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-r border-indigo-900/40">
              {/* Subtle Cosmic Ring Accent */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 bg-radial from-indigo-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

              {/* Top Brand */}
              <div className="space-y-3 relative z-10">
                <Logo size="md" variant="dark" withSlogan={true} />
              </div>

              {/* Center Showcase */}
              <div className="space-y-6 my-auto py-8 relative z-10">
                <div className="space-y-2.5">
                  <h2 className="text-2xl xl:text-3xl font-extrabold tracking-tight leading-snug text-white">
                    Khám phá vũ trụ học tập{' '}
                    <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      không giới hạn
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    &quot;{slogan}&quot;
                  </p>
                </div>

                {/* Feature Highlights Grid with Galaxy accents */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xs">
                    <div className="size-9 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0">
                      <Trophy className="size-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Đấu trường Quiz Tương tác</h4>
                      <p className="text-[11px] text-slate-300 leading-normal">
                        Làm bài thi kịch tính phong cách Cosmic Arena với bảng xếp hạng realtime.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xs">
                    <div className="size-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center shrink-0">
                      <Users className="size-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Không gian Lớp học Liền mạch</h4>
                      <p className="text-[11px] text-slate-300 leading-normal">
                        Kết nối bài giảng, bài tập, thảo luận diễn đàn và sổ điểm trực quan.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xs">
                    <div className="size-9 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 flex items-center justify-center shrink-0">
                      <Sparkles className="size-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Trợ lý AI Đồng hành</h4>
                      <p className="text-[11px] text-slate-300 leading-normal">
                        Hỏi đáp ngữ cảnh học tập thông minh và sinh câu hỏi trắc nghiệm tự động.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Copyright */}
              <div className="text-[11px] text-slate-400 relative z-10">
                © {new Date().getFullYear()} KEIVerse. Mọi quyền được bảo lưu.
              </div>
            </aside>

            {/* Right Column: Form Container (Spacious, longer, comfortable form with min-height) */}
            <main className="lg:col-span-7 flex flex-col justify-center items-center px-6 sm:px-10 lg:px-12 py-10 sm:py-12 w-full bg-white text-slate-800 min-h-155">
              <div className="w-full max-w-lg mx-auto">{children}</div>
            </main>
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="relative z-20 py-4 text-center text-xs text-slate-400">
        Nền tảng Quản lý Học tập Trực tuyến Thông minh {SITE_CONFIG.name}
      </footer>
    </div>
  );
}
