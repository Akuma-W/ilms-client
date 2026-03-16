import { apiClient } from "./api-client";

export const getProfile = async () => {
  const res = await apiClient("/users/me");

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  return res.json();
};
