import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/services/payment-gateway';
import { logAuditEvent } from '@/lib/services/audit-service';
import { getDbPool } from '@/lib/db';
import { defaultPaymentProvider } from '@/lib/services/payment-provider-adapter';

export async function POST(request: NextRequest) {
  const pool = getDbPool();
  let client;

  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-payment-signature') || '';

    // Enforce HMAC signature check in production or if ALLOW_UNSIGNED_WEBHOOKS is false
    const allowUnsigned = process.env.ALLOW_UNSIGNED_WEBHOOKS === 'true';
    const isValidSignature = allowUnsigned || verifyWebhookSignature(rawBody, signature);

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz Webhook İmzası (HMAC Verification Failed).' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);
    const { providerPaymentId, status, eventId } = payload;

    if (!providerPaymentId) {
      return NextResponse.json(
        { success: false, error: 'Eksik Provider Payment ID.' },
        { status: 400 }
      );
    }

    // Acquire PostgreSQL DB Client for Transaction
    client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Webhook Replay Protection check in DB (Section 7.2)
      if (eventId) {
        const replayCheck = await client.query(
          'SELECT event_id FROM webhook_events WHERE event_id = $1 LIMIT 1 FOR UPDATE',
          [eventId]
        );
        if (replayCheck.rows.length > 0) {
          await client.query('COMMIT');
          return NextResponse.json({ success: true, message: 'Webhook zaten önceden işlendi (Replay Ignored).' }, { status: 200 });
        }
      }

      // 2. Fetch and Row Lock Local Payment Record (Section 3.1 & 3.2 FOR UPDATE)
      const paymentRes = await client.query(
        `SELECT id, merchant_id, user_id, amount_minor, currency, status 
         FROM payments 
         WHERE provider_payment_id = $1 OR id = $1 
         FOR UPDATE`,
        [providerPaymentId]
      );

      if (paymentRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { success: false, error: 'Yerel veritabanında ödeme kaydı bulunamadı.' },
          { status: 404 }
        );
      }

      const dbPayment = paymentRes.rows[0];

      // Validate payment amount & currency matches local DB record (Section 3.2)
      if (payload.amountMinor && BigInt(payload.amountMinor) !== BigInt(dbPayment.amount_minor)) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { success: false, error: 'Tutar uyuşmazlığı detected (Fraud Guard).' },
          { status: 422 }
        );
      }

      // Check if already completed
      if (dbPayment.status === 'COMPLETED') {
        await client.query('COMMIT');
        return NextResponse.json({ success: true, message: 'Ödeme zaten önceden tamamlanmıştı.' }, { status: 200 });
      }

      // 3. Single Atomic Transaction: Update Payment Status to COMPLETED
      await client.query(
        'UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2',
        ['COMPLETED', dbPayment.id]
      );

      // 4. Calculate Net Settlement (Gross - 3% Commission = Net Payout)
      const settlement = defaultPaymentProvider.calculateSettlement(BigInt(dbPayment.amount_minor), 300);

      // 5. Insert Balanced Double-Entry Ledger Transaction & Entries (DEBIT = CREDIT)
      const txnId = `txn-wh-${dbPayment.id}`;
      await client.query(
        `INSERT INTO ledger_transactions (id, idempotency_key, description, created_at)
         VALUES ($1, $2, 'Sanal POS Webhook Tahsilat Hakedis', NOW())
         ON CONFLICT (id) DO NOTHING`,
        [txnId, `wh-${dbPayment.id}`]
      );

      // Entry 1: Debit User Wallet (Gross Amount)
      // Entry 2: Credit Merchant Payout Wallet (Net Payout)
      // Entry 3: Credit Platform Fee Wallet (Commission)
      await client.query(
        `INSERT INTO ledger_entries (id, transaction_id, wallet_id, direction, amount_minor, created_at)
         VALUES 
           ($1, $2, $3, 'DEBIT', $4, NOW()),
           ($5, $2, $6, 'CREDIT', $7, NOW()),
           ($8, $2, 'w-platform-fees', 'CREDIT', $9, NOW())
         ON CONFLICT DO NOTHING`,
        [
          `entry-user-dr-${txnId}`,
          txnId,
          `w-user-${dbPayment.user_id}`,
          dbPayment.amount_minor,

          `entry-merch-cr-${txnId}`,
          `w-merchant-${dbPayment.merchant_id}`,
          settlement.netPayoutMinor.toString(),

          `entry-fee-cr-${txnId}`,
          settlement.commissionAmountMinor.toString(),
        ]
      );

      // 6. Log Webhook Event for Replay Protection
      if (eventId) {
        await client.query(
          `INSERT INTO webhook_events (event_id, provider, payload_hash, status, created_at)
           VALUES ($1, 'CRAFTGATE', $2, 'PROCESSED', NOW())
           ON CONFLICT DO NOTHING`,
          [eventId, `hash-${Date.now()}`]
        );
      }

      await client.query('COMMIT');
    } catch (dbTxnErr) {
      if (client) await client.query('ROLLBACK');
      throw dbTxnErr;
    } finally {
      if (client) client.release();
    }

    // 7. Non-blocking Audit Logging
    await logAuditEvent({
      actorId: 'payment-gateway',
      action: 'WEBHOOK_PAYMENT_SETTLED_ATOMIC',
      resourceType: 'PAYMENT',
      resourceId: providerPaymentId,
      metadata: payload,
    });

    return NextResponse.json({
      success: true,
      message: 'Webhook tek PostgreSQL transaction içinde atomik olarak işlendi.',
    });
  } catch (error: any) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (e) {}
      client.release();
    }

    return NextResponse.json(
      { success: false, error: 'Webhook işleme hatası: ' + (error.message || 'Bilinmeyen hata') },
      { status: 500 }
    );
  }
}
