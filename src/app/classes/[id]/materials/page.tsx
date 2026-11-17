import { Metadata } from 'next';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { classServerService } from '@/features/classes/services/class.server.service';
import { topicsServerService } from '@/features/topics/services/topics.server.service';
import { MaterialsClient } from './materials-client';

export const metadata: Metadata = {
  title: 'Tài liệu học tập',
};

interface ClassMaterialsProps {
  params: Promise<{ id: string }>;
}

export default async function ClassMaterials({ params }: ClassMaterialsProps) {
  const { id: classId } = await params;

  // Check user relation to determine teacher privileges
  const [relation, classData] = await Promise.all([
    enrollmentServerService.getMyRelationInClass(classId).catch(() => null),
    classServerService.getClassData(classId).catch(() => null),
  ]);
  const isTeacher =
    relation?.roleIn === 'teacher' ||
    Boolean(classData && relation?.userId && classData.teacherId === relation.userId);

  // 2. Fetch topics and nested resources via server service
  const topics = await topicsServerService.getTopicsWithResources(classId);
  const materials = topics.flatMap((t) =>
    (t.materials || []).map((m) => ({
      ...m,
      topicTitle: t.title,
    })),
  );

  return (
    <MaterialsClient
      classId={classId}
      initialMaterials={materials}
      topics={topics}
      isTeacher={isTeacher}
      isArchived={Boolean(classData?.isArchived)}
    />
  );
}
