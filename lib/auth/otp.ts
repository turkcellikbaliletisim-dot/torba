import { createHash, randomInt, timingSafeEqual } from 'node:crypto';

const OTP_LENGTH = 6;

export function generateOtpCode(): string {
  return randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, '0');
}

export function hashOtpCode(code: string, pepper: string): string {
  if (!/^\d{6}$/.test(code)) {
    throw new Error('OTP code must contain exactly six digits.');
  }
  if (!pepper) {
    throw new Error('OTP pepper is required.');
  }

  return createHash('sha256').update(`${code}:${pepper}`).digest('hex');
}

export function verifyOtpCode(code: string, expectedHash: string, pepper: string): boolean {
  const actualHash = hashOtpCode(code, pepper);
  const actual = Buffer.from(actualHash, 'hex');
  const expected = Buffer.from(expectedHash, 'hex');

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
