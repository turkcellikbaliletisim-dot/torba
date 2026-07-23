import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/guard';
import { executeBankPayout } from '@/lib/services/payout-service';

export async function POST(request: NextRequest) {
  try {
    // Require settlement.approve permission for executing merchant bank payouts
    const auth = await requirePermission(request, 'settlement.approve');
    if (!auth.isAuthenticated || !auth.user) {
      return auth.errorResponse || NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const { settlementBatchId, merchantId, iban, accountHolderName, amountMinor } = await request.json();

    if (!settlementBatchId || !merchantId || !iban || !amountMinor) {
      return NextResponse.json({ success: false, error: 'Eksik veya geçersiz hakediş transfer parametreleri.' }, { status: 400 });
    }

    const result = await executeBankPayout({
      settlementBatchId,
      merchantId,
      iban,
      accountHolderName: accountHolderName || 'Esnaf İşletmesi Ltd.',
      amountMinor: BigInt(amountMinor),
      requestedByUserId: auth.user.userId,
    });

    if (!result.success && result.status === 'FAILED') {
      return NextResponse.json({ success: false, error: result.errorMessage }, { status: 422 });
    }

    if (result.status === 'PENDING_APPROVAL') {
      return NextResponse.json(
        {
          success: true,
          message: 'Yüksek tutarlı hakediş transfer talebi oluşturuldu. 2. bir yöneticinin onayı beklenmektedir (Çift Onay Prensibi).',
          data: { approvalId: result.approvalId, status: 'PENDING_APPROVAL' },
        },
        { status: 202 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Banka EFT/FAST hakediş transferi başarıyla gerçekleşti.',
      data: {
        payoutId: result.payoutId,
        bankReference: result.bankReference,
        status: result.status,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Banka transferi başlatılamadı: ' + error.message }, { status: 500 });
  }
}
