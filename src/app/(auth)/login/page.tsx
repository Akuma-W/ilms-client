import { Metadata } from 'next';
import LoginClient from './login-client';

export const metadata: Metadata = {
  title: 'Đăng nhập',
};

export default function Login() {
  return (
    <LoginClient />
  );
}
