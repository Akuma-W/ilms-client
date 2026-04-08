import { ClassTabs } from '@/types';
import { Metadata } from 'next';
import ClassesClient from './classes-client';
import { fetchClasses } from '@/features/classes/utils/classes.utils';
import { userService } from '@/features/user/services/user.service';
import { redirect } from 'next/navigation';
import { SWRConfig } from 'swr';

export const metadata: Metadata = {
  title: 'Tổng quan lớp',
};

interface ClassesProps {
  searchParams: Promise<{
    tab?: ClassTabs;
    search?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function Classes({ searchParams }: ClassesProps) {
  const params = await searchParams;
  const tab = params.tab || 'discovery';
  const search = params.search || '';
  const page = params.page || '1';
  const limit = params.limit || '10';

  const initialData = await fetchClasses(tab, { search, page, limit });
  console.log('SSR fetch classes with key:', JSON.stringify([tab, search, page, limit]));

  const user = await userService.getMe();
  if (!user) {
    redirect('/login');
  }

  return (
    <SWRConfig
      value={{
        fallback: {
          [JSON.stringify([tab, search, page, limit])]: initialData,
        },
      }}
    >
      <ClassesClient
        user={user}
        initialData={initialData}
        initialParams={{ tab, page, limit, search }}
      />
    </SWRConfig>
  );
}
