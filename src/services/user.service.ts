import { apiClient } from './api-client';

export const getProfile = async () => {
  const res = await apiClient('/users/me');
  const result = await res.json();

  return result;
};
