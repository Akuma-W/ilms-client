import { classService } from '@/features/classes/services/class.service';
import { enrollmentService } from '@/features/classes/services/enrollment.service';
import { ClassTabs } from '@/types';
import { QueryResponse } from '@/types/api';
import { Class } from '@/types/class';
import { Metadata } from 'next';
import ClassesClient from './classes-client';

export const metadata: Metadata = {
  title: 'Tổng quan lớp',
};

interface ClassesProps {
  searchParams: Promise<{
    tab?: ClassTabs;
    page?: string;
    limit?: string;
    search?: string;
  }>;
}

export default async function Classes({ searchParams }: ClassesProps) {
  const params = await searchParams;
  const tab = params.tab || 'discovery';
  const search = params.search || '';
  const page = params.page || '1';
  const limit = params.limit || '10';

  let initialData: QueryResponse<Class[]>;

  switch (tab) {
    case 'joined':
      initialData = await enrollmentService.getMyEnrollments({
        status: 'approved',
      });
      break;
    case 'pending':
      initialData = await enrollmentService.getMyEnrollments({
        status: 'pending',
      });
      break;
    case 'created':
      initialData = await classService.getMyCreatedClasses({
        page: page,
        limit: limit,
        search,
      });
      break;
    default:
      initialData = await classService.getClasses({
        page: page,
        limit: limit,
        search,
      });
      break;
  }

  return <ClassesClient classesData={initialData.data} initialParams={{ tab, page, limit, search }} />;
}
