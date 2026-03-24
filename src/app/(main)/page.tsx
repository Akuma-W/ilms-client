import { BannerCarousel } from '@/components/others/banner-carousel';
import { useWebsiteConfig } from '@/hooks/useConfig';
import { banners, features, steps } from './data';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FeedbackSection } from '@/components/others/feedback-section';

export default function Home() {
  const { slogan } = useWebsiteConfig();

  return (
    <section className="flex flex-col w-full overflow-x-hidden">
      {/* Banner */}
      <BannerCarousel banners={banners} />

      {/* Slogan Bar */}
      <div className="w-full bg-galaxy py-8 text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white italic tracking-wide">
            &quot;{slogan}&quot;
          </h3>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Chức năng cốt lõi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cung cấp đầy đủ các công cụ cần thiết để bạn có một trải nghiệm học tập
              tuyệt vời nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 group"
              >
                <div
                  className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-white transition-transform group-hover:scale-110',
                    feature.color,
                  )}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 relative">
              <div className="hidden lg:block relative z-10 rounded-3xl overflow-hidden shadow-2xl h-100">
                <Image
                  src="https://picsum.photos/seed/about-us/800/600"
                  alt="About KEIVerse"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="block lg:hidden h-1 w-full bg-galaxy rounded-full" />

              {/* Decorative blobs */}
              <div className="hidden lg:block absolute -top-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
              <div className="hidden lg:block absolute -bottom-10 -right-10 w-60 h-60 bg-purple-400/20 rounded-full blur-3xl"></div>
            </div>

            <div className="flex-1 space-y-8">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                Về chúng tôi
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                Kiến tạo tương lai <br />
                <span className="text-gradient">Học tập không giới hạn</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                KEIVerse ra đời với sứ mệnh mang đến một môi trường học tập số hóa toàn diện, nơi
                tri thức được kết nối và lan tỏa. Chúng tôi tin rằng mỗi sinh viên đều có một hành
                trình học tập riêng biệt, và KEIVerse là người bạn đồng hành giúp bạn khám phá và
                chinh phục những đỉnh cao mới.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-galaxy-blue mb-1">10k+</div>
                  <div className="text-sm text-gray-500">Sinh viên tin dùng</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-galaxy-purple mb-1">500+</div>
                  <div className="text-sm text-gray-500">Khóa học đa dạng</div>
                </div>
              </div>
              <Button size="lg" className="bg-galaxy text-white px-8">
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-galaxy-dark text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Quy trình học tập</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Chỉ với vài bước đơn giản, bạn đã có thể bắt đầu trải nghiệm học tập hiện đại tại
              KEIVerse.
            </p>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-blue-500 via-purple-500 to-blue-500 -translate-y-1/2 opacity-20"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12">
              {steps.map((step, index) => (
                <div key={index} className="relative flex flex-col items-center text-center group">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/20 transition-all group-hover:bg-galaxy group-hover:scale-110 relative z-10">
                    <step.icon className="w-10 h-10 text-blue-400 group-hover:text-white" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-galaxy flex items-center justify-center text-xs font-bold border-2 border-white/20">
                      {index + 1}
                    </div>
                  </div>
                  <h4 className="text-lg font-bold mb-3">{step.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <FeedbackSection />
    </section>
  );
}
