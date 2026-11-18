'use client';

import Link from 'next/link';
import { Award, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminTopSchool } from '@/types/admin';

interface AdminTopSchoolsCardProps {
  schools: AdminTopSchool[];
  isLoading?: boolean;
}

export function AdminTopSchoolsCard({ schools, isLoading }: AdminTopSchoolsCardProps) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-2xs p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-44 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const maxScore = Math.max(...schools.map((s) => s.activityScore || 1), 1);

  return (
    <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="size-4.5 text-amber-500" />
            Top Trường Học Năng Động Nhất
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Xếp hạng theo số lượng lớp và quy mô sinh viên trực thuộc
          </CardDescription>
        </div>

        <Link
          href="/admin/schools"
          className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
        >
          Xem tất cả <ArrowRight className="size-3" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        {schools.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Chưa có dữ liệu thống kê trường học
          </div>
        ) : (
          schools.slice(0, 5).map((school, index) => {
            const score =
              school.activityScore || school.totalClasses * 10 + school.totalStudents * 2;
            const progress = Math.round((score / maxScore) * 100);

            return (
              <div key={school.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="size-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[11px] text-slate-600 dark:text-slate-300">
                      #{index + 1}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {school.name}
                    </span>
                    {school.shortname && (
                      <Badge
                        variant="outline"
                        className="text-[10px] py-0 px-1.5 border-slate-300 dark:border-slate-700"
                      >
                        {school.shortname}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <span>
                      <strong className="text-slate-700 dark:text-slate-300">
                        {school.totalClasses ?? 0}
                      </strong>{' '}
                      lớp
                    </span>
                    <span>
                      <strong className="text-slate-700 dark:text-slate-300">
                        {school.totalStudents ?? 0}
                      </strong>{' '}
                      SV
                    </span>
                  </div>
                </div>

                {/* Progress Visual Bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${Math.max(progress, 8)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
