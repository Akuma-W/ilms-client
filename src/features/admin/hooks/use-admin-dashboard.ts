import useSWR from 'swr';
import { adminService } from '../services/admin.service';

export function useAdminOverview() {
  const { data, error, isLoading, mutate } = useSWR(
    ['admin/dashboard/overview'],
    () => adminService.getOverview(),
    { revalidateOnFocus: false, dedupingInterval: 30000 },
  );

  return {
    overview: data ?? null,
    isLoading,
    error,
    mutate,
  };
}

export function useAdminGrowth() {
  const { data, error, isLoading, mutate } = useSWR(
    ['admin/dashboard/growth'],
    () => adminService.getGrowth(),
    { revalidateOnFocus: false, dedupingInterval: 60000 },
  );

  return {
    growth: data || [],
    isLoading,
    error,
    mutate,
  };
}

export function useAdminTopSchools() {
  const { data, error, isLoading, mutate } = useSWR(
    ['admin/dashboard/top-schools'],
    () => adminService.getTopSchools(),
    { revalidateOnFocus: false, dedupingInterval: 60000 },
  );

  return {
    topSchools: data || [],
    isLoading,
    error,
    mutate,
  };
}

export function useAdminRecentActivities() {
  const { data, error, isLoading, mutate } = useSWR(
    ['admin/dashboard/activities'],
    () => adminService.getRecentActivities(),
    { revalidateOnFocus: false, dedupingInterval: 15000 },
  );

  return {
    recentActivities: data || [],
    isLoading,
    error,
    mutate,
  };
}

// Unified coordinator hook aggregating all 4 dashboard data streams
export function useAdminDashboard() {
  const overviewState = useAdminOverview();
  const growthState = useAdminGrowth();
  const topSchoolsState = useAdminTopSchools();
  const activitiesState = useAdminRecentActivities();

  const handleMutateAll = async () => {
    await Promise.all([
      overviewState.mutate(),
      growthState.mutate(),
      topSchoolsState.mutate(),
      activitiesState.mutate(),
    ]);
  };

  return {
    overview: overviewState.overview,
    isOverviewLoading: overviewState.isLoading,
    growth: growthState.growth,
    isGrowthLoading: growthState.isLoading,
    topSchools: topSchoolsState.topSchools,
    isTopSchoolsLoading: topSchoolsState.isLoading,
    recentActivities: activitiesState.recentActivities,
    isActivitiesLoading: activitiesState.isLoading,
    isLoading: overviewState.isLoading && growthState.isLoading && topSchoolsState.isLoading,
    mutate: handleMutateAll,
  };
}
