'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FileQuestion,
  Users,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Logo } from '@/components/common/logo';

const ADMIN_NAV_ITEMS = [
  {
    title: 'Tổng quan',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: 'Trường học & Môn',
    href: '/admin/schools',
    icon: GraduationCap,
    exact: false,
  },
  {
    title: 'Lớp học hệ thống',
    href: '/admin/classes',
    icon: BookOpen,
    exact: false,
  },
  {
    title: 'Đề thi & Bản quyền',
    href: '/admin/quizzes',
    icon: FileQuestion,
    exact: false,
  },
  {
    title: 'Quản lý người dùng',
    href: '/admin/users',
    icon: Users,
    exact: false,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isItemActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'shrink-0 sticky top-0 h-screen flex flex-col bg-slate-900 text-slate-100 border-r border-slate-800 dark:bg-black/95 dark:border-slate-800/80 z-40 select-none transition-all duration-300',
        collapsed ? 'w-20' : 'w-64',
      )}
    >
      {/* Brand & Portal Header */}
      <div
        className={cn(
          'p-4 border-b border-slate-800 flex items-center',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!collapsed ? (
          <Logo variant="dark" size="sm" withText={true} subTitle="Admin Control Center" />
        ) : (
          <Logo variant="dark" size="sm" withText={false} />
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="size-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 shrink-0"
          title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-4 px-2.5 overflow-y-auto space-y-1">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Phân hệ Quản trị
          </div>
        )}

        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.href, item.exact);

          const linkContent = (
            <Link
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl text-sm font-medium transition-all group',
                collapsed ? 'justify-center p-3' : 'px-3.5 py-2.5',
                active
                  ? 'bg-blue-600/20 text-blue-400 font-semibold border-l-3 border-blue-500 shadow-inner'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60',
              )}
            >
              <Icon
                className={cn(
                  'size-4.5 transition-colors shrink-0',
                  active ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200',
                )}
              />
              {!collapsed && <span className="flex-1 truncate">{item.title}</span>}
              {!collapsed && active && (
                <div className="size-1.5 rounded-full bg-blue-400 animate-pulse" />
              )}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="text-xs font-medium">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.href}>{linkContent}</div>;
        })}
      </div>

      {/* Footer Exit Section */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        {!collapsed && (
          <div className="px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Quyền hạn</span>
            <Badge
              variant="outline"
              className="text-[10px] bg-red-500/10 text-red-400 border-red-500/30 font-semibold"
            >
              SUPER ADMIN
            </Badge>
          </div>
        )}

        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href="/classes"
                className="flex items-center justify-center p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="size-4.5 text-slate-400" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Về giao diện học tập
            </TooltipContent>
          </Tooltip>
        ) : (
          <Link
            href="/classes"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="size-4 text-slate-400" />
            <span>Về giao diện học tập</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
