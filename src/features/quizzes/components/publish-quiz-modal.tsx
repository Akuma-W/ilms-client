'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Loader2, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useClasses } from '@/features/classes/hooks/use-classes';
import { topicsService } from '@/features/topics/services/topics.service';
import { quizzesService } from '../services/quizzes.service';
import { quizPublicationsService } from '../services/quiz-publications.service';
import { formatDateTimeLocal } from '../utils/quiz.utils';
import { PublishQuizFormFields } from './publish-quiz-form-fields';
import { ClassTabs } from '@/types/enum';
import type { Quiz } from '@/types/quiz';
import type { Topic } from '@/types/topic';

interface PublishQuizModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedQuiz?: Quiz;
  preselectedClassId?: string;
  preselectedClassName?: string;
  topics?: Topic[];
  onSuccess?: () => void;
}

export function PublishQuizModal({
  isOpen,
  onOpenChange,
  preselectedQuiz,
  preselectedClassId,
  preselectedClassName,
  topics: initialTopics = [],
  onSuccess,
}: PublishQuizModalProps) {
  const [selectedQuizId, setSelectedQuizId] = useState(preselectedQuiz?.id || '');
  const [selectedClassId, setSelectedClassId] = useState(preselectedClassId || '');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ quiz?: boolean; class?: boolean; topic?: boolean }>({});

  const [openAt, setOpenAt] = useState(() => formatDateTimeLocal(new Date()));
  const [closeAt, setCloseAt] = useState(() =>
    formatDateTimeLocal(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  );

  // Fetch teacher quizzes if not preselected
  const { data: availableQuizzes = [], isLoading: isLoadingQuizzes } = useSWR<Quiz[]>(
    isOpen && !preselectedQuiz ? 'teacher-available-quizzes' : null,
    () => quizzesService.getAvailableQuizzes(),
  );

  // Fetch teacher created classes if not preselected
  const { classes: teacherClasses = [], isLoading: isLoadingClasses } = useClasses({
    tab: ClassTabs.CREATED,
    page: 1,
    limit: 50,
  });

  const effectiveQuizId = preselectedQuiz?.id || selectedQuizId;
  const effectiveClassId = preselectedClassId || selectedClassId;

  // Dynamically fetch topics for chosen class
  const { data: classTopics = [], isLoading: isLoadingTopics } = useSWR<Topic[]>(
    isOpen && effectiveClassId && effectiveClassId !== 'unselected'
      ? ['class-topics-for-publish', effectiveClassId]
      : null,
    () => topicsService.getTopics(effectiveClassId),
    {
      fallbackData: preselectedClassId && initialTopics.length > 0 ? initialTopics : undefined,
    },
  );

  // Resets state only when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedQuizId(preselectedQuiz?.id || '');
      setSelectedClassId(preselectedClassId || '');
      setSelectedTopicId('');
      setErrors({});
      setIsPublic(false);
      setOpenAt(formatDateTimeLocal(new Date()));
      setCloseAt(formatDateTimeLocal(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)));
    }
  }, [isOpen, preselectedQuiz?.id, preselectedClassId]);

  const handlePublish = async () => {
    const newErrors: { quiz?: boolean; class?: boolean; topic?: boolean } = {};
    if (!effectiveQuizId || effectiveQuizId === 'unselected') newErrors.quiz = true;
    if (!effectiveClassId || effectiveClassId === 'unselected') newErrors.class = true;
    if (!selectedTopicId || selectedTopicId === 'unselected') newErrors.topic = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.quiz) toast.error('Vui lòng chọn đề thi trắc nghiệm');
      else if (newErrors.class) toast.error('Vui lòng chọn lớp học nhận bài thi');
      else if (newErrors.topic) toast.error('Vui lòng chọn chủ đề bài học (Topic)');
      return;
    }

    const openingTime = new Date(openAt);
    const closingTime = new Date(closeAt);
    if (
      Number.isNaN(openingTime.getTime()) ||
      Number.isNaN(closingTime.getTime()) ||
      closingTime <= openingTime
    ) {
      toast.error('Thời gian đóng bài phải sau thời gian mở bài');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await quizPublicationsService.publishQuiz(effectiveClassId, {
        quizId: effectiveQuizId,
        topicId: selectedTopicId === 'none' ? null : selectedTopicId,
        openAt: openingTime.toISOString(),
        closeAt: closingTime.toISOString(),
        isPublic,
      });

      toast.success(res.message || 'Xuất bản bài thi vào lớp học thành công!');
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Không thể xuất bản bài thi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-md border border-slate-200 dark:border-slate-800 p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600" />
            Xuất bản bài thi vào lớp học
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Ấn định lịch mở, hạn nộp và chủ đề bài học để sinh viên trong lớp tham gia làm bài.
          </DialogDescription>
        </DialogHeader>

        <PublishQuizFormFields
          preselectedQuiz={preselectedQuiz}
          selectedQuizId={selectedQuizId}
          onSelectQuizId={(id) => {
            setSelectedQuizId(id);
            setErrors((prev) => ({ ...prev, quiz: false }));
          }}
          availableQuizzes={availableQuizzes}
          isLoadingQuizzes={isLoadingQuizzes}
          preselectedClassId={preselectedClassId}
          preselectedClassName={preselectedClassName}
          selectedClassId={selectedClassId}
          onSelectClassId={(id) => {
            setSelectedClassId(id);
            setSelectedTopicId('');
            setErrors((prev) => ({ ...prev, class: false }));
          }}
          teacherClasses={teacherClasses}
          isLoadingClasses={isLoadingClasses}
          selectedTopicId={selectedTopicId}
          onSelectTopicId={(id) => {
            setSelectedTopicId(id);
            setErrors((prev) => ({ ...prev, topic: false }));
          }}
          classTopics={classTopics}
          isLoadingTopics={isLoadingTopics}
          openAt={openAt}
          onOpenAtChange={setOpenAt}
          closeAt={closeAt}
          onCloseAtChange={setCloseAt}
          isPublic={isPublic}
          onIsPublicChange={setIsPublic}
          errors={errors}
        />

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs rounded-md"
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handlePublish}
            disabled={isSubmitting}
            className="text-xs rounded-md bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Đang xuất bản...
              </>
            ) : (
              'Xuất bản bài thi'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
