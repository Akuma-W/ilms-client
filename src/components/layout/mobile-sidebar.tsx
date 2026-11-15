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
    <SheetContent side="left" className="w-75 sm:w-100 p-0 bg-slate-900 border-r border-slate-800 text-slate-100">
      <SheetHeader className="p-6 border-b border-slate-800">
        <SheetTitle className="text-left">
          <Logo size="sm" variant="dark" withSlogan={true} />
        </SheetTitle>
      </SheetHeader>

      <div className="flex flex-col h-full">
        {/* User Profile in Sidebar */}
        {user && (
          <div className="p-6 bg-slate-850/60 border-b border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10 border border-slate-700">
                <AvatarImage src={user.avatar || user.avatarUrl || undefined} alt={user.fullName} />
                <AvatarFallback className="bg-linear-to-br from-blue-600 to-indigo-600 text-white text-xs font-bold">
                  {user.fullName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.fullName || 'User'}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
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
              <Button variant="outline" size="sm" className="flex-1 h-8 text-[10px] border-slate-700 bg-slate-800 text-slate-200">
                <Bell className="w-3 h-3 mr-1 text-cyan-400" /> Thông báo
              </Button>
              <Button variant="outline" size="sm" className="flex-1 h-8 text-[10px] border-slate-700 bg-slate-800 text-slate-200">
                <MessageCircle className="w-3 h-3 mr-1 text-cyan-400" /> Tin nhắn
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">
              Khám phá
            </p>
            <div className="space-y-1">
              {MAIN_NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start gap-3 h-11 px-3 rounded-lg font-medium',
                      pathname === item.href
                        ? 'bg-blue-600/20 text-cyan-400 font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                    )}
                  >
                    <item.icon className="w-4 h-4 text-cyan-400" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {user && (
            <div className="px-4 mt-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">
                Cá nhân
              </p>
              <div className="space-y-1">
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-11 px-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <User2 className="w-4 h-4 text-cyan-400" /> Hồ sơ cá nhân
                  </Button>
                </Link>
                {user.role === 'teacher' && (
                  <Link href="/classes">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-11 px-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <BookOpen className="w-4 h-4 text-cyan-400" /> Quản lý lớp học
                    </Button>
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-11 px-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <Settings className="w-4 h-4 text-cyan-400" /> Quản trị hệ thống
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800">
          {!user ? (
            <div className="grid grid-cols-2 gap-3">
              <Link href="/login">
                <Button variant="outline" className="w-full border-slate-700 bg-slate-800 text-slate-200">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold">
                  Đăng ký
                </Button>
              </Link>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11 px-3 rounded-lg text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 font-bold"
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
