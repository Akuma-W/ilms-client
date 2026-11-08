import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { redirect } from 'next/navigation';

interface ClassDetailProps {
  params: Promise<{ id: string }>;
}

/**
 * Entry redirect router for class detail workspace.
 * Routes enrolled users to /overview and non-enrolled users to /info.
 */
export default async function ClassDetail({ params }: ClassDetailProps) {
  const { id: classId } = await params;
  let isJoined = false;

  try {
    const relation = await enrollmentServerService.getMyRelationInClass(classId);
    isJoined = Boolean(
      relation && (relation.status === 'approved' || relation.roleIn === 'teacher'),
    );
  } catch {
    isJoined = false;
  }

  if (isJoined) {
    redirect(`/classes/${classId}/overview`);
  } else {
    redirect(`/classes/${classId}/info`);
  }
}
