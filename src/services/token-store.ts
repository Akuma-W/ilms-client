let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
  localStorage.setItem('accessToken', accessToken);
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
  localStorage.removeItem('accessToken');
}
