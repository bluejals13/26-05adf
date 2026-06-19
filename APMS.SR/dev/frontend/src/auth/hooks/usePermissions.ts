// hooks/usePermissions.ts	// 타입 > 롤 퍼미션 > 훅  :  권한 계산 관리

import type { User, Permission, Role } from "../auth.types";
import { RolePermissions } from "../auth.types";

export function usePermissions(user?: User) {
  return {
    hasPermission: (perm: Permission) =>
      user?.permissions.includes(perm) ?? false,

    hasRole: (role: Role) =>
      user?.roles.includes(role) ?? false,

    isAdmin: user?.roles.includes("ADMIN") ?? false,
  };
}
