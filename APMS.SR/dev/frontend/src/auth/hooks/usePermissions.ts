// hooks/usePermissions.ts	// 타입 > 롤 퍼미션 > 훅  :  권한 계산 관리

//import { useAuthStore } from "../../store/auth.store";
//import { authService } from "../auth.service";

export function usePermissions(user: any) {
  const hasPermission = (perm: string) =>
    user?.permissions?.includes(perm);

  const isAdmin = () =>
    user?.permissions?.includes("ADMIN");

  const refresh = async () => {
    // 기존 유지
  };

  return {
    hasPermission,
    isAdmin, // 🔥 이거 추가
    refresh,
  };
}
