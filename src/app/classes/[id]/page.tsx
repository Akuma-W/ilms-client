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
  let isJoined = true;

  try {
    const relation = await enrollmentServerService.getMyRelationInClass(classId);
    isJoined = !!relation;
  } catch {
    isJoined = true;
  }

  if (isJoined) {
    redirect(`/classes/${classId}/overview`);
  } else {
    redirect(`/classes/${classId}/info`);
  }
}
