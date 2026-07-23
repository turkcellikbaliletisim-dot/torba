import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/guard';
import { approveBySecondAdmin } from '@/lib/services/approval-service';
import { logAuditEvent } from '@/lib/services/audit-service';
import { executeRefundDomainLogic } from '@/lib/services/refund-service';

export async function POST(request: NextRequest) {
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

    // Trigger Underlying Action Execution via Unified Refund Domain Logic (Item 4.2)
    let executionResult: any = { executed: true };

    if (record.actionType === 'HIGH_VALUE_REFUND' && record.payload) {
      const { paymentId, refundAmountMinor, reason, idempotencyKey } = record.payload;

      const refundExec = await executeRefundDomainLogic({
        paymentId,
        refundAmountMinor: BigInt(refundAmountMinor || 1000000),
        reason: reason || '4-Eye Approved Refund',
        idempotencyKey: idempotencyKey ? `appr-${idempotencyKey}` : undefined,
        requestedByUserId: auth.user.userId,
        requestedByUserRole: auth.user.role,
        bypassApprovalCheck: true, // Bypass 2nd approval check since 2nd approval is now granted!
      });

      if (!refundExec.success) {
        // Error propagation on execution failure (Item 4.6)
        return NextResponse.json(
          { success: false, error: 'Onay verildi ancak finansal iade yürütmesi başarısız oldu: ' + refundExec.errorMessage },
          { status: 500 }
        );
      }

      executionResult = { refundId: refundExec.refundId, status: refundExec.status };
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
