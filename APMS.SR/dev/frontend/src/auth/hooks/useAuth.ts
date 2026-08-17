// hooks/useAuth.ts		// 스토어 > 쿼리 > 훅  :  컴포지션 관리

import { useMe } from "../../queries/useMe";
import { useAuthStore } from "../../store/auth.store";
import { authService } from "../auth.service";

export function useAuth() {
  const token = useAuthStore((s) => s.token);

  const {
    data: user,
    isLoading,
    isError,
  } = useMe();

  const isAuthenticated = !!token;

  return {
    token,
    user,

    isLoading,
    isError,

    // token이 존재하는지를 인증 상태의 기준으로 사용
    isLoggedIn: isAuthenticated,

    logout: authService.logout,
  };
}
