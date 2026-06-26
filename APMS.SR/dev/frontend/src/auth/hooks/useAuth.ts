// hooks/useAuth.ts		// 스토어 > 쿼리 > 훅  :  컴포지션 관리

import { useMe } from "../../queries/useMe";
import { useAuthStore } from "../../store/auth.store";
import { authService } from "../auth.service";

export function useAuth() {    // 로그인 상태 가져오기
  const token = useAuthStore((s) => s.token);
  const { data: user, isLoading, isError } = useMe();

  return {
    token,
    user,
    isLoading,
    isError,    
    isLoggedIn: !!token && !!user,
    logout: authService.logout,
  };
}
