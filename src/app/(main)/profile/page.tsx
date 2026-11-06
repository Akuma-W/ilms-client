import { userServerService } from '@/features/user/services/user.server.service';
import { redirect } from 'next/navigation';

export default async function Profile() {
  const user = await userServerService.getMe();

  redirect(`/profile/${user?.id}`);
}
