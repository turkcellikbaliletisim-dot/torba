import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/services/payment-gateway';
import { logAuditEvent } from '@/lib/services/audit-service';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-payment-signature') || '';

    // Development fallback or HMAC Verification
    const isValidSignature = process.env.NODE_ENV !== 'production' || verifyWebhookSignature(rawBody, signature);

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz Webhook İmzası (HMAC Failed).' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);

    // Audit Log Webhook Signal
    await logAuditEvent({
      actorId: 'payment-gateway',
      action: 'WEBHOOK_PAYMENT_SETTLED',
      resourceType: 'PAYMENT',
      resourceId: payload.paymentId || 'pay-unknown',
      metadata: payload,
    });

    return NextResponse.json({
      success: true,
      message: 'Webhook başarıyla işlendi ve hakediş güncellendi.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Webhook işleme hatası.' },
      { status: 500 }
    );
  }
}
