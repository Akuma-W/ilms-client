import { Metadata } from 'next';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { userServerService } from '@/features/user/services/user.server.service';
import { classServerService } from '@/features/classes/services/class.server.service';
import { materialsService } from '@/features/materials/services/materials.service';
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

  // 1. Check user relation to determine teacher privileges (Must be teacher of THIS class)
  const [relation, currentUser, classData] = await Promise.all([
    enrollmentServerService.getMyRelationInClass(classId).catch(() => null),
    userServerService.getMe().catch(() => null),
    classServerService.getClassData(classId).catch(() => null),
  ]);
  const isTeacher =
    relation?.roleIn === 'teacher' ||
    Boolean(classData && currentUser && classData.teacherId === currentUser.id);

  // 2. Fetch topics and materials via service (encapsulates mock fallback)
  const { topics, materials } = await materialsService.getAllMaterialsWithTopic(classId);

  return (
    <MaterialsClient
      classId={classId}
      initialMaterials={materials}
      topics={topics}
      isTeacher={isTeacher}
    />
  );
}
