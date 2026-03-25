'use client';

import { ACCESS_TOKEN_KEY } from '@/lib/token-store';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function CallbackClient() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
      router.push('/classes');
    }
  }, [params, router]);

  return <p>Logging in...</p>;
}
