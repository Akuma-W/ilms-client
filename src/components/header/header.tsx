'use client';

import { Button } from '../ui/button';
import { Logo } from '../common/logo';
import { Bell, LogIn, Menu, MessageCircle, UserPlus } from 'lucide-react';
import { AvatarDropdown } from './avatar-dropdown';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
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
    <header className="sticky top-0 z-50 w-full border-b border-indigo-200/70 bg-gradient-to-r from-sky-50/95 via-indigo-50/85 to-slate-50/95 dark:from-slate-900/95 dark:via-indigo-950/40 dark:to-slate-900/95 text-slate-800 dark:text-slate-100 shadow-xs backdrop-blur-md h-16 relative">
      {/* Subtle Galaxy Accent Border Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 opacity-70 pointer-events-none" />

      <div className="container mx-auto flex h-full px-4 max-w-7xl items-center justify-between">
        {/* Brand Logo with vivid Galaxy signature colors */}
        <Logo variant="light" withText withSlogan className="hidden sm:flex" />
        <Logo variant="light" withText size="md" className="flex sm:hidden" />

        {/* Toolbar Actions */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <AvatarSkeleton />
          ) : !user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-slate-800 font-bold hover:text-indigo-950 hover:bg-white/80 border border-transparent hover:border-indigo-200/60 transition-all"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="default"
                  className="bg-galaxy hover:opacity-90 text-white font-bold shadow-sm"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Đăng ký
                </Button>
              </Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2.5">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-700 hover:text-indigo-950 hover:bg-white/80 hover:border-indigo-200/80 border border-indigo-100/80 size-9 rounded-xl transition-all shadow-2xs"
                title="Thông báo"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-indigo-100" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-700 hover:text-indigo-950 hover:bg-white/80 hover:border-indigo-200/80 border border-indigo-100/80 size-9 rounded-xl transition-all shadow-2xs"
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
                className="md:hidden text-slate-800 hover:text-indigo-950 hover:bg-white/80 size-9 rounded-xl"
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
