import { Metadata } from 'next';
import { classServerService } from '@/features/classes/services/class.server.service';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { userServerService } from '@/features/user/services/user.server.service';
import { InfoClient } from './info-client';
import type { Class } from '@/types/class';

export const metadata: Metadata = {
  title: 'Thông tin lớp học',
};

interface ClassInfoProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClassInformation({ params }: ClassInfoProps) {
  const { id } = await params;

  const [classData, user, relation] = await Promise.all([
    classServerService.getClassData(id),
    userServerService.getMe().catch(() => null),
    enrollmentServerService.getMyRelationInClass(id).catch(() => null),
  ]);

  return (
    <InfoClient classData={classData as unknown as Class} userData={user} relation={relation} />
  );
}
