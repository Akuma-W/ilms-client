import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { classServerService } from '@/features/classes/services/class.server.service';
import { enrollmentServerService } from '@/features/classes/services/enrollment.server.service';
import { userServerService } from '@/features/user/services/user.server.service';
import { forumsServerService } from '@/features/forums/services/forums.server.service';
import { ForumDetailClient } from './forum-detail-client';

interface ForumDetailPageProps {
  params: Promise<{
    id: string;
    forumId: string;
  }>;
}

export async function generateMetadata({ params }: ForumDetailPageProps): Promise<Metadata> {
  const { forumId } = await params;
  const forum = await forumsServerService.getForumDetail(forumId);

  return {
    title: forum ? `${forum.title} | Diễn đàn lớp học` : 'Chi tiết bài thảo luận',
    description: forum?.content.slice(0, 160) || 'Thảo luận lớp học',
  };
}

export default async function ForumDetailPage({ params }: ForumDetailPageProps) {
  const { id, forumId } = await params;

  const [classData, user, relation, forumDetail] = await Promise.all([
    classServerService.getClassData(id),
    userServerService.getMe().catch(() => null),
    enrollmentServerService.getMyRelationInClass(id).catch(() => null),
    forumsServerService.getForumDetail(forumId),
  ]);

  if (!forumDetail) {
    notFound();
  }

  const isTeacher = Boolean(
    (relation?.roleIn === 'teacher' || classData?.teacherId === user?.id) && user,
  );

  return (
    <ForumDetailClient
      initialForum={forumDetail}
      classId={id}
      isTeacher={isTeacher}
      currentUser={user}
    />
  );
}
