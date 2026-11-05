export const ROUTES = {
  PUBLIC: ['/', '/contact', '/tools'],
  AUTH: ['/login', '/register', '/google/callback', '/google/register'],
  PROTECTED: ['/classes', '/profile', '/quizzes', '/admin'],
  ADMIN: ['/admin'],
} as const;

/**
 * Routes that communicate with the NestJS backend and require active backend connectivity.
 */
export const BACKEND_REQUIRED_ROUTES: readonly string[] = [
  ...ROUTES.AUTH,
  ...ROUTES.PROTECTED,
  '/tools/assistant',
];
