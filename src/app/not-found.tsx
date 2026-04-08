import { Header } from '@/components/header/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md my-20">
          <h1 className="text-9xl font-black text-galaxy-blue">404</h1>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Trang không tồn tại</h2>
            <p className="text-gray-400">
              Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Có thể đường dẫn đã bị
              thay đổi hoặc không còn tồn tại.
            </p>
          </div>
          <Link href="/">
            <Button className="bg-galaxy-blue hover:bg-blue-600 text-white gap-2 h-12 px-8 rounded-xl font-bold transition-all">
              <Home className="w-5 h-5" />
              Về trang chủ
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
