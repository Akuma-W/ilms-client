import { Metadata } from 'next';
import { AdminSchoolsClient } from '@/app/admin/schools/admin-schools-client';

export const metadata: Metadata = {
  title: 'Quản lý Trường học | Admin',
  description: 'Quản trị mạng lưới các trường học và môn học hệ thống KEIVerse',
};

export default function AdminSchoolsPage() {
  return <AdminSchoolsClient />;
}
