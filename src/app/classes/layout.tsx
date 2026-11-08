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
      {/* Top Header */}
      <Header initialUser={user} />

      {/* Main Classroom Workspace Layout */}
      <div className="flex flex-1 min-h-[calc(100vh-4rem)] relative items-start">
        {/* Sticky Fixed Desktop Class Sidebar */}
        <aside className="hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] self-start z-30">
          <ClassSidebar initialStarredClasses={data} />
        </aside>

        {/* Dynamic Classroom Content Area */}
        <div className="flex flex-col flex-1 min-w-0 transition-all duration-200">
          <main className="flex-1">{children}</main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
