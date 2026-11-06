import { Metadata } from 'next';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { MOCK_MATERIALS, getMockTopics } from '@/mocks/classes/class-data.mock';
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
  const relation = await enrollmentServerService.getMyRelationInClass(classId);
  const isTeacher = relation?.roleIn === 'teacher';

  // 2. Mock data (mapped to current classId)
  const topics = getMockTopics(classId);
  const materialsWithTopicInfo = MOCK_MATERIALS.map((item) => {
    return {
      ...item,
      topicTitle: topics.find((topic) => topic.id === item.topicId)?.title,
    };
  });

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
