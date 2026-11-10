import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { userServerService } from '@/features/user/services/user.server.service';
import { classServerService } from '@/features/classes/services/class.server.service';
import { topicsServerService } from '@/features/topics/services/topics.server.service';
import { AssignmentForm } from '@/features/assignments/components/assignment-form';

export const metadata: Metadata = {
  title: 'Giao bài tập mới',
};

interface CreateAssignmentPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ topicId?: string }>;
}

export default async function CreateAssignmentPage({
  params,
  searchParams,
}: CreateAssignmentPageProps) {
  const { id: classId } = await params;
  const { topicId } = await searchParams;

  // 1. Check teacher privileges (Must be teacher of THIS class)
  const [relation, currentUser, classData, topics] = await Promise.all([
    enrollmentServerService.getMyRelationInClass(classId).catch(() => null),
    userServerService.getMe().catch(() => null),
    classServerService.getClassData(classId).catch(() => null),
    topicsServerService.getTopics(classId).catch(() => []),
  ]);

  const isClassTeacher =
    currentUser?.role === 'admin' ||
    relation?.roleIn === 'teacher' ||
    Boolean(classData && currentUser && classData.teacherId === currentUser.id);

  if (!isClassTeacher) {
    redirect(`/classes/${classId}/assignments`);
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-4">
      <AssignmentForm mode="create" classId={classId} topics={topics} defaultTopicId={topicId} />
    </div>
  );
}
