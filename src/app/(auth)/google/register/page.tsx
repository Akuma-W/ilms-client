import { Metadata } from 'next';
import GoogleRegisterClient from './google-register-client';

export const metadata: Metadata = {
  title: 'Đăng ký với Google',
};

export default function GoogleRegister() {
  return <GoogleRegisterClient />;
}
