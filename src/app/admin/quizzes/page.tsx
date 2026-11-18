import { Metadata } from 'next';
import { AdminQuizzesClient } from '@/app/admin/quizzes/admin-quizzes-client';

export const metadata: Metadata = {
  title: 'Quản trị Đề thi & Khảo thí | Admin',
  description: 'Kiểm duyệt và quản trị đề thi khảo thí toàn hệ thống KEIVerse',
};

export default function AdminQuizzesPage() {
  return <AdminQuizzesClient />;
}
