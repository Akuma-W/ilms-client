import { LoginDto } from "@/types/auth.type";
import { API_URL, apiClient } from "./api-client";
import { clearAccessToken, setAccessToken } from "@/lib/token-store";

export const login = async (dto: LoginDto) => {
  const res = await apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const result = await res.json();
  console.debug(result);

  setAccessToken(result.data.accessToken);

  return result.message;
};

export const refreshToken = async (): Promise<string | null> => {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      clearAccessToken();
      return null;
    };

    const { data } = await res.json();

    setAccessToken(data.accessToken);

    return data.accessToken;
  } catch {
    clearAccessToken();
    return null;
  }
};

export const logout = async () => {
  try {
    await apiClient("/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } finally {
    clearAccessToken();
  }
};
