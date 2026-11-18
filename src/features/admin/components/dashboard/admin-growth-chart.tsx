'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { AdminGrowthMetric } from '@/types/admin';

interface AdminGrowthChartProps {
  metrics: AdminGrowthMetric[];
  isLoading?: boolean;
}

const chartConfig = {
  newUsers: {
    label: 'Người dùng mới',
    color: '#3b82f6',
  },
  newClasses: {
    label: 'Lớp học mới',
    color: '#6366f1',
  },
  quizAttempts: {
    label: 'Lượt nộp bài thi',
    color: '#10b981',
  },
} satisfies ChartConfig;

export function AdminGrowthChart({ metrics, isLoading }: AdminGrowthChartProps) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-2xs p-6 space-y-4">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-56 rounded-md" />
          <Skeleton className="h-3 w-80 rounded-md" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </Card>
    );
  }

  const chartData = metrics.map((m) => ({
    date: m.date.slice(5),
    fullDate: m.date,
    newUsers: m.newUsers,
    newClasses: m.newClasses,
    quizAttempts: m.quizAttempts,
  }));

  return (
    <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="size-4.5 text-blue-500" />
            Tăng trưởng Hệ thống 7 ngày qua
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Số lượng người dùng mới, lớp học mới và lượt nộp bài thi theo từng ngày
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-xs text-slate-500">
            Chưa có đủ dữ liệu ghi nhận trong 7 ngày qua
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs text-slate-500"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                className="text-xs text-slate-500"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="newUsers" fill="var(--color-newUsers)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="newClasses" fill="var(--color-newClasses)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="quizAttempts" fill="var(--color-quizAttempts)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
