import { Metadata } from 'next';
import { userServerService } from '@/features/user/services/user.server.service';
import { redirect } from 'next/navigation';
import { ProfileClient } from '@/app/(main)/profile/profile-client';
import { SITE_CONFIG } from '@/config';

export const metadata: Metadata = {
  title: `Hồ sơ cá nhân | ${SITE_CONFIG.name}`,
  description: 'Quản lý thông tin tài khoản và bảo mật cá nhân trên hệ thống KEIVerse.',
};

export default async function ProfilePage() {
  const user = await userServerService.getMe();

  if (!user) {
    redirect('/login');
  }

  return <ProfileClient initialUser={user} />;
}
