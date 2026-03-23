let accessToken: string | null = null;

export const ACCESS_TOKEN_KEY = 'access_token';

export const getAccessToken = (): string | null => {
  if (accessToken) return accessToken;

  if (typeof window === 'undefined') return null;

  // Save access token to localStorage
  accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  return accessToken;
};

export const setAccessToken = (token: string) => {
  accessToken = token;

  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};

export const clearAccessToken = () => {
  accessToken = null;

  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};
