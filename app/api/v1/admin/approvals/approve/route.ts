import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/guard';
import { approveBySecondAdmin } from '@/lib/services/approval-service';
import { executeRefundDomainLogic } from '@/lib/services/refund-service';
import { executeBankPayout } from '@/lib/services/payout-service';

export async function POST(request: NextRequest) {
  try {
    const auth = await requirePermission(request, 'refund.approve');
    if (!auth.isAuthenticated || !auth.user) {
      return auth.errorResponse || NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const { approvalId } = await request.json();
    if (!approvalId) {
      return NextResponse.json({ success: false, error: 'approvalId parametresi zorunludur.' }, { status: 400 });
    }

    // 1. Grant 2nd admin approval in approval_records table
    const result = await approveBySecondAdmin(approvalId, auth.user.userId);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    const record = result.approvalRecord;

    // 2. Execution Pipeline for HIGH_VALUE_REFUND
    if (record?.actionType === 'HIGH_VALUE_REFUND' && record.payload) {
      const payload = record.payload;
      const refundResult = await executeRefundDomainLogic({
        paymentId: payload.paymentId,
        refundAmountMinor: BigInt(payload.refundAmountMinor),
        reason: payload.reason || '2. Admin Onaylı Yüksek Tutarlı İade',
        idempotencyKey: payload.idempotencyKey,
        requestedByUserId: record.firstApproverId,
        requestedByUserRole: 'ADMIN',
        bypassApprovalCheck: true,
      });

      if (!refundResult.success) {
        return NextResponse.json(
          { success: false, error: `Çift Onay Verildi Ancak İade Yürütme Başarısız Oldu: ${refundResult.errorMessage}` },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Çift onay tamamlandı ve yüksek tutarlı iade yürütüldü.',
        data: { approvalRecord: record, executionResult: refundResult },
      });
    }

    // 3. Execution Pipeline for SETTLEMENT_PAYOUT (Section 11)
    if (record?.actionType === 'SETTLEMENT_PAYOUT' && record.payload) {
      const payload = record.payload;
      const payoutResult = await executeBankPayout({
        settlementBatchId: payload.settlementBatchId,
        merchantId: payload.merchantId,
        iban: payload.iban,
        accountHolderName: payload.accountHolderName || 'Esnaf İşletmesi Ltd.',
        amountMinor: BigInt(payload.amountMinor),
        requestedByUserId: record.firstApproverId,
        bypassApprovalCheck: true,
      });

      if (!payoutResult.success) {
        return NextResponse.json(
          { success: false, error: `Çift Onay Verildi Ancak Banka Payout Yürütme Başarısız Oldu: ${payoutResult.errorMessage}` },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Çift onay tamamlandı ve hakediş banka transferi yürütüldü.',
        data: { approvalRecord: record, executionResult: payoutResult },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'İkinci admin onayı verildi.',
      data: { approvalRecord: record },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Onay verilemedi: ' + error.message }, { status: 500 });
  }
}
