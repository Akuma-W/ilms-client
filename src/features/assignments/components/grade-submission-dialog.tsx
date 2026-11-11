'use client';

import { useState, useEffect } from 'react';
import { Award, ExternalLink, FileText, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatAssignmentDate } from '../utils/assignment.utils';
import { resolveStorageUrl } from '@/features/upload/utils/file.utils';
import type { Assignment, Submission } from '@/types/assignment';
import { submissionService } from '../services/submission.service';

interface GradeSubmissionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  submission: Submission | null;
  assignment: Assignment;
  onGradeSaved: (updatedSubmission: Submission) => void;
}

export function GradeSubmissionDialog({
  isOpen,
  onOpenChange,
  submission,
  assignment,
  onGradeSaved,
}: GradeSubmissionDialogProps) {
  const [score, setScore] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (submission) {
      setScore(
        submission.score !== null && submission.score !== undefined ? String(submission.score) : '',
      );
      setFeedback(submission.feedback || '');
    }
  }, [submission]);

  if (!submission) return null;

  const student = submission.student;
  const isAlreadyGraded = submission.score !== null && submission.score !== undefined;

  const handleSave = async () => {
    const scoreNum = parseFloat(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > assignment.maxScore) {
      toast.error(`Điểm số phải nằm trong khoảng từ 0 đến ${assignment.maxScore}`);
      return;
    }

    setIsSaving(true);
    try {
      const res = await submissionService.gradeSubmission(submission.id, {
        score: scoreNum,
        feedback: feedback.trim() || null,
      });

      if (!res.success) throw new Error(res.message);
      toast.success(`Đã lưu điểm cho sinh viên ${student?.fullName || ''}`);

      const updated: Submission = {
        ...submission,
        score: scoreNum,
        feedback: feedback.trim() || null,
      };
      onGradeSaved(updated);
      onOpenChange(false);
    } catch (error) {
      toast.error('Lưu điểm thất bại', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại sau',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Award className="size-5 text-amber-500" />
            {isAlreadyGraded ? 'Chỉnh sửa điểm bài tập' : 'Chấm điểm bài tập'}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Đánh giá bài nộp, cho điểm và gửi nhận xét phản hồi đến sinh viên.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* 1. Student Header */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 rounded-xl border border-border">
                <AvatarImage src={student?.avatarUrl || ''} />
                <AvatarFallback className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs rounded-xl">
                  {(student?.fullName || 'SV').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {student?.fullName || 'Sinh viên'}
                </p>
                <p className="text-xs text-muted-foreground">{student?.email || 'N/A'}</p>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  submission.isLate
                    ? 'bg-red-200 text-red-900 border border-red-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {submission.isLate ? 'Nộp trễ' : 'Đúng hạn'}
              </span>
              <p className="text-[11px] text-muted-foreground mt-1">
                {formatAssignmentDate(submission.submittedAt)}
              </p>
            </div>
          </div>

          {/* 2. Student Submission Work */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Nội dung bài làm</h4>

            {submission.textAnswer && (
              <div className="p-3.5 rounded-xl border border-border bg-card text-sm space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">Lời giải / Ghi chú:</p>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {submission.textAnswer}
                </p>
              </div>
            )}

            {submission.files && submission.files.length > 0 ? (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground">
                  Tệp bài nộp ({submission.files.length}):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {submission.files.map((file, idx) => (
                    <a
                      key={`${file.fileUrl}-${idx}`}
                      href={resolveStorageUrl(file.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-card hover:border-amber-500 text-sm group transition-all"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="size-4 text-amber-500 shrink-0" />
                        <span className="text-xs font-medium text-foreground truncate">
                          {file.fileName || 'Tệp đính kèm'}
                        </span>
                      </div>
                      <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-foreground shrink-0 ml-1.5" />
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              !submission.textAnswer && (
                <p className="text-xs text-muted-foreground italic">
                  Sinh viên không đính kèm tệp nào.
                </p>
              )
            )}
          </div>

          {/* 3. Grading Controls */}
          <div className="space-y-4 pt-3 border-t border-border/70">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="gradeScore" className="text-sm font-semibold text-foreground">
                  Điểm số <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="gradeScore"
                    type="number"
                    step="0.25"
                    min="0"
                    max={assignment.maxScore}
                    placeholder={`0 - ${assignment.maxScore}`}
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="h-10 text-sm font-mono font-bold"
                  />
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                    / {assignment.maxScore} đ
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="gradeFeedback" className="text-sm font-semibold text-foreground">
                  Nhận xét & Góp ý của giáo viên
                </Label>
                <Textarea
                  id="gradeFeedback"
                  rows={4}
                  placeholder="Nhập nhận xét chi tiết, chỉ ra điểm tốt và điểm cần cải thiện..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="text-sm leading-relaxed resize-y min-h-22.5 max-h-55"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="text-sm h-9"
          >
            Hủy
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !score}
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm h-9 gap-1.5 shadow-xs"
          >
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {isAlreadyGraded ? 'Cập nhật kết quả' : 'Lưu kết quả chấm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
