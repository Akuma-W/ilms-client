import { serverFetch } from '@/lib/api/server-fetcher';

export async function GET() {
  const res = await serverFetch('/users/me');

  const result = await res.json();

  if (!res.ok || !result.success) {
    return Response.json(
      { message: 'Unauthorized' },
      { status: 401 },
    );
  }

  return Response.json(result, {
    status: res.status,
  });
}
