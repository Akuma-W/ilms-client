// Environment variables and API URLs
export const CLIENT_API_URL =
  process.env.NEXT_PUBLIC_CLIENT_API_URL || 'http://localhost:5000/api/v1';

export const SERVER_API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_SERVER_API_URL ||
  'http://localhost:5000/api/v1';

export const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '';
