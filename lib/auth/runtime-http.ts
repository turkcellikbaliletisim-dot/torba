import { NextResponse } from 'next/server';
import { tryGetAuthRuntime, type AuthRuntime } from '@/lib/auth/runtime';

export type AuthRuntimeResult =
  | { ok: true; runtime: AuthRuntime }
  | { ok: false; response: NextResponse };

export function resolveAuthRuntime(): AuthRuntimeResult {
  const runtime = tryGetAuthRuntime();
  if (runtime) return { ok: true, runtime };

  return {
    ok: false,
    response: NextResponse.json(
      {
        success: false,
        error: {
          code: 'AUTH_NOT_CONFIGURED',
          message: 'Authentication service is temporarily unavailable.',
        },
      },
      { status: 503 },
    ),
  };
}
