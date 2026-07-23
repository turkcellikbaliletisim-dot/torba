import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        totalGmvMinor: 485000000, // ₺4.850.000,00 Toplam İşlem Hacmi
        activeMerchants: 240,
        activeCompanies: 45,
        totalUsers: 18500,
        suspiciousFlagCount: 2,
        systemStatus: 'HEALTHY',
        pendingApplications: {
          merchants: 4,
          companies: 2,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Admin dashboard verileri alınamadı.' },
      { status: 500 }
    );
  }
}
