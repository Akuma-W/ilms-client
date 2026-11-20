import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Học trực tuyến | Interactive LMS',
  description: 'Danh sách và tham gia các buổi học trực tuyến',
};

export default function MeetingsPage() {
  redirect('/classes');
}
