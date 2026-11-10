import { Metadata } from 'next';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { userServerService } from '@/features/user/services/user.server.service';
import { classServerService } from '@/features/classes/services/class.server.service';
import { assignmentsServerService } from '@/features/assignments/services/assignments.server.service';
import { topicsServerService } from '@/features/topics/services/topics.server.service';
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
  const [relation, currentUser, classData, initialAssignments, topics] = await Promise.all([
    enrollmentServerService.getMyRelationInClass(classId).catch(() => null),
    userServerService.getMe().catch(() => null),
    classServerService.getClassData(classId).catch(() => null),
    assignmentsServerService.getAssignments(classId).catch(() => []),
    topicsServerService.getTopics(classId).catch(() => []),
  ]);

  const isTeacher =
    currentUser?.role === 'admin' ||
    relation?.roleIn === 'teacher' ||
    Boolean(classData && currentUser && classData.teacherId === currentUser.id);

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
