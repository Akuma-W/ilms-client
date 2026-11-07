import { Metadata } from 'next';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { userServerService } from '@/features/user/services/user.server.service';
import { classServerService } from '@/features/classes/services/class.server.service';
import { assignmentsService } from '@/features/assignments/services/assignments.service';
import { topicsService } from '@/features/topics/services/topics.service';
import { AssignmentsClient } from './assignments-client';

export const metadata: Metadata = {
  title: 'Bài tập & Thực hành',
};

interface ClassAssignmentsProps {
  params: Promise<{ id: string }>;
}

/**
 * Server Component for the Class Assignments tab.
 * Pre-fetches initial assignments and user role to prevent waterfalls.
 */
export default async function ClassAssignments({ params }: ClassAssignmentsProps) {
  const { id: classId } = await params;

  // 1. Check user relation and role (Must be teacher of THIS class)
  const [relation, currentUser, classData] = await Promise.all([
    enrollmentServerService.getMyRelationInClass(classId).catch(() => null),
    userServerService.getMe().catch(() => null),
    classServerService.getClassData(classId).catch(() => null),
  ]);

  // =========================================================================
  // [DEV_PREVIEW_ACCESS]: Nhận diện quyền giảng viên khi test hoặc user có role teacher.
  // Khi chạy Production nghiêm ngặt: chỉ kiểm tra `relation?.roleIn === 'teacher' || ...`.
  // =========================================================================
  const isTeacher =
    relation?.roleIn === 'teacher' ||
    Boolean(classData && currentUser && classData.teacherId === currentUser.id) ||
    currentUser?.role === 'teacher';

  // 2. Fetch initial data via service layer
  const initialAssignments = assignmentsService.getInitialAssignments(classId);
  const topics = topicsService.getInitialTopics(classId);

  return (
    <AssignmentsClient
      classId={classId}
      initialAssignments={initialAssignments}
      topics={topics}
      isTeacher={isTeacher}
      studentId={currentUser?.id}
    />
  );
}
