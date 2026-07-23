import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, UserSessionPayload } from './jwt';

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
