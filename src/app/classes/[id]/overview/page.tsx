// import { topicsService } from '@/features/classes/services/topics.service';
// import { enrollmentService } from '@/features/classes/services/enrollment.service';
// import { materialsService } from '@/features/classes/services/materials.service';
// import { OverviewClient } from './overview-client';

interface ClassOverviewProps {
  params: Promise<{ id: string }>;
}

export default async function ClassOverview({ params }: ClassOverviewProps) {
  // const { id: classId } = await params;

  // // 1. Fetch initial data on the server
  // const relation = await enrollmentService.getMyRelationInClass(classId);
  // const initialTopics = await topicsService.getTopics(classId);

  // // 2. Resolve materials for each topic to prevent client waterfall loading
  // const initialTopicsWithMaterials = await Promise.all(
  //   initialTopics.map(async (topic) => {
  //     try {
  //       const materials = await materialsService.getMaterials(topic.id);
  //       return {
  //         ...topic,
  //         materials,
  //       };
  //     } catch {
  //       return {
  //         ...topic,
  //         materials: [],
  //       };
  //     }
  //   }),
  // );

  // const isTeacher = relation?.roleIn === 'teacher';

  // return (
  //   <OverviewClient
  //     classId={classId}
  //     initialTopics={initialTopicsWithMaterials}
  //     isTeacher={isTeacher}
  //   />
  // );
  return <div>Overview</div>;
}
