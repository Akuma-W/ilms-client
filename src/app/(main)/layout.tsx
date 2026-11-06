import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/header/header';
import { Navbar } from '@/components/layout/navbar';
import { userServerService } from '@/features/user/services/user.server.service';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await userServerService.getMe();

  return (
    <div className="flex min-h-svh flex-col">
      <div className="sticky top-0 z-50">
        <Header initialUser={user} />
        <Navbar />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
