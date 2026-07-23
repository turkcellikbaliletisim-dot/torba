import { NextRequest, NextResponse } from 'next/server';
import { transitionPaymentStatus } from '@/lib/services/payment-state-machine';
import { logAuditEvent } from '@/lib/services/audit-service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const paymentId = formData.get('paymentId') as string;
    const status = formData.get('status') as string;
    const mdStatus = formData.get('mdStatus') as string;

    if (!paymentId) {
      return NextResponse.json({ success: false, error: 'paymentId parametresi eksik.' }, { status: 400 });
    }

    const isSuccess = status === 'SUCCESS' && (mdStatus === '1' || mdStatus === 'SUCCESS');
    const targetStatus = isSuccess ? 'COMPLETED' : 'FAILED';

    const transitionRes = await transitionPaymentStatus(
      paymentId,
      targetStatus,
      '3ds-callback-handler',
      { status, mdStatus }
    );

    await logAuditEvent({
      actorId: '3ds-callback-handler',
      action: '3DS_CALLBACK_PROCESSED',
      resourceType: 'PAYMENT',
      resourceId: paymentId,
      metadata: { isSuccess, targetStatus, transitionSuccess: transitionRes.success },
    });

    if (isSuccess) {
      return NextResponse.redirect(new URL('/mobile/wallet?status=success', request.url));
    } else {
      return NextResponse.redirect(new URL('/mobile/wallet?status=failed', request.url));
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: '3D Secure callback işlenemedi: ' + error.message }, { status: 500 });
  }
}
