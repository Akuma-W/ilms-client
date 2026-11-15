import { Metadata } from 'next';
import { ForgotPasswordClient } from './forgot-password-client';

export const metadata: Metadata = {
  title: 'Khôi phục mật khẩu | KEIVerse',
  description: 'Khôi phục mật khẩu tài khoản học tập KEIVerse qua mã xác thực email',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
