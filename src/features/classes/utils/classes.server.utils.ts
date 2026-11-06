import { ClassTabs } from '@/types/enum';
import type { QueryResponse } from '@/types/api';
import type { Class } from '@/types/class';
import { enrollmentServerService } from '../services/enrollment.server.service';
import { classServerService } from '../services/class.server.service';

/**
 * Server-side class fetcher for Server Components SSR.
 */
export async function fetchClassesServer(
  tab: ClassTabs,
  params: {
    search?: string;
    page?: number;
    limit?: number;
  },
): Promise<QueryResponse<Class> | null> {
  switch (tab) {
    case 'joined':
      return enrollmentServerService.getMyEnrollments({
        status: 'approved',
        ...params,
      });
    case 'pending':
      return enrollmentServerService.getMyEnrollments({
        status: 'pending',
        ...params,
      });
    case 'created':
      return classServerService.getMyCreatedClasses(params);
    default:
      return classServerService.getClasses(params);
  }
}
