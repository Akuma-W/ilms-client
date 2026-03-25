import { userService } from '@/services/user.service';

export async function getUser() {
  const res = await userService.getProfile();

  if (!res?.success) return null;

  return res.data;
}
