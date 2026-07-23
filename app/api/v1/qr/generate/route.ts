import { NextResponse } from 'next/server';
import { generateSignedQrToken } from '@/lib/services/qr-token-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, branchId, amountMinor } = body;

    const payload = {
      intentId: `intent-${Date.now()}`,
      userId: userId || 'user-mock-123',
      branchId: branchId || 'branch-mock-456',
      amountMinor: BigInt(amountMinor || 45000), // Default ₺450,00
    };

    const { qrToken, expiresAt } = generateSignedQrToken(payload, 60);

    return NextResponse.json({
      success: true,
      data: {
        qrToken,
        expiresAt,
        ttlSeconds: 60,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'QR token üretilemedi.' },
      { status: 500 }
    );
  }
}
