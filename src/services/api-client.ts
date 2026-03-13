import { refreshToken } from "./auth.service";

let accessToken: string | null = null;

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const setAccessToken = (token: string) => {
  accessToken = token;
}

export const apiClient = async (
  url: string,
  options: RequestInit = {}
) => {
  const res = await fetch(
    `${API_URL}${url}`,
    {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    }
  );

  if (res.status === 401) {
    const newToken = await refreshToken();

    if (!newToken) {
      window.location.href = "/login";
      throw new Error("Unauthorized");
    };

    accessToken = newToken;

    return fetch(
      `${API_URL}${url}`,
      {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  }

  return res;
}
