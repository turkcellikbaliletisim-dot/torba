import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, UserSessionPayload } from './jwt';
import { Permission, hasPermission } from './rbac';

export interface AuthGuardResult {
  isAuthenticated: boolean;
  user?: UserSessionPayload;
  errorResponse?: NextResponse;
}

/**
 * Enforces Authentication and Role-Based Access Control inside Next.js API Route Handlers.
 */
export async function requireAuth(
  request: NextRequest,
  allowedRoles?: ('ADMIN' | 'MERCHANT' | 'CORPORATE_HR' | 'CUSTOMER')[]
): Promise<AuthGuardResult> {
  const cookieToken = request.cookies.get('torbaa_session')?.value;
  const authHeader = request.headers.get('Authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const token = cookieToken || bearerToken;

  if (!token) {
    return {
      isAuthenticated: false,
      errorResponse: NextResponse.json(
        { success: false, error: 'Oturum açmanız gerekmektedir. Token bulunamadı.' },
        { status: 401 }
      ),
    };
  }

  const user = await verifySessionToken(token);

  if (!user) {
    return {
      isAuthenticated: false,
      errorResponse: NextResponse.json(
        { success: false, error: 'Geçersiz veya süresi dolmuş oturum tokenı.' },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return {
      isAuthenticated: false,
      errorResponse: NextResponse.json(
        { success: false, error: `Erişim Engellendi: Gerekli yetkiler (${allowedRoles.join(', ')}) mevcut değil.` },
        { status: 403 }
      ),
    };
  }

  return { isAuthenticated: true, user };
}

/**
 * Enforces Granular Permission-Based Access Control inside Next.js API Route Handlers.
 */
export async function requirePermission(
  request: NextRequest,
  permission: Permission
): Promise<AuthGuardResult> {
  const auth = await requireAuth(request);
  if (!auth.isAuthenticated || !auth.user) {
    return auth;
  }

  if (!hasPermission(auth.user.role, permission)) {
    return {
      isAuthenticated: false,
      errorResponse: NextResponse.json(
        { success: false, error: `Erişim Engellendi: '${permission}' izni yetkileriniz arasında bulunmuyor.` },
        { status: 403 }
      ),
    };
  }

  return auth;
}
