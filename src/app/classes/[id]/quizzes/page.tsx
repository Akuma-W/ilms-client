import { Metadata } from 'next';
import { classServerService } from '@/features/classes/services/class.server.service';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { userServerService } from '@/features/user/services/user.server.service';
import { quizzesServerService } from '@/features/quizzes/services/quizzes.server.service';
import { topicsService } from '@/features/topics/services/topics.service';
import { QuizzesClient } from './quizzes-client';

export const metadata: Metadata = {
  title: 'Bài trắc nghiệm lớp học',
  description: 'Danh sách bài trắc nghiệm, kiểm tra định kỳ và đánh giá tiếp thu môn học.',
};

interface ClassQuizzesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClassQuizzesPage({ params }: ClassQuizzesPageProps) {
  const { id } = await params;

  const [classData, user, relation, initialQuizzes, topics] = await Promise.all([
    classServerService.getClassData(id).catch(() => null),
    userServerService.getMe().catch(() => null),
    enrollmentServerService.getMyRelationInClass(id).catch(() => null),
    quizzesServerService.getClassQuizzes(id),
    topicsService.getTopics(id).catch(() => []),
  ]);

  const isTeacher = Boolean(
    (relation?.roleIn === 'teacher' || classData?.teacherId === user?.id) && user,
  );

  return (
    <QuizzesClient
      initialQuizzes={initialQuizzes}
      topics={topics}
      classId={id}
      isTeacher={isTeacher}
      currentUser={user}
    />
  );
}
