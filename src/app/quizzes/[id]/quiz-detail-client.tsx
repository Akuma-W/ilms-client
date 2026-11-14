'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizDetailHeader } from '@/features/quizzes/components/detail/quiz-detail-header';
import { QuizDetailActions } from '@/features/quizzes/components/detail/quiz-detail-actions';
import { QuizDetailQuestions } from '@/features/quizzes/components/detail/quiz-detail-questions';
import { PublishQuizModal } from '@/features/quizzes/components/publish-quiz-modal';
import { quizzesService } from '@/features/quizzes/services/quizzes.service';
import type { Quiz } from '@/types/quiz';
import type { User } from '@/types/user';
import { toast } from 'sonner';

interface QuizDetailClientProps {
  initialQuiz: Quiz;
  currentUser: User | null;
}

export function QuizDetailClient({ initialQuiz, currentUser }: QuizDetailClientProps) {
  const router = useRouter();
  const [quiz] = useState<Quiz>(initialQuiz);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);

  const isOwner = currentUser?.id === quiz.createdBy;
  const canPublish = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  // Handles cloning public quiz into personal library
  const handleCloneQuiz = async () => {
    try {
      toast.loading('Đang sao chép đề thi về kho cá nhân...');
      const cloned = await quizzesService.cloneQuiz(quiz.id);
      toast.dismiss();
      toast.success('Sao chép đề thi thành công! Đang chuyển hướng...');
      router.push(`/quizzes/${cloned.id}`);
    } catch (err: unknown) {
      toast.dismiss();
      const msg = err instanceof Error ? err.message : 'Không thể sao chép đề thi';
      toast.error(msg);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Info */}
      <QuizDetailHeader quiz={quiz} isOwner={isOwner} />

      {/* Action Bar */}
      <QuizDetailActions
        quiz={quiz}
        isOwner={isOwner}
        canPublish={canPublish}
        onOpenPublishModal={() => setIsPublishDialogOpen(true)}
        onCloneQuiz={handleCloneQuiz}
      />

      {/* Questions Preview */}
      <QuizDetailQuestions questions={quiz.questions || []} isOwner={isOwner} />

      {canPublish && (
        <PublishQuizModal
          preselectedQuiz={quiz}
          isOpen={isPublishDialogOpen}
          onOpenChange={setIsPublishDialogOpen}
        />
      )}
    </div>
  );
}
