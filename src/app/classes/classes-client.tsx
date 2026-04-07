'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClassCard } from '@/features/classes/components/class-card';
import { ClassEmpty } from '@/features/classes/components/class-empty';
import { ClassSearch } from '@/features/classes/components/class-search';
import { useClasses } from '@/features/classes/hooks/use-classes';
import { ClassTabs } from '@/types';
import { QueryResponse } from '@/types/api';
import { Class, ClassParams } from '@/types/class';
import { Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ClassesClientProps {
  initialData: QueryResponse<Class[]>;
  initialParams: ClassParams;
}

export default function ClassesClient({ initialData, initialParams }: ClassesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = Object.values(ClassTabs).includes(searchParams.get('tab') as ClassTabs)
    ? (searchParams.get('tab') as ClassTabs)
    : initialParams.tab || ClassTabs.DISCOVERY;
  const search = searchParams.get('search') ?? initialParams.search ?? '';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '8';

  const { classes } = useClasses({
    tab,
    search,
    page,
    limit,
    initialData,
    initialParams,
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
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      {/* Page Title & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Lớp học của tôi</h1>
          <p className="text-gray-500 font-medium">
            Quản lý và khám phá các khóa học của bạn tại Đại học Bách Khoa.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <ClassSearch />
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl px-6 h-12 shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
            <Plus className="w-5 h-5 mr-2" />
            Tạo lớp học
          </Button>
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
            {[
              { value: 'discovery', label: 'Khám phá' },
              { value: 'joined', label: 'Đã tham gia' },
              { value: 'pending', label: 'Đang duyệt' },
              { value: 'created', label: 'Đã tạo' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="px-0 py-4 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-bold text-gray-400 hover:text-gray-600 transition-all text-base"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={tab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {classes.length === 0 ? (
              <ClassEmpty tab={tab} />
            ) : (
              classes.map((cls, index) => (
                <ClassCard key={cls.id} classData={cls} index={index} tab={tab} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
