'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { classTabItems } from '@/config/class';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export function StickyNav({ classId, isJoined }: { classId: string; isJoined?: boolean }) {
  const pathname = usePathname();
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsStuck(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = classTabItems.filter((tab) => !tab.joinedOnly || isJoined);
  const activeTab = tabs.find((tab) => {
    return (
      pathname.includes(`/${tab.value}`) || (tab.value === 'overview' && pathname.endsWith(classId))
    );
  });

  return (
    <div
      className={cn(
        'sticky top-16 z-30 transition-all duration-300',
        isStuck
          ? 'bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm'
          : 'bg-white border-b border-gray-100',
      )}
    >
      <div className="container mx-auto lg:max-w-7xl sm:max-w-lg">
        <div className="h-16 flex gap-2 overflow-x-auto no-scrollbar justify-start items-center">
          <Tabs value={activeTab?.value} className="w-full">
            <TabsList className="bg-transparent border-b border-gray-200 rounded-none h-16 w-full justify-start p-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  asChild
                  className="shrink-0 h-12 px-4 w-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
                >
                  <Link
                    href={`/classes/${classId}/${tab.value}`}
                    className="flex items-center gap-2"
                  >
                    {tab.icon && <tab.icon className="w-4 h-4" />}
                    {tab.label}
                  </Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
