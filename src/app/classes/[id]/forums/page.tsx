import { Metadata } from 'next';
import { classServerService } from '@/features/classes/services/class.server.service';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { forumsServerService } from '@/features/forums/services/forums.server.service';
import { ForumsClient } from './forums-client';

export const metadata: Metadata = {
  title: 'Diễn đàn lớp học',
  description: 'Thảo luận, trao đổi bài học và hỏi đáp thắc mắc chuyên môn trong lớp học.',
};

interface ClassForumsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClassForumsPage({ params }: ClassForumsPageProps) {
  const { id } = await params;

  const [classData, relation, initialForums] = await Promise.all([
    classServerService.getClassData(id),
    enrollmentServerService.getMyRelationInClass(id).catch(() => null),
    forumsServerService.getForums(id),
  ]);

  const isTeacher = Boolean(
    relation?.roleIn === 'teacher' ||
    (classData && relation?.userId && classData.teacherId === relation.userId),
  );

  return <ForumsClient initialForums={initialForums} classId={id} isTeacher={isTeacher} />;
}
