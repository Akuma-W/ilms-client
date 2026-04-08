'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { classTabItems } from '@/config/class';
import { ClassCard } from '@/features/classes/components/ui/class-card';
import { ClassEmpty } from '@/features/classes/components/class-empty';
import { ClassSearch } from '@/features/classes/components/ui/class-search';
import { CreateClassModal } from '@/features/classes/components/modals/create-class-modal';
import { FindClassModal } from '@/features/classes/components/modals/find-class-modal';
import { useClasses } from '@/features/classes/hooks/use-classes';
import { cn } from '@/lib/utils';
import { ClassTabs } from '@/types';
import { QueryResponse } from '@/types/api';
import { Class, ClassParams } from '@/types/class';
import { User } from '@/types/user';
import { School } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ClassesClientProps {
  user: User;
  initialData: QueryResponse<Class[]>;
  initialParams: ClassParams;
}

export default function ClassesClient({ user, initialData, initialParams }: ClassesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = Object.values(ClassTabs).includes(searchParams.get('tab') as ClassTabs)
    ? (searchParams.get('tab') as ClassTabs)
    : initialParams.tab || ClassTabs.DISCOVERY;
  const search = searchParams.get('search') ?? initialParams.search;
  const page = searchParams.get('page') ?? initialParams.page;
  const limit = searchParams.get('limit') ?? initialParams.limit;

  const { classes } = useClasses({
    tab,
    search,
    page,
    limit,
    initialData,
  });

  const updateQuery = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([k, v]) => {
      if (!v) newParams.delete(k);
      else newParams.set(k, v);
    });

    if (newParams.toString() !== searchParams.toString()) {
      router.replace(`/classes?${newParams.toString()}`);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-galaxy-blue">Danh sách lớp học</h1>
        <h2 className="text-md font-semibold text-gray-500">
          Xin chào, <span className="text-galaxy-blue font-bold">{user?.fullName}</span>
        </h2>
        <div className="space-y-1">
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
          <ClassSearch />
        </div>

        {/* Modals */}
        <div className="flex items-center gap-3">
          {/* Find Class by Code */}
          <FindClassModal
            classes={classes}
            onJoinClass={(cls) => console.log('Joining class:', cls)}
          />
          {/* Create Class (Teacher) */}
          {user.role === 'teacher' && (
            <CreateClassModal onCreateClass={(data) => console.log('Creating class: ', data)} />
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs
        value={tab}
        onValueChange={(value) => {
          if (value !== tab) {
            updateQuery({ tab: value, page: '1' });
          }
        }}
        className="space-y-10"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-px">
          <TabsList className="bg-transparent h-auto p-0 gap-10">
            {classTabItems.map((tab) => (
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
            ))}
          </TabsList>
        </div>

        <TabsContent value={tab} className="mt-0">
          {classes.length === 0 ? (
            <ClassEmpty tab={tab} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {classes.map((cls, index) => (
                <ClassCard key={cls.id} classData={cls} index={index} tab={tab} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
