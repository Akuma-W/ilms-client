import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      {/* <NavSidebar open={openSidebar} onClose={() => setOpenSidebar(false)} /> */}

      <main className="flex-1 relative py-4 px-4">{children}</main>
      <Footer />
    </div>
  );
}
