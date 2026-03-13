import { apiClient } from "./api-client";

export const getProfile = async () => {
  const res = await apiClient("/users/me");

  return res.json();
};
