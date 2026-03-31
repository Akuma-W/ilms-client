export const ROUTES = {
  PUBLIC: ['/', '/contact', '/tools'],
  AUTH: ['/login', '/register', '/google/callback', '/google/register'],
  PROTECTED: ['/classes', '/profile', '/quizzes', '/admin'],
  ADMIN: ['/admin'],
} as const;
