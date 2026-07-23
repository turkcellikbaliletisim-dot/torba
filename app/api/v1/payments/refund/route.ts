import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/guard';
import { executeRefundDomainLogic } from '@/lib/services/refund-service';

export async function POST(request: NextRequest) {
  try {
    // 1. Enforce Granular Permission Guard (refund.create)
    const auth = await requirePermission(request, 'refund.create');
    if (!auth.isAuthenticated || !auth.user) {
      return auth.errorResponse || NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const rawBody = await request.json();
    const { paymentId, refundAmountMinor, reason, idempotencyKey } = rawBody;

    if (!paymentId || !refundAmountMinor || BigInt(refundAmountMinor) <= 0n) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz ödeme ID veya iade tutarı.' },
        { status: 400 }
      );
    }

    // 2. Execute Unified Refund Domain Logic
    const refundResult = await executeRefundDomainLogic({
      paymentId,
      refundAmountMinor: BigInt(refundAmountMinor),
      reason,
      idempotencyKey,
      requestedByUserId: auth.user.userId,
      requestedByUserRole: auth.user.role,
      requestedByMerchantId: auth.user.merchantId,
      bypassApprovalCheck: false,
    });

    if (!refundResult.success) {
      const statusCode = refundResult.errorCode === '409_CONFLICT' ? 409 : refundResult.errorCode === 'FORBIDDEN' ? 403 : 422;
      return NextResponse.json({ success: false, error: refundResult.errorMessage }, { status: statusCode });
    }

    if (refundResult.status === 'PENDING_SECOND_APPROVAL') {
      return NextResponse.json(
        {
          success: true,
          message: 'Yüksek tutarlı iade talebi oluşturuldu. İşlemin tamamlanması için 2. bir yöneticinin onayı gerekmektedir (Çift Onay Prensibi).',
          data: { approvalId: refundResult.approvalId, status: 'PENDING_SECOND_APPROVAL' },
        },
        { status: 202 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'İade işlemi ve komisyon ters ledger kaydı başarıyla gerçekleşti.',
      data: {
        refundId: refundResult.refundId,
        status: refundResult.status,
        refundAmountMinor: refundResult.refundAmountMinor?.toString(),
        totalRefundedAfter: refundResult.totalRefundedAfter?.toString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'İade işlemi hatası: ' + error.message }, { status: 500 });
  }
}
