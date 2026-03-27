import { Metadata } from "next";
import RegisterClient from "./register-client";

export const metadata: Metadata = {
  title: 'Đăng nhập',
};

export default function Register() {
  return <RegisterClient />;
}
