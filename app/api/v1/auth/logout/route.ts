import { resolveAuthRuntime } from '@/lib/auth/runtime-http';

export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
  const resolved = resolveAuthRuntime();
  if (!resolved.ok) return resolved.response;

  return resolved.runtime.handlers.logout(request);
}
