// hooks/usePermissions.ts	// 타입 > 롤 퍼미션 > 훅  :  권한 계산 관리

//import { useAuthStore } from "../../store/auth.store";
//import { authService } from "../auth.service";
import type { User } from "../auth.types";

export function usePermissions( user?: User | null ) {
  const hasPermission = ( permission: string ) => user?.permissions.includes(permission) ?? false;

  const hasRole = (role: string) =>
    user?.roles.includes(role) ?? false;

  const isAdmin = () =>
    hasRole("ADMIN") ||
    hasPermission("ADMIN");

  return {
    hasPermission,
    hasRole,
    isAdmin,
  };
}
