'use client';

import { Award, BookOpen, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatScore } from '../utils/grade.utils';
import type { StudentGradeRecord } from '@/types/grade';

interface StudentGradeStatsProps {
  record: StudentGradeRecord;
}

export function StudentGradeStats({ record }: StudentGradeStatsProps) {
  const gradedItemsCount = record.detailedItems.filter((i) => i.status === 'graded').length;
  const hasScore = record.finalScore !== null && record.finalScore !== undefined;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Final Score */}
      <Card
        className={`shadow-2xs transition-all p-0 gap-3 ${
          !hasScore
            ? 'border border-border/80 bg-card/60'
            : record.isPassed
              ? 'border border-emerald-500/30 bg-emerald-500/5'
              : 'border border-rose-500/30 bg-rose-500/5'
        }`}
      >
        <CardHeader className="p-3 pb-1 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Điểm tổng kết
            </span>
            <Award
              className={`size-4 ${
                !hasScore
                  ? 'text-muted-foreground'
                  : record.isPassed
                    ? 'text-emerald-500'
                    : 'text-rose-500'
              }`}
            />
          </div>
          <div className="pt-0 flex items-baseline gap-2">
            <span
              className={`text-xl sm:text-2xl font-bold ${
                !hasScore
                  ? 'text-muted-foreground'
                  : record.isPassed
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {formatScore(record.finalScore)}
            </span>
            <span className="text-xs text-muted-foreground">/ 10</span>
            {hasScore && record.gpa4 !== null && (
              <span className="text-xs font-mono font-medium text-primary ml-auto">
                GPA: {record.gpa4.toFixed(1)} / 4.0
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-3.5 pt-0">
          <span className="text-xs font-medium text-foreground/80">
            Xếp loại: {record.letterGrade || '—'}
          </span>
        </CardContent>
      </Card>

      {/* Card 2: Completion Rate */}
      <Card className="p-0 gap-3 border border-blue-500/30 bg-blue-500/5 shadow-2xs transition-all">
        <CardHeader className="p-3 sm:p-3.5 pb-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Tiến độ học tập
            </span>
            <BookOpen className="size-4 text-blue-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 pt-0.5">
            {record.completionRate}%
          </p>
        </CardHeader>
        <CardContent className="p-3 sm:p-3.5 pt-0">
          <span className="text-xs text-muted-foreground">Đã nộp bài tập & tham gia quiz</span>
        </CardContent>
      </Card>

      {/* Card 3: Course Status */}
      <Card
        className={`shadow-2xs transition-all p-0 gap-3 ${
          !hasScore
            ? 'border border-border/80 bg-card/60'
            : record.isPassed
              ? 'border border-emerald-500/30 bg-emerald-500/5'
              : 'border border-rose-500/30 bg-rose-500/5'
        }`}
      >
        <CardHeader className="p-3 sm:p-3.5 pb-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Kết quả học phần
            </span>
            {!hasScore ? (
              <Clock className="size-4 text-muted-foreground" />
            ) : record.isPassed ? (
              <CheckCircle2 className="size-4 text-emerald-500" />
            ) : (
              <XCircle className="size-4 text-rose-500" />
            )}
          </div>
          <p className="text-xl sm:text-2xl font-bold pt-0.5">
            {!hasScore ? (
              <span className="text-muted-foreground font-normal text-lg">Đang cập nhật</span>
            ) : record.isPassed ? (
              <span className="text-emerald-600 dark:text-emerald-400">Đạt yêu cầu</span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400">Chưa đạt</span>
            )}
          </p>
        </CardHeader>
        <CardContent className="p-3 sm:p-3.5 pt-0">
          <span className="text-xs text-muted-foreground">
            {hasScore ? 'Chuẩn đầu ra: ≥ 5.0' : 'Chưa có điểm tổng kết'}
          </span>
        </CardContent>
      </Card>

      {/* Card 4: Graded Items */}
      <Card className="p-0 gap-3 border border-amber-500/30 bg-amber-500/5 shadow-2xs transition-all">
        <CardHeader className="p-3 sm:p-3.5 pb-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Đầu điểm đã có
            </span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-foreground pt-0.5">
            {gradedItemsCount}{' '}
            <span className="text-xs font-normal text-muted-foreground">
              / {record.detailedItems.length} hoạt động
            </span>
          </p>
        </CardHeader>
        <CardContent className="p-3 sm:p-3.5 pt-0">
          <span className="text-xs text-muted-foreground">Bài tập và kiểm tra định kỳ</span>
        </CardContent>
      </Card>
    </div>
  );
}
