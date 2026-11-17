import { Metadata } from 'next';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { classServerService } from '@/features/classes/services/class.server.service';
import { topicsServerService } from '@/features/topics/services/topics.server.service';
import { OverviewClient } from './overview-client';

export const metadata: Metadata = {
  title: 'Tổng quan bài giảng',
};

interface ClassOverviewProps {
  params: Promise<{ id: string }>;
}

export default async function ClassOverview({ params }: ClassOverviewProps) {
  const { id: classId } = await params;

  // Check user relation in class to determine teacher privileges
  const [relation, classData] = await Promise.all([
    enrollmentServerService.getMyRelationInClass(classId).catch(() => null),
    classServerService.getClassData(classId).catch(() => null),
  ]);
  const isTeacher =
    relation?.roleIn === 'teacher' ||
    Boolean(classData && relation?.userId && classData.teacherId === relation.userId);

  // Fetch topics and nested resources via service
  const initialTopicsWithMaterials = await topicsServerService.getTopicsWithResources(classId);

  return (
    <OverviewClient
      classId={classId}
      initialTopics={initialTopicsWithMaterials}
      isTeacher={isTeacher}
      isArchived={Boolean(classData?.isArchived)}
    />
  );
}
