'use client';

import { Award, CheckCircle2, ExternalLink, FileText, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatAssignmentDate } from '../utils/assignment.utils';
import type { Assignment, Submission } from '@/types/assignment';

interface SubmissionRowProps {
  submission: Submission;
  assignment: Assignment;
  onOpenGradeDialog: (sub: Submission) => void;
}

export function SubmissionRow({
  submission: sub,
  assignment,
  onOpenGradeDialog,
}: SubmissionRowProps) {
  const student = sub.student;
  const isGraded = sub.score !== null && sub.score !== undefined;

  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-3 transition-colors hover:border-border/80 shadow-xs">
      {/* Top Row: Student info & Submission timestamp */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-10 rounded-xl border border-border">
            <AvatarImage src={student?.avatarUrl || ''} />
            <AvatarFallback className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs rounded-xl">
              {(student?.fullName || 'SV').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground line-clamp-1">
              {student?.fullName || 'Sinh viên'}
            </p>
            <p className="text-xs text-muted-foreground">{student?.email || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {sub.isLate ? (
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-red-200 text-red-900 border border-red-300">
              Nộp trễ
            </span>
          ) : (
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Đúng hạn
            </span>
          )}
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {formatAssignmentDate(sub.submittedAt)}
          </span>
        </div>
      </div>

      {/* Middle Row: Submitted Files & Text Notes */}
      {(sub.textAnswer || (sub.files && sub.files.length > 0)) && (
        <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-2 text-sm">
          {sub.textAnswer && (
            <p className="text-foreground whitespace-pre-wrap leading-relaxed line-clamp-2">
              {sub.textAnswer}
            </p>
          )}
          {sub.files && sub.files.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {sub.files.map((file, idx) => (
                <a
                  key={`${file.fileUrl}-${idx}`}
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border hover:border-amber-500 text-xs font-medium text-foreground transition-colors"
                >
                  <FileText className="size-3.5 text-amber-500" />
                  <span className="max-w-45 truncate">{file.fileName || 'Tệp đính kèm'}</span>
                  <ExternalLink className="size-3 text-muted-foreground ml-0.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom Row: Score Badge & Open Grade Dialog Action Button */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/50">
        <div className="flex items-center gap-2">
          {isGraded ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
                <CheckCircle2 className="size-4" />
                {sub.score} / {assignment.maxScore} đ
              </span>
              {sub.feedback && (
                <span className="text-xs text-muted-foreground hidden md:inline truncate max-w-sm">
                  &quot;{sub.feedback}&quot;
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground italic font-medium">
              Chưa có điểm đánh giá
            </span>
          )}
        </div>

        <Button
          type="button"
          size="sm"
          onClick={() => onOpenGradeDialog(sub)}
          className={`h-9 text-sm font-medium gap-1.5 rounded-xl shadow-xs ${
            isGraded
              ? 'bg-muted hover:bg-muted/80 text-foreground border border-border'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          {isGraded ? (
            <>
              <Pencil className="size-3.5 text-amber-600" />
              <span>Sửa điểm & nhận xét</span>
            </>
          ) : (
            <>
              <Award className="size-4" />
              <span>Chấm bài tập</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
