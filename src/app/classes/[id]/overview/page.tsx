import { Metadata } from 'next';
import { topicsServerService } from '@/features/classes/services/topics.server.service';
import { materialsServerService } from '@/features/classes/services/materials.server.service';
import { serverApiClient } from '@/lib/api/server-api-client';
import { Enrollment } from '@/types/enrollment';
import { Class } from '@/types/class';
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
  const relationRes = await serverApiClient<Enrollment>(`/enrollments/me/${classId}`, {
    ignoreAuthError: true,
  });
  const isTeacher = relationRes.data?.roleIn === 'teacher';

  // 2. Fetch class details for Google Meet link
  const classRes = await serverApiClient<Class>(`/classes/${classId}`, {
    ignoreAuthError: true,
  });
  const meetingUri = classRes.data?.meetingUri || null;

  // 3. Pre-fetch topics and their attached learning materials
  const initialTopics = await topicsServerService.getTopics(classId);

  const initialTopicsWithMaterials = await Promise.all(
    initialTopics.map(async (topic) => {
      try {
        const materials = await materialsServerService.getMaterials(topic.id);
        return {
          ...topic,
          materials,
        };
      } catch {
        return {
          ...topic,
          materials: [],
        };
      }
    }),
  );

  return (
    <OverviewClient
      classId={classId}
      initialTopics={initialTopicsWithMaterials}
      isTeacher={isTeacher}
      meetingUri={meetingUri}
    />
  );
}
