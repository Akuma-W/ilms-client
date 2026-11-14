import { notFound } from 'next/navigation';
import { quizAttemptsServerService } from '@/features/quizzes/services/quiz-attempts.server.service';
import { quizzesServerService } from '@/features/quizzes/services/quizzes.server.service';
import { QuizResultView } from '@/features/quizzes/components/results/quiz-result-view';

interface ClassAttemptResultPageProps {
  params: Promise<{ id: string; publicationId: string; attemptId: string }>;
}

export default async function ClassAttemptResultPage({ params }: ClassAttemptResultPageProps) {
  const { id: classId, publicationId, attemptId } = await params;
  const result = await quizAttemptsServerService.getAttemptById(attemptId);

  if (!result) {
    notFound();
  }

  const quiz = result.quizId ? await quizzesServerService.getQuizById(result.quizId) : null;

  return (
    <QuizResultView
      result={result}
      quiz={quiz}
      retakeUrl={`/classes/${classId}/quizzes/${publicationId}/take`}
      backUrl={`/classes/${classId}/quizzes/${publicationId}`}
      backLabel="Trở về trang đợt thi lớp học"
    />
  );
}
