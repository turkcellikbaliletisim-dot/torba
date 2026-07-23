import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/guard';
import { query } from '@/lib/db';
import { logAuditEvent } from '@/lib/services/audit-service';

export async function POST(request: NextRequest) {
  try {
    const auth = await requirePermission(request, 'refund.approve');
    if (!auth.isAuthenticated || !auth.user) {
      return auth.errorResponse || NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const { sagaId, resolution, notes } = await request.json();

    if (!sagaId || !resolution) {
      return NextResponse.json({ success: false, error: 'sagaId ve resolution parametreleri zorunludur.' }, { status: 400 });
    }

    const newStatus = resolution === 'MANUAL_RECOVER' ? 'COMPLETED' : 'FAILED_FINAL';

    const sagaRes = await query('SELECT refund_id, payment_id FROM refund_sagas WHERE id = $1 FOR UPDATE', [sagaId]);

    if (!sagaRes || sagaRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Refund saga kaydı bulunamadı.' }, { status: 404 });
    }

    const { refund_id, payment_id } = sagaRes.rows[0];

    await query('UPDATE refund_sagas SET status = $1, updated_at = NOW() WHERE id = $2', [newStatus, sagaId]);
    if (newStatus === 'COMPLETED') {
      await query('UPDATE refunds SET status = $1, updated_at = NOW() WHERE id = $2', ['COMPLETED', refund_id]);
    }

    await logAuditEvent({
      actorId: auth.user.userId,
      action: 'REFUND_SAGA_MANUALLY_RESOLVED',
      resourceType: 'REFUND_SAGA',
      resourceId: sagaId,
      metadata: { resolution, notes, refundId: refund_id, paymentId: payment_id },
    });

    return NextResponse.json({
      success: true,
      message: `Refund saga kaydı manuel olarak ${newStatus} durumuna getirildi.`,
      data: { sagaId, status: newStatus },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Manuel saga çözümü başarısız: ' + error.message }, { status: 500 });
  }
}
