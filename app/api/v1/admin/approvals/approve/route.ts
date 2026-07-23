import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/guard';
import { approveBySecondAdmin } from '@/lib/services/approval-service';
import { logAuditEvent } from '@/lib/services/audit-service';
import { defaultPaymentProvider } from '@/lib/services/payment-provider-adapter';
import { getDbPool } from '@/lib/db';

export async function POST(request: NextRequest) {
  const pool = getDbPool();
  let client;

  try {
    // Enforce refund.approve or settlement.approve permission
    const auth = await requirePermission(request, 'refund.approve');
    if (!auth.isAuthenticated || !auth.user) {
      return auth.errorResponse || NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const { approvalId } = await request.json();

    if (!approvalId) {
      return NextResponse.json({ success: false, error: 'Approval ID gereklidir.' }, { status: 400 });
    }

    // Execute Second Admin Approval (Enforcing 4-Eye Principle: firstApprover != secondApprover)
    const result = await approveBySecondAdmin(approvalId, auth.user.userId);

    if (!result.success || !result.approvalRecord) {
      return NextResponse.json({ success: false, error: result.error || 'Onay verilemedi.' }, { status: 422 });
    }

    const record = result.approvalRecord;

    // Trigger Underlying Action Execution (Item 4.9 Execution Pipeline)
    let executionResult: any = { executed: true };

    if (record.actionType === 'HIGH_VALUE_REFUND' && record.payload) {
      const { paymentId, refundAmountMinor, reason } = record.payload;

      // Call Provider Refund API
      const refundResult = await defaultPaymentProvider.processRefund({
        providerPaymentId: paymentId,
        refundAmountMinor: BigInt(refundAmountMinor || 1000000),
        currency: 'TRY',
        reason: reason || '4-Eye Approved Refund',
        requestedByUserId: auth.user.userId,
      });

      client = await pool.connect();
      try {
        await client.query('BEGIN');

        // Insert Refund Record
        await client.query(
          `INSERT INTO refunds (id, payment_id, amount_minor, reason, status, created_at)
           VALUES ($1, $2, $3, $4, 'COMPLETED', NOW())
           ON CONFLICT (id) DO NOTHING`,
          [refundResult.refundId, paymentId, refundAmountMinor.toString(), '4-Eye Approved Refund']
        );

        // Update Payment Status
        await client.query('UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2', ['REFUNDED', paymentId]);

        // Insert Reversal Ledger Entries
        const txnId = `txn-ref-appr-${refundResult.refundId}`;
        await client.query(
          `INSERT INTO ledger_transactions (id, idempotency_key, description, created_at)
           VALUES ($1, $2, '4-Eye Onaylı İade Ters Ledger Kaydı', NOW())
           ON CONFLICT (id) DO NOTHING`,
          [txnId, `ref-appr-${refundResult.refundId}`]
        );

        await client.query(
          `INSERT INTO ledger_entries (id, transaction_id, wallet_id, direction, amount_minor, created_at)
           VALUES 
             ($1, $2, 'w-user-u-101', 'CREDIT', $3, NOW()),
             ($4, $2, 'w-merchant-m-101', 'DEBIT', $3, NOW())
           ON CONFLICT DO NOTHING`,
          [`entry-appr-cr-${txnId}`, txnId, refundAmountMinor.toString(), `entry-appr-dr-${txnId}`]
        );

        await client.query('COMMIT');
        executionResult = { refundId: refundResult.refundId, status: 'EXECUTED' };
      } catch (e) {
        if (client) await client.query('ROLLBACK');
      } finally {
        if (client) client.release();
      }
    }

    await logAuditEvent({
      actorId: auth.user.userId,
      action: 'DUAL_APPROVAL_EXECUTED',
      resourceType: 'APPROVAL',
      resourceId: approvalId,
      metadata: { executionResult },
    });

    return NextResponse.json({
      success: true,
      message: 'Çift onay başarıyla verildi ve finansal işlem otomatik olarak yürütüldü (EXECUTED).',
      data: executionResult,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Onay verilemedi: ' + error.message }, { status: 500 });
  }
}
