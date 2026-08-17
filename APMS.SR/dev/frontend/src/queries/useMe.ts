// queries/useMe.ts

import { useQuery } from "@tanstack/react-query";

import { http } from "../api/http";
import { authKeys } from "../auth/auth.keys";
import type { User } from "../auth/auth.types";
import { useAuthStore } from "../store/auth.store";

export function useMe() {
  const token = useAuthStore((s) => s.token);

  return useQuery<User>({
    queryKey: [...authKeys.me(), token],

    queryFn: () =>
      http.get<User>("/api/users/me"),

    enabled: !!token,

    retry: 0,

    // 세션 확인 요청은 캐시보다 서버 상태 우선
    staleTime: 0,

    // 주기적인 polling 없음
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
