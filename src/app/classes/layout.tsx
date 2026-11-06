import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/header/header';
import { ClassSidebar } from '@/features/classes/components/sidebar/class-sidebar';
import { userServerService } from '@/features/user/services/user.server.service';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';

export default async function ClassLayout({ children }: { children: React.ReactNode }) {
  const user = await userServerService.getMe();
  const data = await enrollmentServerService.getStarredClasses();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50">
        <Header initialUser={user} />
        <div className="bg-galaxy-dark w-full py-2" />
      </div>

      {/* Main layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <ClassSidebar initialStarredClasses={data} />
        </div>

        {/* Content */}
        <div className="flex flex-col w-full transition-all duration-300">
          <main className="flex-1">{children}</main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
