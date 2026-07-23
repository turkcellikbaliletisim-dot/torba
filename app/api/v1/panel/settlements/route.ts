import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        merchantName: 'BigChefs Cafe & Brasserie - Balıkesir Şubesi',
        totalVolumeMinor: 12500000, // ₺125.000,00
        netPayableMinor: 12125000, // ₺121.250,00 (%3 komisyon kesintisi sonrası)
        commissionMinor: 375000, // ₺3.750,00 (%3 şeffaf komisyon)
        nextPayoutDate: '2026-07-27',
        payoutCycleDays: 7,
        settlementStatus: 'SCHEDULED',
        recentTransactions: [
          {
            id: 'tx-101',
            date: '2026-07-23 14:15',
            customerName: 'Ahmet Y.',
            type: 'YEMEK_KARTI',
            grossAmountMinor: 45000, // ₺450,00
            commissionMinor: 1350, // ₺13,50
            netAmountMinor: 43650, // ₺436,50
            status: 'COMPLETED',
          },
          {
            id: 'tx-102',
            date: '2026-07-23 13:30',
            customerName: 'Mehmet K.',
            type: 'TOIN_HARCAMA',
            grossAmountMinor: 12000, // ₺120,00
            commissionMinor: 360,
            netAmountMinor: 11640,
            status: 'COMPLETED',
          },
        ],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Hakediş bilgileri alınamadı.' },
      { status: 500 }
    );
  }
}
