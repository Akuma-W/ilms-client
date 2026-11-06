import { classServerService } from '@/features/classes/services/class.server.service';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { userServerService } from '@/features/user/services/user.server.service';
import { InfoClient } from './info-client';
import { Metadata } from 'next';
import { MOCK_CURRENT_CLASS } from '@/mocks/classes/class-data.mock';
import type { Class } from '@/types/class';
import type { User } from '@/types/user';
import type { Enrollment } from '@/types/enrollment';

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
  let classData: Class | null = null;
  let user: User | null = null;
  let relation: Enrollment | null = null;

  try {
    classData = await classServerService.getClassData(id);
    if (!classData) {
      classData = { ...MOCK_CURRENT_CLASS, id } as unknown as Class;
    }
  } catch {
    classData = { ...MOCK_CURRENT_CLASS, id } as unknown as Class;
  }

  try {
    user = await userServerService.getMe();
  } catch {
    user = null;
  }

  try {
    relation = await enrollmentServerService.getMyRelationInClass(id);
  } catch {
    relation = null;
  }

  return <InfoClient classData={classData} userData={user} relation={relation} />;
}
