import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { userServerService } from '@/features/user/services/user.server.service';
import { classServerService } from '@/features/classes/services/class.server.service';
import { topicsService } from '@/features/topics/services/topics.service';
import { assignmentsService } from '@/features/assignments/services/assignments.service';
import { AssignmentForm } from '@/features/assignments/components/assignment-form';

export const metadata: Metadata = {
  title: 'Chỉnh sửa bài tập',
};

interface EditAssignmentPageProps {
  params: Promise<{ id: string; itemId: string }>;
}

export default async function EditAssignmentPage({ params }: EditAssignmentPageProps) {
  const { id: classId, itemId } = await params;

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

  // 2. Fetch assignment details and topics
  const [assignment, topics] = await Promise.all([
    assignmentsService.getAssignmentById(itemId).catch(() => null),
    Promise.resolve(topicsService.getInitialTopics(classId)),
  ]);

  return (
    <div className="w-full max-w-5xl mx-auto py-4">
      <AssignmentForm
        mode="edit"
        classId={classId}
        assignmentId={itemId}
        initialData={assignment}
        topics={topics}
      />
    </div>
  );
}
