import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Danh sách lớp',
};

interface ClassDetailProps {
  params: Promise<{ id: string }>;
}

export default async function ClassDetail({ params }: ClassDetailProps) {
  const { id } = await params;

  redirect(`/classes/${id}/info`);
}
