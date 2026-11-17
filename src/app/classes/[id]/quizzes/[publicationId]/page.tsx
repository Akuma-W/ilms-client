import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
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

  const [relation, publication, classData] = await Promise.all([
    enrollmentServerService.getMyRelationInClass(classId).catch(() => null),
    quizPublicationsServerService.getPublicationById(publicationId),
    classServerService.getClassData(classId),
  ]);

  if (!publication) {
    notFound();
  }

  const isTeacher =
    relation?.roleIn === 'teacher' ||
    Boolean(classData && relation?.userId && classData.teacherId === relation.userId);

  return (
    <ClassQuizPublicationClient
      classId={classId}
      publicationId={publicationId}
      publication={publication}
      isTeacher={isTeacher}
      isArchived={Boolean(classData?.isArchived)}
    />
  );
}
