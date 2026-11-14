'use client';

import { BookOpen, Calendar, Eye, HelpCircle, Lock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReviewMode } from '@/types/enum';
import type { Quiz } from '@/types/quiz';
import type { Topic } from '@/types/topic';
import type { Class } from '@/types/class';

interface PublishQuizFormFieldsProps {
  preselectedQuiz?: Quiz;
  selectedQuizId: string;
  onSelectQuizId: (id: string) => void;
  availableQuizzes: Quiz[];
  isLoadingQuizzes: boolean;

  preselectedClassId?: string;
  preselectedClassName?: string;
  selectedClassId: string;
  onSelectClassId: (id: string) => void;
  teacherClasses: Class[];
  isLoadingClasses: boolean;

  selectedTopicId: string;
  onSelectTopicId: (id: string) => void;
  classTopics: Topic[];
  isLoadingTopics: boolean;

  openAt: string;
  onOpenAtChange: (val: string) => void;
  closeAt: string;
  onCloseAtChange: (val: string) => void;

  reviewMode: ReviewMode;
  onReviewModeChange: (val: ReviewMode) => void;

  isPublic: boolean;
  onIsPublicChange: (val: boolean) => void;

  errors: { quiz?: boolean; class?: boolean; topic?: boolean };
}

export function PublishQuizFormFields({
  preselectedQuiz,
  selectedQuizId,
  onSelectQuizId,
  availableQuizzes,
  isLoadingQuizzes,
  preselectedClassId,
  preselectedClassName,
  selectedClassId,
  onSelectClassId,
  teacherClasses,
  isLoadingClasses,
  selectedTopicId,
  onSelectTopicId,
  classTopics,
  isLoadingTopics,
  openAt,
  onOpenAtChange,
  closeAt,
  onCloseAtChange,
  reviewMode,
  onReviewModeChange,
  isPublic,
  onIsPublicChange,
  errors,
}: PublishQuizFormFieldsProps) {
  return (
    <div className="space-y-4 py-2">
      {/* Field 1: Quiz */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Đề thi trắc nghiệm <span className="text-rose-500">*</span>
        </Label>
        {preselectedQuiz ? (
          <div className="p-2.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <HelpCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                {preselectedQuiz.title}
              </span>
            </div>
            <span className="text-[11px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-sm font-semibold flex items-center gap-1 shrink-0">
              <Lock className="w-3 h-3" /> Đã chọn
            </span>
          </div>
        ) : (
          <div>
            <Select
              value={selectedQuizId || 'unselected'}
              onValueChange={onSelectQuizId}
              disabled={isLoadingQuizzes}
            >
              <SelectTrigger
                className={`w-full text-sm rounded-md ${
                  errors.quiz ? 'border-rose-500 ring-1 ring-rose-500/20' : ''
                }`}
              >
                <SelectValue placeholder="-- Chưa chọn đề thi --" />
              </SelectTrigger>
              <SelectContent className="rounded-md">
                <SelectItem value="unselected" disabled className="text-slate-400">
                  -- Chưa chọn đề thi --
                </SelectItem>
                {availableQuizzes.map((q) => (
                  <SelectItem key={q.id} value={q.id} className="text-sm">
                    {q.title} ({q.timeLimit} phút)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.quiz && (
              <p className="text-[11px] text-rose-500 font-medium mt-1">
                Vui lòng chọn đề thi trắc nghiệm
              </p>
            )}
          </div>
        )}
      </div>

      {/* Field 2: Class */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Lớp học nhận bài thi <span className="text-rose-500">*</span>
        </Label>
        {preselectedClassId ? (
          <div className="p-2.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                {preselectedClassName || 'Lớp học hiện tại'}
              </span>
            </div>
            <span className="text-[11px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-sm font-semibold flex items-center gap-1 shrink-0">
              <Lock className="w-3 h-3" /> Đã chọn
            </span>
          </div>
        ) : (
          <div>
            <Select
              value={selectedClassId || 'unselected'}
              onValueChange={onSelectClassId}
              disabled={isLoadingClasses}
            >
              <SelectTrigger
                className={`w-full text-sm rounded-md ${
                  errors.class ? 'border-rose-500 ring-1 ring-rose-500/20' : ''
                }`}
              >
                <SelectValue placeholder="-- Chưa chọn lớp học --" />
              </SelectTrigger>
              <SelectContent className="rounded-md">
                <SelectItem value="unselected" disabled className="text-slate-400">
                  -- Chưa chọn lớp học --
                </SelectItem>
                {teacherClasses.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id} className="text-sm">
                    {cls.title} ({cls.courseCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.class && (
              <p className="text-[11px] text-rose-500 font-medium mt-1">
                Vui lòng chọn lớp học nhận bài thi
              </p>
            )}
          </div>
        )}
      </div>

      {/* Field 3: Topic */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Chủ đề bài học (Topic) <span className="text-rose-500">*</span>
        </Label>
        <div>
          <Select
            value={selectedTopicId || 'unselected'}
            onValueChange={onSelectTopicId}
            disabled={isLoadingTopics}
          >
            <SelectTrigger
              className={`w-full text-sm rounded-md ${
                errors.topic ? 'border-rose-500 ring-1 ring-rose-500/20' : ''
              }`}
            >
              <SelectValue placeholder="-- Chưa chọn chủ đề bài học --" />
            </SelectTrigger>
            <SelectContent className="rounded-md">
              <SelectItem value="unselected" disabled className="text-slate-400">
                -- Chưa chọn chủ đề --
              </SelectItem>
              <SelectItem value="none" className="text-sm text-slate-600 italic">
                Không thuộc chủ đề nào
              </SelectItem>
              {classTopics.map((t) => (
                <SelectItem key={t.id} value={t.id} className="text-sm">
                  {t.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.topic && (
            <p className="text-[11px] text-rose-500 font-medium mt-1">
              Vui lòng chọn chủ đề bài học (hoặc chọn &quot;Không thuộc chủ đề nào&quot;)
            </p>
          )}
        </div>
      </div>

      {/* Field 4: Open & Close Time Window */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            Thời gian mở bài
          </Label>
          <Input
            type="datetime-local"
            value={openAt}
            onChange={(e) => onOpenAtChange(e.target.value)}
            className="text-xs h-9 rounded-md"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            Thời gian đóng bài
          </Label>
          <Input
            type="datetime-local"
            value={closeAt}
            onChange={(e) => onCloseAtChange(e.target.value)}
            className="text-xs h-9 rounded-md"
          />
        </div>
      </div>

      {/* Field 5: Review Mode */}
      <div className="space-y-1.5 pt-1">
        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          Chế độ xem đáp án & kết quả
        </Label>
        <Select value={reviewMode} onValueChange={(val) => onReviewModeChange(val as ReviewMode)}>
          <SelectTrigger className="w-full text-xs h-9 rounded-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-md">
            <SelectItem value={ReviewMode.after_submission} className="text-xs">
              Xem đáp án sau khi nộp bài
            </SelectItem>
            <SelectItem value={ReviewMode.immediate} className="text-xs">
              Xem đáp án sau mỗi câu trả lời
            </SelectItem>
            <SelectItem value={ReviewMode.after_closed} className="text-xs">
              Chỉ xem đáp án sau khi hết hạn đợt thi
            </SelectItem>
            <SelectItem value={ReviewMode.never} className="text-xs">
              Không cho xem đáp án
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Field 6: Public Outside Classroom Checkbox */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="isPublicPublication"
          checked={isPublic}
          onChange={(e) => onIsPublicChange(e.target.checked)}
          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
        <label
          htmlFor="isPublicPublication"
          className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          Công khai lên Thư viện chung (Học sinh ngoài lớp có thể làm thử)
        </label>
      </div>
    </div>
  );
}
