'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MoreVertical,
  Paperclip,
  Pencil,
  Trash2,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  formatAssignmentDate,
  getDeadlineInfo,
  getStudentSubmission,
} from '../utils/assignment.utils';
import type { Assignment } from '@/types/assignment';

interface AssignmentCardProps {
  assignment: Assignment;
  classId: string;
  isTeacher: boolean;
  studentId?: string;
  topicTitle?: string;
  onDelete?: (assignment: Assignment) => void;
}

export function AssignmentCard({
  assignment,
  classId,
  isTeacher,
  studentId,
  topicTitle,
  onDelete,
}: AssignmentCardProps) {
  const router = useRouter();
  const userSubmission = getStudentSubmission(assignment, studentId);
  const deadlineInfo = getDeadlineInfo(assignment.dueAt, userSubmission);

  const hasMaterials = assignment.materials && assignment.materials.length > 0;

  return (
    <Link
      href={`/classes/${classId}/assignments/${assignment.id}`}
      className={cn(
        'group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl',
        'bg-card border border-border/80 shadow-xs hover:shadow-md transition-all cursor-pointer',
        'hover:border-amber-500/40 hover:bg-amber-500/2',
      )}
    >
      {/* 1. Left Column: Information */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="flex items-center justify-center size-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
          <FileText className="size-5" />
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          {topicTitle && (
            <div>
              <Badge
                variant="outline"
                className="text-xs bg-muted/60 text-muted-foreground font-normal border-border/70"
              >
                {topicTitle}
              </Badge>
            </div>
          )}

          <h4 className="text-base font-semibold text-foreground tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
            {assignment.title}
          </h4>

          {assignment.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {assignment.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1 font-medium">
              <Calendar className="size-3.5" />
              Điểm tối đa: <strong className="text-foreground">{assignment.maxScore}</strong>
            </span>

            {assignment.createdAt && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="size-3.5" />
                Đã giao: {formatAssignmentDate(assignment.createdAt)}
              </span>
            )}

            {hasMaterials && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Paperclip className="size-3.5" />
                {assignment.materials?.length} tệp đề bài
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Right Column: Status Badges & Actions */}
      <div className="flex flex-wrap md:flex-col items-start md:items-end justify-between md:justify-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/60">
        {/* Deadline Status & Due Date (2 Rows) */}
        <div className="flex flex-col items-start md:items-end gap-1">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border',
              deadlineInfo.badgeClass,
            )}
          >
            <Clock className="size-3.5" />
            {deadlineInfo.statusText}
          </span>
          {assignment.dueAt && (
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Calendar className="size-3 text-muted-foreground/70" />
              {deadlineInfo.dueText}
            </span>
          )}
        </div>

        {/* Status for Student vs Teacher */}
        <div className="flex items-center gap-2">
          {isTeacher ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-muted/60 px-2.5 py-1 rounded-lg">
              <Users className="size-3.5 text-amber-600 dark:text-amber-400" />
              <span>
                {assignment.submissionCount ?? assignment.submissions?.length ?? 0}/
                {assignment.totalStudents ?? 15} đã nộp
              </span>
            </div>
          ) : userSubmission ? (
            userSubmission.score !== null && userSubmission.score !== undefined ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="size-3.5" />
                Đã chấm: {userSubmission.score}/{assignment.maxScore}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <CheckCircle2 className="size-3.5" />
                Đã nộp
              </span>
            )
          ) : (
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-muted text-muted-foreground">
              Chưa nộp
            </span>
          )}

          {/* Teacher Actions Dropdown Menu */}
          {isTeacher && (
            <DropdownMenu>
              <DropdownMenuTrigger
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="size-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Thao tác bài tập"
              >
                <MoreVertical className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/classes/${classId}/assignments/${assignment.id}/edit`);
                  }}
                  className="gap-2 text-sm font-medium cursor-pointer"
                >
                  <Pencil className="size-4" />
                  Chỉnh sửa đề bài
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete?.(assignment);
                  }}
                  className="gap-2 text-sm font-medium text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash2 className="size-4" />
                  Xóa bài tập
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </Link>
  );
}
