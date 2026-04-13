'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { classesTabItems } from '@/config/class';
import { ClassSearch } from '@/features/classes/components/ui/class-search';
import { CreateClassModal } from '@/features/classes/components/modals/create-class-modal';
import { FindClassModal } from '@/features/classes/components/modals/find-class-modal';
import { cn } from '@/lib/utils';
import { ClassTabs } from '@/types';
import { QueryResponse } from '@/types/api';
import { Class, ClassParams } from '@/types/class';
import { User } from '@/types/user';
import { School } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { ClassList } from '@/features/classes/components/ui/class-list';

interface ClassesClientProps {
  user: User | null;
  initialData: QueryResponse<Class> | null;
  initialParams: ClassParams;
}

export default function ClassesClient({ user, initialData, initialParams }: ClassesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const tab = Object.values(ClassTabs).includes(searchParams.get('tab') as ClassTabs)
    ? (searchParams.get('tab') as ClassTabs)
    : initialParams.tab || ClassTabs.DISCOVERY;
  const search = searchParams.get('search') ?? initialParams.search ?? '';
  const page = Number(searchParams.get('page') ?? initialParams.page);
  const limit = Number(searchParams.get('limit') ?? initialParams.limit);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParamsString);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === '' || value === null) {
          params.delete(key);
        } else params.set(key, value);
      });

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, searchParamsString, pathname],
  );

  const handleTabChange = useCallback(
    (nextTab: ClassTabs) => {
      if (nextTab === tab) return;

      updateParams({ tab: String(nextTab), page: '1', search: '' });
    },
    [updateParams, tab],
  );

  const handleSearch = useCallback(
    (value: string) => {
      updateParams({ search: value, page: null });
    },
    [updateParams],
  );

  const handlePageChange = useCallback(
    (p: number) => {
      updateParams({ page: String(p) });
    },
    [updateParams],
  );

  const listParams = useMemo(() => ({ tab, search, page, limit }), [tab, search, page, limit]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-galaxy-blue">Danh sách lớp học</h1>
        <h2 className="font-semibold text-gray-500">
          Xin chào{' '}
          <span className={user?.role === 'teacher' ? 'text-red-600' : 'text-green-600'}>
            {user?.role === 'teacher' ? 'giảng viên ' : 'sinh viên '}
          </span>
          <span className="text-galaxy-blue font-bold text-[18px]">{user?.fullName}</span>
        </h2>
        <div className="space-y-2">
          <p className="text-gray-500 text-md font-medium">Quản lý và khám phá các lớp học tại</p>
          <div className="flex items-center gap-2 text-primary font-black text-[12px] uppercase tracking-[0.2em] mb-2">
            <School className="w-3.5 h-3.5" />
            {user?.school?.name} ({user?.school?.shortname})
          </div>
        </div>
      </div>

      {/* Page Tools: Search, Create Class, Find Class */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="relative w-full">
          <ClassSearch value={search} onSearch={handleSearch} />
        </div>

        {/* Modals */}
        <div className="flex items-center gap-3">
          {/* Find Class by Code */}
          <FindClassModal />
          {/* Create Class (Teacher) */}
          {user?.role === 'teacher' && <CreateClassModal />}
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs
        value={tab}
        onValueChange={(value) => handleTabChange(value as ClassTabs)}
        className="space-y-10"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-px">
          <TabsList className="bg-transparent h-auto p-0 gap-10">
            {classesTabItems.map((tab) => {
              if (user?.role !== 'teacher' && tab.value === 'created') return;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    'px-1 py-4 bg-transparent rounded-none font-bold text-base transition-all duration-200 cursor-pointer',
                    'text-gray-400 hover:text-gray-600 active:text-primary',
                    'data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-b-primary',
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Class List */}
        <TabsContent value={tab} className="mt-0">
          <ClassList
            initialData={initialData}
            params={listParams}
            onPageChange={handlePageChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
