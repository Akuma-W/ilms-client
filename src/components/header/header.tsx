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
    await logoutAction();

    // clear cache user
    await mutateUser(undefined, false);

    // Redirect to login
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="container mx-auto flex px-4 py-3 max-w-7xl items-center justify-between">
        {/* <SiteLogo /> */}
        <Logo withText withSlogan className="hidden sm:flex" />
        <Logo withText size="md" className="flex sm:hidden" />

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <AvatarSkeleton />
          ) : !user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="cursor-pointer text-gray-900 hover:hover:text-galaxy-blue hover:bg-blue-50 transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="default"
                  className="cursor-pointer bg-galaxy hover:opacity-90 text-white shadow-md"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Đăng ký
                </Button>
              </Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer relative text-gray-600 hover:bg-gray-100"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer text-gray-600 hover:bg-gray-100"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
              <AvatarDropdown user={user} onLogout={handleLogout} />
            </div>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-gray-600">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <MobileSidebar user={user} logout={handleLogout} />
          </Sheet>
        </div>
      </div>
    </header>
  );
}
