import { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';
import { quizzesServerService } from '@/features/quizzes/services/quizzes.server.service';
import { QuizzesClient } from './quizzes-client';

export const metadata: Metadata = {
  title: 'Kho bài trắc nghiệm & đề thi | Interactive LMS',
  description: 'Khám phá và biên soạn ngân hàng đề thi trắc nghiệm trực tuyến',
};

export default async function QuizzesPage() {
  const initialData = await quizzesServerService.getQuizzes({ scope: 'all', page: 1, limit: 12 });

  return (
    <>
      <QuizzesClient initialData={initialData} />
      <Footer />
    </>
  );
}
