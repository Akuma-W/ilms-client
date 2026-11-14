import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { userServerService } from '@/features/user/services/user.server.service';
import { quizzesServerService } from '@/features/quizzes/services/quizzes.server.service';
import { EditQuizClient } from './edit-quiz-client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const quiz = await quizzesServerService.getQuizById(id);
  if (quiz) {
    return {
      title: `Chỉnh sửa: ${quiz.title} | Quiz Studio`,
      description: 'Biên soạn và cấu hình câu hỏi đề thi',
    };
  }

  return {
    title: 'Chỉnh sửa đề thi | Interactive LMS',
  };
}

export default async function EditQuizPage({ params }: PageProps) {
  const { id } = await params;
  const user = await userServerService.getMe();

  if (!user) {
    redirect('/login');
  }

  const quiz = await quizzesServerService.getQuizById(id);

  if (!quiz) {
    notFound();
  }

  // Check ownership
  if (quiz.createdBy !== user.id && user.role !== 'admin') {
    redirect(`/quizzes/${id}`);
  }

  return <EditQuizClient initialQuiz={quiz} />;
}
