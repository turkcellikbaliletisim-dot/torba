/**
 * Masks Sensitive Data (Phone Numbers, User IDs, Merchant IDs) for Production Structured Audit Logging
 */
export function maskSensitiveValue(value: string | undefined | null): string {
  if (!value) return '';
  const str = String(value);
  if (str.length <= 4) return '***';
  return str.substring(0, 3) + '***' + str.substring(str.length - 2);
}

export function maskPhone(phone: string | undefined | null): string {
  if (!phone) return '';
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 10) return '***';
  return clean.substring(0, 3) + '***' + clean.substring(clean.length - 2);
}

export interface StructuredLogPayload {
  level: 'INFO' | 'WARN' | 'ERROR';
  event: string;
  userId?: string;
  merchantId?: string;
  phone?: string;
  metadata?: Record<string, any>;
}

export function logStructured(payload: StructuredLogPayload): void {
  const maskedPayload = {
    timestamp: new Date().toISOString(),
    level: payload.level,
    event: payload.event,
    userId: maskSensitiveValue(payload.userId),
    merchantId: maskSensitiveValue(payload.merchantId),
    phone: maskPhone(payload.phone),
    metadata: payload.metadata || {},
  };

  console.log(JSON.stringify(maskedPayload));
}
