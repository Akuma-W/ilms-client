import { ClassHero } from '@/features/classes/components/layout/class-hero';
import { ClassNav } from '@/features/classes/components/layout/class-nav';
import { classServerService } from '@/features/classes/services/class.server.service';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';

export default async function ClassDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id: classId } = await params;
  const [classData, relation] = await Promise.all([
    classServerService.getClassData(classId),
    enrollmentServerService.getMyRelationInClass(classId).catch(() => null),
  ]);

  const isJoined = relation !== null && relation !== undefined;

  return (
    <div className="min-h-screen bg-background w-full flex flex-col">
      {/* 1. Seamless Hero Section without rounded corners */}
      <ClassHero classData={classData} />

      {/* 2. Refined Class Tabs Navigation (all 8 tabs) */}
      <ClassNav classId={classData.id} isJoined={isJoined} />

      {/* 3. Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</div>
    </div>
  );
}
