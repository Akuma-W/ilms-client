"use client";

import { Button } from '../ui/button'
import { Logo } from './logo'
import { Bell, LogIn, Menu, MessageCircle, UserPlus } from 'lucide-react';
import { AvatarDropdown } from './avatar-dropdown';
import Link from 'next/link';
import { logout } from '@/services/auth/auth.service';
import { useAuth } from '@/providers/auth-provider';

export function Header() {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();

      window.location.href = "/login";
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="container mx-auto flex px-4 py-3 max-w-7xl items-center justify-between">
        {/* <SiteLogo /> */}
        <Logo withText withSlogan />

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          {!user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-900 hover:hover:text-galaxy-blue hover:bg-blue-50 transition-colors">
                  <LogIn className="w-4 h-4 mr-2" />
                  Đăng nhập
                </Button>
              </Link>
              <Button variant="default" className="bg-galaxy hover:opacity-90 text-white shadow-md">
                <UserPlus className="w-4 h-4 mr-2" />
                Đăng ký
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:bg-gray-100">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
                <MessageCircle className="w-5 h-5" />
              </Button>
              <AvatarDropdown user={user} logout={handleLogout} />
            </div>
          )}
          <Button variant="ghost" size="icon" className="md:hidden text-gray-600">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  )
}
