import { NextRequest, NextResponse } from 'next/server';
import { verifyMfaCode } from '@/lib/auth/mfa';
import { logAuditEvent } from '@/lib/services/audit-service';

export async function POST(request: NextRequest) {
  try {
    const { userId, mfaCode } = await request.json();

    if (!userId || !mfaCode) {
      return NextResponse.json({ success: false, error: 'userId ve mfaCode zorunludur.' }, { status: 400 });
    }

    const secret = process.env.JWT_SECRET || 'default_secret';
    const result = verifyMfaCode(secret, mfaCode);

    await logAuditEvent({
      actorId: userId,
      action: 'MFA_VERIFICATION_ATTEMPT',
      resourceType: 'AUTH',
      resourceId: userId,
      metadata: { success: result.isValid },
    });

    if (!result.isValid) {
      return NextResponse.json({ success: false, error: result.message }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'İki faktörlü doğrulama (MFA) başarıyla tamamlandı.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'MFA doğrulaması başarısız: ' + error.message }, { status: 500 });
  }
}
