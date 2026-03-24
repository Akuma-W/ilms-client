import { authService } from "./auth/auth.service";
import { getAccessToken } from "./token-store";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

let refreshPromise: Promise<string | null> | null = null;

export const apiClient = async (
  url: string,
  options: RequestInit & { _retry?: boolean } = {},
  cookie?: string,
) => {
  const token = getAccessToken();
  console.log(token);

  try {
    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      // credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  if (res.status !== 401 || options._retry) {
    return res;
  }

    // avoid multiple refresh request at the same time
    if (!refreshPromise) {
      refreshPromise = authService.refresh();
    }
    const newToken = await refreshPromise;
    refreshPromise = null;

    if (!newToken) {
      window.location.href = "/login";
      return res;
    }

    // retry request
    return fetch(`${API_URL}${url}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${newToken}`,
      },
    });
  } catch (error) {
    throw new Error(`Không thể kết nối tới server: ${error}`);
  }
};
