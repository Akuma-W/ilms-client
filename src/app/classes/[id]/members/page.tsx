import { Metadata } from 'next';
import { classServerService } from '@/features/classes/services/class.server.service';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { userServerService } from '@/features/user/services/user.server.service';
import { MembersClient } from '@/app/classes/[id]/members/members-client';
import type { Class } from '@/types/class';

export const metadata: Metadata = {
  title: 'Thành viên lớp học',
};

interface ClassMembersProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClassMembersPage({ params }: ClassMembersProps) {
  const { id } = await params;

  const [classData, user, relation] = await Promise.all([
    classServerService.getClassData(id),
    userServerService.getMe().catch(() => null),
    enrollmentServerService.getMyRelationInClass(id).catch(() => null),
  ]);

  const isTeacher = Boolean(
    (relation?.roleIn === 'teacher' || classData?.teacherId === user?.id) && user,
  );

  return (
    <MembersClient
      classData={classData as unknown as Class}
      isTeacher={isTeacher}
      currentUser={user}
    />
  );
}
