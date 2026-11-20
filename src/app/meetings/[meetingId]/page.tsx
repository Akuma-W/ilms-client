import type { Metadata } from 'next';
import { MeetingRoomClient } from '@/app/meetings/[meetingId]/meeting-room-client';

export const metadata: Metadata = {
  title: 'Phòng học trực tuyến | Interactive LMS',
  description: 'Phòng học trực tuyến',
};

interface MeetingProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export default async function Meeting({ params }: MeetingProps) {
  const { meetingId } = await params;
  return <MeetingRoomClient meetingId={meetingId} />;
}
