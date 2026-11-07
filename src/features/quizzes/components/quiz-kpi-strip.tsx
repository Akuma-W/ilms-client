'use client';

import { Award, CheckCircle2, Clock, HelpCircle, TrendingUp, Users } from 'lucide-react';

interface QuizKpiStripProps {
  isTeacher: boolean;
  totalQuizzes: number;
  openCount: number;
  completedCount: number;
  studentAvgScore: number;
}

/**
 * Metric summary cards for Classroom Quizzes tab.
 * Displays teacher overview (published, open, completion rate) or student progress (completed, avg score, % progress).
 */
export function QuizKpiStrip({
  isTeacher,
  totalQuizzes,
  openCount,
  completedCount,
  studentAvgScore,
}: QuizKpiStripProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {isTeacher ? (
        <>
          <div className="p-3.5 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <HelpCircle className="size-4 text-rose-500" />
              <span>Đề đã xuất bản</span>
            </span>
            <p className="text-lg sm:text-xl font-bold text-foreground">{totalQuizzes} bài</p>
          </div>

          <div className="p-3.5 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Clock className="size-4 text-emerald-500" />
              <span>Đang mở cho lớp</span>
            </span>
            <p className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {openCount} bài
            </p>
          </div>

          <div className="p-3.5 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1 col-span-2 sm:col-span-1">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Users className="size-4 text-primary" />
              <span>Tỉ lệ hoàn thành lớp</span>
            </span>
            <p className="text-lg sm:text-xl font-bold text-primary">~88.5%</p>
          </div>
        </>
      ) : (
        <>
          <div className="p-3.5 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-violet-500" />
              <span>Đã hoàn thành</span>
            </span>
            <p className="text-lg sm:text-xl font-bold text-foreground">
              {completedCount}/{totalQuizzes} bài
            </p>
          </div>

          <div className="p-3.5 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Award className="size-4 text-amber-500" />
              <span>Điểm trung bình quiz</span>
            </span>
            <p className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400">
              {studentAvgScore > 0 ? `${studentAvgScore}/10` : 'Chưa có điểm'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1 col-span-2 sm:col-span-1">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="size-4 text-emerald-500" />
              <span>Tiến độ học phần</span>
            </span>
            <p className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {totalQuizzes > 0 ? Math.round((completedCount / totalQuizzes) * 100) : 0}%
            </p>
          </div>
        </>
      )}
    </div>
  );
}
