import type { LedgerEntryInput } from '@/lib/domain/ledger';

export type EntityId = string;
export type WalletType = string;

export interface PaginationInput {
  limit: number;
  cursor?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  nextCursor?: string;
}

export interface WalletRecord {
  id: EntityId;
  ownerType: string;
  ownerId: EntityId;
  walletType: WalletType;
  currency: string;
  status: string;
}

export interface LedgerTransactionRecord {
  id: EntityId;
  transactionType: string;
  externalReference?: string;
  idempotencyKey: string;
  status: string;
  occurredAt: Date;
  reversedTransactionId?: EntityId;
}

export interface LedgerEntryRecord {
  id: EntityId;
  ledgerTransactionId: EntityId;
  walletId: EntityId;
  direction: 'DEBIT' | 'CREDIT';
  amountMinor: bigint;
}

export interface LedgerTransactionInput {
  transactionType: string;
  externalReference?: string;
  idempotencyKey: string;
  occurredAt?: Date;
  reversedTransactionId?: EntityId;
  entries: LedgerEntryInput[];
}

export interface WalletRepository {
  findById(id: EntityId): Promise<WalletRecord | null>;
  findByOwner(
    ownerType: string,
    ownerId: EntityId,
    walletType?: WalletType,
  ): Promise<WalletRecord[]>;
  lockById(id: EntityId): Promise<WalletRecord | null>;
}

export interface LedgerRepository {
  findTransactionById(id: EntityId): Promise<LedgerTransactionRecord | null>;
  findTransactionByIdempotencyKey(key: string): Promise<LedgerTransactionRecord | null>;
  listEntries(transactionId: EntityId): Promise<LedgerEntryRecord[]>;
  create(input: LedgerTransactionInput): Promise<LedgerTransactionRecord>;
}

export interface AuditLogInput {
  actorUserId?: EntityId;
  action: string;
  entityType: string;
  entityId?: EntityId;
  correlationId?: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}

export interface AuditLogRepository {
  append(input: AuditLogInput): Promise<void>;
}

export interface UnitOfWork {
  runInTransaction<T>(work: () => Promise<T>): Promise<T>;
}
