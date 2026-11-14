import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { userServerService } from '@/features/user/services/user.server.service';
import { classServerService } from '@/features/classes/services/class.server.service';
import { quizPublicationsServerService } from '@/features/quizzes/services/quiz-publications.server.service';
import { ClassQuizPublicationClient } from './class-quiz-publication-client';

interface PageProps {
  params: Promise<{ id: string; publicationId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { publicationId } = await params;
  const pub = await quizPublicationsServerService.getPublicationById(publicationId);
  return {
    title: pub?.quiz?.title
      ? `${pub.quiz.title} | Đợt thi lớp học`
      : 'Đợt thi lớp học | Interactive LMS',
  };
}

export default async function ClassQuizPublicationPage({ params }: PageProps) {
  const { id: classId, publicationId } = await params;

  const [user, publication, classData] = await Promise.all([
    userServerService.getMe(),
    quizPublicationsServerService.getPublicationById(publicationId),
    classServerService.getClassData(classId),
  ]);

  if (!publication) {
    notFound();
  }

  const isTeacher = user?.id === classData.teacherId || user?.role === 'teacher' || user?.role === 'admin';

  return (
    <ClassQuizPublicationClient
      classId={classId}
      publicationId={publicationId}
      publication={publication}
      isTeacher={isTeacher}
      currentUser={user}
    />
  );
}
