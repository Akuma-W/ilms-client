import { ClassTabs } from '@/types/enum';
import type { QueryResponse } from '@/types/api';
import type { Class } from '@/types/class';
import { enrollmentService } from '../services/enrollment.service';
import { classService } from '../services/class.service';

export async function fetchClasses(
  tab: ClassTabs,
  params: {
    search?: string;
    page?: number;
    limit?: number;
    subjectId?: string;
  },
  role?: string,
): Promise<QueryResponse<Class> | null> {
  switch (tab) {
    case 'joined':
      return enrollmentService.getMyEnrollments({
        status: 'approved',
        isArchived: false,
        ...params,
      });
    case 'pending':
      return enrollmentService.getMyEnrollments({
        status: 'pending',
        ...params,
      });
    case 'created':
      return classService.getMyCreatedClasses({
        isArchived: false,
        ...params,
      });
    case 'archived':
      if (role === 'teacher') {
        return classService.getMyCreatedClasses({
          isArchived: true,
          ...params,
        });
      }
      return enrollmentService.getMyEnrollments({
        status: 'approved',
        isArchived: true,
        ...params,
      });
    default:
      return classService.getClasses(params);
  }
}

export function buildClassKey(
  tab: ClassTabs,
  search?: string,
  page?: number,
  limit?: number,
  subjectId?: string,
  role?: string,
  userId?: string,
) {
  return [
    tab,
    search || '',
    String(page) || '1',
    String(limit) || '10',
    subjectId || '',
    role || '',
    userId || '',
  ];
}
