import { NextResponse } from 'next/server';
import { SendOtpSchema } from '@/lib/validation/schemas';
import { sendSms } from '@/lib/services/sms-service';

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();

    // 1. Zod Input Schema Validation
    const validation = SendOtpSchema.safeParse(rawBody);
    if (!validation.success) {
      const errorMsg = validation.error.issues?.[0]?.message || 'Geçersiz telefon numarası.';
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    const { phone } = validation.data;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Real SMS Gateway Transmission
    const smsResult = await sendSms({
      toPhone: phone,
      messageText: `TORBAA Doğrulama Kodunuz: ${otpCode}. Bu kodu kimseden paylaşmayın. (B002)`,
    });

    if (!smsResult.success) {
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
