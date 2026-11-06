'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CLASSROOM_NAV_TABS } from '@/config';
import { cn } from '@/lib/utils';

interface ClassNavProps {
  classId: string;
  isJoined?: boolean;
}

/**
 * Modern, refined Classroom Tabs Navigation bar.
 * Connects seamlessly under ClassHero without rounded corners,
 * centered horizontally with distinctive contrast above the main content.
 */
export function ClassNav({ classId, isJoined }: ClassNavProps) {
  const pathname = usePathname();

  const tabs = CLASSROOM_NAV_TABS.filter((tab) => !tab.joinedOnly || isJoined);

  return (
    <div className="sticky top-16 z-30 w-full bg-muted/70 dark:bg-slate-900/85 backdrop-blur-md border-b border-border/80 transition-all shadow-xs">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center justify-start md:justify-center gap-1 sm:gap-2 h-12 overflow-x-auto no-scrollbar"
          aria-label="Classroom navigation tabs"
        >
          {tabs.map((tab) => {
            const isActive =
              pathname.includes(`/${tab.value}`) ||
              (tab.value === 'overview' && pathname.endsWith(classId));
            const colors = tab.colors;

            return (
              <Link
                key={tab.value}
                href={`/classes/${classId}/${tab.value}`}
                className={cn(
                  'relative flex items-center gap-2 px-3.5 sm:px-4.5 h-12 text-sm font-medium whitespace-nowrap transition-all border-b-2 shrink-0 select-none',
                  isActive
                    ? cn('text-foreground font-semibold', colors.border, colors.activeText)
                    : 'text-muted-foreground hover:text-foreground border-transparent hover:border-border/60',
                )}
              >
                {tab.icon && (
                  <tab.icon
                    className={cn(
                      'size-4 shrink-0 transition-colors',
                      isActive ? colors.icon : 'text-muted-foreground',
                    )}
                  />
                )}
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

// Backward-compatible alias
export { ClassNav as StickyNav };
