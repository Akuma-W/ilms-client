import { GoogleRegisterDto } from "@/types/auth";

export const authService = {
  async registerGooogle(dto: GoogleRegisterDto) {
    await fetch('/api/auth/google/register')
  },
  async logout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  },
};
