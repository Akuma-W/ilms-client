import { apiClient } from "../api-client"

export const getAllClasses = async () => {
  const res = await apiClient("/classes");
  const result = await res.json();

  return result;
}