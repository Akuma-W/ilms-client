import { Metadata } from 'next';
import { classServerService } from '@/features/classes/services/class.server.service';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { userServerService } from '@/features/user/services/user.server.service';
import { GradesClient } from '@/app/classes/[id]/grades/grades-client';

export const metadata: Metadata = {
  title: 'Bảng điểm lớp học',
};

interface ClassGradesProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClassGradesPage({ params }: ClassGradesProps) {
  const { id } = await params;

  const [classData, user, relation] = await Promise.all([
    classServerService.getClassData(id),
    userServerService.getMe().catch(() => null),
    enrollmentServerService.getMyRelationInClass(id).catch(() => null),
  ]);

  const isTeacher = Boolean(
    (relation?.roleIn === 'teacher' || classData?.teacherId === user?.id) && user,
  );

  return <GradesClient classId={id} isTeacher={isTeacher} currentUser={user} />;
}
