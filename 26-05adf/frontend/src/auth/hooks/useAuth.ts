// hooks/useAuth.ts

import { useMe } from "../../queries/useMe";
import { useAuthStore } from "../../store/auth.store";
import { authService } from "../auth.service";

export function useAuth() {
  const token = useAuthStore((s) => s.token);

  const authServiceUnavailable = useAuthStore(
    (s) => s.authServiceUnavailable,
  );

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

    // 인증 서비스 장애 여부
    authServiceUnavailable,

    // token 존재 여부를 인증 상태의 기준으로 사용
    isLoggedIn: isAuthenticated,

    // Redis / 인증 인프라 장애 상태에서는
    // 인증 실패로 간주하지 않는다.
    isAuthDegraded: authServiceUnavailable,

    logout: authService.logout,
  };
}
