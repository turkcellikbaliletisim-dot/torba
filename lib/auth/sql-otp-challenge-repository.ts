import type { SqlClient } from '@/lib/db/sql';
import type {
  OtpChallengeRecord,
  OtpChallengeRepository,
} from '@/lib/auth/contracts';

interface OtpChallengeRow {
  id: string;
  destination: string;
  purpose: string;
  code_hash: string;
  expires_at: string | Date;
  attempt_count: number;
  max_attempts: number;
  consumed_at: string | Date | null;
}

function mapChallenge(row: OtpChallengeRow): OtpChallengeRecord {
  return {
    id: row.id,
    destination: row.destination,
    purpose: row.purpose,
    codeHash: row.code_hash,
    expiresAt: new Date(row.expires_at),
    attemptCount: row.attempt_count,
    maxAttempts: row.max_attempts,
    consumedAt: row.consumed_at ? new Date(row.consumed_at) : undefined,
  };
}

export class SqlOtpChallengeRepository implements OtpChallengeRepository {
  constructor(private readonly client: SqlClient) {}

  async create(input: {
    destination: string;
    purpose: string;
    codeHash: string;
    expiresAt: Date;
    maxAttempts: number;
  }): Promise<OtpChallengeRecord> {
    const result = await this.client.query<OtpChallengeRow>(
      `INSERT INTO otp_challenges
         (destination, purpose, code_hash, expires_at, max_attempts)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, destination, purpose, code_hash, expires_at,
                 attempt_count, max_attempts, consumed_at`,
      [input.destination, input.purpose, input.codeHash, input.expiresAt, input.maxAttempts],
    );

    const row = result.rows[0];
    if (!row) throw new Error('OTP challenge could not be created.');
    return mapChallenge(row);
  }

  async findActive(destination: string, purpose: string): Promise<OtpChallengeRecord | null> {
    const result = await this.client.query<OtpChallengeRow>(
      `SELECT id, destination, purpose, code_hash, expires_at,
              attempt_count, max_attempts, consumed_at
       FROM otp_challenges
       WHERE destination = $1
         AND purpose = $2
         AND consumed_at IS NULL
         AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [destination, purpose],
    );

    return result.rows[0] ? mapChallenge(result.rows[0]) : null;
  }

  async incrementAttempt(id: string): Promise<void> {
    await this.client.query(
      `UPDATE otp_challenges
       SET attempt_count = attempt_count + 1
       WHERE id = $1`,
      [id],
    );
  }

  async consume(id: string): Promise<void> {
    await this.client.query(
      `UPDATE otp_challenges
       SET consumed_at = NOW()
       WHERE id = $1 AND consumed_at IS NULL`,
      [id],
    );
  }
}
