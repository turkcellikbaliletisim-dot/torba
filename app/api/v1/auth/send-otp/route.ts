import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone || typeof phone !== 'string' || phone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz telefon numarası.' },
        { status: 400 }
      );
    }

    // Standardized mock OTP response for dev environment
    return NextResponse.json({
      success: true,
      message: 'OTP doğrulama kodu başarıyla gönderildi.',
      data: {
        phone,
        expiresInSeconds: 120,
        // Development mode helper hint
        devCodeHint: '123456',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
