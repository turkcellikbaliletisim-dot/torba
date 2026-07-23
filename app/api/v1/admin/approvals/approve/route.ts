import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/guard';
import { approveBySecondAdmin } from '@/lib/services/approval-service';
import { logAuditEvent } from '@/lib/services/audit-service';

export async function POST(request: NextRequest) {
  try {
    // Requires refund.approve or settlement.approve permission
    const auth = await requirePermission(request, 'refund.approve');
    if (!auth.isAuthenticated || !auth.user) {
      return auth.errorResponse || NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const { approvalId } = await request.json();

    if (!approvalId) {
      return NextResponse.json({ success: false, error: 'Approval ID gereklidir.' }, { status: 400 });
    }

    // Execute Second Admin Approval (Enforcing 4-Eye Principle: firstApprover != secondApprover)
    const result = await approveBySecondAdmin(approvalId, auth.user.userId);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 422 });
    }

    await logAuditEvent({
      actorId: auth.user.userId,
      action: 'DUAL_APPROVAL_GRANTED',
      resourceType: 'APPROVAL',
      resourceId: approvalId,
    });

    return NextResponse.json({
      success: true,
      message: 'Çift onay başarıyla verildi. Finansal işlem serbest bırakıldı.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Onay verilemedi: ' + error.message }, { status: 500 });
  }
}
