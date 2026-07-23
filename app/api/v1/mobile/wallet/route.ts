import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        balances: {
          toinPoints: 1250,
          toinApproxTryValue: 1250.0,
          mealCardMinor: 450000, // ₺4.500,00
          mealCardCurrency: 'TRY',
          taxExemptInfo: 'GVK 23/8 Vergi İstisnalı',
        },
        activeCoupons: [
          {
            id: 'coupon-1',
            merchantName: 'BigChefs Cafe & Brasserie',
            title: 'Öğle Menüsünde %20 İndirim',
            discountPercent: 20,
            expiresInDays: 2,
            validUntil: '2026-07-25',
          },
          {
            id: 'coupon-2',
            merchantName: 'Starbucks Coffee',
            title: '2. Kahve %50 İndirimli',
            discountPercent: 50,
            expiresInDays: 5,
            validUntil: '2026-07-28',
          },
        ],
        loyaltyCards: [
          {
            id: 'card-1',
            cardName: 'TORBAA Dijital Yemek Kartı',
            cardNumber: '4580 •••• •••• 9201',
            status: 'ACTIVE',
            isMealCardEnabled: true,
          },
        ],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Cüzdan bilgileri alınamadı.' },
      { status: 500 }
    );
  }
}
