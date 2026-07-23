import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'torbaa_jwt_secure_secret_key_2026_prod_minimum_32_chars'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Unprotected / Public Auth & Demo UI pages
  if (
    pathname.startsWith('/api/v1/auth') ||
    pathname.startsWith('/api/v1/health') ||
    pathname.startsWith('/api/v1/mobile/merchants') ||
    pathname.startsWith('/api/v1/mobile/campaigns') ||
    pathname.startsWith('/api/v1/payments/webhook') ||
    pathname.startsWith('/api/v1/payouts/webhook') ||
    pathname === '/' ||
    pathname.startsWith('/mobile') ||
    // Allow UI pages to render in demo mode for user inspection
    pathname === '/admin' ||
    pathname === '/panel' ||
    pathname === '/corporate'
  ) {
    return NextResponse.next();
  }

  // 2. Protected API Routes
  const isAdminApi = pathname.startsWith('/api/v1/admin');
  const isPanelApi = pathname.startsWith('/api/v1/panel');
  const isCorporateApi = pathname.startsWith('/api/v1/corporate');
  const isProtectedPaymentApi = pathname.startsWith('/api/v1/payments/intent');
  const isProtectedMobileApi = pathname.startsWith('/api/v1/mobile/wallet') || pathname.startsWith('/api/v1/qr');

  if (!isAdminApi && !isPanelApi && !isCorporateApi && !isProtectedPaymentApi && !isProtectedMobileApi) {
    return NextResponse.next();
  }

  // Extract session token from Cookie or Auth Header
  const cookieToken = request.cookies.get('torbaa_session')?.value;
  const authHeader = request.headers.get('Authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const token = cookieToken || bearerToken;

  if (!token) {
    return NextResponse.json({ success: false, error: 'Oturum açmanız gerekmektedir. Token bulunamadı.' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY, { issuer: 'torbaa-auth' });
    const userRole = payload.role as string;

    if (isAdminApi && userRole !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Erişim Engellendi: Admin yetkisi gereklidir.' }, { status: 403 });
    }

    if (isPanelApi && userRole !== 'MERCHANT' && userRole !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Erişim Engellendi: İşletme yetkisi gereklidir.' }, { status: 403 });
    }

    if (isCorporateApi && userRole !== 'CORPORATE_HR' && userRole !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Erişim Engellendi: Kurumsal İK yetkisi gereklidir.' }, { status: 403 });
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Geçersiz veya süresi dolmuş oturum tokenı.' }, { status: 401 });
  }
}

export const config = {
  matcher: [
    '/api/v1/admin/:path*',
    '/api/v1/panel/:path*',
    '/api/v1/corporate/:path*',
    '/api/v1/payments/intent',
    '/api/v1/mobile/wallet',
    '/api/v1/qr/:path*',
  ],
};
