import crypto from 'crypto';

export interface PaymentInitOptions {
  merchantId: string;
  orderId: string;
  amountMinor: bigint;
  currency: string;
  cardToken?: string;
  idempotencyKey: string;
}

export interface PaymentInitResult {
  success: boolean;
  paymentId: string;
  status: 'SUCCESS' | 'WAITING_3DS' | 'FAILED';
  redirectUrl?: string;
  errorCode?: string;
  errorMessage?: string;
}

const PAYMENT_API_KEY = process.env.PAYMENT_API_KEY || 'dev_payment_api_key_2026';
const PAYMENT_SECRET_KEY = process.env.PAYMENT_SECRET_KEY || 'dev_payment_secret_key_2026';

export async function initPayment(options: PaymentInitOptions): Promise<PaymentInitResult> {
  const paymentId = `pay-${options.orderId}-${Date.now()}`;
  return {
    success: true,
    paymentId,
    status: 'SUCCESS',
  };
}

export function verifyWebhookSignature(
  rawBody: string,
  incomingSignature: string
): boolean {
  if (!incomingSignature) return false;
  const expectedSig = crypto
    .createHmac('sha256', PAYMENT_SECRET_KEY)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(incomingSignature), Buffer.from(expectedSig));
}
