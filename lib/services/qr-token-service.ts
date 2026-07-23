import crypto from 'crypto';

export interface QrTokenPayload {
  intentId: string;
  userId: string;
  branchId: string;
  amountMinor: bigint;
  expiresAtMs: number;
}

const QR_SECRET_KEY = process.env.QR_SECRET_KEY || 'torbaa_secure_qr_secret_key_2026_dev';

export function generateSignedQrToken(payload: Omit<QrTokenPayload, 'expiresAtMs'>, ttlSeconds = 60): {
  qrToken: string;
  expiresAt: string;
} {
  const expiresAtMs = Date.now() + ttlSeconds * 1000;
  const dataToSign = `${payload.intentId}:${payload.userId}:${payload.branchId}:${payload.amountMinor}:${expiresAtMs}`;
  
  const signature = crypto
    .createHmac('sha256', QR_SECRET_KEY)
    .update(dataToSign)
    .digest('hex')
    .slice(0, 16); // 16-char truncated HMAC signature for compact QR

  const qrToken = Buffer.from(
    JSON.stringify({
      i: payload.intentId,
      u: payload.userId,
      b: payload.branchId,
      a: payload.amountMinor.toString(),
      e: expiresAtMs,
      s: signature,
    })
  ).toString('base64url');

  return {
    qrToken,
    expiresAt: new Date(expiresAtMs).toISOString(),
  };
}

export function verifyQrToken(qrToken: string): {
  isValid: boolean;
  error?: string;
  payload?: QrTokenPayload;
} {
  try {
    const decodedJson = Buffer.from(qrToken, 'base64url').toString('utf8');
    const parsed = JSON.parse(decodedJson);

    const { i: intentId, u: userId, b: branchId, a: amountMinorStr, e: expiresAtMs, s: signature } = parsed;

    if (!intentId || !userId || !branchId || !amountMinorStr || !expiresAtMs || !signature) {
      return { isValid: false, error: 'Eksik veya geçersiz QR token biçimi.' };
    }

    // Check expiration
    if (Date.now() > Number(expiresAtMs)) {
      return { isValid: false, error: 'QR kodunun süresi dolmuş. Lütfen ekranı yenileyin.' };
    }

    // Verify signature
    const amountMinor = BigInt(amountMinorStr);
    const dataToSign = `${intentId}:${userId}:${branchId}:${amountMinor}:${expiresAtMs}`;
    const expectedSignature = crypto
      .createHmac('sha256', QR_SECRET_KEY)
      .update(dataToSign)
      .digest('hex')
      .slice(0, 16);

    if (signature !== expectedSignature) {
      return { isValid: false, error: 'QR kod imzası geçersiz. Sahtecilik tespiti.' };
    }

    return {
      isValid: true,
      payload: {
        intentId,
        userId,
        branchId,
        amountMinor,
        expiresAtMs: Number(expiresAtMs),
      },
    };
  } catch (error) {
    return { isValid: false, error: 'QR token çözümlenemedi.' };
  }
}
