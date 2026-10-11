import { classService } from '@/features/classes/services/class.service';
import { enrollmentService } from '@/features/classes/services/enrollment.service';
import { userService } from '@/features/user/services/user.service';
import { InfoClient } from './info-client';
import { Metadata } from 'next';

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
  const classData = await classService.getClassData(id);
  const user = await userService.getMe();
  const relation = await enrollmentService.getMyRelationInClass(id);

  return <InfoClient classData={classData} userData={user} relation={relation} />;
}
