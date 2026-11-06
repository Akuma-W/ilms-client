'use client';

import type { User } from '@/types/user';
import { Bell, BookOpen, LogOut, MessageCircle, Settings, User2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Logo } from '../common/logo';
import { cn } from '@/lib/utils';
import { AvatarImage, AvatarFallback, Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { MAIN_NAV_ITEMS, ROLE_CONFIG } from '@/config';
import Link from 'next/link';

interface MobileSidebarProps {
  user?: User | null;
  logout: () => void;
}

export function MobileSidebar({ user, logout }: MobileSidebarProps) {
  const pathname = usePathname();

  return (
    <SheetContent side="left" className="w-75 sm:w-100 p-0">
      <SheetHeader className="p-6 border-b border-gray-100">
        <SheetTitle className="text-left">
          <Logo size="sm" withSlogan={true} />
        </SheetTitle>
      </SheetHeader>

      <div className="flex flex-col h-full">
        {/* User Profile in Sidebar */}
        {user && (
          <div className="p-6 bg-gray-50/50 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                <AvatarImage src={user.avatar || undefined} alt={user.fullName} />
                <AvatarFallback className="bg-galaxy text-white text-xs">
                  {user.fullName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-gray-900">{user.fullName || 'User'}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                <span
                  className={cn(
                    'w-fit mt-1 text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter',
                    ROLE_CONFIG[user.role].className,
                  )}
                >
                  {ROLE_CONFIG[user.role].label}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 h-8 text-[10px]">
                <Bell className="w-3 h-3 mr-1" /> Thông báo
              </Button>
              <Button variant="outline" size="sm" className="flex-1 h-8 text-[10px]">
                <MessageCircle className="w-3 h-3 mr-1" /> Tin nhắn
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
              Menu
            </p>
            <div className="space-y-1">
              {MAIN_NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start gap-3 h-11 px-3 rounded-lg font-medium',
                      pathname === item.href
                        ? 'bg-blue-50 text-galaxy-blue'
                        : 'text-gray-600 hover:bg-gray-50',
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {user && (
            <div className="px-4 mt-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
                Cá nhân
              </p>
              <div className="space-y-1">
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-11 px-3 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    <User2 className="w-4 h-4" /> Thông tin cá nhân
                  </Button>
                </Link>
                {user.role === 'teacher' && (
                  <Link href="/classes">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-11 px-3 rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                      <BookOpen className="w-4 h-4" /> Quản lý lớp học
                    </Button>
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-11 px-3 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4" /> Quản lý hệ thống
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100">
          {!user ? (
            <div className="grid grid-cols-2 gap-3">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full bg-galaxy text-white">Đăng ký</Button>
              </Link>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11 px-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-600 font-bold"
              onClick={() => logout()}
            >
              <LogOut className="w-4 h-4" /> Đăng xuất
            </Button>
          )}
        </div>
      </div>
    </SheetContent>
  );
}
