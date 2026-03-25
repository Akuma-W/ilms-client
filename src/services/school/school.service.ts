import { apiClient } from '../api-client';

export const getSchools = async () => {
  const res = await apiClient('/schools');
  const result = await res.json();

  return result;
};
