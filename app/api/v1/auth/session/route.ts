import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth/guard';
import { resolveAuthRuntime } from '@/lib/auth/runtime-http';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<Response> {
  const resolved = resolveAuthRuntime();
  if (!resolved.ok) return resolved.response;

  const context = await authenticateRequest(request, resolved.runtime.sessions);

  if (!context) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Authentication is required.',
        },
      },
      { status: 401 },
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      userId: context.userId,
      sessionId: context.sessionId,
      permissions: context.permissions,
    },
  });
}
