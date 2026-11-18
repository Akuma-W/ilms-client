'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Activity, LogOut } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { User } from '@/types/user';

interface AdminTopbarProps {
  user?: User | null;
}

const BREADCRUMB_MAP: Record<string, string> = {
  '/admin': 'Tổng quan Dashboard',
  '/admin/schools': 'Quản lý Trường học & Môn học',
  '/admin/classes': 'Quản lý Lớp học Hệ thống',
  '/admin/quizzes': 'Quản trị Đề thi & Bản quyền',
  '/admin/users': 'Quản trị Người dùng Toàn Hệ thống',
};

export function AdminTopbar({ user }: AdminTopbarProps) {
  const pathname = usePathname();
  const currentTitle = BREADCRUMB_MAP[pathname] || 'Quản trị';

  return (
    <header className="h-16 shrink-0 sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-6 flex items-center justify-between transition-colors">
      {/* Left Container: Shadcn Semantic Breadcrumb */}
      <div className="flex items-center min-w-0">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <Home className="size-3.5" />
                  <span>Quản trị</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {pathname !== '/admin' && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs md:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {currentTitle}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right Container: System Health & Admin Profile Actions */}
      <div className="flex items-center gap-4 shrink-0">
        {/* System Health Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          <Activity className="size-3.5 animate-pulse text-emerald-500" />
          <span>Hệ thống: Hoạt động tốt</span>
        </div>

        {/* Profile Card and Action */}
        <div className="flex items-center gap-3 pl-3 sm:border-l border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8.5 ring-2 ring-blue-500/20">
              <AvatarImage src={user?.avatarUrl || ''} alt={user?.fullName || 'Admin'} />
              <AvatarFallback className="bg-blue-600 text-white font-semibold text-xs">
                {user?.fullName?.charAt(0).toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>

            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {user?.fullName || 'Administrator'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {user?.email || 'admin@ilms.local'}
              </span>
            </div>
          </div>

          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <Link
                href="/classes"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
              >
                <LogOut className="size-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Rời khu vực quản trị
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
