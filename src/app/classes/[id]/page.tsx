import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Danh sách lớp',
};

interface ClassDetailProps {
  params: Promise<{ id: string }>;
}

export default async function ClassDetail({ params }: ClassDetailProps) {
  const { id: classId } = await params;
  const isJoined = classId === '1';

  if (isJoined) {
    redirect(`/classes/${classId}/overview`);
  } else {
    redirect(`/classes/${classId}/info`);
  }
}
