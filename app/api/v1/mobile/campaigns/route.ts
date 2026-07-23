import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const campaigns = [
      {
        id: 'c1',
        title: 'Öğle Menüsünde %20 İndirim + 250 Toin Puan',
        merchantId: 'm1',
        merchantName: 'BigChefs Cafe & Brasserie',
        badgeText: '%20 İndirim',
        badgeColor: '#FF6B35', // Campaign orange
        pointsRewardText: '250 Puan Kazan',
        expiresInDays: 2,
        validUntil: '25 Temmuz 2026',
        imageUrl: '/images/campaign-1.jpg',
      },
      {
        id: 'c2',
        title: 'Akşam Yemeğinde Çifte Toin Fırsatı',
        merchantId: 'm2',
        merchantName: 'Sahar Restoran Balıkesir',
        badgeText: '2x Toin',
        badgeColor: '#F4B400', // Points yellow
        pointsRewardText: '500 Puan Kazan',
        expiresInDays: 5,
        validUntil: '28 Temmuz 2026',
        imageUrl: '/images/campaign-2.jpg',
      },
    ];

    return NextResponse.json({
      success: true,
      data: campaigns,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Kampanyalar yüklenemedi.' },
      { status: 500 }
    );
  }
}
