'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminDashboard } from '@/features/admin/hooks/use-admin-dashboard';
import { AdminKpiCards } from '@/features/admin/components/dashboard/admin-kpi-cards';
import { AdminGrowthChart } from '@/features/admin/components/dashboard/admin-growth-chart';
import { AdminTopSchoolsCard } from '@/features/admin/components/dashboard/admin-top-schools-card';
import { AdminRecentActivitiesCard } from '@/features/admin/components/dashboard/admin-recent-activities-card';

export function AdminDashboardClient() {
  const {
    overview,
    isOverviewLoading,
    growth,
    isGrowthLoading,
    topSchools,
    isTopSchoolsLoading,
    recentActivities,
    isActivitiesLoading,
    mutate,
  } = useAdminDashboard();

  const handleRefresh = () => {
    mutate();
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Trung tâm Điều hành Hệ thống
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tổng quan dữ liệu thời gian thực về trường học, lớp học và người dùng KEIVerse
          </p>
        </div>

        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="rounded-xl border-slate-200 dark:border-slate-800 text-xs font-medium self-start sm:self-auto"
        >
          <RefreshCw className="size-3.5 mr-1.5" />
          Làm mới số liệu
        </Button>
      </div>

      {/* 4 Primary Top KPI Metric Cards */}
      <AdminKpiCards stats={overview} isLoading={isOverviewLoading} />

      {/* 7-Day Growth Trends Chart (Shadcn Chart Recharts) */}
      <AdminGrowthChart metrics={growth} isLoading={isGrowthLoading} />

      {/* Secondary Analytics Strip: Top Schools and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminTopSchoolsCard schools={topSchools} isLoading={isTopSchoolsLoading} />
        <AdminRecentActivitiesCard activities={recentActivities} isLoading={isActivitiesLoading} />
      </div>
    </div>
  );
}
