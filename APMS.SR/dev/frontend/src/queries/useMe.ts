// queries/useMe.ts	// 서버 상태 (리액트 쿼리) 관리 	staleTime


import { useQuery } from "@tanstack/react-query";
import { http } from "../api/http";
import { authKeys } from "../auth/auth.keys";
import type { User } from "../auth/auth.types";
import { useAuthStore } from "../store/auth.store";
import { useEffect, useState } from "react";

export function useMe() {
  const isLoggedOut = useAuthStore((s) => s.isLoggedOut);
  // hydration guard (핵심)
  //const [hydrated, setHydrated] = useState(false);
  const token = useAuthStore((s) => s.token);

  return useQuery<User>({  // 중요 보안 혹은 실시간이 필요시 사용 쿼리
    queryKey: [...authKeys.me(), token], // 🔥 핵심
    queryFn: () => http.get("/api/users/me"),

    enabled: !!token && !isLoggedOut,

    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  
  
}
