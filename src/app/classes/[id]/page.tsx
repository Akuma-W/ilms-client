import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { userServerService } from '@/features/user/services/user.server.service';
import { redirect } from 'next/navigation';

interface ClassDetailProps {
  params: Promise<{ id: string }>;
}

export default async function ClassDetail({ params }: ClassDetailProps) {
  const { id: classId } = await params;

  const [relation, currentUser] = await Promise.all([
    enrollmentServerService.getMyRelationInClass(classId).catch(() => null),
    userServerService.getMe().catch(() => null),
  ]);

  const isJoined = Boolean(
    relation && (relation.status === 'approved' || relation.roleIn === 'teacher'),
  );
  const isAdmin = currentUser?.role === 'admin';

  if (isJoined || isAdmin) {
    redirect(`/classes/${classId}/overview`);
  } else {
    redirect(`/classes/${classId}/info`);
  }
}
