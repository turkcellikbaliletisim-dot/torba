import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { apiSuccess } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  const correlationId = randomUUID();

  return NextResponse.json(
    apiSuccess(
      {
        service: 'torbaa-api',
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: 'v1',
      },
      correlationId,
    ),
    {
      status: 200,
      headers: {
        'x-correlation-id': correlationId,
        'cache-control': 'no-store',
      },
    },
  );
}
