import { ClassHero } from '@/features/classes/components/layout/class-hero';
import { StickyNav } from '@/features/classes/components/layout/sticky-nav';
import { classService } from '@/features/classes/services/class.service';

export default async function ClassDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // const classData = await getClassData(id);
  const classData = await classService.getClassData(id);
  const isJoined = id === '1';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <ClassHero classData={classData} />

      {/* Sticky Sub-navigation */}
      <StickyNav classId={classData.id} isJoined={true} />

      {/* Main Content Area */}
      <div className="container mx-auto px-8 py-12">{children}</div>
    </div>
  );
}
