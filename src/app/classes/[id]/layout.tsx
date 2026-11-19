import { notFound } from 'next/navigation';
import { ClassHero } from '@/features/classes/components/layout/class-hero';
import { ClassNav } from '@/features/classes/components/layout/class-nav';
import { ClassArchivedBanner } from '@/features/classes/components/layout/class-archived-banner';
import { classServerService } from '@/features/classes/services/class.server.service';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { userServerService } from '@/features/user/services/user.server.service';

export default async function ClassDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id: classId } = await params;
  const [classData, relation, currentUser] = await Promise.all([
    classServerService.getClassData(classId),
    enrollmentServerService.getMyRelationInClass(classId).catch(() => null),
    userServerService.getMe().catch(() => null),
  ]);

  if (!classData) {
    notFound();
  }

  const isJoined = Boolean(
    relation && (relation.status === 'approved' || relation.roleIn === 'teacher'),
  );
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-background w-full flex flex-col">
      {/* 1. Seamless Hero Section without rounded corners */}
      <ClassHero classData={classData} />

      {/* 2. Refined Class Tabs Navigation (all 8 tabs) */}
      <ClassNav classId={classData.id} isJoined={isJoined} isAdmin={isAdmin} />

      {/* 3. Read-only Warning Banner if archived */}
      {classData.isArchived && <ClassArchivedBanner isJoined />}

      {/* 4. Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</div>
    </div>
  );
}
