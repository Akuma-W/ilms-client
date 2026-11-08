'use client';

import type { User } from '@/types/user';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { BookOpen, ChevronDown, LogOut, Settings, User2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Role } from '@/types/enum';
import { ROLE_CONFIG } from '@/config';
import Link from 'next/link';

interface AvatarDropdownProps {
  user: User;
  onLogout: () => Promise<void>;
}

export function AvatarDropdown({ user, onLogout: logout }: AvatarDropdownProps) {
  const roleConfig = ROLE_CONFIG[user.role];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Avatar Menu Trigger */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-white/80 p-1 pr-2 rounded-full transition-all border border-indigo-100 hover:border-indigo-200/80 shadow-2xs">
          <Avatar className="h-9 w-9 border-2 border-white shadow-xs">
            <AvatarImage src={user.avatar || undefined} alt={user.fullName} />
            <AvatarFallback className="bg-galaxy text-white text-xs font-bold">
              {user.fullName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:flex flex-col items-start text-left">
            <span className="text-xs font-bold text-slate-900 leading-none">{user.fullName}</span>
            <span className="text-[10px] text-indigo-700 capitalize mt-0.5 font-semibold">
              {user.role}
            </span>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 mt-2 p-2 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-950 text-slate-800 dark:text-slate-100 shadow-xl rounded-2xl"
      >
        {/* Avatar Header */}
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-indigo-100">
                <AvatarImage src={user.avatar || undefined} alt={user.fullName} />
                <AvatarFallback className="bg-galaxy text-white font-bold">
                  {user.fullName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-bold leading-none text-slate-900 truncate">
                  {user.fullName}
                </p>
                <p className="text-xs leading-none text-slate-500 mt-1 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <span
                className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter',
                  roleConfig.className,
                )}
              >
                {roleConfig.label}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1.5 bg-indigo-50" />

        {/* Profile */}
        <Link href={`/profile/${user.id}`}>
          <DropdownMenuItem className="cursor-pointer rounded-xl p-2.5 text-slate-800 font-medium hover:text-indigo-950 hover:bg-indigo-50/70 focus:bg-indigo-50/70 transition-colors">
            <User2 className="mr-2 h-4 w-4 text-indigo-600" />
            <span className="font-semibold text-sm">Thông tin cá nhân</span>
          </DropdownMenuItem>
        </Link>

        {/* Teacher: Class Management */}
        {user.role === Role.teacher && (
          <Link href={'/classes'}>
            <DropdownMenuItem className="cursor-pointer rounded-xl p-2.5 text-slate-800 font-medium hover:text-indigo-950 hover:bg-indigo-50/70 focus:bg-indigo-50/70 transition-colors">
              <BookOpen className="mr-2 h-4 w-4 text-indigo-600" />
              <span className="font-semibold text-sm">Quản lý lớp học</span>
            </DropdownMenuItem>
          </Link>
        )}

        {/* Admin: System Management */}
        {user.role === Role.admin && (
          <Link href={'/admin'}>
            <DropdownMenuItem className="cursor-pointer rounded-xl p-2.5 text-slate-800 font-medium hover:text-indigo-950 hover:bg-indigo-50/70 focus:bg-indigo-50/70 transition-colors">
              <Settings className="mr-2 h-4 w-4 text-indigo-600" />
              <span className="font-semibold text-sm">Quản lý hệ thống</span>
            </DropdownMenuItem>
          </Link>
        )}

        <DropdownMenuSeparator className="my-1.5 bg-indigo-50" />

        {/* Logout */}
        <DropdownMenuItem
          className="cursor-pointer rounded-xl p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 transition-colors"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="font-bold text-sm">Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
