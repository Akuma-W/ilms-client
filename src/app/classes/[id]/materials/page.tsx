import { Metadata } from 'next';
import { topicsServerService } from '@/features/classes/services/topics.server.service';
import { materialsServerService } from '@/features/classes/services/materials.server.service';
import { serverApiClient } from '@/lib/api/server-api-client';
import { Enrollment } from '@/types/enrollment';
import { MaterialsClient } from './materials-client';

export const metadata: Metadata = {
  title: 'Tài liệu học tập',
};

interface ClassMaterialsProps {
  params: Promise<{ id: string }>;
}

/**
 * Server Component for the Class Materials tab (Emerald Green theme).
 * Pre-fetches topics and materials on the server to prevent waterfalls.
 */
export default async function ClassMaterials({ params }: ClassMaterialsProps) {
  const { id: classId } = await params;

  // 1. Check user relation to determine teacher privileges
  const relationRes = await serverApiClient<Enrollment>(`/enrollments/me/${classId}`, {
    ignoreAuthError: true,
  });
  const isTeacher = relationRes.data?.roleIn === 'teacher';

  // 2. Fetch topics
  const rawTopics = await topicsServerService.getTopics(classId);
  const topics = Array.isArray(rawTopics) ? rawTopics : [];

  // 3. Resolve materials for each topic and flatten
  const materialsWithTopicInfo = await Promise.all(
    topics.map(async (topic) => {
      try {
        const materials = await materialsServerService.getMaterials(topic.id);
        const matList = Array.isArray(materials) ? materials : [];
        return matList.map((material) => ({
          ...material,
          topicTitle: topic.title,
        }));
      } catch {
        return [];
      }
    }),
  );

  const flattenedMaterials = materialsWithTopicInfo.flat();

  return (
    <MaterialsClient
      classId={classId}
      initialMaterials={flattenedMaterials}
      topics={topics}
      isTeacher={isTeacher}
    />
  );
}
