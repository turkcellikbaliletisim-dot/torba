import { NextResponse } from 'next/server';
import { verifyQrToken } from '@/lib/services/qr-token-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { qrToken } = body;

    if (!qrToken || typeof qrToken !== 'string') {
      return NextResponse.json(
        { success: false, error: 'QR token gereklidir.' },
        { status: 400 }
      );
    }

    const verification = verifyQrToken(qrToken);

    if (!verification.isValid) {
      return NextResponse.json(
        { success: false, error: verification.error },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'QR Kod başarıyla doğrulandı.',
      data: {
        payload: {
          intentId: verification.payload?.intentId,
          userId: verification.payload?.userId,
          branchId: verification.payload?.branchId,
          amountMinor: verification.payload?.amountMinor.toString(),
          expiresAtMs: verification.payload?.expiresAtMs,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'QR doğrulama sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
}
