// hooks/usePermissions.ts	// 타입 > 롤 퍼미션 > 훅  :  권한 계산 관리


import  { useAuth } from "../hooks/useAuth";
import { usePermissions } from "../../auth/hooks/usePermissions";
//import type { User, Permission, Role } from "../auth.types";

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapAuth() {
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    try {
      const token = await authService.refreshToken();

      if (!token) {
        useAuthStore.getState().setToken(null);
        queryClient.clear();
        return;
      }

      useAuthStore.getState().setToken(token);
    } catch {
      useAuthStore.getState().setToken(null);
      queryClient.clear();
    }
  })();

  return bootstrapPromise;
}
