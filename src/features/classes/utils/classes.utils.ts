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

export function getDeadlineUrgencyColor(dueAt: string, isMounted = true): string {
  if (!isMounted) return 'border-white/10 bg-white/5 text-slate-400';
  const now = new Date();
  const due = new Date(dueAt);
  const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (diffHours < 3) return 'border-red-500/50 bg-red-500/10 text-red-400';
  if (diffHours < 24) return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400';
  return 'border-white/10 bg-white/5 text-slate-400';
}

export function getDeadlineUrgencyIndicator(dueAt: string, isMounted = true): string {
  if (!isMounted) return 'bg-slate-500';
  const now = new Date();
  const due = new Date(dueAt);
  const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (diffHours < 3) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
  if (diffHours < 24) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
  return 'bg-slate-500';
}
