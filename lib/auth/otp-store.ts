import crypto from 'crypto';

interface OtpRecord {
  phone: string;
  hashedCode: string;
  expiresAtMs: number;
  attempts: number;
  lastSentAtMs: number;
}

// In-memory OTP storage with Redis-compatible interface
const otpStore = new Map<string, OtpRecord>();

function hashOtp(phone: string, code: string): string {
  return crypto.createHash('sha256').update(`${phone}:${code}`).digest('hex');
}

/**
 * Checks if an OTP can be sent to the given phone number (Cooldown enforcement: 1 OTP per 60s)
 */
export function canSendOtp(phone: string, cooldownSeconds = 60): { allowed: boolean; remainingSeconds?: number } {
  const record = otpStore.get(phone);
  if (!record) return { allowed: true };

  const elapsedMs = Date.now() - record.lastSentAtMs;
  const cooldownMs = cooldownSeconds * 1000;

  if (elapsedMs < cooldownMs) {
    const remaining = Math.ceil((cooldownMs - elapsedMs) / 1000);
    return { allowed: false, remainingSeconds: remaining };
  }

  return { allowed: true };
}

/**
 * Stores a hashed OTP for a phone number with an expiration TTL (default 120 seconds)
 */
export function storeOtp(phone: string, code: string, ttlSeconds = 120): void {
  const hashedCode = hashOtp(phone, code);
  const expiresAtMs = Date.now() + ttlSeconds * 1000;

  otpStore.set(phone, {
    phone,
    hashedCode,
    expiresAtMs,
    attempts: 0,
    lastSentAtMs: Date.now(),
  });
}

/**
 * Verifies an OTP code for a phone number against its stored SHA-256 hash.
 * Enforces maximum 3 attempts and invalidates on success or attempt limit reach.
 */
export function verifyOtpCode(phone: string, code: string): { isValid: boolean; error?: string } {
  const record = otpStore.get(phone);

  if (!record) {
    return { isValid: false, error: 'Doğrulama kodu bulunamadı veya süresi dolmuş. Lütfen yeni bir kod isteyin.' };
  }

  // Check expiration
  if (Date.now() > record.expiresAtMs) {
    otpStore.delete(phone);
    return { isValid: false, error: 'Doğrulama kodunun süresi dolmuş. Lütfen yeni bir kod isteyin.' };
  }

  // Increment attempts
  record.attempts += 1;

  if (record.attempts > 3) {
    otpStore.delete(phone);
    return { isValid: false, error: 'Çok sayıda hatalı kod girildi. Güvenlik nedeniyle yeni kod istemelisiniz.' };
  }

  // Compare SHA-256 Hashes
  const inputHash = hashOtp(phone, code);
  if (inputHash !== record.hashedCode) {
    return { isValid: false, error: `Hatalı doğrulama kodu. (Kalan deneme hakkı: ${3 - record.attempts})` };
  }

  // Success -> Delete OTP from store (One-time use)
  otpStore.delete(phone);
  return { isValid: true };
}
