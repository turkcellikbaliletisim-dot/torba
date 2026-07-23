import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { AuthSessionRepository } from '@/lib/auth/contracts';
import { SESSION_COOKIE_NAME } from '@/lib/auth/cookie';
import type { Permission } from '@/lib/auth/permissions';
import { hashSessionToken } from '@/lib/auth/session';

export interface AuthenticatedRequestContext {
  userId: string;
  sessionId: string;
  permissions: Permission[];
}

export async function authenticateRequest(
  request: NextRequest,
  sessions: AuthSessionRepository,
): Promise<AuthenticatedRequestContext | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await sessions.findByTokenHash(hashSessionToken(token));
  if (!session || session.revokedAt || session.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  return {
    userId: session.userId,
    sessionId: session.id,
    permissions: session.permissions,
  };
}

export function requirePermission(
  context: AuthenticatedRequestContext | null,
  permission: Permission,
): NextResponse | null {
  if (!context) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHENTICATED', message: 'Authentication is required.' } },
      { status: 401 },
    );
  }

  if (!context.permissions.includes(permission)) {
    return NextResponse.json(
      { success: false, error: { code: 'FORBIDDEN', message: 'Permission is required.' } },
      { status: 403 },
    );
  }

  return null;
}
