'use client';

import type { QuizClassStats } from '@/types/quiz';

interface ClassQuizStatsKpiProps {
  stats?: QuizClassStats;
  totalPoints: number;
}

export function ClassQuizStatsKpi({ stats, totalPoints }: ClassQuizStatsKpiProps) {
  const safeTotal = totalPoints > 0 ? totalPoints : 10;
  const completionRate =
    stats && stats.totalStudents > 0
      ? Math.round((stats.submittedCount / stats.totalStudents) * 100)
      : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1: Sĩ số */}
      <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-2xs">
        <p className="text-[11px] font-semibold text-muted-foreground">Sĩ số lớp</p>
        <p className="text-xl font-bold text-foreground mt-1">{stats?.totalStudents ?? 0}</p>
      </div>

      {/* 2: Đã nộp bài */}
      <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 shadow-2xs">
        <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Đã nộp bài</p>
        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
          {stats?.submittedCount ?? 0}{' '}
          <span className="text-xs font-normal text-muted-foreground">({completionRate}%)</span>
        </p>
      </div>

      {/* 3: Chưa nộp */}
      <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-2xs">
        <p className="text-[11px] font-semibold text-muted-foreground">Chưa nộp bài</p>
        <p className="text-xl font-bold text-foreground mt-1">{stats?.notSubmittedCount ?? 0}</p>
      </div>

      {/* 4: Điểm trung bình */}
      <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 shadow-2xs">
        <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">Điểm trung bình</p>
        <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
          {stats?.averageScore !== undefined && stats?.averageScore !== null
            ? `${stats.averageScore}/${safeTotal}`
            : '—'}
        </p>
      </div>

      {/* 5: Điểm cao nhất */}
      <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-2xs">
        <p className="text-[11px] font-semibold text-muted-foreground">Điểm cao nhất</p>
        <p className="text-xl font-bold text-emerald-600 mt-1">
          {stats?.highestScore !== undefined && stats?.highestScore !== null
            ? `${stats.highestScore}/${safeTotal}`
            : '—'}
        </p>
      </div>

      {/* 6: Điểm thấp nhất */}
      <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-2xs">
        <p className="text-[11px] font-semibold text-muted-foreground">Điểm thấp nhất</p>
        <p className="text-xl font-bold text-amber-600 mt-1">
          {stats?.lowestScore !== undefined && stats?.lowestScore !== null
            ? `${stats.lowestScore}/${safeTotal}`
            : '—'}
        </p>
      </div>
    </div>
  );
}
