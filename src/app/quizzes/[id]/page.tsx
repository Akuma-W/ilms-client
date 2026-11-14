import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/layout/footer';
import { userServerService } from '@/features/user/services/user.server.service';
import { quizzesServerService } from '@/features/quizzes/services/quizzes.server.service';
import { QuizDetailClient } from './quiz-detail-client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const quiz = await quizzesServerService.getQuizById(id);
  if (quiz) {
    return {
      title: `${quiz.title} | Chi tiết bài thi`,
      description: quiz.description || 'Xem chi tiết đề thi trắc nghiệm',
    };
  }

  return {
    title: 'Chi tiết bài thi | Interactive LMS',
  };
}

export default async function QuizDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [user, quiz] = await Promise.all([
    userServerService.getMe(),
    quizzesServerService.getQuizById(id),
  ]);

  if (!quiz) {
    notFound();
  }

  return (
    <>
      <QuizDetailClient initialQuiz={quiz} currentUser={user} />
      <Footer />
    </>
  );
}
