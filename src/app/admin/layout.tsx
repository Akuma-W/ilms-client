import { userServerService } from '@/features/user/services/user.server.service';
import { AdminSidebar } from '@/features/admin/components/layout/admin-sidebar';
import { AdminTopbar } from '@/features/admin/components/layout/admin-topbar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await userServerService.getMe();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar user={user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
