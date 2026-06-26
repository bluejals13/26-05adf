// auth/bootstrapAuth.tsx				// 리프레시 관리

import { useAuthStore } from "../store/auth.store";
import { queryClient } from "../queryClient";
import { refreshToken } from "../api/http";

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapAuth(): Promise<void> {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = (async () => {
    try {
      const data = await refreshToken();

      if (data?.accessToken) {
        // refresh 성공 → access token 저장
        useAuthStore.getState().setToken(data.accessToken);
      } else {
        // refresh 실패 → 비로그인 상태
        useAuthStore.getState().logout();
        queryClient.clear();
      }
    } catch {
      useAuthStore.getState().logout();
      queryClient.clear();
    } finally {
      bootstrapPromise = null;
    }
  })();

  return bootstrapPromise;
}
