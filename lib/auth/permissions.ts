export type PortalRole =
  | 'USER'
  | 'MERCHANT_OWNER'
  | 'BRANCH_MANAGER'
  | 'CASHIER'
  | 'CORPORATE_ADMIN'
  | 'CORPORATE_FINANCE'
  | 'PLATFORM_ADMIN'
  | 'PLATFORM_FINANCE'
  | 'PLATFORM_RISK'
  | 'PLATFORM_SUPPORT';

export type Role = PortalRole;

export type Permission =
  | 'profile:read'
  | 'wallet:read'
  | 'payment:create'
  | 'merchant:read'
  | 'merchant:manage'
  | 'branch:manage'
  | 'pos:use'
  | 'corporate:read'
  | 'corporate:manage'
  | 'allowance:approve'
  | 'admin:access'
  | 'finance:manage'
  | 'risk:manage'
  | 'support:manage';

const rolePermissions: Record<PortalRole, readonly Permission[]> = {
  USER: ['profile:read', 'wallet:read', 'payment:create', 'merchant:read'],
  MERCHANT_OWNER: ['merchant:read', 'merchant:manage', 'branch:manage', 'pos:use'],
  BRANCH_MANAGER: ['merchant:read', 'branch:manage', 'pos:use'],
  CASHIER: ['merchant:read', 'pos:use'],
  CORPORATE_ADMIN: ['corporate:read', 'corporate:manage'],
  CORPORATE_FINANCE: ['corporate:read', 'allowance:approve'],
  PLATFORM_ADMIN: ['admin:access', 'finance:manage', 'risk:manage', 'support:manage'],
  PLATFORM_FINANCE: ['admin:access', 'finance:manage'],
  PLATFORM_RISK: ['admin:access', 'risk:manage'],
  PLATFORM_SUPPORT: ['admin:access', 'support:manage'],
};

export function hasPermission(role: PortalRole, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

export function permissionsForRoles(roles: readonly PortalRole[]): Permission[] {
  return [...new Set(roles.flatMap((role) => rolePermissions[role]))];
}

export function requirePermission(role: PortalRole, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Role ${role} does not have permission ${permission}.`);
  }
}
