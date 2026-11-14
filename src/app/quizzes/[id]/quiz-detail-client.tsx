'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuizDetailHeader } from '@/features/quizzes/components/detail/quiz-detail-header';
import { QuizDetailActions } from '@/features/quizzes/components/detail/quiz-detail-actions';
import { QuizDetailQuestions } from '@/features/quizzes/components/detail/quiz-detail-questions';
import { PublishQuizModal } from '@/features/quizzes/components/publish-quiz-modal';
import { quizzesService } from '@/features/quizzes/services/quizzes.service';
import { quizAttemptsService } from '@/features/quizzes/services/quiz-attempts.service';
import { formatQuizDateTime } from '@/features/quizzes/utils/quiz.utils';
import type { Quiz, QuizAttempt } from '@/types/quiz';
import type { User } from '@/types/user';

interface QuizDetailClientProps {
  initialQuiz: Quiz;
  currentUser: User | null;
}

// Quiz repository detail view with questions preview and practice attempt history
export function QuizDetailClient({ initialQuiz, currentUser }: QuizDetailClientProps) {
  const router = useRouter();
  const [quiz] = useState<Quiz>(initialQuiz);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);

  const isOwner = currentUser?.id === quiz.createdBy;
  const canPublish = currentUser?.role === 'teacher' || currentUser?.role === 'admin';
  const totalPoints =
    quiz.totalPoints ??
    (quiz.questions || []).reduce((sum, q) => sum + (q.points || 0), 0) ??
    (quiz.questions?.length || 10);

  // Fetch personal practice attempts
  const { data: userAttempts = [] } = useSWR<QuizAttempt[]>(
    currentUser && quiz.id ? ['user-practice-attempts', quiz.id] : null,
    () => quizAttemptsService.getUserAttempts(quiz.id),
  );

  const validAttempts = userAttempts.filter((att) => att.submittedAt !== null);

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

      {/* Personal Practice History */}
      <div className="p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            Lịch sử luyện tập của bạn
          </h3>
          <span className="text-xs text-muted-foreground font-medium">
            Tổng số lượt làm: <strong>{validAttempts.length}</strong>
          </span>
        </div>

        {validAttempts.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-border/60 rounded-xl bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Bạn chưa có lượt luyện tập nào cho đề thi này. Hãy nhấn &quot;Luyện tập ngay&quot; phía trên để thử sức!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-semibold text-left">
                  <th className="pb-2.5 pl-2">Lần thi</th>
                  <th className="pb-2.5">Điểm số</th>
                  <th className="pb-2.5">Bắt đầu lúc</th>
                  <th className="pb-2.5">Nộp lúc</th>
                  <th className="pb-2.5">Trạng thái</th>
                  <th className="pb-2.5 text-right pr-2">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y border-border/40">
                {validAttempts.map((att, idx) => (
                  <tr key={att.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 pl-2 font-medium">#{validAttempts.length - idx}</td>
                    <td className="py-2.5">
                      <span className="font-bold text-emerald-500">
                        {att.score !== null ? `${att.score}/${totalPoints} đ` : 'Đang chấm'}
                      </span>
                    </td>
                    <td className="py-2.5 text-muted-foreground">
                      {formatQuizDateTime(att.startedAt)}
                    </td>
                    <td className="py-2.5 text-muted-foreground">
                      {formatQuizDateTime(att.submittedAt)}
                    </td>
                    <td className="py-2.5">
                      <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Đã hoàn thành
                      </Badge>
                    </td>
                    <td className="py-2.5 text-right pr-2">
                      <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-indigo-600 dark:text-indigo-400 gap-1 hover:text-indigo-700">
                        <Link href={`/quizzes/results/${att.id}`}>
                          <span>Xem lại</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
