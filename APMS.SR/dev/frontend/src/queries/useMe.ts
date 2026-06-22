// queries/useMe.ts	// 서버 상태 (리액트 쿼리) 관리 	staleTime


import { useQuery } from "@tanstack/react-query";
import { http } from "../api/http";
import type { User } from "../auth/auth.types";
import { useAuthStore } from "../store/auth.store";

export function useMe() {
  const token = useAuthStore((s) => s.token);

  return useQuery<User>({
    queryKey: ["me"],
    queryFn: () => http.get<User>("/api/users/me"),

    enabled: !!token && useAuthStore.getState().token === token,

    staleTime: 1000 * 10 * 2,
    retry: false,
    refetchOnWindowFocus: true,
  });
  
    return {
    ...query,
    isStale: query.isStale,
    fetchStatus: query.fetchStatus,
    dataUpdatedAt: query.dataUpdatedAt,
  };
  
}
