import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'torbaa_jwt_secure_secret_key_2026_prod_minimum_32_chars'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected Portal Rotes
  const isAdminRoute = pathname.startsWith('/admin');
  const isPanelRoute = pathname.startsWith('/panel');
  const isCorporateRoute = pathname.startsWith('/corporate');

  if (!isAdminRoute && !isPanelRoute && !isCorporateRoute) {
    return NextResponse.next();
  }

  // Extract session token from Cookie or Auth Header
  const cookieToken = request.cookies.get('torbaa_session')?.value;
  const authHeader = request.headers.get('Authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const token = cookieToken || bearerToken;

  if (!token) {
    // Development bypass hint or redirect to login
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/mobile', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY, { issuer: 'torbaa-auth' });
    const userRole = payload.role as string;

    if (isAdminRoute && userRole !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Erişim Engellendi: Admin yetkisi gereklidir.' }, { status: 403 });
    }

    if (isPanelRoute && userRole !== 'MERCHANT' && userRole !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Erişim Engellendi: İşletme yetkisi gereklidir.' }, { status: 403 });
    }

    if (isCorporateRoute && userRole !== 'CORPORATE_HR' && userRole !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Erişim Engellendi: Kurumsal İK yetkisi gereklidir.' }, { status: 403 });
    }

    return NextResponse.next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/mobile', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/panel/:path*', '/corporate/:path*'],
};
