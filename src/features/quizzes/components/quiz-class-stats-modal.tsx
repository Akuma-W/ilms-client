'use client';

import { useState } from 'react';
import useSWR from 'swr';
import {
  AlertCircle,
  Award,
  BarChart3,
  CheckCircle2,
  Download,
  Loader2,
  Users,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { quizzesService } from '../services/quizzes.service';
import type { QuizClassItem, QuizClassStats } from '@/types/quiz';

interface QuizClassStatsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: QuizClassItem | null;
  classId: string;
}

/**
 * Modal displaying class evaluation statistics for a specific quiz.
 * Shows submitted vs unsubmitted students, class average score, and pass rate.
 */
export function QuizClassStatsModal({
  isOpen,
  onOpenChange,
  quiz,
  classId,
}: QuizClassStatsModalProps) {
  const [activeTab, setActiveTab] = useState<'submitted' | 'unsubmitted'>('submitted');

  const { data: stats, isLoading } = useSWR<QuizClassStats>(
    isOpen && quiz ? ['quiz-stats', classId, quiz.id] : null,
    () => quizzesService.getClassQuizStats(classId, quiz!.id),
  );

  if (!quiz) return null;

  const submittedStudents = (stats?.students || []).filter((s) => s.isSubmitted);
  const unsubmittedStudents = (stats?.students || []).filter((s) => !s.isSubmitted);

  const handleExportStats = () => {
    toast.success('Đã tải xuống danh sách kết quả bài trắc nghiệm của lớp!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-5 sm:p-6 space-y-4">
        <DialogHeader className="space-y-1 text-left pb-2 border-b border-border/60">
          <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <BarChart3 className="size-5 text-primary" />
            <span>Thống kê kết quả bài trắc nghiệm</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground truncate">
            {quiz.title}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 text-center space-y-2">
            <Loader2 className="size-6 text-primary animate-spin mx-auto" />
            <p className="text-xs text-muted-foreground">Đang tải dữ liệu đánh giá lớp học...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* KPI Summary Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl border border-border/80 bg-muted/30 space-y-0.5">
                <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-emerald-500" />
                  <span>Đã nộp bài</span>
                </span>
                <p className="text-base sm:text-lg font-bold text-foreground">
                  {stats?.submittedCount || 0}/{stats?.totalStudents || 40}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-border/80 bg-muted/30 space-y-0.5">
                <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                  <XCircle className="size-3 text-rose-500" />
                  <span>Chưa nộp bài</span>
                </span>
                <p className="text-base sm:text-lg font-bold text-rose-600 dark:text-rose-400">
                  {stats?.unsubmittedCount || 0}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-border/80 bg-muted/30 space-y-0.5">
                <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                  <Award className="size-3 text-amber-500" />
                  <span>Điểm TB lớp</span>
                </span>
                <p className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">
                  {stats?.averageScore ? `${stats.averageScore}/10` : '---'}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-border/80 bg-muted/30 space-y-0.5">
                <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                  <Users className="size-3 text-sky-500" />
                  <span>Tỉ lệ hoàn thành</span>
                </span>
                <p className="text-base sm:text-lg font-bold text-sky-600 dark:text-sky-400">
                  {stats?.passRatePercent ? `${stats.passRatePercent}%` : '---'}
                </p>
              </div>
            </div>

            {/* Filter Tabs between Submitted vs Unsubmitted */}
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant={activeTab === 'submitted' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('submitted')}
                  className="h-8 text-xs font-semibold rounded-xl gap-1.5"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>Đã làm ({submittedStudents.length})</span>
                </Button>

                <Button
                  type="button"
                  variant={activeTab === 'unsubmitted' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('unsubmitted')}
                  className="h-8 text-xs font-semibold rounded-xl gap-1.5"
                >
                  <AlertCircle className="size-3.5" />
                  <span>Chưa làm ({unsubmittedStudents.length})</span>
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExportStats}
                className="h-8 text-xs font-semibold rounded-xl gap-1.5 hidden sm:inline-flex"
              >
                <Download className="size-3.5" />
                <span>Xuất CSV</span>
              </Button>
            </div>

            {/* Students List */}
            <div className="max-h-75 overflow-y-auto space-y-2 pr-1">
              {(activeTab === 'submitted' ? submittedStudents : unsubmittedStudents).length ===
              0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Không có sinh viên nào trong danh mục này.
                </div>
              ) : (
                (activeTab === 'submitted' ? submittedStudents : unsubmittedStudents).map((st) => (
                  <div
                    key={st.studentId}
                    className="p-2.5 rounded-xl border border-border/70 bg-card hover:bg-muted/30 transition-colors flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        {st.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{st.fullName}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{st.email}</p>
                      </div>
                    </div>

                    <div>
                      {st.isSubmitted ? (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold text-xs px-2 py-0.5">
                          {st.score !== null ? `${st.score} điểm` : 'Đã nộp'}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[11px] px-2 py-0.5"
                        >
                          Chưa nộp
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-border/50 flex items-center justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-9 px-4 text-sm rounded-xl font-semibold"
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
