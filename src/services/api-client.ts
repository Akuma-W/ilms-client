import { authService } from "./auth/auth.service";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

let refreshPromise: Promise<string | null> | null = null;

export const apiClient = async (
  url: string,
  options: RequestInit = {},
  cookie?: string,
) => {
  try {
    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(cookie ? { Cookie: cookie } : {}),
      },
    });

    if (res.status !== 401) return res;

    // avoid multiple refresh request at the same time
    if (!refreshPromise) {
      refreshPromise = authService.refresh();
    }
    await refreshPromise;
    refreshPromise = null;

    // retry request
    return fetch(`${API_URL}${url}`, {
      ...options,
      credentials: "include",
    });
  } catch (error) {
    throw new Error(`Không thể kết nối tới server: ${error}`);
  }
};
