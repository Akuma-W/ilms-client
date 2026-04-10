import { ClassInfo } from '@/features/classes/components/pages/class-info';
import { classService } from '@/features/classes/services/class.service';
import { userService } from '@/features/user/services/user.service';

interface ClassInfoProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClassInformation({ params }: ClassInfoProps) {
  const { id } = await params;
  const classData = await classService.getClassData(id);
  const user = await userService.getMe();

  return <ClassInfo classData={classData} userData={user} />;
}
