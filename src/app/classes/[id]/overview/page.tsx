import { Metadata } from 'next';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { getMockTopics } from '@/mocks/classes/class-data.mock';
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

  // 1. Check user relation in class to determine teacher privileges
  const relation = await enrollmentServerService.getMyRelationInClass(classId);
  const isTeacher = relation?.roleIn === 'teacher';

  // 2. Mock class data (mapped to current classId)
  const initialTopicsWithMaterials = getMockTopics(classId);

  return (
    <OverviewClient
      classId={classId}
      initialTopics={initialTopicsWithMaterials}
      isTeacher={isTeacher}
    />
  );
}
