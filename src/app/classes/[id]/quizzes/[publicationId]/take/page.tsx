import { notFound, redirect } from 'next/navigation';
import { quizPublicationsServerService } from '@/features/quizzes/services/quiz-publications.server.service';
import { classServerService } from '@/features/classes/services/class.server.service';
import { ClassTakeQuizClient } from './class-take-quiz-client';

interface ClassTakeQuizPageProps {
  params: Promise<{ id: string; publicationId: string }>;
}

export default async function ClassTakeQuizPage({ params }: ClassTakeQuizPageProps) {
  const { id: classId, publicationId } = await params;

  const [publication, classData] = await Promise.all([
    quizPublicationsServerService.getPublicationById(publicationId),
    classServerService.getClassData(classId),
  ]);

  if (!publication) {
    notFound();
  }

  if (classData?.isArchived) {
    redirect(`/classes/${classId}/quizzes/${publicationId}`);
  }

  return (
    <ClassTakeQuizClient
      classId={classId}
      publicationId={publicationId}
      publication={publication}
    />
  );
}
