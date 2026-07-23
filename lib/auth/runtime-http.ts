import { NextResponse } from 'next/server';
import { tryGetAuthRuntime, type AuthRuntime } from '@/lib/auth/runtime';

export type AuthRuntimeResult =
  | { runtime: AuthRuntime; response?: never }
  | { runtime?: never; response: NextResponse };

export function resolveAuthRuntime(): AuthRuntimeResult {
  const runtime = tryGetAuthRuntime();
  if (runtime) return { runtime };

  return {
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
