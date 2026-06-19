// hooks/usePermissions.ts	// 타입 > 롤 퍼미션 > 훅  :  권한 계산 관리

import type { User, Permission, Role } from "../auth.types";
import { RolePermissions } from "../auth.types";

export function usePermissions(user?: User) {
  const permissions = new Set<Permission>(
    user?.roles.flatMap(role => RolePermissions[role]) ?? []
  );

  return {
    hasPermission: (perm: Permission) => permissions.has(perm),

    hasRole: (role: Role) =>
      user?.roles.includes(role) ?? false,

    isAdmin: user?.roles.includes("ADMIN") ?? false,
  };
}
