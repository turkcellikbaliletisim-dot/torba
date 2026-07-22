import type { Permission, Role } from '@/lib/auth/permissions';

export interface ResolvedAuthUser {
  id: string;
  roles: Role[];
  permissions: Permission[];
}

export interface AuthUserResolver {
  resolveByDestination(destination: string): Promise<ResolvedAuthUser | null>;
}
