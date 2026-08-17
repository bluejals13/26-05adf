// auth/bootstrapAuth.tsx				// 리프레시 관리

import { useAuthStore } from "../store/auth.store";
import { queryClient } from "../queryClient";

import { refreshToken, RefreshTokenError } from "../api/http";

import { authKeys } from "../auth/auth.keys";

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapAuth(): Promise<void> {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = (async () => {
    try {
      const data = await refreshToken();

      if (data?.accessToken) {
        // Refresh 성공
        useAuthStore.getState().setToken(data.accessToken);
        return;
      }

      // 명확한 인증 정보가 없는 경우
      useAuthStore.getState().logout();
      queryClient.resetQueries({
        queryKey: authKeys.all,
      });

    } catch (error) {

      // 401 → 실제 인증 만료/무효
      if (
        error instanceof RefreshTokenError &&
        error.status === 401
      ) {
        useAuthStore.getState().logout();

        queryClient.resetQueries({
          queryKey: authKeys.all,
        });

        return;
      }

      // 503 → Redis / 인증 인프라 장애
      if (
        error instanceof RefreshTokenError &&
        error.status === 503
      ) {
        // 절대 logout 하지 않는다.
        console.warn(
          "[Auth] Authentication service unavailable."
        );

        return;
      }

      // Network Error 등 일시적인 연결 장애
      console.warn(
        "[Auth] Authentication service temporarily unavailable.",
        error
      );

      // 여기서도 logout 하지 않는다.
    } finally {
      bootstrapPromise = null;
    }
  })();

  return bootstrapPromise;
}

