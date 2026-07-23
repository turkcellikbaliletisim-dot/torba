import { NextResponse } from 'next/server';
import { createSettlementBatch } from '@/lib/services/settlement-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantId = searchParams.get('merchantId') || 'm-101';

    const batch = await createSettlementBatch(merchantId);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          todayGmvMinor: Number(batch.totalGrossMinor),
          todayGmvCurrency: 'TRY',
          pendingPayoutMinor: Number(batch.totalNetPayoutMinor),
          commissionBasisPoints: 300,
          commissionDeductionMinor: Number(batch.totalCommissionMinor),
          nextPayoutDate: '2026-07-28',
          itemCount: batch.itemCount,
        },
        batchId: batch.batchId,
        recentSettlements: [
          {
            id: 'settlement-101',
            date: '2026-07-21',
            grossAmountMinor: 1250000,
            commissionMinor: 37500,
            netPayoutMinor: 1212500,
            status: 'PAID',
            bankReference: 'TR99 0006 2000 0000 1234 5678 90',
          },
          {
            id: 'settlement-102',
            date: '2026-07-14',
            grossAmountMinor: 980000,
            commissionMinor: 29400,
            netPayoutMinor: 950600,
            status: 'PAID',
            bankReference: 'TR99 0006 2000 0000 1234 5678 91',
          },
        ],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Hakediş dökümü alınamadı.' },
      { status: 500 }
    );
  }
}
