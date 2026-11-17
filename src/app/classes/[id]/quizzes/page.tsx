import { Metadata } from 'next';
import { classServerService } from '@/features/classes/services/class.server.service';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { quizPublicationsServerService } from '@/features/quizzes/services/quiz-publications.server.service';
import { topicsServerService } from '@/features/topics/services/topics.server.service';
import { QuizzesClient } from './quizzes-client';

export const metadata: Metadata = {
  title: 'Trắc nghiệm lớp học',
  description: 'Danh sách bài trắc nghiệm, kiểm tra định kỳ và đánh giá tiếp thu môn học.',
};

interface ClassQuizzesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClassQuizzesPage({ params }: ClassQuizzesPageProps) {
  const { id } = await params;

  const [classData, relation, initialQuizzes, topics] = await Promise.all([
    classServerService.getClassData(id).catch(() => null),
    enrollmentServerService.getMyRelationInClass(id).catch(() => null),
    quizPublicationsServerService.getClassPublications(id),
    topicsServerService.getTopics(id).catch(() => []),
  ]);

  const isTeacher = Boolean(
    relation?.roleIn === 'teacher' ||
    (classData && relation?.userId && classData.teacherId === relation.userId),
  );

  return (
    <QuizzesClient
      initialQuizzes={initialQuizzes}
      topics={topics}
      classId={id}
      isTeacher={isTeacher}
      isArchived={Boolean(classData?.isArchived)}
    />
  );
}
