// bootstrap/bootstrapAuth.tsx				// 리프레시 관리

import { authService } from "../auth/auth.service";
import { useAuthStore } from "../store/auth.store";
import { queryClient } from "../queryClient";

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapAuth() {
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    try {
      const token = await authService.refreshToken();

      if (!token) {
        useAuthStore.getState().setToken(null);
        await queryClient.clear();
        return;
      }

      useAuthStore.getState().setToken(token);
    } catch {
      useAuthStore.getState().setToken(null);
      await queryClient.clear();
    } finally {
      bootstrapPromise = null;
    }
  })();

  return bootstrapPromise;
}
