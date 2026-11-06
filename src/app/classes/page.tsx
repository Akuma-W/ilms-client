import { ClassTabs } from '@/types/enum';
import { Metadata } from 'next';
import ClassesClient from './classes-client';
import { fetchClassesServer } from '@/features/classes/utils/classes.server.utils';
import { userServerService } from '@/features/user/services/user.server.service';
import { redirect } from 'next/navigation';

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

  if (!params.tab) {
    const newParams = new URLSearchParams(params as Record<string, string>);
    newParams.set('tab', 'discovery');

    redirect(`/classes?${newParams.toString()}`);
  }

  const tab = params.tab;
  const search = params.search || '';
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;

  const initialData = await fetchClassesServer(tab, { search, page, limit });

  const user = await userServerService.getMe();

  return (
    <ClassesClient
      user={user}
      initialData={initialData}
      initialParams={{ tab, page, limit, search }}
    />
  );
}
