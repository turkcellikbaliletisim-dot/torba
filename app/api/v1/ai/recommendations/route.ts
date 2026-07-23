import { NextResponse } from 'next/server';
import { recommendCampaigns } from '@/lib/ai/recommendations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, latitude, longitude, tier, preferredCategories } = body;

    const dummyCandidates = [
      {
        id: 'c1',
        merchantName: 'BigChefs Cafe & Brasserie',
        category: 'Yemek',
        discountPercent: 20,
        toinRewardPoints: 250,
        merchantLatitude: 40.6492,
        merchantLongitude: 27.8861,
        rating: 4.7,
      },
      {
        id: 'c2',
        merchantName: 'Sahar Restoran Balıkesir',
        category: 'Yemek',
        discountPercent: 15,
        toinRewardPoints: 500,
        merchantLatitude: 40.6510,
        merchantLongitude: 27.8890,
        rating: 4.8,
      },
      {
        id: 'c3',
        merchantName: 'Kahve Dünyası',
        category: 'Kafe',
        discountPercent: 10,
        toinRewardPoints: 100,
        merchantLatitude: 40.6700,
        merchantLongitude: 27.9100,
        rating: 4.5,
      },
    ];

    const userContext = {
      userId: userId || 'u-mock-1',
      latitude: latitude || 40.6495,
      longitude: longitude || 27.8865,
      tier: tier || 'SILVER',
      preferredCategories: preferredCategories || ['Yemek'],
    };

    const recommendations = recommendCampaigns(userContext, dummyCandidates);

    return NextResponse.json({
      success: true,
      data: {
        recommendations,
        meta: {
          engine: 'TORBAA-AI-Rec-v1',
          evaluatedCount: dummyCandidates.length,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'AI Öneri servisi çalıştırılamadı.' },
      { status: 500 }
    );
  }
}
