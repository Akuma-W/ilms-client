import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { classServerService } from '@/features/classes/services/class.server.service';
import { topicsServerService } from '@/features/topics/services/topics.server.service';
import { assignmentsServerService } from '@/features/assignments/services/assignments.server.service';
import { AssignmentForm } from '@/features/assignments/components/assignment-form';
import { userServerService } from '@/features/user/services/user.server.service';

export const metadata: Metadata = {
  title: 'Chỉnh sửa bài tập',
};

interface EditAssignmentPageProps {
  params: Promise<{ id: string; itemId: string }>;
}

export default async function EditAssignmentPage({ params }: EditAssignmentPageProps) {
  const { id: classId, itemId } = await params;

  // Check teacher privileges (Must be teacher of THIS class)
  const [user, relation, classData, assignment, topics] = await Promise.all([
    userServerService.getMe(),
    enrollmentServerService.getMyRelationInClass(classId).catch(() => null),
    classServerService.getClassData(classId).catch(() => null),
    assignmentsServerService.getAssignmentById(itemId).catch(() => null),
    topicsServerService.getTopics(classId).catch(() => []),
  ]);

  const isClassTeacher =
    relation?.roleIn === 'teacher' ||
    Boolean(classData && relation?.userId && classData.teacherId === relation.userId);

  if (!isClassTeacher || user?.role === 'admin') {
    redirect(`/classes/${classId}/assignments`);
  }

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
