import { query } from '@/lib/db';

export interface DualApprovalRequest {
  actionType: 'HIGH_VALUE_REFUND' | 'MANUAL_WALLET_ADJUSTMENT' | 'SETTLEMENT_PAYOUT';
  requestedByUserId: string;
  amountMinor: bigint;
  payload: Record<string, any>;
}

export interface ApprovalRecord {
  id: string;
  actionType: string;
  status: 'PENDING_SECOND_APPROVAL' | 'APPROVED' | 'REJECTED';
  firstApproverId: string;
  secondApproverId?: string;
  payload?: Record<string, any>;
  createdAtMs: number;
}

const memoryApprovals = new Map<string, ApprovalRecord>();
const HIGH_VALUE_THRESHOLD_MINOR = 1000000n; // ₺10.000,00

export async function requestDualApproval(req: DualApprovalRequest): Promise<{ requiresSecondApproval: boolean; approvalRecord: ApprovalRecord }> {
  const approvalId = `appr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const isHighValue = req.amountMinor >= HIGH_VALUE_THRESHOLD_MINOR;
  const status: 'PENDING_SECOND_APPROVAL' | 'APPROVED' = isHighValue ? 'PENDING_SECOND_APPROVAL' : 'APPROVED';

  const record: ApprovalRecord = {
    id: approvalId,
    actionType: req.actionType,
    status,
    firstApproverId: req.requestedByUserId,
    payload: req.payload,
    createdAtMs: Date.now(),
  };

  memoryApprovals.set(approvalId, record);

  try {
    await query(
      `INSERT INTO approval_requests (id, action_type, status, first_approver_id, payload, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [approvalId, req.actionType, status, req.requestedByUserId, JSON.stringify(req.payload)]
    );
  } catch (e) {
    // Non-blocking DB fallback
  }

  return { requiresSecondApproval: isHighValue, approvalRecord: record };
}

export async function approveBySecondAdmin(
  approvalId: string,
  secondApproverUserId: string
): Promise<{ success: boolean; approvalRecord?: ApprovalRecord; error?: string }> {
  // Check memory store fallback
  const memRecord = memoryApprovals.get(approvalId);
  if (memRecord) {
    if (memRecord.firstApproverId === secondApproverUserId) {
      return { success: false, error: 'Çift Onay Prensibi (4-Eye Principle): Aynı yönetici ikinci onayı veremez.' };
    }
    memRecord.status = 'APPROVED';
    memRecord.secondApproverId = secondApproverUserId;
    return { success: true, approvalRecord: memRecord };
  }

  try {
    const res = await query('SELECT first_approver_id, action_type, status, payload FROM approval_requests WHERE id = $1 LIMIT 1', [approvalId]);
    if (!res || res.rows.length === 0) {
      return { success: false, error: 'Approval request not found.' };
    }

    const row = res.rows[0];

    if (row.first_approver_id === secondApproverUserId) {
      return { success: false, error: 'Çift Onay Prensibi (4-Eye Principle): Aynı yönetici ikinci onayı veremez.' };
    }

    await query('UPDATE approval_requests SET status = $1, second_approver_id = $2, updated_at = NOW() WHERE id = $3', ['APPROVED', secondApproverUserId, approvalId]);
    
    const dbRecord: ApprovalRecord = {
      id: approvalId,
      actionType: row.action_type,
      status: 'APPROVED',
      firstApproverId: row.first_approver_id,
      secondApproverId: secondApproverUserId,
      payload: typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload,
      createdAtMs: Date.now(),
    };

    return { success: true, approvalRecord: dbRecord };
  } catch (e) {
    return { success: false, error: 'Approval verification failed.' };
  }
}
