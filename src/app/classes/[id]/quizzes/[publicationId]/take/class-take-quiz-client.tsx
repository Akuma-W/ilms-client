'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizPlayEngine } from '@/features/quizzes/components/play/quiz-play-engine';
import { quizAttemptsService } from '@/features/quizzes/services/quiz-attempts.service';
import type { QuizAttemptResult, QuizAttemptSession, QuizPublication } from '@/types/quiz';

interface ClassTakeQuizClientProps {
  classId: string;
  publicationId: string;
  publication: QuizPublication;
}

export function ClassTakeQuizClient({
  classId,
  publicationId,
  publication,
}: ClassTakeQuizClientProps) {
  const router = useRouter();
  const [session, setSession] = useState<QuizAttemptSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initiates taking attempt session in classroom context
  const initAttempt = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await quizAttemptsService.startAttempt(publication.quizId, publicationId);
      setSession(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể bắt đầu làm bài thi lớp học';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [publication.quizId, publicationId]);

  useEffect(() => {
    initAttempt();
  }, [initAttempt]);

  const handleCompleted = (result: QuizAttemptResult) => {
    router.push(`/classes/${classId}/quizzes/${publicationId}/attempts/${result.attemptId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Đang chuẩn bị đề thi lớp học...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 rounded-2xl border border-destructive/20 bg-destructive/5 text-center space-y-4">
        <p className="text-sm font-semibold text-destructive">
          {error || 'Không tải được bài thi'}
        </p>
        <div className="flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push(`/classes/${classId}/quizzes/${publicationId}`)}
            className="gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={initAttempt}
            className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Thử lại</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <QuizPlayEngine
      session={session}
      reviewMode={publication.reviewMode}
      onCompleted={handleCompleted}
    />
  );
}
