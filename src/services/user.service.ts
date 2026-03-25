import { apiClient } from "./api-client";

export const userService = {
  async getProfile() {
    const res = await apiClient("/users/me");
    const result = await res.json();

    return result;
  }
}
