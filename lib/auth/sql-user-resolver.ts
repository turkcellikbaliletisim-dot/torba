import type { SqlClient } from '@/lib/db/sql';
import type { AuthUserResolver, ResolvedAuthUser } from '@/lib/auth/user-resolver';
import { permissionsForRoles, type Role } from '@/lib/auth/permissions';

interface AuthUserRow {
  id: string;
  role_codes: string[] | null;
}

const validRoles = new Set<Role>([
  'USER',
  'MERCHANT_OWNER',
  'BRANCH_MANAGER',
  'CASHIER',
  'CORPORATE_ADMIN',
  'CORPORATE_FINANCE',
  'PLATFORM_ADMIN',
  'PLATFORM_FINANCE',
  'PLATFORM_RISK',
  'PLATFORM_SUPPORT',
]);

function normalizeRoles(roleCodes: string[] | null): Role[] {
  const roles = (roleCodes ?? []).filter((role): role is Role => validRoles.has(role as Role));
  return roles.length > 0 ? [...new Set(roles)] : ['USER'];
}

export class SqlAuthUserResolver implements AuthUserResolver {
  constructor(private readonly client: SqlClient) {}

  async resolveByDestination(destination: string): Promise<ResolvedAuthUser | null> {
    const normalizedDestination = destination.trim();

    const result = await this.client.query<AuthUserRow>(
      `SELECT
         u.id,
         COALESCE(
           array_agg(DISTINCT r.code) FILTER (WHERE r.code IS NOT NULL),
           ARRAY[]::varchar[]
         ) AS role_codes
       FROM users u
       LEFT JOIN user_role_assignments ura
         ON ura.user_id = u.id
        AND ura.revoked_at IS NULL
       LEFT JOIN roles r ON r.id = ura.role_id
       WHERE u.status = 'ACTIVE'
         AND (u.phone = $1 OR LOWER(u.email) = LOWER($1))
       GROUP BY u.id
       LIMIT 1`,
      [normalizedDestination],
    );

    const row = result.rows[0];
    if (!row) return null;

    const roles = normalizeRoles(row.role_codes);
    return {
      id: row.id,
      roles,
      permissions: permissionsForRoles(roles),
    };
  }
}
