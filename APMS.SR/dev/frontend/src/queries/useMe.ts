// queries/useMe.ts	// 서버 상태 (리액트 쿼리) 관리 	staleTime


import { useQuery } from "@tanstack/react-query";
import { http } from "../api/http";
import { authKeys } from "../auth/auth.keys";
import type { User } from "../auth/auth.types";
import { useAuthStore } from "../store/auth.store";

export function useMe() {
  const token = useAuthStore((s) => s.token);

  return useQuery<User>({  // 중요 보안 혹은 실시간이 필요시 사용 쿼리
    queryKey: authKeys.me(),
    queryFn: () => http.get<User>("/api/users/me"),

    enabled: !!token,

    retry: false,
    refetchOnWindowFocus: true,
  });
  
  
}
