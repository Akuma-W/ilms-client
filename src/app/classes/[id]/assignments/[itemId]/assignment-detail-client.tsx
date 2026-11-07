'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Edit3, FileText, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmDeleteModal } from '@/components/common/confirm-delete-modal';
import { AssignmentFileQueue } from '@/features/assignments/components/assignment-file-queue';
import { StudentSubmissionStatusCard } from '@/features/assignments/components/student-submission/student-submission-status-card';
import { StudentSubmissionWorkCard } from '@/features/assignments/components/student-submission/student-submission-work-card';
import { TeacherSubmissionsTable } from '@/features/assignments/components/teacher-submissions-table';
import { assignmentsService } from '@/features/assignments/services/assignments.service';
import {
  formatAssignmentDate,
  getDeadlineInfo,
  getStudentSubmission,
} from '@/features/assignments/utils/assignment.utils';
import type { Assignment, Submission } from '@/types/assignment';
import type { User } from '@/types/user';

interface AssignmentDetailClientProps {
  assignment?: Assignment | null;
  assignmentId?: string;
  classId: string;
  isTeacher: boolean;
  currentUser?: User | null;
}

export function AssignmentDetailClient({
  assignment: initialAssignment,
  assignmentId,
  classId,
  isTeacher,
  currentUser,
}: AssignmentDetailClientProps) {
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(initialAssignment || null);
  const [isLoading, setIsLoading] = useState(!initialAssignment && !!assignmentId);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!assignment && assignmentId) {
      assignmentsService.getAssignmentById(assignmentId).then((data) => {
        setAssignment(data);
        setIsLoading(false);
      });
    }
  }, [assignment, assignmentId]);

  const studentSubmission = getStudentSubmission(assignment, currentUser?.id);
  const deadline = getDeadlineInfo(assignment?.dueAt, studentSubmission);

  const handleConfirmDelete = async () => {
    if (!assignment) return;
    setIsDeleting(true);
    try {
      const res = await assignmentsService.deleteAssignment(assignment.id);
      if (!res.success) throw new Error(res.message);
      toast.success('Đã xóa bài tập thành công');
      router.push(`/classes/${classId}/assignments`);
    } catch (error) {
      toast.error('Xóa bài tập thất bại', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại sau',
      });
      setIsDeleting(false);
    }
  };

  const handleStudentSubmissionChange = (newSubmission: Submission | null) => {
    setIsFormOpen(false);
    setIsEditing(false);
    if (!assignment) return;
    const studentId = currentUser?.id || 'current-student-id';
    const existing = (assignment.submissions || []).filter((s) => s.studentId !== studentId);
    const updatedSubmissions = newSubmission ? [newSubmission, ...existing] : existing;

    setAssignment((prev) =>
      prev
        ? {
            ...prev,
            submissions: updatedSubmissions,
            submissionCount: updatedSubmissions.length,
          }
        : null,
    );
  };

  const handleTeacherGraded = (updatedSubmissions: Submission[]) => {
    if (!assignment) return;
    setAssignment((prev) =>
      prev
        ? {
            ...prev,
            submissions: updatedSubmissions,
          }
        : null,
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-75">
        <Loader2 className="size-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center py-16 bg-card border border-border rounded-2xl space-y-3">
        <h3 className="text-base font-semibold text-foreground">Không tìm thấy bài tập</h3>
        <p className="text-sm text-muted-foreground">Bài tập không tồn tại hoặc đã bị xóa.</p>
        <Button
          onClick={() => router.push(`/classes/${classId}/assignments`)}
          className="bg-amber-600 hover:bg-amber-700 text-white text-sm"
        >
          Quay lại danh sách bài tập
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* 1. Header with Title & Role Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border">
        <div className="flex items-start gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/classes/${classId}/assignments`)}
            className="size-10 rounded-xl hover:bg-muted mt-0.5"
            title="Quay lại danh sách bài tập"
          >
            <ArrowLeft className="size-5" />
          </Button>

          <div className="space-y-1.5">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              {assignment.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="size-3.5 text-amber-500" />
                Đã giao: {formatAssignmentDate(assignment.createdAt)}
              </span>
              <span>•</span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${deadline.badgeClass}`}
              >
                <Clock className="size-3.5" />
                {deadline.label}
              </span>
              <span>•</span>
              <span className="font-semibold text-foreground">
                Thang điểm: {assignment.maxScore} đ
              </span>
            </div>
          </div>
        </div>

        {/* Teacher Actions */}
        {isTeacher && (
          <div className="flex items-center gap-2 self-end md:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push(`/classes/${classId}/assignments/${assignment.id}/edit`)}
              className="gap-1.5 text-sm h-9 rounded-xl font-medium"
            >
              <Edit3 className="size-4 text-amber-600" />
              Chỉnh sửa đề bài
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(true)}
              className="gap-1.5 text-sm h-9 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 font-medium"
            >
              <Trash2 className="size-4" />
              Xóa bài tập
            </Button>
          </div>
        )}
      </div>

      {/* 2. Teacher View: Description card + Submissions management table */}
      {isTeacher ? (
        <div className="space-y-6">
          {/* Assignment Description Card */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-border/70">
              <div className="flex items-center justify-center size-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <FileText className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Bài tập</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Nội dung đề bài, yêu cầu và tài liệu đính kèm giao cho sinh viên.
                </p>
              </div>
            </div>

            {assignment.description ? (
              <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {assignment.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Không có hướng dẫn bổ sung.</p>
            )}

            {assignment.materials && assignment.materials.length > 0 && (
              <div className="pt-4 border-t border-border/60">
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Tài liệu đính kèm:
                </p>
                <AssignmentFileQueue files={assignment.materials} readonly />
              </div>
            )}
          </div>

          {/* Teacher Submissions Grading Table */}
          <div className="space-y-3">
            <TeacherSubmissionsTable assignment={assignment} onGraded={handleTeacherGraded} />
          </div>
        </div>
      ) : (
        /* 3. Student View */
        <div className="space-y-6">
          {/* Assignment Description & Materials */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-5 shadow-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-border/70">
              <div className="flex items-center justify-center size-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <FileText className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Bài tập</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Nội dung đề bài, yêu cầu làm bài và tài liệu đính kèm từ giảng viên.
                </p>
              </div>
            </div>

            {assignment.description ? (
              <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {assignment.description}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Không có hướng dẫn văn bản cho bài tập này.
              </p>
            )}

            {assignment.materials && assignment.materials.length > 0 && (
              <div className="pt-4 border-t border-border/60 space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Tài liệu & Đề bài tải về:</h3>
                <AssignmentFileQueue files={assignment.materials} readonly />
              </div>
            )}
          </div>

          {/* Status & Action Control Card */}
          <StudentSubmissionStatusCard
            assignment={assignment}
            submission={studentSubmission}
            isFormOpen={isFormOpen}
            onToggleForm={() => setIsFormOpen((prev) => !prev)}
            isEditing={isEditing}
            onToggleEdit={() => setIsEditing((prev) => !prev)}
          />

          {/* Student Assignment Work Card */}
          <StudentSubmissionWorkCard
            assignment={assignment}
            submission={studentSubmission}
            currentUser={currentUser}
            isFormOpen={isFormOpen}
            isEditing={isEditing}
            onCancelForm={() => setIsFormOpen(false)}
            onCancelEdit={() => setIsEditing(false)}
            onSubmissionChange={handleStudentSubmissionChange}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Xác nhận xóa bài tập"
        description="Toàn bộ bài nộp và kết quả chấm điểm của sinh viên sẽ bị xóa vĩnh viễn."
        itemTypeLabel="bài tập"
        itemName={assignment.title}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
