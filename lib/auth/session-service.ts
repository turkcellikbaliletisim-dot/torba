import type { AuthSessionRepository } from '@/lib/auth/contracts';
import type { Permission, Role } from '@/lib/auth/permissions';
import { generateSessionToken, hashSessionToken } from '@/lib/auth/session';

export interface CreateSessionInput {
  userId: string;
  roles: Role[];
  permissions: Permission[];
  ttlSeconds?: number;
}

export interface CreatedSession {
  sessionId: string;
  token: string;
  expiresAt: Date;
}

export class SessionService {
  constructor(private readonly sessions: AuthSessionRepository) {}

  async create(input: CreateSessionInput): Promise<CreatedSession> {
    const ttlSeconds = input.ttlSeconds ?? 60 * 60 * 24 * 30;
    if (!Number.isInteger(ttlSeconds) || ttlSeconds <= 0) {
      throw new Error('Session TTL must be a positive integer.');
    }

    const token = generateSessionToken();
    const tokenHash = hashSessionToken(token);
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    const session = await this.sessions.create({
      userId: input.userId,
      tokenHash,
      expiresAt,
      roles: input.roles,
      permissions: input.permissions,
    });

    return { sessionId: session.id, token, expiresAt };
  }

  async revokeByToken(token: string): Promise<void> {
    const session = await this.sessions.findByTokenHash(hashSessionToken(token));
    if (session) await this.sessions.revoke(session.id);
  }
}
