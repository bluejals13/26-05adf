// hooks/usePermissions.ts	// 타입 > 롤 퍼미션 > 훅  :  권한 계산 관리

import { useAuthStore } from "../../store/auth.store";
import { authService } from "../auth.service";

export function usePermissions(user: any) {
  const token = useAuthStore((s) => s.token);

  const hasPermission = (perm: string) => {
    return user?.permissions?.includes(perm);
  };

  const refresh = async () => {
    try {
      const newToken = await authService.refreshToken();

      if (!newToken) {
        useAuthStore.getState().logout();
        return;
      }

      useAuthStore.getState().setToken(newToken);
    } catch (e) {
      useAuthStore.getState().logout();
    }
  };

  return {
    hasPermission,
    refresh,
  };
}
