'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClassCard } from '@/features/classes/components/class-card';
import { ClassSearch } from '@/features/classes/components/class-search';
import { classService } from '@/features/classes/services/class.service';
import { enrollmentService } from '@/features/classes/services/enrollment.service';
import { ClassTabs as ClassesTabs } from '@/types';
import { Class } from '@/types/class';
import { Plus, BookOpen } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';

interface ClassesClientProps {
  classesData: Class[] | undefined;
  initialParams: {
    tab?: string;
    page?: string;
    limit?: string;
    search?: string;
  };
}

async function fetchClasses({
  tab,
  search,
  page,
  limit,
}: {
  tab: ClassesTabs;
  search: string;
  page: string;
  limit: string;
}) {
  switch (tab) {
    case 'joined': {
      const res = await enrollmentService.getMyEnrollments({
        status: 'approved',
      });

      return res.data;
    }

    case 'pending': {
      const res = await enrollmentService.getMyEnrollments({
        status: 'pending',
      });

      return res.data;
    }

    case 'created': {
      const res = await classService.getMyCreatedClasses({ search, page, limit });
      return res.data;
    }

    default: {
      const res = await classService.getClasses({ search, page, limit });
      return res.data;
    }
  }
}

function EmptyState({ tab }: { tab: ClassesTabs }) {
  const map: Record<ClassesTabs, string> = {
    discovery: 'Không tìm thấy lớp học',
    joined: 'Bạn chưa tham gia lớp nào',
    pending: 'Không có yêu cầu nào',
    created: 'Bạn chưa tạo lớp nào',
  };

  return (
    <div className="flex flex-col items-center py-20 text-gray-500">
      <BookOpen className="w-10 h-10 mb-3" />
      <p>{map[tab]}</p>
    </div>
  );
}

export default function ClassesClient({ classesData, initialParams }: ClassesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab: ClassesTabs =
    (searchParams.get('tab') as ClassesTabs) || initialParams.tab || ClassesTabs.DISCOVERY;
  const search = searchParams.get('search') || '';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '8';

  const key = ['classes', tab, search, page, limit];

  const isInitial =
    tab === initialParams.tab &&
    search === (initialParams.search || '') &&
    page === (initialParams.page || '1') &&
    limit === (initialParams.limit || '8');

  const { data, isLoading } = useSWR(key, () => fetchClasses({ tab, search, page, limit }), {
    fallbackData: isInitial ? classesData : undefined,
    keepPreviousData: true,
    revalidateOnMount: false,
    revalidateOnFocus: false,
    refreshInterval: 10000, // 10 seconds
    dedupingInterval: 10000, // 10 seconds
  });

  const updateQuery = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([k, v]) => {
      if (!v) newParams.delete(k);
      else newParams.set(k, v);
    });

    const newUrl = `/classes?${newParams.toString()}`;
    const currentUrl = window.location.pathname + window.location.search;

    if (newUrl !== currentUrl) {
      router.push(newUrl);
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
            {!data || data.length === 0 ? (
              <EmptyState tab={tab} />
            ) : (
              data.map((cls, index) => (
                <ClassCard key={cls.id} classData={cls} index={index} tab={tab} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
