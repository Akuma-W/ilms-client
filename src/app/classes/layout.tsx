'use client';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/header/header';
import { ClassSidebar } from '@/features/classes/components/sidebar/class-sidebar';
import useSidebarStore from '@/stores/sidebar-store';
import { cn } from '@/lib/utils';

export default function ClassLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50">
        <Header />
        <div className="bg-galaxy-dark w-full py-2" />
      </div>

      {/* Main layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <ClassSidebar />
        </div>

        {/* Content */}
        <div className={cn('flex flex-col flex-1 transition-all duration-300')}>
          <main className="flex-1 custom-scrollbar">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
