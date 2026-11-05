import { NextResponse } from 'next/server';
import { SERVER_API_URL } from '@/config';

/**
 * Health check proxy endpoint executing on Next.js server.
 * Probes the NestJS backend /health/live endpoint with a short timeout.
 */
export async function GET() {
  const backendHealthUrl = `${SERVER_API_URL}/health/live`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(backendHealthUrl, {
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      return NextResponse.json({ online: true, statusCode: res.status });
    }

    return NextResponse.json(
      { online: false, statusCode: res.status, message: 'Backend returned non-200' },
      { status: 503 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        online: false,
        error: error instanceof Error ? error.message : 'ECONNREFUSED',
      },
      { status: 503 },
    );
  }
}
