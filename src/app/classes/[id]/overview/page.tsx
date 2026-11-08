import { Metadata } from 'next';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { userServerService } from '@/features/user/services/user.server.service';
import { classServerService } from '@/features/classes/services/class.server.service';
import { topicsServerService } from '@/features/topics/services/topics.server.service';
import { OverviewClient } from './overview-client';

export const metadata: Metadata = {
  title: 'Tổng quan bài giảng',
};

interface ClassOverviewProps {
  params: Promise<{ id: string }>;
}

/**
 * Server Component for the Class Overview tab (Cyber Cyan theme).
 * Pre-fetches topics and nested materials on the server to prevent waterfalls.
 */
export default async function ClassOverview({ params }: ClassOverviewProps) {
  const { id: classId } = await params;

  // 1. Check user relation in class to determine teacher privileges (Must be teacher of THIS class)
  const [relation, currentUser, classData] = await Promise.all([
    enrollmentServerService.getMyRelationInClass(classId).catch(() => null),
    userServerService.getMe().catch(() => null),
    classServerService.getClassData(classId).catch(() => null),
  ]);
  const isTeacher =
    relation?.roleIn === 'teacher' ||
    Boolean(classData && currentUser && classData.teacherId === currentUser.id);

  // 2. Fetch topics and nested resources via service
  const initialTopicsWithMaterials = await topicsServerService.getTopicsWithResources(classId);

  return (
    <OverviewClient
      classId={classId}
      initialTopics={initialTopicsWithMaterials}
      isTeacher={isTeacher}
    />
  );
}
