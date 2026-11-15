'use client';

import { Button } from '../ui/button';
import { Logo } from '../common/logo';
import { Bell, LogIn, Menu, MessageCircle, UserPlus } from 'lucide-react';
import { AvatarDropdown } from './avatar-dropdown';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/features/user/hooks/use-current-user';
import { Sheet, SheetTrigger } from '../ui/sheet';
import { MobileSidebar } from '../layout/mobile-sidebar';
import { AvatarSkeleton } from './avatar-skeleton';
import { logoutAction } from '@/features/auth/actions/logout.action';
import { User } from '@/types/user';

interface HeaderProps {
  initialUser?: User | null;
}

export function Header({ initialUser }: HeaderProps) {
  const router = useRouter();
  const { user, isLoading, mutateUser } = useCurrentUser({
    initialUser,
  });

  const handleLogout = async () => {
    try {
      await logoutAction();
    } catch {
      // Ignore network errors during logout
    }

    // Clear user cache and refresh page state
    await mutateUser(null, false);
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-indigo-100/80 bg-linear-to-r from-sky-100/95 via-indigo-100/90 to-purple-100/95 text-slate-800 shadow-xs backdrop-blur-md h-16">
      {/* Subtle Galaxy Accent Border Line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-cyan-500 via-indigo-500 to-purple-500 opacity-80 pointer-events-none" />

      <div className="container mx-auto flex h-full px-4 max-w-7xl items-center justify-between">
        {/* Brand Logo with Galaxy signature styling */}
        <Logo variant="light" withText withSlogan className="hidden sm:flex" />
        <Logo variant="light" withText size="md" className="flex sm:hidden" />

        {/* Toolbar Actions */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <AvatarSkeleton />
          ) : !user ? (
            <div className="hidden sm:flex items-center gap-2.5">
              <Link href="/login">
                <Button
                  variant="secondary"
                  className="border border-indigo-400 hover:bg-indigo-100/80 text-indigo-800 hover:text-indigo-900 hover:border-indigo-600 font-bold shadow-xs px-4 h-9.5 rounded-xl transition-all"
                >
                  <LogIn className="w-4 h-4 mr-1.5 text-indigo-600" />
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="default"
                  className="bg-linear-to-r from-blue-800 via-indigo-800 to-purple-800 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-extrabold shadow-md shadow-indigo-500/25 px-4.5 h-9.5 rounded-xl transition-all"
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Đăng ký
                </Button>
              </Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2.5">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-slate-200 size-9 rounded-xl transition-all"
                title="Thông báo"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-slate-200 size-9 rounded-xl transition-all"
                title="Tin nhắn"
              >
                <MessageCircle className="w-4.5 h-4.5" />
              </Button>
              <AvatarDropdown user={user} onLogout={handleLogout} />
            </div>
          )}

          {/* Mobile Navigation Drawer Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-slate-700 hover:text-slate-900 hover:bg-white/80 size-9 rounded-xl"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <MobileSidebar user={user} logout={handleLogout} />
          </Sheet>
        </div>
      </div>
    </header>
  );
}
