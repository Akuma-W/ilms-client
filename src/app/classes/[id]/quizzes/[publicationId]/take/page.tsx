import { notFound } from 'next/navigation';
import { quizPublicationsServerService } from '@/features/quizzes/services/quiz-publications.server.service';
import { ClassTakeQuizClient } from './class-take-quiz-client';

interface ClassTakeQuizPageProps {
  params: Promise<{ id: string; publicationId: string }>;
}

export default async function ClassTakeQuizPage({ params }: ClassTakeQuizPageProps) {
  const { id: classId, publicationId } = await params;
  const publication = await quizPublicationsServerService.getPublicationById(publicationId);

  if (!publication) {
    notFound();
  }

  return (
    <ClassTakeQuizClient
      classId={classId}
      publicationId={publicationId}
      publication={publication}
    />
  );
}
