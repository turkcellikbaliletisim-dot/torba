import type { SqlClient } from '@/lib/db/sql';
import type { AuthSessionRecord, AuthSessionRepository } from '@/lib/auth/contracts';
import type { Permission, Role } from '@/lib/auth/permissions';

interface AuthSessionRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string | Date;
  revoked_at: string | Date | null;
  roles_json: Role[];
  permissions_json: Permission[];
}

function mapSession(row: AuthSessionRow): AuthSessionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    tokenHash: row.token_hash,
    expiresAt: new Date(row.expires_at),
    revokedAt: row.revoked_at ? new Date(row.revoked_at) : undefined,
    roles: row.roles_json,
    permissions: row.permissions_json,
  };
}

export class SqlAuthSessionRepository implements AuthSessionRepository {
  constructor(private readonly client: SqlClient) {}

  async create(input: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    roles: Role[];
    permissions: Permission[];
  }): Promise<AuthSessionRecord> {
    const result = await this.client.query<AuthSessionRow>(
      `INSERT INTO auth_sessions
         (user_id, token_hash, expires_at, roles_json, permissions_json)
       VALUES ($1, $2, $3, $4::jsonb, $5::jsonb)
       RETURNING id, user_id, token_hash, expires_at, revoked_at,
                 roles_json, permissions_json`,
      [input.userId, input.tokenHash, input.expiresAt, JSON.stringify(input.roles), JSON.stringify(input.permissions)],
    );

    const row = result.rows[0];
    if (!row) throw new Error('Auth session could not be created.');
    return mapSession(row);
  }

  async findByTokenHash(tokenHash: string): Promise<AuthSessionRecord | null> {
    const result = await this.client.query<AuthSessionRow>(
      `SELECT id, user_id, token_hash, expires_at, revoked_at,
              roles_json, permissions_json
       FROM auth_sessions
       WHERE token_hash = $1
       LIMIT 1`,
      [tokenHash],
    );

    return result.rows[0] ? mapSession(result.rows[0]) : null;
  }

  async revoke(id: string): Promise<void> {
    await this.client.query(
      `UPDATE auth_sessions
       SET revoked_at = COALESCE(revoked_at, NOW())
       WHERE id = $1`,
      [id],
    );
  }
}
