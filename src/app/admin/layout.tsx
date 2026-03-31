import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/header/header';
import { Navbar } from '@/components/layout/navbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <div className="sticky top-0 z-50">
        <Header />
        <Navbar />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
