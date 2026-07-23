import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/guard';
import { runFinancialDailyClosing } from '@/lib/services/daily-closing-service';

export async function GET(request: NextRequest) {
  try {
    const auth = await requirePermission(request, 'settlement.run');
    if (!auth.isAuthenticated || !auth.user) {
      return auth.errorResponse || NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || undefined;

    const closing = await runFinancialDailyClosing(date);

    return NextResponse.json({
      success: true,
      data: {
        businessDate: closing.businessDate,
        providerTotalMinor: closing.providerTotalMinor.toString(),
        localPaymentsTotalMinor: closing.localPaymentsTotalMinor.toString(),
        ledgerTotalMinor: closing.ledgerTotalMinor.toString(),
        settlementTotalMinor: closing.settlementTotalMinor.toString(),
        bankPayoutTotalMinor: closing.bankPayoutTotalMinor.toString(),
        isBalanced: closing.isBalanced,
        discrepancyMinor: closing.discrepancyMinor.toString(),
        equationFormula: 'Provider Total = Local Payments Total = Ledger Total = Settlement Total',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Günlük finansal kapanış raporu alınamadı: ' + error.message },
      { status: 500 }
    );
  }
}
