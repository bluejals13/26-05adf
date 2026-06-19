// hooks/usePermissions.ts	// 타입 > 롤 퍼미션 > 훅  :  권한 계산 관리

import type { User } from "../auth.types";

export function usePermissions(user?: User) {
  const permissions = user?.permissions ?? [];
  const roles = user?.roles ?? [];

  return {
    hasPermission: (perm: string) => permissions.includes(perm),
    hasRole: (role: string) => roles.includes(role),
    isAdmin: roles.includes("ADMIN"),
  };
}
