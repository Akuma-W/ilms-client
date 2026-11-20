import { classServerService } from '@/features/classes/services/class.server.service';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { userServerService } from '@/features/user/services/user.server.service';
import { redirect } from 'next/navigation';

interface ClassDetailProps {
  params: Promise<{ id: string }>;
}

export default async function ClassDetail({ params }: ClassDetailProps) {
  const { id: classId } = await params;

  const [classData, relation, currentUser] = await Promise.all([
    classServerService.getClassData(classId).catch(() => null),
    enrollmentServerService.getMyRelationInClass(classId).catch(() => null),
    userServerService.getMe().catch(() => null),
  ]);

  const isTeacher = Boolean(
    relation?.roleIn === 'teacher' ||
    (classData && currentUser && classData.teacherId === currentUser.id),
  );
  const isJoined = Boolean((relation && relation.status === 'approved') || isTeacher);
  const isAdmin = currentUser?.role === 'admin';

  if (isJoined || isAdmin) {
    redirect(`/classes/${classId}/overview`);
  } else {
    redirect(`/classes/${classId}/info`);
  }
}
