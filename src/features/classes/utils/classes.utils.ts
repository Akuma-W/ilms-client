import { ClassTabs } from '@/types';
import { QueryResponse } from '@/types/api';
import { Class } from '@/types/class';
import { enrollmentService } from '../services/enrollment.service';
import { classService } from '../services/class.service';

export async function fetchClasses(
  tab: ClassTabs,
  params: {
    search?: string;
    page?: string;
    limit?: string;
  },
): Promise<QueryResponse<Class[]>> {
  switch (tab) {
    case 'joined':
      return await enrollmentService.getMyEnrollments({
        status: 'approved',
      });
    case 'pending':
      return await enrollmentService.getMyEnrollments({
        status: 'pending',
      });
    case 'created':
      return await classService.getMyCreatedClasses(params);
    default:
      return await classService.getClasses(params);
  }
}
