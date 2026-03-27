import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/header/header';
import { Navbar } from '@/components/layout/navbar';
// import { ProtectedRoute } from '@/components/route/protected-route';

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <div className="sticky top-0 z-50">
        <Header />
        <Navbar />
      </div>
      <main className="flex-1">
        {/* <ProtectedRoute>{children}</ProtectedRoute> */}
        {children}
      </main>
      <Footer />
    </div>
  );
}
