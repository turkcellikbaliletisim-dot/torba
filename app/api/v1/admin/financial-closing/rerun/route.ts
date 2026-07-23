import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/guard';
import { runFinancialDailyClosing } from '@/lib/services/daily-closing-service';
import { logAuditEvent } from '@/lib/services/audit-service';

export async function POST(request: NextRequest) {
  try {
    const auth = await requirePermission(request, 'settlement.run');
    if (!auth.isAuthenticated || !auth.user) {
      return auth.errorResponse || NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const { date } = await request.json();
    const closing = await runFinancialDailyClosing(date);

    await logAuditEvent({
      actorId: auth.user.userId,
      action: 'FINANCIAL_CLOSING_RERUN_EXECUTED',
      resourceType: 'FINANCIAL_CLOSING',
      resourceId: closing.businessDate,
      metadata: { isBalanced: closing.isBalanced, localGross: closing.localCompletedGrossMinor.toString() },
    });

    return NextResponse.json({
      success: true,
      message: `${closing.businessDate} tarihli finansal kapanış raporu yeniden hesaplandı ve kaydedildi.`,
      data: {
        businessDate: closing.businessDate,
        providerCapturedGrossMinor: closing.providerCapturedGrossMinor.toString(),
        localCompletedGrossMinor: closing.localCompletedGrossMinor.toString(),
        platformCommissionMinor: closing.platformCommissionMinor.toString(),
        merchantNetMinor: closing.merchantNetMinor.toString(),
        totalRefundedMinor: closing.totalRefundedMinor.toString(),
        eligibleSettlementNetMinor: closing.eligibleSettlementNetMinor.toString(),
        paidBankPayoutNetMinor: closing.paidBankPayoutNetMinor.toString(),
        isBalanced: closing.isBalanced,
        discrepancyMinor: closing.discrepancyMinor.toString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Finansal kapanış rerun başarısız: ' + error.message }, { status: 500 });
  }
}
