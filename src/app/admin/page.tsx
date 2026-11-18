import { Metadata } from 'next';
import { AdminDashboardClient } from '@/app/admin/admin-dashboard-client';

export const metadata: Metadata = {
  title: 'Quản trị Hệ thống | Dashboard',
  description: 'Trung tâm điều hành và phân tích số liệu hệ thống KEIVerse',
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
