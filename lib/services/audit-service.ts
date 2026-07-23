import { query } from '@/lib/db';
import { PoolClient } from 'pg';

export interface AuditLogOptions {
  actorId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

/**
 * Writes an audit log entry into PostgreSQL, supporting single-transaction execution when dbClient is provided.
 */
export async function logAuditEvent(options: AuditLogOptions, dbClient?: PoolClient): Promise<void> {
  const logId = `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const metadataJson = JSON.stringify(options.metadata || {});

  const sql = `INSERT INTO audit_logs (id, actor_id, action, resource_type, resource_id, ip_address, metadata, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`;
  const params = [
    logId,
    options.actorId,
    options.action,
    options.resourceType,
    options.resourceId || null,
    options.ipAddress || null,
    metadataJson,
  ];

  try {
    if (dbClient) {
      await dbClient.query(sql, params);
    } else {
      await query(sql, params);
    }
  } catch (error) {
    // Non-blocking fallback audit logging
    console.log(`[AUDIT LOG] ${options.action} by ${options.actorId} on ${options.resourceType}:${options.resourceId}`);
  }
}
