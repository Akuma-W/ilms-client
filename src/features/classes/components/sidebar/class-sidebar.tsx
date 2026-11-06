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
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
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

  const { isCollapsed, toggle, setCollapsed } = useSidebarStore();

  const classId = params.id as string;

  const isActive = (itemHref: string) => {
    const url = new URL(itemHref, 'http://localhost');
    const itemPath = url.pathname;
    const itemTab = url.searchParams.get('tab');
    const currentTab = searchParams.get('tab');

    if (pathname !== itemPath) return false;

    if (itemTab) {
      return itemTab === currentTab;
    }

    return true;
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 250 }}
      className={cn(
        'relative h-full flex flex-col py-10 border-r bg-white border-white/10 z-40 transition-all duration-100',
        isCollapsed ? 'items-center' : 'items-stretch',
      )}
    >
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-6">
          {/* Main Nav */}
          <nav className="space-y-1">
            {!isCollapsed && (
              <h3 className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Menu chính
              </h3>
            )}

            {CLASS_SIDEBAR_NAV.map((item) => {
              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group',
                        isActive(item.href)
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
                      )}
                    >
                      <item.icon
                        className={cn(
                          'w-5 h-5',
                          isActive(item.href)
                            ? 'text-white'
                            : 'group-hover:scale-110 transition-transform',
                        )}
                      />
                      {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                    </Link>
                  </TooltipTrigger>

                  {isCollapsed && (
                    <TooltipContent side="right" className="glass border-white/10 text-white">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>

          <Separator className="bg-gray-100 px-2" />

          {/* Starred Classes */}
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="px-3 flex items-center justify-between">
                  {!isCollapsed && (
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Lớp đã lưu{' '}
                      <span className="text-xs bg-primary text-white rounded-full px-2 py-0.5 ml-1 font-semibold">
                        {total}
                      </span>
                    </h3>
                  )}
                  <Button
                    onClick={() => setCollapsed(false)}
                    variant="ghost"
                    className="h-8 w-8 rounded-full"
                  >
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </Button>
                </div>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="glass border-white/10 text-white">
                  Lớp đã lưu{' '}
                  <span className="text-xs bg-primary text-white rounded-full px-2 py-0.5 ml-1 font-semibold">
                    {total}
                  </span>
                </TooltipContent>
              )}
            </Tooltip>

            <div className="space-y-1">
              {total > 0 ? (
                starredClasses.map((cls) => {
                  const isActive = classId === cls.id;
                  const clsTheme = getClassTheme(cls);

                  return (
                    <Tooltip key={cls.id}>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/classes/${cls.id}`}
                          style={{ '--class-theme': clsTheme.hex } as React.CSSProperties}
                          className={cn(
                            'flex items-center px-1 gap-3 py-2 rounded-xl transition-all group relative border border-transparent',
                            isActive
                              ? 'text-galaxy-blue'
                              : 'text-slate-400 hover:border-galaxy-blue',
                          )}
                        >
                          <div className="flex text-sm items-center w-full">
                            <div
                              className={cn(
                                'font-bold px-2 py-1 justify-between rounded-2xl border mr-2 transition-all duration-200',
                                'border-(--class-theme) text-(--class-theme)',
                                isActive
                                  ? `bg-(--class-theme) text-white group-hover:scale-105`
                                  : `text-(--class-theme) border-(--class-theme) group-hover:bg-(--class-theme) group-hover:text-white`,
                              )}
                            >
                              {cls.courseCode}
                            </div>
                            {!isCollapsed && (
                              <span
                                className={cn(
                                  'font-medium transition-all duration-200 line-clamp-1',
                                  isActive
                                    ? 'group-hover:font-bold'
                                    : 'text-slate-400 font-medium group-hover:font-bold group-hover:text-galaxy-blue',
                                )}
                              >
                                {cls.title}
                              </span>
                            )}
                          </div>
                          {isActive && (
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-galaxy-blue transition-all group-hover:w-full" />
                          )}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="glass border-white/10 text-white">
                        {cls.title}
                      </TooltipContent>
                    </Tooltip>
                  );
                })
              ) : (
                <div className="px-3 py-2 rounded-xl text-sm text-slate-500">
                  {!isCollapsed && 'Không có lớp nào được lưu'}
                </div>
              )}
            </div>
          </div>

          {/* Deadline Widget */}
          {!isCollapsed && (
            <>
              <Separator className="bg-gray-100 px-2" />
              <div className="px-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
                  Deadline
                </h3>
                <Suspense
                  fallback={
                    <div className="space-y-3">
                      <div className="h-14 w-full rounded-xl bg-white/5 animate-pulse" />
                    </div>
                  }
                >
                  <DeadlineWidget classId={classId} />
                </Suspense>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer / Toggle */}
      <div className="mt-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="w-full h-10 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-900"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>
    </motion.aside>
  );
}
