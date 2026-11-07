'use client';

import { useState } from 'react';
import { Award, CheckCircle2, Clock, FileEdit, Loader2, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResourceDropzone } from '@/components/resources/resource-dropzone';
import { AssignmentFileQueue } from '../assignment-file-queue';
import { submissionService } from '../../services/submission.service';
import { inferMaterialTypeFromFileName } from '@/features/upload/utils/file.utils';
import { formatAssignmentDate } from '../../utils/assignment.utils';
import type { Assignment, Submission, SubmissionFile } from '@/types/assignment';
import type { FileType } from '@/types/enum';
import type { User } from '@/types/user';

interface StudentSubmissionWorkCardProps {
  assignment: Assignment;
  submission?: Submission | null;
  currentUser?: User | null;
  isFormOpen: boolean;
  isEditing: boolean;
  onCancelForm: () => void;
  onCancelEdit: () => void;
  onSubmissionChange: (submission: Submission) => void;
}

interface StudentSubmissionFormProps {
  assignment: Assignment;
  submission?: Submission | null;
  currentUser?: User | null;
  mode: 'create' | 'edit';
  onCancel: () => void;
  onSubmissionChange: (submission: Submission) => void;
}

/**
 * Form for submitting new or updated student work.
 */
function StudentSubmissionForm({
  assignment,
  submission,
  currentUser,
  mode,
  onCancel,
  onSubmissionChange,
}: StudentSubmissionFormProps) {
  const [textAnswer, setTextAnswer] = useState(submission?.textAnswer || '');
  const [files, setFiles] = useState<SubmissionFile[]>(submission?.files || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFilesSelected = (newRawFiles: File[]) => {
    const formatted: SubmissionFile[] = newRawFiles.map((f, idx) => ({
      id: `sf-draft-${Date.now()}-${idx}`,
      fileUrl: URL.createObjectURL(f),
      fileType: inferMaterialTypeFromFileName(f.name) as FileType | null,
      fileName: f.name,
      fileSize: f.size,
      submissionId: submission?.id || 'draft',
    }));
    setFiles((prev) => [...prev, ...formatted]);
    toast.success(`Đã thêm ${newRawFiles.length} tệp bài làm`);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0 && !textAnswer.trim()) {
      toast.error('Vui lòng tải lên tệp bài làm hoặc nhập câu trả lời');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        const res = await submissionService.submitAssignment(
          assignment.id,
          {
            textAnswer: textAnswer.trim() || null,
            files,
          },
          currentUser,
        );
        if (!res.success) throw new Error(res.message);
        toast.success(res.message);
        onSubmissionChange(res.data);
      } else if (submission) {
        const res = await submissionService.updateSubmission(
          assignment.id,
          submission.id,
          {
            textAnswer: textAnswer.trim() || null,
            files,
          },
          currentUser,
        );
        if (!res.success) throw new Error(res.message);
        toast.success(res.message);
        onSubmissionChange(res.data);
      }
    } catch (error) {
      toast.error(mode === 'create' ? 'Nộp bài thất bại' : 'Cập nhật thất bại', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại sau',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-xs space-y-5">
      {/* Form Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/70">
        <div className="flex items-center justify-center size-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
          {mode === 'create' ? <Send className="size-5" /> : <FileEdit className="size-5" />}
        </div>
        <div>
          <h3 className="font-bold text-foreground text-lg">
            {mode === 'create' ? 'Nộp bài làm của bạn' : 'Chỉnh sửa bài làm'}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {mode === 'create'
              ? 'Tải lên tệp bài tập và/hoặc nhập nội dung trả lời bên dưới.'
              : 'Thay đổi các tệp bài làm hoặc cập nhật nội dung trả lời đã gửi.'}
          </p>
        </div>
      </div>

      {/* File Upload Zone */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground">Tệp bài làm tải lên:</Label>
        <ResourceDropzone
          onFilesSelected={handleFilesSelected}
          hintText="Kéo thả hoặc bấm để chọn tệp bài làm (hỗ trợ .zip, .pdf, .docx, mã nguồn...)"
        />
        <AssignmentFileQueue files={files} onRemove={handleRemoveFile} />
      </div>

      {/* Text Area for Answer */}
      <div className="space-y-2">
        <Label htmlFor="work-text-answer" className="text-sm font-semibold text-foreground">
          Câu trả lời văn bản / Lời giải (tùy chọn):
        </Label>
        <textarea
          id="work-text-answer"
          rows={4}
          value={textAnswer}
          onChange={(e) => setTextAnswer(e.target.value)}
          placeholder="Nhập nội dung giải bài tập hoặc ghi chú gửi đến giảng viên..."
          className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring resize-y min-h-24 max-h-80"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/70">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={onCancel}
          className="h-10 px-4 text-sm font-medium rounded-xl"
        >
          Hủy bỏ
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className={`h-10 px-6 text-sm font-semibold rounded-xl text-white shadow-xs gap-2 ${
            mode === 'create' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : mode === 'create' ? (
            <Send className="size-4" />
          ) : (
            <CheckCircle2 className="size-4" />
          )}
          <span>{mode === 'create' ? 'Nộp bài tập' : 'Cập nhật bài nộp'}</span>
        </Button>
      </div>
    </div>
  );
}

/**
 * Read-only view for a submitted student work.
 * Contains NO submit or edit buttons per UX specification.
 */
function StudentSubmissionView({
  assignment,
  submission,
}: {
  assignment: Assignment;
  submission: Submission;
}) {
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

/**
 * Main Section 3 component for Student Submission Work.
 * Follows progressive disclosure:
 * - Hidden when unsubmitted and form not open.
 * - Displays creation form when form is open.
 * - Displays read-only submitted work when submitted.
 * - Displays edit form when edit mode is toggled from Section 2.
 */
export function StudentSubmissionWorkCard({
  assignment,
  submission,
  currentUser,
  isFormOpen,
  isEditing,
  onCancelForm,
  onCancelEdit,
  onSubmissionChange,
}: StudentSubmissionWorkCardProps) {
  // Case 1: Not submitted yet
  if (!submission) {
    if (!isFormOpen) return null;
    return (
      <StudentSubmissionForm
        key="create-form"
        assignment={assignment}
        currentUser={currentUser}
        mode="create"
        onCancel={onCancelForm}
        onSubmissionChange={onSubmissionChange}
      />
    );
  }

  // Case 2: Submitted and in editing mode
  if (isEditing) {
    return (
      <StudentSubmissionForm
        key={`edit-form-${submission.id}`}
        assignment={assignment}
        submission={submission}
        currentUser={currentUser}
        mode="edit"
        onCancel={onCancelEdit}
        onSubmissionChange={onSubmissionChange}
      />
    );
  }

  // Case 3: Submitted in read-only view mode (no action buttons)
  return <StudentSubmissionView assignment={assignment} submission={submission} />;
}
