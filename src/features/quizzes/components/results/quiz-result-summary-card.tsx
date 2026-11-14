'use client';

import { Award, CheckCircle2, Clock, EyeOff } from 'lucide-react';
import type { QuizAttemptResult } from '@/types/quiz';
import { formatTimeRemaining } from '../../utils/quiz-taking.utils';
import { formatQuizDateTime } from '../../utils/quiz.utils';

interface QuizResultSummaryCardProps {
  result: QuizAttemptResult;
  quizTitle?: string;
  totalPoints?: number;
}

export function QuizResultSummaryCard({
  result,
  quizTitle,
  totalPoints,
}: QuizResultSummaryCardProps) {
  const calculatedMaxPoints =
    result.totalPoints ??
    (result.details && result.details.length > 0
      ? result.details.reduce((sum, d) => sum + (d.maxPoints || 0), 0)
      : totalPoints || result.totalQuestions || 10);

  const score = result.score ?? 0;
  const scorePercentage =
    calculatedMaxPoints > 0 ? Math.round((score / calculatedMaxPoints) * 100) : 0;

  let durationSeconds = 0;
  if (result.startedAt && result.submittedAt) {
    const diff = new Date(result.submittedAt).getTime() - new Date(result.startedAt).getTime();
    durationSeconds = Math.max(0, Math.floor(diff / 1000));
  }

  const isMasked = result.canViewAnswers === false;

  return (
    <div className="w-full rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 sm:p-8 shadow-sm space-y-6">
      {/* Title & Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Kết quả làm bài
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            {result.title || quizTitle || 'Bài kiểm tra trắc nghiệm'}
          </h1>
        </div>
        {result.submittedAt && (
          <span className="text-xs text-muted-foreground">
            Nộp lúc: {formatQuizDateTime(result.submittedAt)}
          </span>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Score Card */}
        <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Điểm số đạt được</div>
            {isMasked ? (
              <>
                <div className="text-xl font-extrabold text-foreground">Bảo mật</div>
                <div className="text-xs font-semibold text-indigo-500">
                  Công bố sau khi đóng đợt thi
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl font-extrabold text-foreground">
                  {Math.round(score * 100) / 100}{' '}
                  <span className="text-sm font-normal text-muted-foreground">
                    / {Math.round(calculatedMaxPoints * 100) / 100} đ
                  </span>
                </div>
                <div className="text-xs font-semibold text-indigo-500">
                  Đạt {scorePercentage}% tổng điểm
                </div>
              </>
            )}
          </div>
        </div>

        {/* Correct Questions */}
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Số câu trả lời đúng</div>
            {isMasked ? (
              <>
                <div className="text-xl font-extrabold text-foreground">
                  {result.totalQuestions} câu
                </div>
                <div className="text-xs font-semibold text-emerald-500">Đã ghi nhận bài nộp</div>
              </>
            ) : (
              <>
                <div className="text-2xl font-extrabold text-foreground">
                  {result.correctCount}{' '}
                  <span className="text-sm font-normal text-muted-foreground">
                    / {result.totalQuestions} câu
                  </span>
                </div>
                <div className="text-xs font-semibold text-emerald-500">
                  {result.totalQuestions > 0
                    ? `${Math.round((result.correctCount / result.totalQuestions) * 100)}% chính xác`
                    : '--'}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Time Spent */}
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Thời gian hoàn thành</div>
            <div className="text-2xl font-extrabold text-foreground">
              {durationSeconds > 0 ? formatTimeRemaining(durationSeconds) : '< 1 phút'}
            </div>
            <div className="text-xs text-muted-foreground">Thời gian nộp bài</div>
          </div>
        </div>
      </div>

      {/* Answer Masking Notification if Applicable */}
      {isMasked && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <EyeOff className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Chế độ bảo mật đáp án đang được kích hoạt</p>
            <p className="text-muted-foreground">
              {result.message ||
                'Bạn không thể xem lại chi tiết đáp án câu hỏi cho đợt thi này theo quy định của giảng viên.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
