'use client';

import { Award, CheckCircle2, Clock, MessageSquare, Send } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { AssignmentFileQueue } from '../assignment-file-queue';
import { formatAssignmentDate } from '../../utils/assignment.utils';
import type { Assignment, Submission } from '@/types/assignment';

interface StudentSubmissionViewProps {
  assignment: Assignment;
  submission: Submission;
}

/**
 * Read-only view for a submitted student work.
 * Contains NO submit or edit buttons per UX specification.
 */
export function StudentSubmissionView({ assignment, submission }: StudentSubmissionViewProps) {
  const isGraded = submission.score !== null && submission.score !== undefined;

  return (
    <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-xs space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
            <Send className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">Bài làm của bạn</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Đã gửi vào: {formatAssignmentDate(submission.submittedAt)}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        {isGraded ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 self-start sm:self-auto">
            <CheckCircle2 className="size-3.5" />
            Đã chấm điểm
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-600 dark:text-blue-400 self-start sm:self-auto">
            <Clock className="size-3.5" />
            Đã nộp bài
          </span>
        )}
      </div>

      {/* Graded Result Card */}
      {isGraded && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Award className="size-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Kết quả đánh giá</span>
          </div>
          <div className="text-3xl font-black text-foreground">
            {submission.score}{' '}
            <span className="text-sm font-normal text-muted-foreground">
              / {assignment.maxScore} đ
            </span>
          </div>
          {submission.feedback && (
            <div className="mt-3 p-3.5 rounded-xl bg-card border border-border/70 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <MessageSquare className="size-3.5 text-amber-500" />
                Nhận xét của giáo viên:
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {submission.feedback}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Submitted Content */}
      <div className="space-y-4">
        {submission.textAnswer && (
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">
              Lời giải / Ghi chú đã gửi:
            </Label>
            <div className="p-4 rounded-xl bg-muted/20 border border-border/60 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {submission.textAnswer}
            </div>
          </div>
        )}

        {submission.files && submission.files.length > 0 && (
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">
              Tệp bài làm đã nộp:
            </Label>
            <AssignmentFileQueue files={submission.files} readonly />
          </div>
        )}
      </div>
    </div>
  );
}
