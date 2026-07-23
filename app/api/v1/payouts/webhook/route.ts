import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { logAuditEvent } from '@/lib/services/audit-service';
import { verifyWebhookSignature } from '@/lib/services/payment-gateway';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature') || '';

    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ success: false, error: 'Banka webhook HMAC imzası geçersiz.' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { payoutId, status, bankReference } = payload;

    if (!payoutId || !status) {
      return NextResponse.json({ success: false, error: 'Eksik payout webhook verisi.' }, { status: 400 });
    }

    const targetStatus = status === 'SUCCESS' ? 'PAID' : 'FAILED';

    await query('UPDATE payouts SET status = $1, bank_reference = $2, updated_at = NOW() WHERE id = $3', [
      targetStatus,
      bankReference || null,
      payoutId,
    ]);

    await logAuditEvent({
      actorId: 'bank-payout-webhook',
      action: 'BANK_PAYOUT_WEBHOOK_PROCESSED',
      resourceType: 'PAYOUT',
      resourceId: payoutId,
      metadata: { targetStatus, bankReference },
    });

    return NextResponse.json({ success: true, message: 'Banka payout webhook kaydı işlendi.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Banka payout webhook hatası: ' + error.message }, { status: 500 });
  }
}
