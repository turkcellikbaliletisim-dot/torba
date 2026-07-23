import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, code } = body;

    if (!phone || !code || code.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Telefon numarası ve 6 haneli doğrulama kodu gereklidir.' },
        { status: 400 }
      );
    }

    // In dev mode, accept 123456 or any code
    const isValid = code === '123456' || process.env.NODE_ENV !== 'production';

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Doğrulama kodu hatalı veya süresi dolmuş.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Giriş başarılı.',
      data: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dev_mock_token',
        user: {
          id: 'user-mock-123',
          phone,
          fullName: 'Ahmet Yılmaz',
          tier: 'SILVER',
          toinBalance: 1250,
          mealBalanceMinor: 450000, // ₺4.500,00
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
