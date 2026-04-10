'use client';

import { Class } from '@/types/class';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { classNavItems } from '@/config/class';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { DeadlineWidget } from './deadline-widget';
import useSidebarStore from '@/stores/sidebar-store';

export function ClassSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  const { isCollapsed, toggle, setCollapsed } = useSidebarStore();

  const [starredClasses, setStarredClasses] = useState<Class[]>([]);

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

            {classNavItems.map((item) => {
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
                      Lớp đã lưu
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
                  Lớp đã lưu
                </TooltipContent>
              )}
            </Tooltip>

            <div className="space-y-1">
              {starredClasses.length > 0 ? (
                starredClasses.map((cls) => {
                  const isActive = classId === cls.id;
                  return (
                    <Tooltip key={cls.id}>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/classes/${cls.id}`}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-xl transition-all group relative',
                            isActive
                              ? 'bg-white/5 text-white ring-1 ring-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                              : 'text-slate-400 hover:text-white hover:bg-white/5',
                          )}
                        >
                          <div className="w-2 h-2 rounded-full shrink-0" />
                          {!isCollapsed && (
                            <span className="font-medium text-sm truncate">{cls.title}</span>
                          )}
                          {isActive && (
                            <div className="absolute inset-0 rounded-xl ring-1 ring-primary/50 ring-offset-2 ring-offset-background pointer-events-none" />
                          )}
                        </Link>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right" className="glass border-white/10 text-white">
                          {cls.title}
                        </TooltipContent>
                      )}
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
