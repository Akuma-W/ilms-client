import { ClassHero } from '@/features/classes/components/layout/class-hero';
import { StickyNav } from '@/features/classes/components/layout/sticky-nav';
import { classService } from '@/features/classes/services/class.service';
import { enrollmentService } from '@/features/classes/services/enrollment.service';

export default async function ClassDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id: classId } = await params;
  const classData = await classService.getClassData(classId);
  const relation = await enrollmentService.getMyRelationInClass(classId);

  const isJoined = !!relation;

  return (
    <div className="min-h-screen bg-gray-50 px-8 w-full max-w-7xl mx-auto">
      {/* Hero Section */}
      <ClassHero classData={classData} />

      {/* Sticky Sub-navigation */}
      <StickyNav classId={classData.id} isJoined={isJoined} />

      {/* Main Content Area */}
      <div className="flex-1 mt-2">{children}</div>
    </div>
  );
}
