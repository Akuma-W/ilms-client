// import { topicsService } from '@/features/classes/services/topics.service';
// import { materialsService } from '@/features/classes/services/materials.service';
// import { MaterialsClient } from './materials-client';

interface ClassMaterialsProps {
  params: Promise<{ id: string }>;
}

export default async function ClassMaterials({ params }: ClassMaterialsProps) {
  // const { id: classId } = await params;

  // // 1. Fetch topics on the server
  // const topics = await topicsService.getTopics(classId);

  // // 2. Resolve materials for each topic and flatten the list
  // const materialsWithTopicInfo = await Promise.all(
  //   topics.map(async (topic) => {
  //     try {
  //       const materials = await materialsService.getMaterials(topic.id);
  //       return materials.map((material) => ({
  //         ...material,
  //         topicTitle: topic.title,
  //       }));
  //     } catch {
  //       return [];
  //     }
  //   }),
  // );

  // const flattenedMaterials = materialsWithTopicInfo.flat();

  // return <MaterialsClient initialMaterials={flattenedMaterials} />;
  return (
    <div>Materials</div>
  );
}
