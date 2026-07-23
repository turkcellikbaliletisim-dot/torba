import { NextResponse } from 'next/server';
import { VerifyOtpSchema } from '@/lib/validation/schemas';
import { signSessionToken } from '@/lib/auth/jwt';
import { verifyOtpCode } from '@/lib/auth/otp-store';
import { query } from '@/lib/db';
import { checkRateLimitAsync } from '@/lib/middleware/rate-limit';

export async function POST(request: Request) {
  try {
    // 1. Rate Limit Check
    const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = await checkRateLimitAsync(`verify-otp:${clientIp}`, 10, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Çok fazla hatalı deneme yapıldı. Lütfen biraz bekleyin.' },
        { status: 429 }
      );
    }

    const rawBody = await request.json();

    // 2. Zod Input Schema Validation
    const validation = VerifyOtpSchema.safeParse(rawBody);
    if (!validation.success) {
      const errorMsg = validation.error.issues?.[0]?.message || 'Geçersiz kod veya telefon.';
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    const { phone, code } = validation.data;

    // 3. Strict HMAC-SHA256 OTP Hash Verification
    const otpVerification = await verifyOtpCode(phone, code);
    if (!otpVerification.isValid) {
      return NextResponse.json(
        { success: false, error: otpVerification.error },
        { status: 401 }
      );
    }

    // 4. Real PostgreSQL User Lookup & Role Query
    let userId = `u-${phone}`;
    let fullName = 'Kullanıcı';
    let role: 'CUSTOMER' | 'ADMIN' | 'MERCHANT' | 'CORPORATE_HR' = 'CUSTOMER';

    try {
      const userResult = await query(
        `SELECT u.id, u.full_name, u.phone, r.name as role_name
         FROM users u
         LEFT JOIN roles r ON u.role_id = r.id
         WHERE u.phone = $1 LIMIT 1`,
        [phone]
      );

      if (userResult && userResult.rows.length > 0) {
        userId = userResult.rows[0].id;
        fullName = userResult.rows[0].full_name;
        if (userResult.rows[0].role_name) {
          role = userResult.rows[0].role_name as any;
        }
      } else {
        // User not found -> Auto-register in PostgreSQL
        const newUserId = `u-${Date.now()}`;
        await query(
          'INSERT INTO users (id, full_name, phone, status) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
          [newUserId, 'Yeni Kullanıcı', phone, 'ACTIVE']
        );
        userId = newUserId;

        // Auto-create initial wallets in PostgreSQL
        await query(
          `INSERT INTO wallets (id, owner_type, owner_id, wallet_type, currency) 
           VALUES ($1, 'USER', $2, 'MEAL', 'TRY'), ($3, 'USER', $2, 'TOIN', 'TOIN') 
           ON CONFLICT DO NOTHING`,
          [`w-meal-${userId}`, userId, `w-toin-${userId}`]
        );
      }
    } catch (dbErr: any) {
      // In production, DB failure must abort authentication cleanly
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { success: false, error: 'Veritabanı bağlantı hatası nedeniyle oturum açılamadı.' },
          { status: 503 }
        );
      }
    }

    // 5. Generate Real JOSE HS256 JWT Token with User's DB Role
    const token = await signSessionToken({
      userId,
      phone,
      fullName,
      role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Giriş başarılı.',
      data: {
        token,
        user: {
          id: userId,
          phone,
          fullName,
          role,
          tier: 'SILVER',
          toinBalance: 1250,
          mealBalanceMinor: 450000,
        },
      },
    });

    // Set secure HTTP-only Cookie for Session
    response.cookies.set('torbaa_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 3600, // 8 hours
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
