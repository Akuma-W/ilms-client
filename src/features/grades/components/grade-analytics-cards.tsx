'use client';

import { Award, CheckCircle2, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface GradeAnalyticsCardsProps {
  totalStudents: number;
  averageScore: string;
  passingStudents: number;
  passingRate: number;
}

/**
 * Compact, low-profile analytics tiles displaying student count, class average, and pass rate.
 * Uses emerald, indigo, and galaxy primary palette accents.
 */
export function GradeAnalyticsCards({
  totalStudents,
  averageScore,
  passingStudents,
  passingRate,
}: GradeAnalyticsCardsProps) {
  const hasAverage = averageScore !== '—' && averageScore !== '-' && averageScore !== '0.00';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* 1. Sĩ số */}
      <Card className="border border-blue-500/25 bg-blue-500/5 shadow-2xs hover:border-blue-500/40 transition-all">
        <CardContent className="p-3 sm:p-3.5 flex items-center gap-3">
          <div className="size-9 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
            <Users className="size-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Sĩ số lớp học
            </p>
            <p className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {totalStudents}{' '}
              <span className="text-xs font-normal text-muted-foreground">sinh viên</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Điểm trung bình */}
      <Card className="border border-primary/25 bg-primary/5 shadow-2xs hover:border-primary/40 transition-all">
        <CardContent className="p-3 sm:p-3.5 flex items-center gap-3">
          <div className="size-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 border border-primary/20">
            <Award className="size-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Điểm trung bình lớp
            </p>
            <p className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {averageScore}{' '}
              {hasAverage && <span className="text-xs font-normal text-muted-foreground">/ 10</span>}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Tỷ lệ đạt */}
      <Card className="border border-emerald-500/25 bg-emerald-500/5 shadow-2xs hover:border-emerald-500/40 transition-all">
        <CardContent className="p-3 sm:p-3.5 flex items-center gap-3">
          <div className="size-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <CheckCircle2 className="size-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Tỷ lệ qua môn (&ge; 5.0)
            </p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 leading-tight">
              {passingRate}%{' '}
              <span className="text-xs font-normal text-muted-foreground">
                ({passingStudents}/{totalStudents})
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
