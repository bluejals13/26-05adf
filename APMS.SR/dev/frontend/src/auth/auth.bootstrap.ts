// auth/bootstrapAuth.tsx

import { useAuthStore } from "../store/auth.store";
import { queryClient } from "../queryClient";

import {
  refreshToken,
  RefreshTokenError,
} from "../api/http";

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

      // Refresh Token이 없거나 유효하지 않은 경우
      useAuthStore.getState().logout();

      await queryClient.resetQueries({
        queryKey: authKeys.all,
      });

    } catch (error) {

      // 401
      // 실제 인증 만료 / 무효
      if (
        error instanceof RefreshTokenError &&
        error.status === 401
      ) {
        useAuthStore.getState().logout();

        await queryClient.resetQueries({
          queryKey: authKeys.all,
        });

        return;
      }

      // 503
      // Redis / 인증 인프라 장애
      if (
        error instanceof RefreshTokenError &&
        error.status === 503
      ) {
        console.warn(
          "[Auth] Authentication service unavailable."
        );

        // 중요:
        // logout 하지 않는다.
        // bootstrap은 정상 종료한다.
        return;
      }

      // Network Error / Timeout 등
      console.warn(
        "[Auth] Authentication service temporarily unavailable.",
        error
      );

      // 중요:
      // logout 하지 않는다.
      // bootstrap을 종료시켜 앱이 렌더링되도록 한다.
    } finally {
      bootstrapPromise = null;
    }
  })();

  return bootstrapPromise;
}
