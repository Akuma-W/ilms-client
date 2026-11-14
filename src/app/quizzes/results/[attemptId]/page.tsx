import { notFound } from 'next/navigation';
import { quizAttemptsServerService } from '@/features/quizzes/services/quiz-attempts.server.service';
import { quizzesServerService } from '@/features/quizzes/services/quizzes.server.service';
import { QuizResultView } from '@/features/quizzes/components/results/quiz-result-view';

interface QuizResultPageProps {
  params: Promise<{ attemptId: string }>;
}

export default async function QuizResultPage({ params }: QuizResultPageProps) {
  const { attemptId } = await params;
  const result = await quizAttemptsServerService.getAttemptById(attemptId);

  if (!result) {
    notFound();
  }

  const quiz = result.quizId ? await quizzesServerService.getQuizById(result.quizId) : null;

  return (
    <QuizResultView
      result={result}
      quiz={quiz}
      retakeUrl={`/quizzes/${result.quizId}/take`}
      backUrl={`/quizzes/${result.quizId}`}
      backLabel="Trở về thông tin đề thi"
    />
  );
}
