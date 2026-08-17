// queries/useMe.ts

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { http, HttpError } from "../api/http";
import { authKeys } from "../auth/auth.keys";
import type { User } from "../auth/auth.types";
import { useAuthStore } from "../store/auth.store";

const ME_POLL_INTERVAL = 5000;

export function useMe() {
  const token = useAuthStore((s) => s.token);
  const authServiceUnavailable = useAuthStore(
    (s) => s.authServiceUnavailable,
  );

  const query = useQuery<User>({
    queryKey: [...authKeys.me(), token],

    queryFn: async () => {
      try {
        const user = await http.get<User>("/api/users/me");

        // 인증 서비스 정상 복구
        if (useAuthStore.getState().authServiceUnavailable) {
          useAuthStore
            .getState()
            .setAuthServiceUnavailable(false);
        }

        return user;
      } catch (error) {
        // 인증 인프라 장애
        if (
          error instanceof HttpError &&
          error.status === 503
        ) {
          useAuthStore
            .getState()
            .setAuthServiceUnavailable(true);
        }

        throw error;
      }
    },

    enabled: !!token,

    retry: 0,

    staleTime: 0,

    // 다른 브라우저에서 계정 상태가 변경됐는지 주기적으로 확인
    refetchInterval: ME_POLL_INTERVAL,

    // 브라우저로 돌아왔을 때 즉시 확인
    refetchOnWindowFocus: true,

    // 네트워크 복구 시 즉시 확인
    refetchOnReconnect: true,
  });

  useEffect(() => {
    const user = query.data;

    if (!user) {
      return;
    }

    if (user.status === "SUSPENDED") {
      useAuthStore.getState().logout();
    }
  }, [query.data]);

  return query;
}
