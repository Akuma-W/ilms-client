'use client';

import { Users, GraduationCap, BookOpen, Sparkles, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminOverviewStats } from '@/types/admin';
import { formatNumber } from '@/features/admin/utils/admin-formatters';

interface AdminKpiCardsProps {
  stats: AdminOverviewStats | null;
  isLoading?: boolean;
}

export function AdminKpiCards({ stats, isLoading }: AdminKpiCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-3"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="size-8 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-20 rounded-md" />
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <Skeleton className="h-3 w-16 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Người dùng Toàn Hệ thống',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-200/60 dark:border-blue-900/50',
      details: [
        { label: 'Sinh viên', value: stats?.totalStudents ?? 0 },
        { label: 'Giảng viên', value: stats?.totalTeachers ?? 0 },
        { label: 'Quản trị viên', value: stats?.totalAdmins ?? 0 },
        {
          label: 'Bị khóa',
          value: stats?.lockedUsers ?? 0,
          highlight: (stats?.lockedUsers ?? 0) > 0,
        },
      ],
    },
    {
      title: 'Trường học',
      value: stats?.totalSchools ?? 0,
      icon: GraduationCap,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200/60 dark:border-emerald-900/50',
      details: [
        { label: 'Đang hoạt động', value: stats?.activeSchools ?? 0 },
        { label: 'Tạm ngừng', value: stats?.inactiveSchools ?? 0 },
      ],
    },
    {
      title: 'Lớp học',
      value: stats?.totalClasses ?? 0,
      icon: BookOpen,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-200/60 dark:border-indigo-900/50',
      details: [
        { label: 'Đang mở', value: stats?.activeClasses ?? 0 },
        { label: 'Đã lưu trữ', value: stats?.archivedClasses ?? 0 },
        { label: 'Lượt ghi danh', value: stats?.totalEnrollments ?? 0 },
      ],
    },
    {
      title: 'Trắc nghiệm & Trợ lý AI',
      value: stats?.totalQuizzes ?? 0,
      icon: Sparkles,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200/60 dark:border-amber-900/50',
      details: [
        { label: 'Công khai', value: stats?.publicQuizzes ?? 0 },
        { label: 'Riêng tư', value: stats?.privateQuizzes ?? 0 },
        { label: 'Lượt nộp bài', value: stats?.totalAttempts ?? 0 },
        { label: 'Tương tác AI', value: stats?.totalAIRequests ?? 0 },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <Card
            key={idx}
            className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-2xs hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-xl ${card.bg} ${card.color} border ${card.border}`}>
                <Icon className="size-4.5" />
              </div>
            </CardHeader>
            <CardContent>
              {/* Primary Metric Number */}
              <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {formatNumber(card.value)}
              </div>

              {/* Sub Metrics List */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/70 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                {card.details.map((item, dIdx) => (
                  <span
                    key={dIdx}
                    className={
                      item.highlight
                        ? 'text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1'
                        : undefined
                    }
                  >
                    {item.highlight && <AlertCircle className="size-3 inline" />}
                    {item.label}:{' '}
                    <strong className="text-slate-700 dark:text-slate-300">
                      {formatNumber(item.value)}
                    </strong>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
