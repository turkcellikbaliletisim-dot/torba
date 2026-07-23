import { NextResponse } from 'next/server';
import { evaluateTransactionRisk } from '@/lib/ai/fraud-detection';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, merchantId, amountMinor, userLatitude, userLongitude, merchantLatitude, merchantLongitude } = body;

    const assessmentInput = {
      userId: userId || 'u-mock-1',
      merchantId: merchantId || 'm-mock-1',
      amountMinor: BigInt(amountMinor || 45000), // Default ₺450,00
      userLatitude: userLatitude || 40.6495,
      userLongitude: userLongitude || 27.8865,
      merchantLatitude: merchantLatitude || 40.6492,
      merchantLongitude: merchantLongitude || 27.8861,
    };

    const riskAssessment = evaluateTransactionRisk(assessmentInput);

    return NextResponse.json({
      success: true,
      data: {
        assessment: {
          ...riskAssessment,
        },
        engine: 'TORBAA-AI-Fraud-v1',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'AI Risk Değerlendirme servisi çalıştırılamadı.' },
      { status: 500 }
    );
  }
}
