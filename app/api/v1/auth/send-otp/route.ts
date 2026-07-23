import { NextResponse } from 'next/server';
import { SendOtpSchema } from '@/lib/validation/schemas';
import { sendSms } from '@/lib/services/sms-service';
import { canSendOtp, storeOtp, deleteOtp, generateSecureOtpCode } from '@/lib/auth/otp-store';
import { checkRateLimitAsync } from '@/lib/middleware/rate-limit';

export async function POST(request: Request) {
  try {
    // 1. Sliding Window IP Rate Limit Check
    const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = await checkRateLimitAsync(`send-otp:${clientIp}`, 5, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Çok fazla OTP isteğinde bulunuldu. Lütfen ${rateLimit.resetSeconds} saniye bekleyin.` },
        { status: 429 }
      );
    }

    const rawBody = await request.json();

    // 2. Zod Input Schema Validation
    const validation = SendOtpSchema.safeParse(rawBody);
    if (!validation.success) {
      const errorMsg = validation.error.issues?.[0]?.message || 'Geçersiz telefon numarası.';
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    const { phone } = validation.data;

    // 3. Cooldown Check per Phone Number
    const cooldownCheck = await canSendOtp(phone, 60);
    if (!cooldownCheck.allowed) {
      return NextResponse.json(
        { success: false, error: `Bu numaraya yeni kod göndermek için ${cooldownCheck.remainingSeconds} saniye beklemelisiniz.` },
        { status: 429 }
      );
    }

    // 4. Generate Cryptographically Secure 6-digit OTP Code (crypto.randomInt)
    const otpCode = generateSecureOtpCode();

    // 5. Store HMAC-SHA256 Hashed OTP with 120s Expiration TTL
    await storeOtp(phone, otpCode, 120);

    // 6. Transmit SMS via Provider
    const smsResult = await sendSms({
      toPhone: phone,
      messageText: `TORBAA Doğrulama Kodunuz: ${otpCode}. Bu kodu kimseden paylaşmayın. (B002)`,
    });

    if (!smsResult.success) {
      // Clean up stored OTP on SMS transmission failure
      await deleteOtp(phone);
      return NextResponse.json(
        { success: false, error: smsResult.error || 'SMS gönderimi başarısız.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP doğrulama kodu başarıyla gönderildi.',
      data: {
        phone,
        expiresInSeconds: 120,
        provider: smsResult.provider,
        devCodeHint: process.env.NODE_ENV !== 'production' ? otpCode : undefined,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
