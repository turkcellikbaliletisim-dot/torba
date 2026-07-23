import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        companyName: 'Teknoloji A.Ş.',
        taxNumber: '1234567890',
        activeEmployees: 120,
        monthlyBudgetMinor: 54000000, // ₺540.000,00
        taxExemptionSavedMinor: 18900000, // ₺189.000,00 GVK 23/8 vergi tasarrufu
        lastTopupDate: '2026-07-01',
        pendingApprovals: [
          {
            id: 'req-2026-07',
            month: 'Temmuz 2026 Ek Yükleme',
            employeeCount: 12,
            totalAmountMinor: 5400000, // ₺54.000,00
            status: 'WAITING_SECOND_APPROVAL',
            createdAt: '2026-07-22',
          },
        ],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Kurumsal bakiye verileri yüklenemedi.' },
      { status: 500 }
    );
  }
}
