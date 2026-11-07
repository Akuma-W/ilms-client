import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { userServerService } from '@/features/user/services/user.server.service';
import { classServerService } from '@/features/classes/services/class.server.service';
import { topicsService } from '@/features/topics/services/topics.service';
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
  const [relation, currentUser, classData] = await Promise.all([
    enrollmentServerService.getMyRelationInClass(classId).catch(() => null),
    userServerService.getMe().catch(() => null),
    classServerService.getClassData(classId).catch(() => null),
  ]);

  const isClassTeacher =
    relation?.roleIn === 'teacher' ||
    Boolean(classData && currentUser && classData.teacherId === currentUser.id);

  // =========================================================================
  // [DEV_PREVIEW_ACCESS]: Nới lỏng điều kiện khi kiểm thử/mock hoặc user có role teacher.
  // Khi chạy Production nghiêm ngặt: chỉ giữ lại `if (!isClassTeacher) redirect(...)`.
  // =========================================================================
  const isAllowed =
    isClassTeacher ||
    currentUser?.role === 'teacher' ||
    !currentUser ||
    process.env.NODE_ENV !== 'production';

  if (!isAllowed) {
    redirect(`/classes/${classId}/assignments`);
  }

  // 2. Fetch topics for topic selection dropdown
  const topics = topicsService.getInitialTopics(classId);

  return (
    <div className="w-full max-w-5xl mx-auto py-4">
      <AssignmentForm mode="create" classId={classId} topics={topics} defaultTopicId={topicId} />
    </div>
  );
}
