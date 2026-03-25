import { Metadata } from "next";
import GoogleRegisterClient from "./register-client";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const metadata: Metadata = {
  title: 'Đăng ký với Google',
};

export default function GoogleRegister() {
  const { user } = useCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-galaxy-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleRegisterClient />
  )
}
