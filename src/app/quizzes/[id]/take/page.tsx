import { notFound } from 'next/navigation';
import { quizzesServerService } from '@/features/quizzes/services/quizzes.server.service';
import { TakeQuizClient } from './take-quiz-client';

interface TakeQuizPageProps {
  params: Promise<{ id: string }>;
}

export default async function TakeQuizPage({ params }: TakeQuizPageProps) {
  const { id } = await params;
  const quiz = await quizzesServerService.getQuizById(id);

  if (!quiz) {
    notFound();
  }

  return <TakeQuizClient quizId={id} initialQuiz={quiz} />;
}
