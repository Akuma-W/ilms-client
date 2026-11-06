import { ClassHero } from '@/features/classes/components/layout/class-hero';
import { ClassNav } from '@/features/classes/components/layout/class-nav';
import { MOCK_CURRENT_CLASS } from '@/mocks/classes/class-data.mock';

export default async function ClassDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id: classId } = await params;
  // const classData = await classService.getClassData(classId);
  // const relation = await enrollmentService.getMyRelationInClass(classId);

  // const isJoined = !!relation;
  const classData = { ...MOCK_CURRENT_CLASS, id: classId || MOCK_CURRENT_CLASS.id };
  const isJoined = true;

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
