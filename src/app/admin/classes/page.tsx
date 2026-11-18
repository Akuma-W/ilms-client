import { Metadata } from 'next';
import { AdminClassesClient } from '@/app/admin/classes/admin-classes-client';

export const metadata: Metadata = {
  title: 'Quản lý Lớp học | Admin',
  description: 'Quản trị danh sách các lớp học hệ thống KEIVerse',
};

export default function AdminClassesPage() {
  return <AdminClassesClient />;
}
