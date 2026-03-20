import { apiClient } from "../api-client";

export const getMyEnrollments = async () => {
  const res = await apiClient("/enrollments/me");
  const result = await res.json();

  return result;
}