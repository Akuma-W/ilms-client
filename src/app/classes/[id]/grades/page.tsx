import { Metadata } from 'next';
import { classServerService } from '@/features/classes/services/class.server.service';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { GradesClient } from '@/app/classes/[id]/grades/grades-client';

export const metadata: Metadata = {
  title: 'Bảng điểm lớp học',
};

interface ClassGradesProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClassGradesPage({ params }: ClassGradesProps) {
  const { id } = await params;

  const [classData, relation] = await Promise.all([
    classServerService.getClassData(id),
    enrollmentServerService.getMyRelationInClass(id).catch(() => null),
  ]);

  const isTeacher = Boolean(
    relation?.roleIn === 'teacher' ||
    (classData && relation?.userId && classData.teacherId === relation.userId),
  );

  return (
    <GradesClient classId={id} isTeacher={isTeacher} isArchived={Boolean(classData?.isArchived)} />
  );
}
