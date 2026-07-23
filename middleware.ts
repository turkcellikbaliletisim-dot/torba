import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'torbaa_jwt_secure_secret_key_2026_prod_minimum_32_chars'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Unprotected / Public Auth endpoints
  if (
    pathname.startsWith('/api/v1/auth') ||
    pathname.startsWith('/api/v1/health') ||
    pathname.startsWith('/api/v1/mobile/merchants') ||
    pathname.startsWith('/api/v1/mobile/campaigns') ||
    pathname === '/mobile'
  ) {
    return NextResponse.next();
  }

  // Protected Routes
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/v1/admin');
  const isPanelRoute = pathname.startsWith('/panel') || pathname.startsWith('/api/v1/panel');
  const isCorporateRoute = pathname.startsWith('/corporate') || pathname.startsWith('/api/v1/corporate');
  const isProtectedMobileRoute = pathname.startsWith('/api/v1/mobile/wallet') || pathname.startsWith('/api/v1/qr');

  if (!isAdminRoute && !isPanelRoute && !isCorporateRoute && !isProtectedMobileRoute) {
    return NextResponse.next();
  }

  // Extract session token from Cookie or Auth Header
  const cookieToken = request.cookies.get('torbaa_session')?.value;
  const authHeader = request.headers.get('Authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const token = cookieToken || bearerToken;

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Oturum açmanız gerekmektedir. Token bulunamadı.' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/mobile', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY, { issuer: 'torbaa-auth' });
    const userRole = payload.role as string;

    if (isAdminRoute && userRole !== 'ADMIN') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, error: 'Erişim Engellendi: Admin yetkisi gereklidir.' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/mobile', request.url));
    }

    if (isPanelRoute && userRole !== 'MERCHANT' && userRole !== 'ADMIN') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, error: 'Erişim Engellendi: İşletme yetkisi gereklidir.' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/mobile', request.url));
    }

    if (isCorporateRoute && userRole !== 'CORPORATE_HR' && userRole !== 'ADMIN') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, error: 'Erişim Engellendi: Kurumsal İK yetkisi gereklidir.' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/mobile', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Geçersiz veya süresi dolmuş oturum tokenı.' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/mobile', request.url));
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/panel/:path*',
    '/corporate/:path*',
    '/api/v1/admin/:path*',
    '/api/v1/panel/:path*',
    '/api/v1/corporate/:path*',
    '/api/v1/mobile/wallet',
    '/api/v1/qr/:path*',
  ],
};
