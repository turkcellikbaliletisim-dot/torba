import type { SqlClient } from '@/lib/db/sql';
import type {
  WalletRecord,
  WalletRepository,
  WalletType,
} from '@/lib/repositories/contracts';

interface WalletRow {
  id: string;
  owner_type: string;
  owner_id: string;
  wallet_type: WalletType;
  currency: string;
  status: string;
  balance_minor: string | number | bigint;
}

function mapWallet(row: WalletRow): WalletRecord {
  return {
    id: row.id,
    ownerType: row.owner_type,
    ownerId: row.owner_id,
    walletType: row.wallet_type,
    currency: row.currency,
    status: row.status,
    balanceMinor: BigInt(row.balance_minor),
  };
}

export class SqlWalletRepository implements WalletRepository {
  constructor(private readonly client: SqlClient) {}

  async findById(id: string): Promise<WalletRecord | null> {
    const result = await this.client.query<WalletRow>(
      `SELECT id, owner_type, owner_id, wallet_type, currency, status, balance_minor
       FROM wallets
       WHERE id = $1`,
      [id],
    );

    return result.rows[0] ? mapWallet(result.rows[0]) : null;
  }

  async findByOwner(
    ownerType: string,
    ownerId: string,
    walletType: WalletType,
  ): Promise<WalletRecord | null> {
    const result = await this.client.query<WalletRow>(
      `SELECT id, owner_type, owner_id, wallet_type, currency, status, balance_minor
       FROM wallets
       WHERE owner_type = $1 AND owner_id = $2 AND wallet_type = $3`,
      [ownerType, ownerId, walletType],
    );

    return result.rows[0] ? mapWallet(result.rows[0]) : null;
  }

  async lockById(id: string): Promise<WalletRecord | null> {
    const result = await this.client.query<WalletRow>(
      `SELECT id, owner_type, owner_id, wallet_type, currency, status, balance_minor
       FROM wallets
       WHERE id = $1
       FOR UPDATE`,
      [id],
    );

    return result.rows[0] ? mapWallet(result.rows[0]) : null;
  }
}
