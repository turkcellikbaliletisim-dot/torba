import type { Permission, Role } from '@/lib/auth/permissions';

export interface OtpChallengeRecord {
  id: string;
  destination: string;
  purpose: string;
  codeHash: string;
  expiresAt: Date;
  attemptCount: number;
  maxAttempts: number;
  consumedAt?: Date;
}

export interface AuthSessionRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
  roles: Role[];
  permissions: Permission[];
}

export interface OtpChallengeRepository {
  create(input: {
    destination: string;
    purpose: string;
    codeHash: string;
    expiresAt: Date;
    maxAttempts: number;
  }): Promise<OtpChallengeRecord>;
  findActive(destination: string, purpose: string): Promise<OtpChallengeRecord | null>;
  incrementAttempt(id: string): Promise<void>;
  consume(id: string): Promise<void>;
}

export interface AuthSessionRepository {
  create(input: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    roles: Role[];
    permissions: Permission[];
  }): Promise<AuthSessionRecord>;
  findByTokenHash(tokenHash: string): Promise<AuthSessionRecord | null>;
  revoke(id: string): Promise<void>;
}

export interface OtpDeliveryGateway {
  send(destination: string, code: string, purpose: string): Promise<void>;
}
