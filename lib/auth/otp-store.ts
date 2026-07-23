import crypto from 'crypto';
import { setCache, getCache, deleteCache } from '@/lib/db/redis';

const OTP_HMAC_SECRET = process.env.OTP_HMAC_SECRET || 'torbaa_otp_secure_hmac_secret_2026_prod';

export interface OtpData {
  phone: string;
  hashedCode: string;
  attempts: number;
}

/**
 * Generates a cryptographically secure 6-digit random integer OTP code
 */
export function generateSecureOtpCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Computes an HMAC-SHA256 hash for an OTP code bound to a phone number and server secret
 */
export function hmacOtpCode(phone: string, code: string): string {
  return crypto
    .createHmac('sha256', OTP_HMAC_SECRET)
    .update(`${phone}:${code}`)
    .digest('hex');
}

/**
 * Enforces a 60-second cooldown per phone number before resending a new OTP
 */
export async function canSendOtp(phone: string, cooldownSeconds = 60): Promise<{ allowed: boolean; remainingSeconds?: number }> {
  const cooldownKey = `otp_cooldown:${phone}`;
  const existing = await getCache(cooldownKey);

  if (existing) {
    const expiresAtMs = parseInt(existing, 10);
    const remainingMs = expiresAtMs - Date.now();
    if (remainingMs > 0) {
      return { allowed: false, remainingSeconds: Math.ceil(remainingMs / 1000) };
    }
  }

  return { allowed: true };
}

/**
 * Stores a secret HMAC-hashed OTP code in Redis / Distributed Cache with a 120-second TTL
 */
export async function storeOtp(phone: string, code: string, ttlSeconds = 120): Promise<void> {
  const hashedCode = hmacOtpCode(phone, code);
  const otpKey = `otp_data:${phone}`;
  const cooldownKey = `otp_cooldown:${phone}`;

  const payload: OtpData = {
    phone,
    hashedCode,
    attempts: 0,
  };

  await setCache(otpKey, JSON.stringify(payload), ttlSeconds);
  await setCache(cooldownKey, (Date.now() + 60 * 1000).toString(), 60); // 60s cooldown
}

/**
 * Removes stored OTP data for a phone number (used if SMS transmission fails)
 */
export async function deleteOtp(phone: string): Promise<void> {
  await deleteCache(`otp_data:${phone}`);
  await deleteCache(`otp_cooldown:${phone}`);
}

/**
 * Verifies an OTP code against stored HMAC-SHA256 hash.
 * Enforces max 3 attempts and invalidates on success or attempt limit reach.
 */
export async function verifyOtpCode(phone: string, code: string): Promise<{ isValid: boolean; error?: string }> {
  const otpKey = `otp_data:${phone}`;
  const rawData = await getCache(otpKey);

  if (!rawData) {
    return { isValid: false, error: 'Doğrulama kodu bulunamadı veya süresi dolmuş. Lütfen yeni bir kod isteyin.' };
  }

  const otpRecord: OtpData = JSON.parse(rawData);
  otpRecord.attempts += 1;

  if (otpRecord.attempts > 3) {
    await deleteOtp(phone);
    return { isValid: false, error: 'Çok sayıda hatalı kod girildi. Güvenlik nedeniyle yeni kod istemelisiniz.' };
  }

  const inputHmac = hmacOtpCode(phone, code);
  if (inputHmac !== otpRecord.hashedCode) {
    await setCache(otpKey, JSON.stringify(otpRecord), 120);
    return { isValid: false, error: `Hatalı doğrulama kodu. (Kalan deneme hakkı: ${3 - otpRecord.attempts})` };
  }

  // Success -> One-time use: Delete OTP from store
  await deleteOtp(phone);
  return { isValid: true };
}
