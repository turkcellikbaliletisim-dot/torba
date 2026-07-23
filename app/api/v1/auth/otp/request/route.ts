import { getAuthRuntime } from '@/lib/auth/runtime';

export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
  return getAuthRuntime().handlers.requestOtp(request);
}
