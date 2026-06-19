// bootstrap/bootstrapAuth.tsx				// 리프레시 관리

// bootstrap/bootstrapAuth.ts

import { authService } from "../auth/auth.service";
import { useAuthStore } from "../store/auth.store";
import { queryClient } from "../queryClient";

let bootstrapPromise: Promise<void> | null = null;
//let bootstrapped = false;
let failed = false;

export function bootstrapAuth() {
  // 이미 실패했으면 완전히 차단 (F5 반복 루프 방지 핵심)
  if (failed) return Promise.resolve();

  // 이미 실행 중이면 같은 Promise 반환
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    try {
      const token = await authService.refreshToken();

      // refresh 실패
      if (!token) {
        failed = true;
        bootstrapped = true;

        useAuthStore.getState().setToken(null);
        await queryClient.clear();

        return;
      }

      // refresh 성공
      bootstrapped = true;
      useAuthStore.getState().setToken(token);
    } catch {
      failed = true;
      bootstrapped = true;

      useAuthStore.getState().setToken(null);
      await queryClient.clear();
    } finally {
      bootstrapPromise = null;
    }
  })();

  return bootstrapPromise;
}
