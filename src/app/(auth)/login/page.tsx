import { Suspense } from 'react';
import { Metadata } from 'next';
import LoginClient from './login-client';

export const metadata: Metadata = {
  title: 'Đăng nhập',
};

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginClient />
    </Suspense>
  );
}
