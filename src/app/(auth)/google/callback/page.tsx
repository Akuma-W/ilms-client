'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function GoogleCallback() {
  const router = useRouter();
  const { mutateUser } = useCurrentUser();

  useEffect(() => {
    // When BE redirect to here, fetch user
    mutateUser().then(() => {
      router.replace('/classes');
    });
  }, [router, mutateUser]);

  return <div>Logging in...</div>;
}
