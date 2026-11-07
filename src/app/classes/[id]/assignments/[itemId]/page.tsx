import { Metadata } from 'next';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { userServerService } from '@/features/user/services/user.server.service';
import { classServerService } from '@/features/classes/services/class.server.service';
import { assignmentsService } from '@/features/assignments/services/assignments.service';
import { AssignmentDetailClient } from './assignment-detail-client';

interface AssignmentDetailPageProps {
  params: Promise<{ id: string; itemId: string }>;
}

export async function generateMetadata({ params }: AssignmentDetailPageProps): Promise<Metadata> {
  const { itemId } = await params;
  const assignment = await assignmentsService.getAssignmentById(itemId).catch(() => null);
  return {
    title: assignment?.title || 'Chi tiết bài tập',
  };
}

export default async function AssignmentDetailPage({ params }: AssignmentDetailPageProps) {
  const { id: classId, itemId } = await params;

  // 1. Fetch user enrollment, role in class, assignment, and class data
  const [relation, currentUser, assignment, classData] = await Promise.all([
    enrollmentServerService.getMyRelationInClass(classId).catch(() => null),
    userServerService.getMe().catch(() => null),
    assignmentsService.getAssignmentById(itemId).catch(() => null),
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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <AssignmentDetailClient
        assignment={assignment}
        assignmentId={itemId}
        classId={classId}
        isTeacher={isTeacher}
        currentUser={currentUser}
      />
    </div>
  );
}
