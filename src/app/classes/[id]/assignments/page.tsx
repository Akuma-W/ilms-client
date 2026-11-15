import { Metadata } from 'next';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
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

export default async function ClassAssignments({ params }: ClassAssignmentsProps) {
  const { id: classId } = await params;

  // Check user relation and role (Must be teacher of THIS class)
  const [relation, classData, initialAssignments, topics] = await Promise.all([
    enrollmentServerService.getMyRelationInClass(classId).catch(() => null),
    classServerService.getClassData(classId).catch(() => null),
    assignmentsServerService.getAssignments(classId).catch(() => []),
    topicsServerService.getTopics(classId).catch(() => []),
  ]);

  const isTeacher =
    relation?.roleIn === 'teacher' ||
    Boolean(classData && relation?.userId && classData.teacherId === relation.userId);

  return (
    <AssignmentsClient
      classId={classId}
      initialAssignments={initialAssignments}
      topics={topics}
      isTeacher={isTeacher}
      studentId={relation?.userId}
    />
  );
}
