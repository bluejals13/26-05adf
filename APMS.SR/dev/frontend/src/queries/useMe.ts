// queries/useMe.ts	// 서버 상태 (리액트 쿼리) 관리 	staleTime

import { useQuery } from "@tanstack/react-query";
import { http } from "../api/http";

import type { User } from "../auth/auth.types";

import { authKeys } from "../auth/auth.keys";
import { useAuthStore } from "../store/auth.store";

export function useMe() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => http.get<User>("api/users/me"),
    enabled: !!token,

    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
