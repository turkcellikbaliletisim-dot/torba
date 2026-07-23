export type Permission =
  | 'merchant.read'
  | 'merchant.approve'
  | 'payment.read'
  | 'refund.create'
  | 'refund.approve'
  | 'settlement.run'
  | 'settlement.approve'
  | 'audit.read'
  | 'user.suspend'
  | 'campaign.approve'
  | 'wallet.adjust';

export const ROLE_PERMISSIONS: Record<'ADMIN' | 'MERCHANT' | 'CORPORATE_HR' | 'CUSTOMER', Permission[]> = {
  ADMIN: [
    'merchant.read',
    'merchant.approve',
    'payment.read',
    'refund.create',
    'refund.approve',
    'settlement.run',
    'settlement.approve',
    'audit.read',
    'user.suspend',
    'campaign.approve',
    'wallet.adjust',
  ],
  MERCHANT: ['merchant.read', 'payment.read', 'refund.create'],
  CORPORATE_HR: ['payment.read'],
  CUSTOMER: [],
};

export function hasPermission(
  role: 'ADMIN' | 'MERCHANT' | 'CORPORATE_HR' | 'CUSTOMER',
  permission: Permission
): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}
