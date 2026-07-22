import { createHash, randomBytes } from 'node:crypto';

export interface SessionToken {
  token: string;
  tokenHash: string;
}

export function createSessionToken(): SessionToken {
  const token = randomBytes(32).toString('base64url');
  return {
    token,
    tokenHash: hashSessionToken(token),
  };
}

export function hashSessionToken(token: string): string {
  if (!token) {
    throw new Error('Session token is required.');
  }

  return createHash('sha256').update(token).digest('hex');
}

export function isSessionActive(input: {
  expiresAt: Date;
  revokedAt?: Date | null;
  now?: Date;
}): boolean {
  const now = input.now ?? new Date();
  return !input.revokedAt && input.expiresAt.getTime() > now.getTime();
}
