'use client';

import { AlertCircle, CheckCircle2, Clock, FileEdit, Send, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatAssignmentDate, getDeadlineInfo } from '../../utils/assignment.utils';
import type { Assignment, Submission } from '@/types/assignment';

interface StudentSubmissionStatusCardProps {
  assignment: Assignment;
  submission?: Submission | null;
  isFormOpen: boolean;
  onToggleForm: () => void;
  isEditing: boolean;
  onToggleEdit: () => void;
}

/**
 * Status and Action Banner card for student view.
 * Displays submission status, class submission count, and action triggers.
 */
export function StudentSubmissionStatusCard({
  assignment,
  submission,
  isFormOpen,
  onToggleForm,
  isEditing,
  onToggleEdit,
}: StudentSubmissionStatusCardProps) {
  const deadlineInfo = getDeadlineInfo(assignment.dueAt, submission);
  const totalSubmissions = assignment.submissionCount ?? (assignment.submissions?.length || 0);
  const isGraded = submission?.score !== null && submission?.score !== undefined;

  return (
    <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Message */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`flex items-center justify-center size-11 rounded-xl shrink-0 ${
              submission
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}
          >
            {submission ? <CheckCircle2 className="size-6" /> : <AlertCircle className="size-6" />}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-foreground text-base">
                {submission ? 'Bạn đã nộp bài tập này' : 'Bạn chưa nộp bài tập này'}
              </h3>
              {submission?.isLate && (
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                  Nộp muộn
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
              {submission ? (
                <span>Đã nộp vào: {formatAssignmentDate(submission.submittedAt)}</span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  Hạn nộp: {formatAssignmentDate(assignment.dueAt)}
                  {deadlineInfo.isOverdue && (
                    <strong className="text-destructive font-semibold"> (Đã quá hạn nộp)</strong>
                  )}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action Trigger Button */}
        <div className="shrink-0 self-end sm:self-auto">
          {!submission ? (
            <Button
              type="button"
              onClick={onToggleForm}
              className={`h-10 px-5 text-sm font-semibold rounded-xl gap-2 shadow-xs transition-all ${
                isFormOpen
                  ? 'bg-muted hover:bg-muted/80 text-foreground'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {isFormOpen ? (
                <>
                  <X className="size-4" />
                  <span>Đóng form</span>
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  <span>Nộp bài</span>
                </>
              )}
            </Button>
          ) : !isGraded ? (
            <Button
              type="button"
              variant={isEditing ? 'outline' : 'default'}
              onClick={onToggleEdit}
              className={`h-10 px-5 text-sm font-semibold rounded-xl gap-2 shadow-xs transition-all ${
                isEditing
                  ? 'border-border text-foreground'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isEditing ? (
                <>
                  <X className="size-4" />
                  <span>Hủy chỉnh sửa</span>
                </>
              ) : (
                <>
                  <FileEdit className="size-4" />
                  <span>Chỉnh sửa bài nộp</span>
                </>
              )}
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="size-4" />
              Đã có điểm
            </span>
          )}
        </div>
      </div>

      {/* Class submission count indicator */}
      <div className="flex items-center gap-2 pt-3 border-t border-border/60 text-xs sm:text-sm font-medium text-muted-foreground">
        <Users className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>
          Đã có <strong className="text-foreground font-bold">{totalSubmissions}</strong> bạn nộp
          bài tập này trong lớp.
        </span>
      </div>
    </div>
  );
}
