// hooks/usePermissions.ts	// 타입 > 롤 퍼미션 > 훅  :  권한 계산 관리

import type { User, Role, Permission } from "../auth.types";

export function usePermissions(user?: User) {
  return {
    isAdmin: user?.roles.includes("ADMIN") ?? false,
    isModerator: user?.roles.includes("MODERATOR") ?? false,

    hasRole: (role: Role) =>
      user?.roles.includes(role) ?? false,

    hasPermission: (perm: Permission) =>
      user?.permissions.includes(perm) ?? false,
  };
}
