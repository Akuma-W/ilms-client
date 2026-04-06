import { userService } from '@/features/user/services/user.service';
import { redirect } from 'next/navigation';

export default async function Profile() {
  const user = await userService.getMe();

  redirect(`/profile/${user?.id}`);
}
