import { Metadata } from 'next';
import RegisterClient from './register-client';

export const metadata: Metadata = {
  title: 'Đăng ký tài khoản',
};

export default function Register() {
  return <RegisterClient />;
}
