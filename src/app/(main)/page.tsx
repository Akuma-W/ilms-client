import { BannerCarousel } from '@/components/home/banner-carousel';
import { HOME_BANNERS, HOME_FEATURES, HOME_STEPS } from '@/config';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ContactSection } from '@/components/common/contact-section';
import { SITE_CONFIG } from '@/config';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Welcome',
};

export default function Home() {
  const { slogan } = SITE_CONFIG;

  return (
    <section className="flex flex-col w-full overflow-x-hidden bg-slate-50/50">
      {/* Banner */}
      <BannerCarousel banners={HOME_BANNERS} />

      {/* Slogan Bar with Galaxy Gradient */}
      <div className="w-full bg-linear-to-r from-slate-950 via-indigo-950 to-slate-950 py-10 text-center relative overflow-hidden border-y border-indigo-900/30">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="size-3.5 text-indigo-400" />
            <span>Nền tảng giáo dục thông minh KEIVerse</span>
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide leading-relaxed">
            &quot;{slogan}&quot;
          </h3>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14 max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              <span>Hệ sinh thái số</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Chức năng cốt lõi
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Cung cấp trọn bộ công cụ học tập, bài giảng tương tác và trợ lý AI thông minh đồng hành
              suốt quá trình rèn luyện.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {HOME_FEATURES.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div>
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white transition-transform group-hover:scale-110 shadow-sm',
                      feature.color,
                    )}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 sm:py-20 bg-white border-y border-slate-200/70 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 relative w-full">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 h-72 sm:h-96 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                  alt="About KEIVerse Interactive Learning"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Decorative cosmic glow */}
              <div className="absolute -top-8 -left-8 w-44 h-44 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-8 -right-8 w-60 h-60 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
            </div>

            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                <span>Về chúng tôi</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                Kiến tạo tương lai <br />
                <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Học tập tương tác không giới hạn
                </span>
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                KEIVerse ra đời với sứ mệnh mang đến một môi trường học tập số hóa tương tác toàn diện,
                nơi tri thức được kết nối và lan tỏa. Chúng tôi tin rằng mỗi người học đều sở hữu tiềm
                năng riêng, và KEIVerse là trợ thủ đắc lực giúp bạn tiếp cận nguồn tài nguyên phong phú
                và bứt phá kết quả.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Users className="size-4" />
                    <span className="text-xl sm:text-2xl font-black text-slate-900">10k+</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Học sinh & Giảng viên tin dùng</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-purple-600 mb-1">
                    <BookOpen className="size-4" />
                    <span className="text-xl sm:text-2xl font-black text-slate-900">500+</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Lớp học & Khóa học đa dạng</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  asChild
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-6 font-semibold shadow-xs gap-2"
                >
                  <Link href="/classes">
                    <span>Khám phá lớp học</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl h-11 px-6 font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <Link href="/contact">
                    <span>Liên hệ hỗ trợ</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold border border-white/10">
              <span>Lộ trình tiếp cận</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Quy trình học tập hiện đại
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Chỉ với vài thao tác trực quan, bạn đã sẵn sàng tham gia lớp học, làm bài tập và trao đổi
              trực tiếp cùng giảng viên.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
            {HOME_STEPS.map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:bg-white/10 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 group-hover:text-white group-hover:bg-indigo-600 transition-all shadow-sm">
                  <step.icon className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-mono font-bold text-indigo-400 mb-1">
                  Bước 0{index + 1}
                </span>
                <h4 className="text-base font-bold mb-2 text-white">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="bg-white py-16 sm:py-20 border-t border-slate-200/70">
        <ContactSection defaultType="feedback" />
      </section>
    </section>
  );
}
