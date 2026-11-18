import { Metadata } from 'next';
import { AdminUsersClient } from '@/app/admin/users/admin-users-client';

export const metadata: Metadata = {
  title: 'Quản trị Người dùng | Admin',
  description: 'Quản trị toàn bộ tài khoản người dùng hệ thống KEIVerse',
};

export default function AdminUsersPage() {
  return <AdminUsersClient />;
}
