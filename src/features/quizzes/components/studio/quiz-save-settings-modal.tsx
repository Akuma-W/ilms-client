'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Globe,
  Lock,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { QuestionType, QuizStatus, ReviewMode, Visibility } from '@/types/enum';
import type { ParsedQuestion } from '@/types/quiz';
import { getQuizQuestionValidationError } from '@/features/quizzes/utils/quiz.utils';

export interface QuizSavePayload {
  title: string;
  description: string;
  timeLimit: number;
  reviewMode: ReviewMode;
  status: QuizStatus;
  visibility: Visibility;
}

interface QuizSaveSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: {
    title: string;
    description: string;
    timeLimit: number;
    reviewMode?: ReviewMode;
  };
  questions: ParsedQuestion[];
  isSaving: boolean;
  onConfirmSave: (payload: QuizSavePayload) => void;
}

// Modal dialog configuring quiz parameters and final publication scope
export function QuizSaveSettingsModal({
  open,
  onOpenChange,
  initialValues,
  questions,
  isSaving,
  onConfirmSave,
}: QuizSaveSettingsModalProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [timeLimit, setTimeLimit] = useState(initialValues.timeLimit);
  const [reviewMode, setReviewMode] = useState<ReviewMode>(
    initialValues.reviewMode || ReviewMode.after_submission
  );

  const totalQuestions = questions.length;
  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
  const mcCount = questions.filter((q) => q.questionType === QuestionType.multiple_choice).length;
  const msCount = questions.filter((q) => q.questionType === QuestionType.multiple_select).length;
  const tfCount = questions.filter((q) => q.questionType === QuestionType.true_false).length;

  const invalidQuestions = questions
    .map((q, idx) => ({ index: idx + 1, error: getQuizQuestionValidationError(q) }))
    .filter((item) => item.error !== null);

  const isFormValid =
    title.trim().length > 0 && totalQuestions > 0 && invalidQuestions.length === 0;

  // Handles clicking one of the three save actions
  const handleSaveAction = (status: QuizStatus, visibility: Visibility) => {
    if (!isFormValid || isSaving) return;
    onConfirmSave({
      title: title.trim(),
      description: description.trim(),
      timeLimit: Math.max(0, Number(timeLimit) || 0),
      reviewMode,
      status,
      visibility,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl w-full max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            Cấu hình & Lưu trữ bộ đề thi
          </DialogTitle>
          <DialogDescription>
            Kiểm tra thông số bộ đề, cấu hình chế độ xem đáp án và bấm chọn một trong các hình thức phát hành bên dưới để hoàn tất.
          </DialogDescription>
        </DialogHeader>

        {/* Question Audit Card */}
        <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tổng quan bộ đề
            </span>
            <span className="text-xs font-semibold text-foreground">
              Tổng điểm:{' '}
              <span className="text-emerald-500 font-bold">
                {Math.round(totalPoints * 10) / 10} đ
              </span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-background border border-border/50">
              <div className="text-lg font-bold text-foreground">{totalQuestions}</div>
              <div className="text-[11px] text-muted-foreground">Tổng câu hỏi</div>
            </div>
            <div className="p-2.5 rounded-lg bg-background border border-border/50">
              <div className="text-lg font-bold text-blue-500">{mcCount}</div>
              <div className="text-[11px] text-muted-foreground">1 Đáp án (MC)</div>
            </div>
            <div className="p-2.5 rounded-lg bg-background border border-border/50">
              <div className="text-lg font-bold text-amber-500">{msCount}</div>
              <div className="text-[11px] text-muted-foreground">Nhiều đáp án (MS)</div>
            </div>
            <div className="p-2.5 rounded-lg bg-background border border-border/50">
              <div className="text-lg font-bold text-purple-500">{tfCount}</div>
              <div className="text-[11px] text-muted-foreground">Đúng / Sai (TF)</div>
            </div>
          </div>

          {/* Validation Warning */}
          {invalidQuestions.length > 0 ? (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Có {invalidQuestions.length} câu hỏi chưa hoàn thiện:</p>
                <p className="mt-0.5 text-muted-foreground">
                  Các câu: {invalidQuestions.map((q) => `#${q.index}`).join(', ')} ({invalidQuestions[0]?.error})
                </p>
                <p className="mt-1 text-rose-400 font-medium">
                  Vui lòng chỉnh sửa trước khi lưu hoặc xuất bản.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Toàn bộ {totalQuestions} câu hỏi đã có đáp án hợp lệ!</span>
            </div>
          )}
        </div>

        {/* Configuration Form */}
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="quiz-title" className="text-xs font-medium">
              Tiêu đề đề thi <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="quiz-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Kiểm tra giữa kỳ - Giải tích 1"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quiz-desc" className="text-xs font-medium">
              Mô tả / Hướng dẫn (tuỳ chọn)
            </Label>
            <Textarea
              id="quiz-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập ghi chú hoặc phạm vi kiến thức..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="quiz-time" className="text-xs font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                Thời gian làm bài (phút)
              </Label>
              <Input
                id="quiz-time"
                type="number"
                min={0}
                value={timeLimit}
                onChange={(e) => setTimeLimit(Math.max(0, parseInt(e.target.value, 10) || 0))}
              />
              <span className="text-[11px] text-muted-foreground">0 = Không giới hạn thời gian</span>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="quiz-review" className="text-xs font-medium flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                Chế độ xem đáp án mặc định
              </Label>
              <select
                id="quiz-review"
                value={reviewMode}
                onChange={(e) => setReviewMode(e.target.value as ReviewMode)}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value={ReviewMode.after_submission}>Xem sau khi nộp bài</option>
                <option value={ReviewMode.immediate}>Xem sau mỗi câu trả lời</option>
                <option value={ReviewMode.never}>Không cho xem đáp án</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3 Interactive Save Action Cards as Direct Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Chọn hình thức phát hành để lưu:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Action 1: Draft */}
            <button
              type="button"
              disabled={!isFormValid || isSaving}
              onClick={() => handleSaveAction(QuizStatus.draft, Visibility.private)}
              className="text-left p-4 rounded-xl border border-border/70 bg-background hover:bg-muted/50 hover:border-border transition-all disabled:opacity-50 disabled:pointer-events-none group relative flex flex-col justify-between"
            >
              <div>
                <div className="font-bold flex items-center gap-2 text-foreground text-sm">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  Lưu bản nháp
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed mt-2.5">
                  Bộ đề đang soạn thảo dở dang. Chỉ hiển thị trong danh sách của bạn và chưa thể phát hành vào lớp.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-border/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400 group-hover:text-foreground flex items-center justify-between">
                <span>Bấm để lưu nháp</span>
                <span>→</span>
              </div>
            </button>

            {/* Action 2: Published Private (Classrooms) */}
            <button
              type="button"
              disabled={!isFormValid || isSaving}
              onClick={() => handleSaveAction(QuizStatus.published, Visibility.private)}
              className="text-left p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/60 transition-all disabled:opacity-50 disabled:pointer-events-none group relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    Cho lớp học
                  </span>
                </div>
                <div className="font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-sm">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Hoàn tất riêng tư
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed mt-2.5">
                  Đề thi hoàn thiện 100%, bảo mật riêng tư. Sẵn sàng xuất bản vào các lớp học mà không bị lộ câu hỏi trên Thư viện.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-emerald-500/20 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 group-hover:underline flex items-center justify-between">
                <span>Hoàn tất & Dùng cho lớp</span>
                <span>→</span>
              </div>
            </button>

            {/* Action 3: Published Public (Global Library) */}
            <button
              type="button"
              disabled={!isFormValid || isSaving}
              onClick={() => handleSaveAction(QuizStatus.published, Visibility.public)}
              className="text-left p-4 rounded-xl border border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/60 transition-all disabled:opacity-50 disabled:pointer-events-none group relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                    Cộng đồng
                  </span>
                </div>
                <div className="font-bold flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-sm">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  Công khai Thư viện
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed mt-2.5">
                  Chia sẻ đề thi lên Thư viện chung của trường để giáo viên khác và học sinh toàn trường cùng khám phá và tự ôn tập.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-indigo-500/20 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline flex items-center justify-between">
                <span>Xuất bản toàn trường</span>
                <span>→</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer with Simple Cancel Action */}
        <DialogFooter className="pt-2 border-t border-border/50 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Đóng / Tiếp tục chỉnh sửa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
