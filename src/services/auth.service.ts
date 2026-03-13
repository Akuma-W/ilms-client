import { LoginDto } from "@/types/auth.type";
import { API_URL, apiClient } from "./api-client";

export const login = async (data: LoginDto) => {
  const res = await apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.json();
};

export const refreshToken = async () => {
  const res = await fetch(
    `${API_URL}/auth/refresh`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!res.ok) return null;

  const data = await res.json();

  localStorage.setItem('accessToken', data.accessToken);

  return res.json();
};

export const logout = async () => {
  await apiClient("/auth/logout", {
    method: "POST",
  });
};
