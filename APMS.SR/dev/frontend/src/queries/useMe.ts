// queries/useMe.ts	// 서버 상태 (리액트 쿼리) 관리 	staleTime

// queries/useMe.ts

import { useQuery } from "@tanstack/react-query";
import { http } from "../api/http";
import type { User } from "../auth/auth.types";
import { useAuthStore } from "../store/auth.store";

export function useMe() {
  const { token } = useAuthStore();
  
  const isReady = token !== undefined; // 또는 hydrate 완료 flag
  
  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => http.get("/api/users/me"),
    enabled: isReady,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
