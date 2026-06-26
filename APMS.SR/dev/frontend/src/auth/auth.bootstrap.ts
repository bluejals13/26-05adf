// bootstrap/bootstrapAuth.tsx				// 리프레시 관리

import { useAuthStore } from "../store/auth.store";
import { queryClient } from "../queryClient";
import { refreshToken } from "../api/http";

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapAuth(): Promise<void> {
  const isLoggedOut = useAuthStore.getState().isLoggedOut;
  if (isLoggedOut) return;
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    try {
      const data = await refreshToken();

      if (!data?.accessToken) {
        useAuthStore.getState().setToken(null);
        await queryClient.clear();
        return;
      }

      useAuthStore.getState().setToken(data.accessToken);
    } catch {
      useAuthStore.getState().setToken(null);
      await queryClient.clear();
    } finally {
      bootstrapPromise = null;
    }
  })();

  return bootstrapPromise;
}
