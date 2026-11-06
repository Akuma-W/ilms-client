import { ClassTabs } from '@/types/enum';
import type { QueryResponse } from '@/types/api';
import type { Class } from '@/types/class';
import { enrollmentService } from '../services/enrollment.service';
import { classService } from '../services/class.service';

/**
 * Client-side class fetcher for SWR hooks in Browser Components.
 */
export async function fetchClasses(
  tab: ClassTabs,
  params: {
    search?: string;
    page?: number;
    limit?: number;
  },
): Promise<QueryResponse<Class> | null> {
  switch (tab) {
    case 'joined':
      return enrollmentService.getMyEnrollments({
        status: 'approved',
        ...params,
      });
    case 'pending':
      return enrollmentService.getMyEnrollments({
        status: 'pending',
        ...params,
      });
    case 'created':
      return classService.getMyCreatedClasses(params);
    default:
      return classService.getClasses(params);
  }
}

export function buildClassKey(tab: ClassTabs, search?: string, page?: number, limit?: number) {
  return [tab, search || '', String(page) || '1', String(limit) || '10'];
}
