import { NextRequest, NextResponse } from 'next/server';
import { PaymentIntentSchema } from '@/lib/validation/schemas';
import { initPayment } from '@/lib/services/payment-gateway';
import { logAuditEvent } from '@/lib/services/audit-service';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();

    // Zod Schema Validation
    const validation = PaymentIntentSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { merchantId, branchId, amountMinor, paymentType, idempotencyKey } = validation.data;

    // Execute Payment Gateway Initialization
    const paymentResult = await initPayment({
      merchantId,
      orderId: `ord-${Date.now()}`,
      amountMinor: BigInt(amountMinor),
      currency: 'TRY',
      idempotencyKey,
    });

    // Write Audit Log
    await logAuditEvent({
      actorId: 'system-user',
      action: 'PAYMENT_INTENT_CREATED',
      resourceType: 'PAYMENT',
      resourceId: paymentResult.paymentId,
      metadata: { merchantId, amountMinor, paymentType, idempotencyKey },
    });

    return NextResponse.json({
      success: true,
      message: 'Ödeme başlatıldı.',
      data: {
        paymentId: paymentResult.paymentId,
        status: paymentResult.status,
        amountMinor,
        idempotencyKey,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Ödeme başlatılamadı.' },
      { status: 500 }
    );
  }
}
