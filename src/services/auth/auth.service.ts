import { LoginDto } from "@/types/auth.type";
import { API_URL, apiClient } from "../api-client";
import { AUTH_ERROR_MAP } from "./auth.errors";

export const authService = {
  async login(payload: LoginDto) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: AUTH_ERROR_MAP[result.message] || 
        'Có lỗi xảy ra, vui lòng thử lại',
      };
    }

    return result;
  },

  async logout() {
    const res = await apiClient("/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    return res.json();
  },

  async getProfile() {
    const res = await apiClient("/users/me");

    return res.json();
  },

  async refresh() {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    return res.json();
  }
};
