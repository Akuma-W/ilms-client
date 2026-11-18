import { clientApiClient } from '@/lib/api/client-api-client';
import type {
  AdminOverviewStats,
  AdminGrowthMetric,
  AdminRecentActivity,
  AdminTopSchool,
} from '@/types/admin';

export const adminService = {
  // Retrieves high-level platform count metrics across entities
  async getOverview(): Promise<AdminOverviewStats | null> {
    const res = await clientApiClient<AdminOverviewStats>('/admin/dashboard/overview');
    return res?.data || null;
  },

  // Retrieves chronological 7-day growth metrics
  async getGrowth(): Promise<AdminGrowthMetric[]> {
    const res = await clientApiClient<AdminGrowthMetric[]>('/admin/dashboard/growth');
    return res?.data || [];
  },

  // Retrieves leaderboard of most active educational institutions
  async getTopSchools(): Promise<AdminTopSchool[]> {
    const res = await clientApiClient<AdminTopSchool[]>('/admin/dashboard/top-schools');
    return res?.data || [];
  },

  // Retrieves recent system audit activities
  async getRecentActivities(): Promise<AdminRecentActivity[]> {
    const res = await clientApiClient<AdminRecentActivity[]>('/admin/dashboard/activities');
    return res?.data || [];
  },
};
