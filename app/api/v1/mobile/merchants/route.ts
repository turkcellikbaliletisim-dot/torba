import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const merchants = [
      {
        id: 'm1',
        name: 'BigChefs Cafe & Brasserie',
        category: 'Yemek',
        rating: 4.7,
        reviewCount: 324,
        distanceText: '350m',
        isVerified: true,
        mealCardAccepted: true,
        toinRewardRate: '%5 Toin',
        activeCampaignCount: 3,
        imageUrl: '/images/merchant-1.jpg',
      },
      {
        id: 'm2',
        name: 'Sahar Restoran Balıkesir',
        category: 'Yemek',
        rating: 4.8,
        reviewCount: 512,
        distanceText: '600m',
        isVerified: true,
        mealCardAccepted: true,
        toinRewardRate: '%10 Toin',
        activeCampaignCount: 2,
        imageUrl: '/images/merchant-2.jpg',
      },
      {
        id: 'm3',
        name: 'Kahve Dünyası',
        category: 'Kafe',
        rating: 4.5,
        reviewCount: 189,
        distanceText: '1.2 km',
        isVerified: true,
        mealCardAccepted: false,
        toinRewardRate: '%5 Toin',
        activeCampaignCount: 1,
        imageUrl: '/images/merchant-3.jpg',
      },
    ];

    const filtered = category && category !== 'Tümü'
      ? merchants.filter((m) => m.category === category)
      : merchants;

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'İşletmeler yüklenemedi.' },
      { status: 500 }
    );
  }
}
