'use client';

import type { Class } from '@/types/class';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CLASS_SIDEBAR_NAV } from '@/config';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  BookOpen,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  MessagesSquare,
  Star,
} from 'lucide-react';
import { DeadlineWidget } from './deadline-widget';
import useSidebarStore from '@/stores/sidebar-store';
import { useStarredClasses } from '../../hooks/use-starred-classes';
import { getClassTheme } from '@/lib/ui/utils';

interface ClassSidebarProps {
  initialStarredClasses?: {
    classes: Class[];
    total: number;
  };
}

export function ClassSidebar({ initialStarredClasses }: ClassSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  const { starredClasses, total } = useStarredClasses({ initialData: initialStarredClasses });
  const { isCollapsed, toggle } = useSidebarStore();

  const classId = params?.id as string | undefined;

  // Classroom-specific navigation items when viewing a specific class
  const classroomNavItems = classId
    ? [
        { label: 'Tổng quan', href: `/classes/${classId}/overview`, icon: BookOpen },
        { label: 'Tài liệu', href: `/classes/${classId}/materials`, icon: FileText },
        { label: 'Bài tập', href: `/classes/${classId}/assignments`, icon: ClipboardList },
        { label: 'Trắc nghiệm', href: `/classes/${classId}/quizzes`, icon: CheckSquare },
        { label: 'Thảo luận', href: `/classes/${classId}/forum`, icon: MessagesSquare },
      ]
    : [];

  const isGlobalNavActive = (itemHref: string) => {
    const url = new URL(itemHref, 'http://localhost');
    const itemPath = url.pathname;
    const itemTab = url.searchParams.get('tab');
    const currentTab = searchParams.get('tab');

    if (pathname !== itemPath) return false;
    if (itemTab) return itemTab === currentTab;
    return true;
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 76 : 272 }}
      className="h-full flex flex-col z-40 bg-gradient-to-b from-indigo-50/90 via-purple-50/75 to-slate-50/90 dark:from-slate-900/95 dark:via-purple-950/20 dark:to-slate-900/95 border-r border-indigo-200/70 text-slate-900 dark:text-slate-100 shadow-xs transition-all duration-200 select-none shrink-0"
    >
      {/* Top Action Row: Header label & collapse toggle */}
      <div
        className={cn(
          'h-14 border-b border-indigo-200/70 flex items-center px-3 shrink-0',
          isCollapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!isCollapsed && (
          <span className="text-xs font-black uppercase tracking-wider text-indigo-950/80 truncate">
            {classId ? 'Không gian lớp học' : 'Điều hướng'}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="size-8 rounded-lg text-indigo-900 hover:text-indigo-950 hover:bg-white/80 border border-indigo-200/60 shadow-2xs transition-colors"
          title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Main Independent Scrolling Navigation */}
      <ScrollArea className="flex-1 py-3 px-2.5">
        <div className="space-y-4">
          {/* Active Class Context: Back button & classroom jump tabs */}
          {classId ? (
            <div className="space-y-1">
              {/* Back to class list button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/classes?tab=joined"
                    className={cn(
                      'flex items-center gap-2.5 rounded-xl text-xs font-bold text-slate-800 hover:text-indigo-950 hover:bg-white/80 border border-indigo-200/60 shadow-2xs transition-all mb-2 group',
                      isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2',
                    )}
                  >
                    <ArrowLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                    {!isCollapsed && <span className="truncate">Danh sách lớp</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-slate-900 text-white border-slate-800">
                    Danh sách lớp
                  </TooltipContent>
                )}
              </Tooltip>

              {!isCollapsed && (
                <h3 className="px-3 mb-2 text-[11px] font-black uppercase tracking-wider text-indigo-950/80">
                  Nội dung lớp học
                </h3>
              )}

              {classroomNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-xl transition-all relative group',
                          isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5',
                          isActive
                            ? 'bg-galaxy text-white shadow-md shadow-indigo-900/20 font-bold'
                            : 'text-slate-800 font-semibold hover:text-indigo-950 hover:bg-white/75 hover:shadow-2xs',
                        )}
                      >
                        <item.icon
                          className={cn(
                            'w-4.5 h-4.5 shrink-0',
                            isActive ? 'text-white' : 'group-hover:scale-105 transition-transform',
                          )}
                        />
                        {!isCollapsed && <span className="text-sm font-bold">{item.label}</span>}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent
                        side="right"
                        className="bg-slate-900 text-white border-slate-800"
                      >
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </div>
          ) : (
            /* Global Class Navigation */
            <div className="space-y-1">
              {!isCollapsed && (
                <h3 className="px-3 mb-2 text-[11px] font-black uppercase tracking-wider text-indigo-950/80">
                  Menu chính
                </h3>
              )}

              {CLASS_SIDEBAR_NAV.map((item) => {
                const active = isGlobalNavActive(item.href);
                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-xl transition-all relative group',
                          isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5',
                          active
                            ? 'bg-galaxy text-white shadow-md shadow-indigo-900/20 font-bold'
                            : 'text-slate-800 font-semibold hover:text-indigo-950 hover:bg-white/75 hover:shadow-2xs',
                        )}
                      >
                        <item.icon
                          className={cn(
                            'w-4.5 h-4.5 shrink-0',
                            active ? 'text-white' : 'group-hover:scale-105 transition-transform',
                          )}
                        />
                        {!isCollapsed && <span className="text-sm font-bold">{item.label}</span>}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent
                        side="right"
                        className="bg-slate-900 text-white border-slate-800"
                      >
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </div>
          )}

          <Separator className="bg-indigo-200/70" />

          {/* Starred Classes Section */}
          <div className="space-y-2">
            {!isCollapsed ? (
              <div className="px-3 flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase tracking-wider text-indigo-950/80 flex items-center gap-1.5">
                  Lớp đã lưu
                  <span className="text-[10px] bg-white text-indigo-950 border border-indigo-200 rounded-full px-2 py-0.2 font-black shadow-2xs">
                    {total}
                  </span>
                </h3>
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </div>
            ) : (
              <div className="flex justify-center pb-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
            )}

            <div className="space-y-1">
              {total > 0 ? (
                starredClasses.map((cls) => {
                  const isCurrentClass = classId === cls.id;
                  const clsTheme = getClassTheme(cls);

                  return (
                    <Tooltip key={cls.id}>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/classes/${cls.id}/overview`}
                          style={{ '--class-theme': clsTheme.hex } as React.CSSProperties}
                          className={cn(
                            'flex items-center rounded-xl transition-all group relative border border-transparent',
                            isCollapsed ? 'justify-center p-2' : 'px-2.5 py-2',
                            isCurrentClass
                              ? 'bg-white border-indigo-300 shadow-2xs text-indigo-950 font-bold'
                              : 'hover:bg-white/80 hover:shadow-2xs text-slate-800',
                          )}
                        >
                          <div
                            className={cn(
                              'size-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-transform group-hover:scale-105 shadow-2xs',
                              'border border-(--class-theme) text-(--class-theme)',
                              isCurrentClass ? 'bg-(--class-theme) text-white' : 'bg-white',
                            )}
                          >
                            {cls.courseCode.slice(0, 3)}
                          </div>
                          {!isCollapsed && (
                            <div className="ml-2.5 min-w-0 flex-1">
                              <p
                                className={cn(
                                  'text-xs font-bold truncate',
                                  isCurrentClass ? 'text-indigo-950' : 'text-slate-900',
                                )}
                              >
                                {cls.title}
                              </p>
                              <p className="text-[11px] font-semibold text-indigo-600 truncate">
                                {cls.courseCode}
                              </p>
                            </div>
                          )}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-slate-900 text-white border-slate-800"
                      >
                        {cls.title} ({cls.courseCode})
                      </TooltipContent>
                    </Tooltip>
                  );
                })
              ) : (
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 text-center">
                  {!isCollapsed && 'Không có lớp nào'}
                </div>
              )}
            </div>
          </div>

          {/* Deadline Widget Section */}
          {!isCollapsed && (
            <>
              <Separator className="bg-indigo-200/70" />
              <div className="px-1 pt-1">
                <h3 className="text-[11px] font-black uppercase tracking-wider text-indigo-950/80 mb-2.5 px-2">
                  Hạn nộp sắp tới
                </h3>
                <Suspense
                  fallback={<div className="h-14 w-full rounded-xl bg-white/70 animate-pulse" />}
                >
                  <DeadlineWidget classId={classId} />
                </Suspense>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
